/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        guru: {
          dark: '#0a0a0a',
          text: '#1a1a1a',
          muted: '#6b7280',
          prompt: '#B5502E',
          teal: '#0E4D4A',
          sand: '#F4E9D8',
        },
      },
    },
  },
  plugins: [],
}
