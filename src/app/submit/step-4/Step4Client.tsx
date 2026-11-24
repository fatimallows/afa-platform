"use client";

import { useState } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import Button from "@/components/Button";
import { useSubmitFlow, type FileKind } from "@/app/submit/flow-context";
import { getAfaTypeLabel } from "@/components/afa/afa-types";
import { createClient } from "@/lib/supabase/client";

type Props = {
  facultyName: string;
  facultyEmail: string;
};

const kindLabel: Record<FileKind, string> = { pdf: "PDF", docx: "DOCX", xlsx: "XLSX" };

const approvalSteps = [
  { title: "Faculty", detail: "Submits application", active: true },
  { title: "Department Chair", detail: "Endorses the activity", active: false },
  { title: "OFA", detail: "Checks documents and safety", active: false },
  { title: "Approved", detail: "Shown on the dashboard", active: false },
];

// feature/real-submission-prototype: submitting now actually inserts a row
// into the real `afas` table (see supabase/schema_afas.sql) instead of only
// flipping local state.
export default function Step4Client({ facultyName, facultyEmail }: Props) {
  const { applicationName, afaType, files, reviewFields, participants, resetFlow } = useSubmitFlow();
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const typeLabel = getAfaTypeLabel(afaType) ?? "AFA";
  const fileSummary = files.map((f) => `${f.name} (${kindLabel[f.kind]})`).join(" · ") || "No files attached";

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmitError("You're not signed in anymore. Please sign in again.");
      setSubmitting(false);
      return;
    }

    const fieldsPayload = {
      ...Object.fromEntries(Object.entries(reviewFields).map(([key, f]) => [key, f.value])),
      participants,
    };
    const filesPayload = files.map((f) => ({ name: f.name, kind: f.kind, sizeLabel: f.sizeLabel }));

    const { error } = await supabase.from("afas").insert({
      user_id: user.id,
      afa_type: afaType ?? "unknown",
      application_name: applicationName || "Untitled application",
      fields: fieldsPayload,
      files: filesPayload,
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setSubmitted(true);
  }

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
            {typeLabel} {reviewFields.academicTerm.value && `· ${reviewFields.academicTerm.value}`}
          </span>
        </div>
        <dl className="m-0 grid grid-cols-[minmax(160px,220px)_1fr_auto] px-7 py-2 text-[17px]">
          {[
            [
              "Course",
              [reviewFields.course.value, reviewFields.section.value && `Section ${reviewFields.section.value}`]
                .filter(Boolean)
                .join(" · ") || "Not provided",
            ],
            ["Academic unit", reviewFields.academicUnit.value || "Not provided"],
            ["When", reviewFields.activityDates.value || "Not provided"],
            ["Where", reviewFields.venue.value || "Not provided"],
            ["Faculty in-charge", `${facultyName} · ${facultyEmail}`],
            ["Participants", participants.length > 0 ? `${participants.length} students` : "Not provided"],
          ].map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="border-b border-flow-divider py-3.5 text-flow-muted">{label}</dt>
              <dd className="m-0 border-b border-flow-divider py-3.5 font-semibold">{value}</dd>
              <dd className="m-0 border-b border-flow-divider py-3.5">
                <a href="/submit/step-3">Edit</a>
              </dd>
            </div>
          ))}
          <div className="contents">
            <dt className="py-3.5 text-flow-muted">Documents</dt>
            <dd className="m-0 py-3.5">
              <span className="font-semibold">{files.length} files attached</span>
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

        {submitError && <p className="mt-4 text-flow-red-text">Couldn&apos;t submit: {submitError}</p>}

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button href="/submit/step-3" variant="flow-outline-navy">
            ← Back to review
          </Button>
          {agreed ? (
            <Button type="button" variant="flow-yellow" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit application"}
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
