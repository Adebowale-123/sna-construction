/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#edf1f8',
          100: '#c8d4ea',
          200: '#a0b3d8',
          600: '#1a3d8a',
          700: '#122d6e',
          800: '#0d2159',
          900: '#0B1E3D',
          950: '#060f20',
        },
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0056B3',
          600: '#0047a0',
          700: '#003a8c',
          800: '#002d70',
          900: '#001f52',
        },
        gold: {
          300: '#fde68a',
          400: '#F0B429',
          500: '#C8960C',
          600: '#a67a08',
          700: '#856005',
        },
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a',
          950: '#070d1a',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(135deg, rgba(11,30,61,0.97) 0%, rgba(0,86,179,0.85) 100%)",
      },
      animation: {
        'fade-up':  'fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':  'fadeIn 0.5s ease-out forwards',
        'ticker':   'ticker 50s linear infinite',
        'count-up': 'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(28px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        ticker:   { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        countUp:  { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [],
};
