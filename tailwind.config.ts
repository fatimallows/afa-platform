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
      },
      borderRadius: {
        card: "12px",
        control: "8px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
