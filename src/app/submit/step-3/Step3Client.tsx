"use client";

import { useState } from "react";
import { IconAlertTriangle, IconSparkles } from "@tabler/icons-react";
import Button from "@/components/Button";
import Field from "@/components/afa/Field";
import { useSubmitFlow, type Participant, type ReviewFieldKey, type ReviewFieldState } from "@/app/submit/flow-context";

type Props = {
  facultyName: string;
  facultyEmail: string;
};

const LABELS: Record<ReviewFieldKey, string> = {
  academicUnit: "Academic unit",
  academicTerm: "Academic year and term",
  course: "Course",
  section: "Section",
  activityDates: "Date/s and time/s of AFA",
  venue: "Venue",
  description: "Description of the activity",
};

function helperFor(field: ReviewFieldState) {
  if (field.tone === "found") {
    return <span className="text-flow-green">✓ From {field.source}</span>;
  }
  if (field.tone === "missing") {
    return <span className="text-flow-red-text">Not found in uploaded files.</span>;
  }
  return undefined;
}

// The underlying value stays a single comma-joined string — same shape as
// every other review field, same DB column, same AI-extraction path — this
// is purely a chip-style editor on top of it so one AFA can cover several
// class sections.
function SectionsField({ field, onChange }: { field: ReviewFieldState; onChange: (value: string) => void }) {
  const [draft, setDraft] = useState("");
  const sections = field.value ? field.value.split(",").map((s) => s.trim()).filter(Boolean) : [];

  function commit(next: string[]) {
    onChange(next.join(", "));
  }

  function addSection() {
    const trimmed = draft.trim();
    if (trimmed && !sections.includes(trimmed)) commit([...sections, trimmed]);
    setDraft("");
  }

  function removeSection(index: number) {
    commit(sections.filter((_, i) => i !== index));
  }

  const toneClasses =
    field.tone === "missing"
      ? "border-flow-red bg-flow-red-bg"
      : "border-flow-field-border bg-white focus-within:border-flow-navy";

  return (
    <div>
      <label
        htmlFor="section-input"
        className={`mb-1.5 block font-semibold ${field.tone === "missing" ? "text-flow-red-text" : ""}`}
      >
        Section(s)
      </label>
      <div className={`flex min-h-[52px] flex-wrap items-center gap-2 rounded-flow-control border-2 px-3 py-2 ${toneClasses}`}>
        {sections.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="flex items-center gap-1.5 rounded-full bg-flow-info-bg px-3 py-1 text-sm font-semibold text-flow-navy"
          >
            {s}
            <button
              type="button"
              onClick={() => removeSection(i)}
              aria-label={`Remove section ${s}`}
              className="text-flow-muted hover:text-flow-red-text"
            >
              ✕
            </button>
          </span>
        ))}
        <input
          id="section-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addSection();
            }
          }}
          onBlur={addSection}
          placeholder={sections.length === 0 ? (field.tone === "missing" ? "Not found — enter manually" : "e.g. WFV") : "Add another…"}
          className="min-w-[100px] flex-1 bg-transparent py-1 outline-none"
        />
      </div>
      {helperFor(field)}
    </div>
  );
}

export default function Step3Client({ facultyName, facultyEmail }: Props) {
  const { reviewFields, setReviewField, participants, setParticipants, participantsSource, aiStatus, aiError } =
    useSubmitFlow();

  function updateParticipant(index: number, patch: Partial<Participant>) {
    setParticipants((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }
  function addParticipant() {
    setParticipants((prev) => [...prev, { name: "", sex: "", degreeProgram: "" }]);
  }
  function removeParticipant(index: number) {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  }

  const keys = Object.keys(reviewFields) as ReviewFieldKey[];
  const foundCount = keys.filter((k) => reviewFields[k].tone === "found").length;
  const missingCount = keys.filter((k) => reviewFields[k].tone === "missing").length;

  function field(key: ReviewFieldKey, extra: { as?: "textarea"; rows?: number; className?: string } = {}) {
    const f = reviewFields[key];
    return (
      <Field
        id={key}
        label={LABELS[key]}
        value={f.value}
        onChange={(v) => setReviewField(key, v)}
        tone={f.tone === "missing" ? "error" : "default"}
        helper={helperFor(f)}
        placeholder={f.tone === "missing" ? "Not found — enter manually" : undefined}
        {...extra}
      />
    );
  }

  return (
    <>
      {aiStatus === "done" && (
        <div className="mb-6 flex items-center gap-3.5 rounded-flow-control border border-flow-info-border bg-flow-info-bg px-5 py-4">
          <IconSparkles size={26} stroke={2} className="shrink-0 text-flow-info-icon" />
          <div className="flex-1">
            <b>
              {foundCount} of {keys.length} fields auto-filled from uploaded files.
            </b>{" "}
            {missingCount > 0 && (
              <span className="font-semibold text-flow-maroon">
                {missingCount} field{missingCount === 1 ? "" : "s"} marked in red need attention.
              </span>
            )}
          </div>
        </div>
      )}

      {aiStatus === "error" && (
        <div className="mb-6 flex items-center gap-3.5 rounded-flow-control border border-flow-red bg-flow-red-bg px-5 py-4">
          <IconAlertTriangle size={26} stroke={2} className="shrink-0 text-flow-red" />
          <div className="flex-1 text-flow-red-text">
            <b>Couldn&apos;t read the uploaded files.</b> {aiError ?? "Fill in the fields below manually."}
          </div>
        </div>
      )}

      {aiStatus === "idle" && (
        <div className="mb-6 rounded-flow-control border border-flow-border bg-flow-page px-5 py-4 text-flow-muted">
          No documents were read for this application yet. Fill in the fields below manually, or go back
          and upload supporting documents.
        </div>
      )}

      <section className="rounded-flow-card border border-flow-border bg-white p-7">
        <h2 className="mb-5 text-[22px] font-bold text-flow-navy">1 · Course and schedule</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {field("academicUnit")}
          {field("academicTerm")}
          {field("course")}
          <SectionsField field={reviewFields.section} onChange={(v) => setReviewField("section", v)} />
          {field("activityDates", { className: "sm:col-span-2" })}
        </div>
      </section>

      <section className="rounded-flow-card border border-flow-border bg-white p-7">
        <h2 className="mb-5 text-[22px] font-bold text-flow-navy">2 · Activity details</h2>
        <div className="flex flex-col gap-5">
          {field("venue")}
          {field("description", { as: "textarea", rows: 4 })}
        </div>
      </section>

      <section className="rounded-flow-card border border-flow-border bg-white p-7">
        <h2 className="mb-5 text-[22px] font-bold text-flow-navy">3 · Faculty in-charge and participants</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            id="faculty"
            label="Faculty in-charge"
            value={facultyName}
            readOnly
            helper={<span>From your UP account</span>}
          />
          <Field
            id="faculty-email"
            label="UP email"
            value={facultyEmail}
            readOnly
            helper={<span>From your UP account</span>}
          />
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">Participants ({participants.length})</span>
            {participantsSource ? (
              <span className="text-sm text-flow-green">✓ From {participantsSource}</span>
            ) : aiStatus === "done" ? (
              <span className="text-sm text-flow-red-text">No class list found — add students manually.</span>
            ) : null}
          </div>

          {participants.length > 0 && (
            <div className="overflow-x-auto rounded-flow-control border border-flow-field-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-flow-field-border bg-flow-page text-left">
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold">Sex</th>
                    <th className="px-3 py-2 font-semibold">Degree program</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => (
                    <tr key={i} className="border-b border-flow-field-border last:border-b-0">
                      <td className="p-1">
                        <input
                          value={p.name}
                          onChange={(e) => updateParticipant(i, { name: e.target.value })}
                          placeholder="Student name"
                          className="w-full rounded px-2 py-1.5 outline-none focus:bg-flow-page"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          value={p.sex}
                          onChange={(e) => updateParticipant(i, { sex: e.target.value })}
                          placeholder="—"
                          className="w-full rounded px-2 py-1.5 outline-none focus:bg-flow-page"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          value={p.degreeProgram}
                          onChange={(e) => updateParticipant(i, { degreeProgram: e.target.value })}
                          placeholder="—"
                          className="w-full rounded px-2 py-1.5 outline-none focus:bg-flow-page"
                        />
                      </td>
                      <td className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeParticipant(i)}
                          aria-label="Remove student"
                          className="text-flow-muted hover:text-flow-red-text"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button type="button" onClick={addParticipant} className="mt-2.5 text-sm font-semibold text-flow-navy hover:underline">
            + Add student
          </button>
        </div>
      </section>

      <div className="flex flex-wrap justify-between gap-3">
        <Button href="/submit/step-2" variant="flow-outline-navy">
          ← Back to uploads
        </Button>
        <Button href="/submit/step-4" variant="flow-yellow">
          Continue to submit →
        </Button>
      </div>
    </>
  );
}
