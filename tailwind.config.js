/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      colors: {
        background: '#030305',
        surface: '#0A0A0F',
        accent: '#8B5CF6', // Purple-500
        'accent-light': '#A78BFA', // Purple-400
        glass: 'rgba(255, 255, 255, 0.04)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-strong': 'rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
        'premium-gradient-hover': 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 30px -5px rgba(139, 92, 246, 0.5)',
        'glass-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          'from': { backgroundPosition: '200% 0' },
          'to': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}
