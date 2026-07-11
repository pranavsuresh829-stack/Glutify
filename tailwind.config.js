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
          cream: "#F8F6EE",
          card: "#FFFFFF",
          ink: "#181811",
          lime: "#D3F04C",
          "lime-soft": "#EAF7A8",
          "lime-deep": "#B6DB2E",
        },
      },
    },
  },
  plugins: [],
};
