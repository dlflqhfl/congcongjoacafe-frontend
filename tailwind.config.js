/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5F2D',
        secondary: '#234B24',
        accent: '#FFD700',
        beige: {
          50: '#FAF7F2',
          100: '#F5EDE3',
          200: '#E6D5C1',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      fontSize: {
        'mobile-base': '16px',
        'mobile-lg': '18px',
        'mobile-xl': '20px',
        'mobile-2xl': '24px',
      }
    },
  },
  plugins: [],
}