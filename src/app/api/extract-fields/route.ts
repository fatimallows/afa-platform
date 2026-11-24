import { NextResponse } from "next/server";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export const runtime = "nodejs";

const FIELD_DESCRIPTIONS: Record<string, string> = {
  academicUnit: "the academic unit/college/department offering the course, e.g. 'College of Social Sciences and Philosophy'",
  academicTerm: "the academic year and term, e.g. 'A.Y. 2026-2027, First Semester'",
  course: "the course code, e.g. 'Geog 123'",
  section: "the course section code(s) — if the activity covers more than one section, list every one, separated by commas, e.g. 'WFV, WFX'",
  activityDates: "the date(s) and time(s) of the field activity, exactly as written in the source — this may be a single range or several separate date ranges (e.g. 'March 11-14, April 8-28, 2026'), copy it as-is rather than splitting it into a single start/end date",
  venue: "the location/venue of the activity",
  description: "a short description of what the activity involves",
};

type OpenRouterContentPart =
  | { type: "text"; text: string }
  | { type: "file"; file: { filename: string; file_data: string } };

async function fileToParts(file: File): Promise<OpenRouterContentPart[]> {
  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".pdf")) {
    return [
      { type: "text", text: `The following file is "${file.name}":` },
      {
        type: "file",
        file: { filename: file.name, file_data: `data:application/pdf;base64,${buffer.toString("base64")}` },
      },
    ];
  }

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const text = workbook.SheetNames.map(
      (sheetName) => `Sheet "${sheetName}":\n${XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName])}`,
    ).join("\n\n");
    return [{ type: "text", text: `Content of "${file.name}" (spreadsheet):\n${text}` }];
  }

  // .docx and anything else: try mammoth, it only understands docx but fails gracefully
  try {
    const result = await mammoth.extractRawText({ buffer });
    return [{ type: "text", text: `Content of "${file.name}" (document):\n${result.value}` }];
  } catch {
    return [{ type: "text", text: `Could not read "${file.name}" (unsupported format).` }];
  }
}

// Open-weight models are less consistent than Gemini about replying with
// bare JSON — they sometimes wrap it in a ```json ... ``` fence. Strip that
// before parsing instead of failing on it.
function parseJsonLoose(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files were uploaded." }, { status: 400 });
  }

  const fileParts = (await Promise.all(files.map(fileToParts))).flat();

  const fieldList = Object.entries(FIELD_DESCRIPTIONS)
    .map(([key, desc]) => `- "${key}": ${desc}`)
    .join("\n");

  const prompt = `You are reading supporting documents for a university Academic Field Activity (AFA) application. Extract the following fields if present anywhere in the attached files:
${fieldList}

Also look for a class/participant list (often a spreadsheet of enrolled students). If one is present, extract each student's name, and their sex and degree program if those columns exist.

Respond with ONLY a JSON object shaped like this — no markdown code fences, no commentary before or after it:
{
  "academicUnit": { "value": "...", "source": "<file name it came from>" } | null,
  "academicTerm": { "value": "...", "source": "..." } | null,
  "course": { "value": "...", "source": "..." } | null,
  "section": { "value": "...", "source": "..." } | null,
  "activityDates": { "value": "...", "source": "..." } | null,
  "venue": { "value": "...", "source": "..." } | null,
  "description": { "value": "...", "source": "..." } | null,
  "participants": { "value": [{ "name": "...", "sex": "...", "degreeProgram": "..." }, ...], "source": "<file name it came from>" } | null
}
Use null for any field that genuinely isn't found in the documents, and omit "sex"/"degreeProgram" per student (empty string) if those specific columns aren't present. Do not guess or invent values.`;

  const baseRequestBody = {
    messages: [{ role: "user", content: [{ type: "text", text: prompt }, ...fileParts] }],
    // mistral-ocr actually reads scanned/handwritten documents (cloudflare-ai
    // is free but plain text/markdown extraction only — it can't read
    // handwriting at all). mistral-ocr costs $2 per 1,000 pages, which is a
    // fraction of a cent for real submission volume.
    plugins: [{ id: "file-parser", pdf: { engine: "mistral-ocr" } }],
  };

  // "openrouter/free" is OpenRouter's own router across many free underlying
  // models — it absorbs a single overloaded/rate-limited model the way our
  // old manual Gemini model list tried to, but natively. Named models after
  // it are a manual backstop in case the router itself has no capacity.
  const envModel = process.env.OPENROUTER_MODEL;
  const candidateModels = [
    envModel,
    "openrouter/free",
    "google/gemma-4-31b-it:free",
    "nvidia/nemotron-3.5-super-vl:free",
  ].filter((m, i, arr): m is string => !!m && arr.indexOf(m) === i);

  const ATTEMPTS_PER_MODEL = 2;
  const RETRYABLE_STATUSES = new Set([429, 502, 503]);

  try {
    let lastStatus = 0;
    let lastErrorText = "";

    for (const model of candidateModels) {
      for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ model, ...baseRequestBody }),
        });

        if (res.ok) {
          const data = await res.json();
          const text: string | undefined = data?.choices?.[0]?.message?.content;

          if (!text) {
            return NextResponse.json({ error: "OpenRouter returned an empty response." }, { status: 502 });
          }

          try {
            const fields = parseJsonLoose(text);
            return NextResponse.json({ fields, modelUsed: model });
          } catch {
            return NextResponse.json({ error: "OpenRouter's reply wasn't valid JSON. Try again." }, { status: 502 });
          }
        }

        lastStatus = res.status;
        lastErrorText = await res.text();
        console.error(`OpenRouter API error (${model}, attempt ${attempt}/${ATTEMPTS_PER_MODEL}):`, lastErrorText);

        // Only worth retrying the same model on rate-limit/overload/upstream-
        // failure codes — anything else (bad request, model not found) will
        // fail the same way again, so move straight to the next candidate.
        if (!RETRYABLE_STATUSES.has(lastStatus)) break;
        if (attempt < ATTEMPTS_PER_MODEL) await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    const friendlyMessage = RETRYABLE_STATUSES.has(lastStatus)
      ? "OpenRouter's free models are temporarily overloaded across everything we tried. Please try again in a moment."
      : "OpenRouter couldn't process the documents. Check the server logs for details.";
    return NextResponse.json({ error: friendlyMessage }, { status: 502 });
  } catch (err) {
    console.error("extract-fields failed:", err);
    return NextResponse.json({ error: "Failed to read documents. Please try again." }, { status: 500 });
  }
}
