"use client";

import { useState } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import Button from "@/components/Button";
import { useSubmitFlow, type FileKind } from "@/app/submit/flow-context";
import { getAfaTypeLabel } from "@/components/afa/afa-types";

type Props = {
  facultyName: string;
  facultyEmail: string;
};

const kindLabel: Record<FileKind, string> = { pdf: "PDF", docx: "DOCX", xlsx: "XLSX" };

const fallbackFiles = [
  { kind: "pdf" as FileKind, name: "Appendix A" },
  { kind: "xlsx" as FileKind, name: "Participants list" },
  { kind: "pdf" as FileKind, name: "Participation agreements" },
  { kind: "docx" as FileKind, name: "Supporting" },
];

const approvalSteps = [
  { title: "Faculty", detail: "Submits application", active: true },
  { title: "Department Chair", detail: "Endorses the activity", active: false },
  { title: "OFA", detail: "Checks documents and safety", active: false },
  { title: "Approved", detail: "Shown on the dashboard", active: false },
];

// Course/schedule/venue values are sample data, same as step 3 — there is no
// backend yet to persist or submit a real application (see the standing
// "confirm with the prof before wiring real AFA data" rule). The "Submit
// application" button below is a UI-only stub: it does not call any API.
export default function Step4Client({ facultyName, facultyEmail }: Props) {
  const { applicationName, afaType, files, resetFlow } = useSubmitFlow();
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const typeLabel = getAfaTypeLabel(afaType) ?? "On-Campus AFA";
  const displayFiles = files.length > 0 ? files : fallbackFiles;
  const fileSummary = displayFiles.map((f) => `${f.name} (${kindLabel[f.kind]})`).join(" · ");

  if (submitted) {
    return (
      <section className="rounded-flow-card border border-flow-border bg-white p-10 text-center">
        <IconCircleCheckFilled size={56} className="mx-auto text-flow-green" />
        <h2 className="mt-4 text-2xl font-bold text-flow-navy">Application submitted</h2>
        <p className="mx-auto mt-2 max-w-[440px] text-flow-muted">
          The Department Chair has been notified. OFA will update the status on your dashboard and by email.
        </p>
        <Button
          href="/dashboard"
          variant="flow-yellow"
          className="mx-auto mt-6"
          onClick={() => resetFlow()}
        >
          Back to dashboard
        </Button>
      </section>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-flow-card border border-flow-border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-flow-navy px-7 py-5 text-white">
          <b className="text-xl">Application summary</b>
          <span className="text-[15px] text-flow-banner-text">
            {typeLabel} · A.Y. 2026-2027, First Semester
          </span>
        </div>
        <dl className="m-0 grid grid-cols-[minmax(160px,220px)_1fr_auto] px-7 py-2 text-[17px]">
          {[
            ["Course", "Geog 123 · Section WFV", "/submit/step-3"],
            ["Academic unit", "College of Social Sciences and Philosophy", "/submit/step-3"],
            ["When", "Dec 2 to Dec 3, 2026", "/submit/step-3"],
            ["Where", "Apacible Street, U.P. Campus, Diliman", "/submit/step-3"],
            ["Faculty in-charge", `${facultyName} · ${facultyEmail}`, "/submit/step-3"],
            ["Participants", "35 students", "/submit/step-3"],
          ].map(([label, value, href]) => (
            <div key={label} className="contents">
              <dt className="border-b border-flow-divider py-3.5 text-flow-muted">{label}</dt>
              <dd className="m-0 border-b border-flow-divider py-3.5 font-semibold">{value}</dd>
              <dd className="m-0 border-b border-flow-divider py-3.5">
                <a href={href}>Edit</a>
              </dd>
            </div>
          ))}
          <div className="contents">
            <dt className="py-3.5 text-flow-muted">Documents</dt>
            <dd className="m-0 py-3.5">
              <span className="font-semibold">{displayFiles.length} files attached</span>
              <div className="text-[15px] text-flow-subtle">{fileSummary}</div>
            </dd>
            <dd className="m-0 py-3.5">
              <a href="/submit/step-2">Edit</a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-flow-card border border-flow-border bg-white p-7">
        <h2 className="text-[22px] font-bold text-flow-navy">Approval process</h2>
        <ol className="mt-4 grid grid-cols-2 gap-3 text-base sm:grid-cols-4">
          {approvalSteps.map((step) => (
            <li
              key={step.title}
              className={`border-t-[5px] pt-3 ${step.active ? "border-flow-yellow" : "border-flow-field-border"}`}
            >
              <b className="block text-flow-navy">{step.title}</b>
              {step.detail}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-flow-card border-2 border-flow-navy bg-white p-7">
        <label className="flex cursor-pointer items-start gap-3.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-[26px] w-[26px] shrink-0 accent-flow-navy"
          />
          The information above is correct, and this activity will follow the University&rsquo;s AFA guidelines and
          safety standards.
        </label>
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button href="/submit/step-3" variant="flow-outline-navy">
            ← Back to review
          </Button>
          {agreed ? (
            <Button type="button" variant="flow-yellow" onClick={() => setSubmitted(true)}>
              Submit application
            </Button>
          ) : (
            <span
              aria-disabled="true"
              className="flex h-14 cursor-not-allowed items-center rounded-flow-control bg-flow-track px-8 text-lg font-bold text-flow-muted"
            >
              Submit application
            </span>
          )}
        </div>
      </section>
    </>
  );
}
