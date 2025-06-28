/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        bounce: 'bounce 1s infinite',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'animation-delay-2000': 'animation-delay-2000 2s ease-in-out',
        'animation-delay-4000': 'animation-delay-4000 4s ease-in-out',
      },
      animationDelay: {
        '2000': '2s',
        '4000': '4s',
      },
    },
  },
  plugins: [],
}