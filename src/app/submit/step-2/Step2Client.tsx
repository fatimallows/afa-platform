"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconUpload } from "@tabler/icons-react";
import Button from "@/components/Button";
import Field from "@/components/afa/Field";
import FileRow from "@/components/afa/FileRow";
import { getAfaTypeLabel } from "@/components/afa/afa-types";
import { useSubmitFlow } from "@/app/submit/flow-context";

export default function Step2Client() {
  const { applicationName, setApplicationName, afaType, files, addFiles, removeFile, extractFields, cancelExtraction } =
    useSubmitFlow();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const router = useRouter();
  const typeLabel = getAfaTypeLabel(afaType) ?? "Not selected yet";

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    addFiles(Array.from(fileList));
  }

  function handleContinueManually() {
    router.push("/submit/step-3");
  }

  async function handleContinueWithAi() {
    setIsReading(true);
    await extractFields();
    setIsReading(false);
    router.push("/submit/step-3");
  }

  function handleCancelReading() {
    cancelExtraction();
    setIsReading(false);
  }

  return (
    <section className="rounded-flow-card border border-flow-border bg-white p-8">
      <h2 className="text-[26px] font-bold text-flow-navy">Upload documents</h2>
      <p className="mb-6 mt-1.5 text-flow-muted">Uploaded forms are used to auto-fill the next step.</p>

      <div className="mb-6 flex flex-wrap gap-5">
        <Field
          id="application-name"
          label="Application name"
          value={applicationName}
          onChange={setApplicationName}
          placeholder="Name this application"
          className="flex-[2_1_320px]"
        />
        <Field
          id="afa-type"
          as="display"
          label="AFA type"
          trailing={
            <Link href="/submit/step-1" className="px-2 py-3 text-[15px] font-semibold">
              Change
            </Link>
          }
          className="flex-1 basis-[200px]"
        >
          {typeLabel}
        </Field>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed px-6 py-9 text-center ${
          isDragging ? "border-flow-navy bg-flow-info-bg" : "border-flow-dropzone-border bg-flow-dropzone-bg"
        }`}
      >
        <IconUpload size={48} stroke={1.8} className="mx-auto text-flow-navy" />
        <div className="mt-2 text-xl font-bold text-flow-navy">Drag files here</div>
        <div className="my-1 text-flow-muted">or</div>
        <Button type="button" variant="flow-navy" onClick={() => inputRef.current?.click()}>
          Browse files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="mt-3.5 text-[15px] text-flow-muted">PDF, Word (.docx) or Excel (.xlsx) · up to 25 MB each</div>
      </div>

      {files.length > 0 && (
        <>
          <h3 className="mb-3 mt-7 text-[19px] font-semibold">Uploaded files ({files.length})</h3>
          <ul className="flex flex-col gap-2.5">
            {files.map((file) => (
              <FileRow
                key={file.id}
                name={file.name}
                kind={file.kind}
                sizeLabel={file.sizeLabel}
                status={file.status}
                onAction={() => removeFile(file.id)}
              />
            ))}
          </ul>
        </>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-flow-border pt-6">
        <Button href="/submit/step-1" variant="flow-outline-navy">
          ← Back
        </Button>

        {files.length === 0 ? (
          <Button type="button" variant="flow-yellow" onClick={handleContinueManually}>
            Continue to review details →
          </Button>
        ) : isReading ? (
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleCancelReading}
              className="text-[15px] font-semibold text-flow-navy underline-offset-2 hover:underline"
            >
              Cancel and continue manually
            </button>
            <Button type="button" variant="flow-yellow" disabled>
              Reading documents…
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="flow-outline-navy" onClick={handleContinueManually}>
              Fill in manually
            </Button>
            <Button type="button" variant="flow-yellow" onClick={handleContinueWithAi}>
              Autofill with AI →
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
