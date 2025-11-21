/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'power-blue': '#0055aa',
        'power-red': '#dd2200',
        'power-yellow': '#ffcc00',
        'field-green': '#228822',
        'dirt-brown': '#885522',
        'pawapuro-blue': '#2563eb',
        'pawapuro-yellow': '#fbbf24',
        'pawapuro-pink': '#f472b6',
        'pawapuro-red': '#ef4444',
        'pawapuro-green': '#4ade80',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
