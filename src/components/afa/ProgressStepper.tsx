import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";

type StepDef = { n: 1 | 2 | 3 | 4; label: string; href: string };

const STEPS: StepDef[] = [
  { n: 1, label: "Choose AFA type", href: "/submit/step-1" },
  { n: 2, label: "Upload documents", href: "/submit/step-2" },
  { n: 3, label: "Review details", href: "/submit/step-3" },
  { n: 4, label: "Submit to OFA", href: "/submit/step-4" },
];

export default function ProgressStepper({ currentStep }: { currentStep: 1 | 2 | 3 | 4 }) {
  return (
    <ol
      aria-label="Application progress"
      className="relative -mt-[52px] mb-7 grid grid-cols-2 gap-x-4 gap-y-5 rounded-flow-card border border-flow-border bg-white p-5 shadow-[0_6px_18px_rgba(14,42,71,0.10)] sm:grid-cols-4 sm:gap-3"
    >
      {STEPS.map((step) => {
        const state = step.n < currentStep ? "done" : step.n === currentStep ? "current" : "upcoming";

        const circle =
          state === "done" ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-flow-green">
              <IconCheck size={20} stroke={3} className="text-white" />
            </span>
          ) : state === "current" ? (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-flow-navy font-bold text-white"
              style={{ boxShadow: "0 0 0 3px #fff, 0 0 0 5px #0E2A47" }}
            >
              {step.n}
            </span>
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-flow-disabled font-bold text-flow-muted">
              {step.n}
            </span>
          );

        const labelBlock = (
          <span>
            <span
              className={`block text-[13px] ${state === "current" ? "font-semibold text-flow-maroon" : "text-flow-muted"}`}
            >
              Step {step.n}
            </span>
            <b className={state === "upcoming" ? "text-flow-subtle" : undefined}>{step.label}</b>
          </span>
        );

        if (state === "done") {
          return (
            <li key={step.n}>
              <Link href={step.href} className="flex items-center gap-3 text-flow-text no-underline">
                {circle}
                {labelBlock}
              </Link>
            </li>
          );
        }

        return (
          <li key={step.n} aria-current={state === "current" ? "step" : undefined} className="flex items-center gap-3">
            {circle}
            {labelBlock}
          </li>
        );
      })}
    </ol>
  );
}
