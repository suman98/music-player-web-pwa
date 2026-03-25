/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#A855F7',
          dark: '#1a1a2e',
          darker: '#0f0f1e',
          50: 'rgba(168, 85, 247, 0.05)',
          100: 'rgba(168, 85, 247, 0.1)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
      },
      keyframes: {
        slideUp: {
          'from': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          'to': {
            transform: 'translateY(0)',
            opacity: '1',
          }
        }
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
