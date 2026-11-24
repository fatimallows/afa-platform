"use client";

import { useSubmitFlow, type FileKind } from "@/app/submit/flow-context";

const checklist = [
  { label: "1 · Course and schedule", status: "1 to check", tone: "text-flow-red-text" },
  { label: "2 · Activity details", status: "Complete", tone: "text-flow-green" },
  { label: "3 · Faculty and participants", status: "1 missing", tone: "text-flow-red-text" },
];

const kindLabel: Record<FileKind, string> = { pdf: "PDF", docx: "DOCX", xlsx: "XLSX" };
const kindColor: Record<FileKind, string> = {
  pdf: "text-flow-red-text",
  docx: "text-flow-info-icon",
  xlsx: "text-flow-green",
};

const fallbackFiles: { kind: FileKind; name: string }[] = [
  { kind: "pdf", name: "Appendix A_Summary Report" },
  { kind: "docx", name: "Appendix A_Summary Report" },
  { kind: "xlsx", name: "Appendix A_Summary Report" },
];

export default function Step3Aside() {
  const { files } = useSubmitFlow();
  const displayFiles = files.length > 0 ? files : fallbackFiles;

  return (
    <>
      <div className="rounded-flow-card border border-flow-border bg-white p-6">
        <h2 className="mb-3.5 text-xl font-bold text-flow-navy">Checklist</h2>
        <ul className="flex flex-col gap-3 text-base">
          {checklist.map((item) => (
            <li key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
              <span>{item.label}</span>
              <b className={`whitespace-nowrap text-right ${item.tone}`}>{item.status}</b>
            </li>
          ))}
        </ul>
        <div className="mt-[18px] h-2.5 rounded-full bg-flow-track">
          <div className="h-2.5 w-[88%] rounded-full bg-flow-green" />
        </div>
        <div className="mt-1.5 text-sm text-flow-muted">14 of 16 fields ready</div>
      </div>

      <div className="rounded-flow-card border border-flow-border bg-white p-6">
        <h2 className="mb-3.5 text-xl font-bold text-flow-navy">Your files</h2>
        <ul className="flex flex-col gap-2.5 text-[15px]">
          {displayFiles.map((file, i) => (
            <li key={i}>
              <span className={`inline-block w-[46px] font-bold ${kindColor[file.kind]}`}>{kindLabel[file.kind]}</span>
              <a href="#">{file.name}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-flow-card bg-flow-navy p-6 text-[16px] text-white">
        <b className="text-lg">Questions?</b>
        <br />
        <span className="text-flow-banner-text">
          ofadiliman@up.edu.ph
          <br />
          (632) 8981-8500 local 2059
        </span>
      </div>
    </>
  );
}
