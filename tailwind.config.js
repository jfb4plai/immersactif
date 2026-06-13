/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        plai: { teal: '#0a9370', orange: '#f97316' },
      },
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
        read: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
