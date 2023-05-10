/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      backgroundImage: {
        mainBanner: 'url("/src/assets/img/parallaxImg.jpg")',
      },
      colors: {
        primary: '#3E74FF',
        primaryText: '#3F63BF',
        secondary: '#254463',
        pageBackground: '#14222F',
        dark: '#161618',
        darkTint: '#1E1E20',
        gray500: '#90A4AE',
        gray600: '#727070',
        gray800: '#E3E3E3',
        gray900: '#F7F7FB',
        danger: '#CA3333',
        transparentGray: 'rgba(0,0,0,0.43)',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        animateTextBackground: {
          '0%': { backgroundPosition: '0 0' },
          '25%': { backgroundPosition: '100% 0' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0 100%' },
          '100%': { backgroundPosition: '0 100%' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        animateTextBackground: 'animateTextBackground 10s ease-in-out infinite',
      },

      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
