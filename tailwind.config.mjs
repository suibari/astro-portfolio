/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      // 実際の値は src/styles/global.css の :root で管理
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        line: "var(--line)",
        blue: "var(--blue)",
        "blue-deep": "var(--blue-deep)",
        "blue-soft": "var(--blue-soft)",
        orange: "var(--orange)",
        "orange-ink": "var(--orange-ink)",
      },
      fontFamily: {
        pixel: ['"VT323"', "monospace"],
        sans: ['"M PLUS Rounded 1c"', "sans-serif"],
      },
    },
  },
};
