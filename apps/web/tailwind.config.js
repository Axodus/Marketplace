/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
