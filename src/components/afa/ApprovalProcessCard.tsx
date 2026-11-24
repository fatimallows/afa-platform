const steps = [
  { title: "Department Chair", detail: "reviews and endorses" },
  { title: "OFA", detail: "checks documents and safety requirements" },
  { title: "Status updates", detail: "by email and on the dashboard" },
];

export default function ApprovalProcessCard() {
  return (
    <div className="rounded-flow-card border border-flow-border bg-white p-6">
      <h2 className="mb-3.5 text-xl font-bold text-flow-navy">Approval process</h2>
      <ol className="flex flex-col gap-3.5 text-base">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-flow-info-bg text-sm font-bold text-flow-navy">
              {i + 1}
            </span>
            <span>
              <b>{step.title}</b> {step.detail}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
