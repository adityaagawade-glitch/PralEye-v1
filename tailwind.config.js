/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        panel: '#161b22',
        danger: '#dc2626',
        warning: '#f59e0b',
        success: '#10b981',
      }
    },
  },
  plugins: [],
}
