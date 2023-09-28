/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'hero': '900px',
        'feat': '800px',
        'post': '30vh',
        'addpost': '50vh',
        'load': '500px'
      },
      minHeight: {
        'post': '30vh',
      },
      width:{
        '70vw': '70vw',
        'post': '50vw',
        'project': '35vw',
      },
      backgroundImage: {
        'hero': "url('../public/images/book.jpg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors:{
        "cream": {
          100: "#FFFCC7",
          200: "#FFFDE7",
          300: "#FFEFCB",
          400: "#F6E3BA",
          500: "#DFCAA0",
          600: "#CFB284"
        } 
      },
      padding: {
        '5%': '5vh'
      },
      borderRadius:{
        'xlg':'70px'
      },
      fontFamily:{
        'bebas': ['Bebas']
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      },
      animation:{
        fadeIn: 'fadeIn 500ms ease-in-out'
      },
    },
  },
  plugins: [],
}

