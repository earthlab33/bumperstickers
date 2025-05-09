/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'impact': ['Impact', 'sans-serif'],
        'georgia': ['Georgia', 'serif'],
        'times': ['"Times New Roman"', 'serif'],
        'arial-black': ['"Arial Black"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 