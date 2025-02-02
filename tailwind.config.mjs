/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	theme: {
    extend: {
      colors: {
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
