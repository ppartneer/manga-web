/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0F',
        surface: '#121217',
        accent: '#6366F1',
        glass: 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(to bottom right, #6366F1, #A855F7)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
