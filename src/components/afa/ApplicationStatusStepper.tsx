import { IconCheck } from "@tabler/icons-react";

export type ApplicationStage = "submitted" | "dept_chair" | "ofa" | "approved";

type StepState = "done" | "current" | "upcoming";

// "submitted" and "dept_chair" both mean the application is sitting with the
// Department Chair — the latter just confirms it's actively being looked at.
const STAGE_INDEX: Record<ApplicationStage, number> = { submitted: 0, dept_chair: 0, ofa: 1, approved: 2 };

export default function ApplicationStatusStepper({
  stage,
  submittedDateLabel,
}: {
  stage: ApplicationStage;
  submittedDateLabel: string;
}) {
  const stageIndex = STAGE_INDEX[stage];
  const step2: StepState = stageIndex > 0 ? "done" : "current";
  const step3: StepState = stageIndex > 1 ? "done" : stageIndex === 1 ? "current" : "upcoming";
  const step4: StepState = stageIndex > 2 ? "done" : "upcoming";

  const steps: { label: string; state: StepState; topLabel: string }[] = [
    { label: "Submitted", state: "done", topLabel: submittedDateLabel },
    { label: "Department Chair", state: step2, topLabel: step2 === "current" ? "In review" : "Done" },
    { label: "OFA review", state: step3, topLabel: step3 === "current" ? "In review" : step3 === "done" ? "Done" : "Next" },
    { label: "Approved", state: step4, topLabel: "Final" },
  ];

  return (
    <ol
      aria-label="Application status"
      className="relative -mt-[52px] mb-6 grid grid-cols-2 gap-x-4 gap-y-5 rounded-flow-card border border-flow-border bg-white p-5 shadow-[0_6px_18px_rgba(14,42,71,0.10)] sm:grid-cols-4 sm:gap-3"
    >
      {steps.map((step, i) => {
        const circle =
          step.state === "done" ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-flow-green">
              <IconCheck size={20} stroke={3} className="text-white" />
            </span>
          ) : step.state === "current" ? (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-flow-navy font-bold text-white"
              style={{ boxShadow: "0 0 0 3px #fff, 0 0 0 5px #0E2A47" }}
            >
              {i + 1}
            </span>
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-flow-disabled font-bold text-flow-muted">
              {i + 1}
            </span>
          );

        return (
          <li key={step.label} aria-current={step.state === "current" ? "step" : undefined} className="flex items-center gap-3">
            {circle}
            <span>
              <span
                className={`block text-[13px] ${step.state === "current" ? "font-semibold text-flow-maroon" : "text-flow-muted"}`}
              >
                {step.topLabel}
              </span>
              <b className={step.state === "upcoming" ? "text-flow-subtle" : undefined}>{step.label}</b>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
