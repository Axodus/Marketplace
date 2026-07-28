/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        marketplace: {
          bg: "var(--marketplace-bg)",
          surface: "var(--marketplace-surface)",
          muted: "var(--marketplace-surface-muted)",
          graphite: "var(--marketplace-graphite)",
          text: "var(--marketplace-text)",
          "text-muted": "var(--marketplace-text-muted)",
          border: "var(--marketplace-border)",
          "border-strong": "var(--marketplace-border-strong)",
          trusted: "var(--marketplace-trusted)",
          accent: "var(--marketplace-accent-muted)",
          "accent-text": "var(--marketplace-accent-text)",
          danger: "var(--marketplace-danger)",
          focus: "var(--marketplace-focus)"
        },
        axodus: {
          ink: "#111827",
          panel: "#f8fafc",
          line: "#d8dee8",
          gold: "#b58b21",
          teal: "#0f766e",
          red: "#b91c1c"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};
