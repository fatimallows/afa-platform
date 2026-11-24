export type AfaStatus =
  | "returned"
  | "evaluation-due"
  | "dept-chair"
  | "dean"
  | "nstp"
  | "ofa"
  | "approved"
  | "completed"
  | "draft";

const statusConfig: Record<AfaStatus, { label: string; bg: string; text: string }> = {
  returned: { label: "Returned", bg: "bg-status-returned-bg", text: "text-crimson" },
  "evaluation-due": { label: "Evaluation due", bg: "bg-status-eval-due-bg", text: "text-status-eval-due-text" },
  "dept-chair": { label: "With Dept. Chair", bg: "bg-status-dept-chair-bg", text: "text-status-dept-chair-text" },
  dean: { label: "With Dean", bg: "bg-status-dean-bg", text: "text-status-dean-text" },
  nstp: { label: "With NSTP Office", bg: "bg-status-nstp-bg", text: "text-status-nstp-text" },
  ofa: { label: "With OFA", bg: "bg-status-ofa-bg", text: "text-status-ofa-text" },
  approved: { label: "Approved", bg: "bg-status-approved-bg", text: "text-status-approved-text" },
  completed: { label: "Completed", bg: "bg-status-completed-bg", text: "text-status-completed-text" },
  draft: { label: "Draft", bg: "bg-status-draft-bg", text: "text-status-draft-text" },
};

// Maps the `afas.status` column's values (see supabase/schema_afas.sql) to a badge.
export const DB_STATUS_TO_BADGE: Record<string, AfaStatus> = {
  submitted: "dept-chair",
  dept_chair: "dept-chair",
  ofa: "ofa",
  approved: "approved",
  returned: "returned",
};

export default function StatusBadge({ status }: { status: AfaStatus }) {
  const { label, bg, text } = statusConfig[status];

  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${bg} ${text}`}>
      {label}
    </span>
  );
}
