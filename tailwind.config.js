/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        sage: {
          50: '#f2f7f2',
          100: '#deeede',
          200: '#bddcbd',
          300: '#93c393',
          400: '#5fa45f',
          500: '#3d863d',
          600: '#2d6b2d',
          700: '#255525',
          800: '#1e431e',
          900: '#183718',
        },
        terracotta: {
          50: '#fdf4f0',
          100: '#fae4d8',
          200: '#f5c5aa',
          300: '#ed9d74',
          400: '#e07040',
          500: '#c8521e',
          600: '#a83d14',
          700: '#882f10',
          800: '#6d250d',
          900: '#591f0b',
        }
      }
    },
  },
  plugins: [],
}
