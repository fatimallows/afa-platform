"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AfaTypeId } from "@/components/afa/afa-types";

export type FileKind = "pdf" | "docx" | "xlsx";
export type FileStatus = { type: "done" } | { type: "reading"; percent: number };

export type UploadedFile = {
  id: string;
  name: string;
  kind: FileKind;
  sizeLabel: string;
  status: FileStatus;
};

type SubmitFlowState = {
  afaType: AfaTypeId | null;
  applicationName: string;
  files: UploadedFile[];
};

const STORAGE_KEY = "afa-submit-flow";

const defaultState: SubmitFlowState = {
  afaType: null,
  applicationName: "",
  files: [],
};

type SubmitFlowContextValue = SubmitFlowState & {
  setAfaType: (id: AfaTypeId) => void;
  setApplicationName: (name: string) => void;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
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

// No real backend exists yet to parse uploaded files or auto-fill fields from
// them — this provider only holds the flow's in-progress state in memory
// (mirrored to sessionStorage so it survives a refresh) and fakes an
// "AI reading" progress animation. See the handoff README's note that all
// screen data is test data, and the standing "ask the prof before wiring real
// AFA data" rule.
export function SubmitFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubmitFlowState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState(JSON.parse(raw) as SubmitFlowState);
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
    const entries: UploadedFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      kind: detectKind(file),
      sizeLabel: formatSize(file.size),
      status: { type: "reading", percent: 0 },
    }));

    setState((s) => ({ ...s, files: [...s.files, ...entries] }));

    entries.forEach((entry) => {
      let percent = 0;
      const interval = setInterval(() => {
        percent = Math.min(100, percent + 20 + Math.round(Math.random() * 20));
        setState((s) => ({
          ...s,
          files: s.files.map((f) =>
            f.id === entry.id
              ? { ...f, status: percent >= 100 ? { type: "done" } : { type: "reading", percent } }
              : f,
          ),
        }));
        if (percent >= 100) clearInterval(interval);
      }, 450);
    });
  }

  function removeFile(id: string) {
    setState((s) => ({ ...s, files: s.files.filter((f) => f.id !== id) }));
  }

  function resetFlow() {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }

  return (
    <SubmitFlowContext.Provider
      value={{ ...state, setAfaType, setApplicationName, addFiles, removeFile, resetFlow }}
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
