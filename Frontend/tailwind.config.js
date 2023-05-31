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
        'post': '300px',
        'addpost': '500px'
      },
      width:{
        'post': '800px',
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
        
      }
    },
  },
  plugins: [],
}

