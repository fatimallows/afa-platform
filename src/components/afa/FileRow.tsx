import type { FileKind, FileStatus } from "@/app/submit/flow-context";

const kindStyles: Record<FileKind, { bg: string; text: string; label: string }> = {
  pdf: { bg: "bg-flow-pdf-bg", text: "text-flow-red-text", label: "PDF" },
  docx: { bg: "bg-flow-docx-bg", text: "text-flow-info-icon", label: "DOCX" },
  xlsx: { bg: "bg-flow-xlsx-bg", text: "text-flow-green", label: "XLSX" },
};

type FileRowProps = {
  name: string;
  kind: FileKind;
  sizeLabel: string;
  status: FileStatus;
  onAction?: () => void;
};

export default function FileRow({ name, kind, sizeLabel, status, onAction }: FileRowProps) {
  const style = kindStyles[kind];

  return (
    <li className="flex items-center gap-3.5 rounded-flow-card border border-flow-border px-4 py-3.5">
      <span
        className={`flex h-[30px] w-[52px] shrink-0 items-center justify-center rounded text-[13px] font-bold ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>
      <span className="min-w-0 flex-1">
        <b className="block truncate">{name}</b>
        {status.type === "done" ? (
          <span className="text-sm text-flow-muted">{sizeLabel} · Read by AI ✓</span>
        ) : (
          <>
            <span className="text-sm text-flow-muted">
              {sizeLabel} · Reading… {status.percent}%
            </span>
            <span className="mt-1.5 block h-1.5 rounded-full bg-flow-track">
              <span
                className="block h-1.5 rounded-full bg-flow-green transition-all"
                style={{ width: `${status.percent}%` }}
              />
            </span>
          </>
        )}
      </span>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="h-11 shrink-0 rounded-[8px] border border-flow-field-border px-3.5 text-[15px] text-flow-text hover:bg-flow-page"
        >
          {status.type === "reading" ? "Cancel" : "Remove"}
        </button>
      )}
    </li>
  );
}
