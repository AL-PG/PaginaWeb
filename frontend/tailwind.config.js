/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'konkhmer-sleokchher': ['"Konkhmer Sleokchher"', 'sans-serif'], 
        gabarito: ["Gabarito", "sans-serif"]// Updated key to match class name
      },
    },
  },
  plugins: [],
}

