/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        casino: {
          primary: '#2C3E50',
          secondary: '#1ABC9C',
          accent: '#F1C40F',
          dark: '#1a202c',
          light: '#f7fafc',
          danger: '#E74C3C',
          success: '#2ECC71',
          green: {
            DEFAULT: '#145A32',
            dark: '#0E3B21',
            light: '#27AE60'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif']
      },
      backgroundImage: {
        'casino-pattern': "url('/src/assets/images/casino-pattern.png')",
        'card-pattern': "url('/src/assets/images/card-pattern.png')"
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
