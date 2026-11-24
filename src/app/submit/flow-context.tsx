"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { AfaTypeId } from "@/components/afa/afa-types";

export type FileKind = "pdf" | "docx" | "xlsx";
export type FileStatus = { type: "added" } | { type: "reading"; percent: number } | { type: "done" };

export type UploadedFile = {
  id: string;
  name: string;
  kind: FileKind;
  sizeLabel: string;
  status: FileStatus;
};

export type ReviewFieldKey =
  | "academicUnit"
  | "academicTerm"
  | "course"
  | "section"
  | "activityDates"
  | "venue"
  | "description";

export type ReviewFieldTone = "unset" | "found" | "missing";

export type ReviewFieldState = { value: string; tone: ReviewFieldTone; source: string | null };

export type ReviewFields = Record<ReviewFieldKey, ReviewFieldState>;

const REVIEW_FIELD_KEYS: ReviewFieldKey[] = [
  "academicUnit",
  "academicTerm",
  "course",
  "section",
  "activityDates",
  "venue",
  "description",
];

// A real class list is required (see the official AFA request forms: name,
// sex assigned at birth, degree program per student) — not just a headcount.
export type Participant = { name: string; sex: string; degreeProgram: string };

const emptyReviewFields: ReviewFields = REVIEW_FIELD_KEYS.reduce((acc, key) => {
  acc[key] = { value: "", tone: "unset", source: null };
  return acc;
}, {} as ReviewFields);

export type AiStatus = "idle" | "reading" | "done" | "error";

type SubmitFlowState = {
  afaType: AfaTypeId | null;
  applicationName: string;
  files: UploadedFile[];
  reviewFields: ReviewFields;
  participants: Participant[];
  participantsSource: string | null;
  aiStatus: AiStatus;
  aiError: string | null;
};

const STORAGE_KEY = "afa-submit-flow";

const defaultState: SubmitFlowState = {
  afaType: null,
  applicationName: "",
  files: [],
  reviewFields: emptyReviewFields,
  participants: [],
  participantsSource: null,
  aiStatus: "idle",
  aiError: null,
};

type SubmitFlowContextValue = SubmitFlowState & {
  setAfaType: (id: AfaTypeId) => void;
  setApplicationName: (name: string) => void;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  setReviewField: (key: ReviewFieldKey, value: string) => void;
  setParticipants: (update: Participant[] | ((prev: Participant[]) => Participant[])) => void;
  extractFields: () => Promise<void>;
  cancelExtraction: () => void;
  resetFlow: () => void;
};

const SubmitFlowContext = createContext<SubmitFlowContextValue | null>(null);

function detectKind(file: File): FileKind {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return "xlsx";
  return "docx";
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// feature/real-submission-prototype: wires the flow to a real `/api/extract-fields`
// route (Gemini) and a real `afas` table, so this can actually be tested end to end.
// Raw File objects live only in-memory (fileBlobs ref) — never persisted to
// sessionStorage, only their metadata is.
export function SubmitFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubmitFlowState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const fileBlobs = useRef<Map<string, File>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SubmitFlowState;
        setState({ ...defaultState, ...parsed, reviewFields: { ...emptyReviewFields, ...parsed.reviewFields } });
      } catch {
        // ignore malformed storage
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  function setAfaType(id: AfaTypeId) {
    setState((s) => ({ ...s, afaType: id }));
  }

  function setApplicationName(name: string) {
    setState((s) => ({ ...s, applicationName: name }));
  }

  function addFiles(files: File[]) {
    const entries: UploadedFile[] = files.map((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      fileBlobs.current.set(id, file);
      return {
        id,
        name: file.name,
        kind: detectKind(file),
        sizeLabel: formatSize(file.size),
        status: { type: "added" },
      };
    });

    setState((s) => ({ ...s, files: [...s.files, ...entries] }));
  }

  function removeFile(id: string) {
    fileBlobs.current.delete(id);
    // Removing the last file mid-read would otherwise leave the in-flight
    // request running with nothing to show for it — cancel it so the UI
    // doesn't stay stuck on "Reading documents…".
    if (fileBlobs.current.size === 0 && abortControllerRef.current) {
      cancelExtraction();
    }
    setState((s) => ({ ...s, files: s.files.filter((f) => f.id !== id) }));
  }

  function setReviewField(key: ReviewFieldKey, value: string) {
    setState((s) => ({
      ...s,
      reviewFields: { ...s.reviewFields, [key]: { ...s.reviewFields[key], value } },
    }));
  }

  function setParticipants(update: Participant[] | ((prev: Participant[]) => Participant[])) {
    setState((s) => ({ ...s, participants: typeof update === "function" ? update(s.participants) : update }));
  }

  async function extractFields() {
    const files = Array.from(fileBlobs.current.values());

    if (files.length === 0) {
      setState((s) => ({ ...s, aiStatus: "error", aiError: "No files to read." }));
      return;
    }

    setState((s) => ({
      ...s,
      aiStatus: "reading",
      aiError: null,
      files: s.files.map((f) => ({ ...f, status: { type: "reading", percent: 8 } })),
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Real progress isn't observable mid-request (it's one request/response,
    // not a stream), so this eases toward 95% for as long as the call is in
    // flight, then snaps to 100% the moment a real result comes back —
    // rather than faking a number upfront and freezing it.
    let percent = 8;
    const interval = setInterval(() => {
      percent += (95 - percent) * 0.15;
      setState((s) => ({
        ...s,
        files: s.files.map((f) =>
          f.status.type === "reading" ? { ...f, status: { type: "reading", percent: Math.round(percent) } } : f,
        ),
      }));
    }, 300);
    intervalRef.current = interval;

    async function finish(update: (s: SubmitFlowState) => SubmitFlowState) {
      clearInterval(interval);
      intervalRef.current = null;
      setState((s) => ({
        ...update(s),
        files: s.files.map((f) => ({ ...f, status: { type: "reading", percent: 100 } })),
      }));
      await new Promise((resolve) => setTimeout(resolve, 400));
      setState((s) => ({ ...s, files: s.files.map((f) => ({ ...f, status: { type: "done" } })) }));
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/extract-fields", { method: "POST", body: formData, signal: controller.signal });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Extraction failed");
      }

      const nextFields: ReviewFields = { ...emptyReviewFields };
      for (const key of REVIEW_FIELD_KEYS) {
        const result = data.fields?.[key];
        if (result && result.value) {
          nextFields[key] = { value: String(result.value), tone: "found", source: result.source ?? "uploaded files" };
        } else {
          nextFields[key] = { value: "", tone: "missing", source: null };
        }
      }

      const participantsResult = data.fields?.participants;
      const nextParticipants: Participant[] =
        Array.isArray(participantsResult?.value) && participantsResult.value.length > 0
          ? participantsResult.value.map((p: Partial<Participant>) => ({
              name: p.name ?? "",
              sex: p.sex ?? "",
              degreeProgram: p.degreeProgram ?? "",
            }))
          : [];
      const nextParticipantsSource = nextParticipants.length > 0 ? (participantsResult?.source ?? "uploaded files") : null;

      await finish((s) => ({
        ...s,
        reviewFields: nextFields,
        participants: nextParticipants,
        participantsSource: nextParticipantsSource,
        aiStatus: "done",
      }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Cancelled via cancelExtraction(), which already reset state — nothing more to do.
        return;
      }
      const message = err instanceof Error ? err.message : "Couldn't read the uploaded files.";
      await finish((s) => ({ ...s, aiStatus: "error", aiError: message }));
    } finally {
      abortControllerRef.current = null;
    }
  }

  function cancelExtraction() {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((s) => ({
      ...s,
      aiStatus: "idle",
      aiError: null,
      files: s.files.map((f) => (f.status.type === "reading" ? { ...f, status: { type: "added" } } : f)),
    }));
  }

  function resetFlow() {
    sessionStorage.removeItem(STORAGE_KEY);
    fileBlobs.current.clear();
    setState(defaultState);
  }

  return (
    <SubmitFlowContext.Provider
      value={{
        ...state,
        setAfaType,
        setApplicationName,
        addFiles,
        removeFile,
        setReviewField,
        setParticipants,
        extractFields,
        cancelExtraction,
        resetFlow,
      }}
    >
      {children}
    </SubmitFlowContext.Provider>
  );
}

export function useSubmitFlow() {
  const ctx = useContext(SubmitFlowContext);
  if (!ctx) throw new Error("useSubmitFlow must be used within SubmitFlowProvider");
  return ctx;
}
