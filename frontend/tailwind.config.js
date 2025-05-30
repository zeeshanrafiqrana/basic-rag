/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bffd',
          400: '#819ffc',
          500: '#647cf8',
          600: '#5061ed',
          700: '#454bd4',
          800: '#3941ab',
          900: '#333c86',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede8ff',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'typing-dots': 'typing 1.4s infinite both',
      },
      keyframes: {
        typing: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100%': { opacity: 0.2 },
        },
      },
    },
  },
  plugins: [],
};