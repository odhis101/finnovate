/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8056A4',
          50: '#F5F0FA',
          100: '#E8DDF2',
          200: '#D1BAE5',
          300: '#BA98D8',
          400: '#A377CB',
          500: '#8056A4',
          600: '#664583',
          700: '#4D3462',
          800: '#332241',
          900: '#1A1121',
        },
      },
    },
  },
  plugins: [],
}

