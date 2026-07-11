/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glutify: {
          bg: "#faf9f4",
          panel: "#ffffff",
          "panel-2": "#f3f2ea",
          line: "#e8e6db",
          ink: "#131309",
          "ink-dim": "#6e6c5e",
          lime: "#d9f24b",
          "lime-soft": "#ecf9ad",
          "lime-deep": "#9db31c",
          danger: "#e0453f",
          "danger-bg": "#fdeceb",
          warn: "#b8790a",
          "warn-bg": "#fdf2e0",
          safe: "#2f8a4e",
          "safe-bg": "#eaf7ee",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "-apple-system", "sans-serif"],
        mono: ["SFMono-Regular", "Consolas", "Menlo", "monospace"],
      },
      animation: {
        gbob: "gbob 2.6s ease-in-out infinite",
        grbob: "grbob 2.4s ease-in-out infinite",
        "gr-pop": "grpop .45s ease both",
        "fade-up": "fadeUp .5s ease both",
      },
      keyframes: {
        gbob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        grbob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        grpop: {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "60%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
    },
  },
  plugins: [],
};
