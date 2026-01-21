/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        'navy-900': '#0a192f',
        'navy-800': '#112240',
        'navy-700': '#233554',
        'accent-orange': '#FF9F1C',
        'text-main': '#ccd6f6',
        'text-muted': '#8892b0',
        // Keeping legacy colors temporarily if needed, but intended to be replaced
        'light-blue': '#A0D8FF',
        'dark-blue': '#003366',
        'soft-orange': '#FFA07A',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.clip-path-inset': {
          'clip-path': 'inset(0)',
        },
      })
    },
  ],
}
