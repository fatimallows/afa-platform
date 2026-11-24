import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#001C41",
        "logo-navy": "#172036",
        "slate-navy": "#1F3959",

        "ofa-yellow": "#F7D172",
        "yellow-hover": "#EFC24F",

        "page-gray": "#F5F5F5",

        "muted-text": "#4A5568",

        "border-input": "#CBD2DC",
        "border-card": "#E6E8EE",
        "border-row": "#F0F1F4",
        "action-row": "#FFFBF2",

        teal: "#529C89",
        "teal-tint": "#E5F0ED",
        periwinkle: "#747BB9",
        "periwinkle-tint": "#EAEBF5",
        orange: "#FD8F4C",
        "orange-tint": "#FFEEE4",
        "deep-yellow": "#C79A2E",
        "deep-yellow-tint": "#FEF8EA",
        crimson: "#BB3045",

        "status-returned-bg": "#FCEBEB",
        "status-returned-text": "#791F1F",
        "status-eval-due-bg": "#FFEEE4",
        "status-eval-due-text": "#A04E1C",
        "status-dept-chair-bg": "#EAEBF5",
        "status-dept-chair-text": "#4A5191",
        "status-dean-bg": "#E6F1FB",
        "status-dean-text": "#0C447C",
        "status-nstp-bg": "#FBEAF0",
        "status-nstp-text": "#72243E",
        "status-ofa-bg": "#FEF8EA",
        "status-ofa-text": "#7A5D14",
        "status-approved-bg": "#E5F0ED",
        "status-approved-text": "#3B6E61",
        "status-completed-bg": "#E6E9EF",
        "status-completed-text": "#001C41",
        "status-draft-bg": "#F1EFE8",
        "status-draft-text": "#5F5E5A",

        // "Submit an AFA" flow (src/app/submit) — distinct palette from the
        // afa-application-handoff README, kept separate from the tokens above
        // since it doesn't overlap with the rest of the site's design system.
        "flow-navy": "#0E2A47",
        "flow-yellow": "#F5C451",
        "flow-green": "#1E6B47",
        "flow-red": "#B3261E",
        "flow-red-text": "#8E1A22",
        "flow-red-bg": "#FFF6F5",
        "flow-maroon": "#7B1113",
        "flow-text": "#1B2430",
        "flow-muted": "#556070",
        "flow-subtle": "#3D4756",
        "flow-border": "#DDE2E8",
        "flow-field-border": "#C4CBD5",
        "flow-field-border-strong": "#9AA4B2",
        "flow-page": "#F4F5F7",
        "flow-info-bg": "#EEF3F9",
        "flow-info-border": "#C9D6E6",
        "flow-info-icon": "#1F4E8C",
        "flow-avatar": "#1F5FA8",
        "flow-divider": "#EEF0F3",
        "flow-track": "#E3E7EC",
        "flow-disabled": "#9AA4B2",
        "flow-help-border": "#8FA3BD",
        "flow-banner-text": "#D5DEEA",
        "flow-banner-text-dim": "#C9D6E6",
        "flow-dropzone-border": "#6B7A90",
        "flow-dropzone-bg": "#F8FAFC",
        "flow-pdf-bg": "#FBE9EA",
        "flow-docx-bg": "#E6EEF9",
        "flow-xlsx-bg": "#E5F3EA",
      },
      borderRadius: {
        card: "12px",
        control: "8px",
        "flow-card": "16px",
        "flow-control": "10px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
