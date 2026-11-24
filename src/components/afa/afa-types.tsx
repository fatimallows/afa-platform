import type { ReactNode } from "react";

export type AfaTypeId =
  | "on-campus"
  | "off-campus"
  | "nstp"
  | "special"
  | "international"
  | "internship"
  | "moa";

export type AfaTypeDef = {
  id: AfaTypeId;
  label: string;
  description: string;
  icon: (stroke: string) => ReactNode;
};

// The 7 AFA types and their icons, copied from the Figma reference (afa-application-handoff).
// Type descriptions and required documents still need OFA confirmation per the handoff README.
export const AFA_TYPES: AfaTypeDef[] = [
  {
    id: "on-campus",
    label: "On-Campus AFA",
    description: "Held inside UP Diliman, such as museums, labs and on-campus field sites.",
    icon: (stroke) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" aria-hidden="true">
        <path d="M3 21h18M5 21V9l7-5 7 5v12M10 21v-5h4v5" />
      </svg>
    ),
  },
  {
    id: "off-campus",
    label: "Off-Campus AFA",
    description: "Held outside the campus, within Metro Manila or the provinces.",
    icon: (stroke) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" aria-hidden="true">
        <path d="M4 17h16M6 17V11l2-4h8l2 4v6M7 17v2M17 17v2" />
        <circle cx="8" cy="14" r="1" />
        <circle cx="16" cy="14" r="1" />
      </svg>
    ),
  },
  {
    id: "nstp",
    label: "NSTP AFA",
    description: "Community activities under the National Service Training Program.",
    icon: (stroke) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" aria-hidden="true">
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
  {
    id: "special",
    label: "Special AFA",
    description: "Activities outside the regular categories.",
    icon: (stroke) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" aria-hidden="true">
        <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />
      </svg>
    ),
  },
  {
    id: "international",
    label: "International AFA",
    description: "Held outside the Philippines, such as foreign partner institutions or exchange sites.",
    icon: (stroke) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
      </svg>
    ),
  },
  {
    id: "internship",
    label: "Internship",
    description: "Students interning with a host company, agency, or office.",
    icon: (stroke) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5h6v2" />
      </svg>
    ),
  },
  {
    id: "moa",
    label: "MOA",
    description: "Memorandum of Agreement with a host training establishment.",
    icon: (stroke) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" aria-hidden="true">
        <path d="M7 3h7l5 5v13H7z" />
        <path d="M14 3v5h5M10 14h6M10 17h4" />
      </svg>
    ),
  },
];

export function getAfaTypeLabel(id: AfaTypeId | null): string | null {
  if (!id) return null;
  return AFA_TYPES.find((type) => type.id === id)?.label ?? null;
}
