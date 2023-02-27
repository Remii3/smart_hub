/** @type {import('tailwindcss').Config} */

(
  module.exports = {
    mode: 'jit',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

    theme: {
      extend: {
        colors: {
          primary: '#6C63FF',
          primaryText: '#4943AC',
          secondary: '#254463',
          pageBackground: '#14222F',
          dark: '#161618',
          darkTint: '#1E1E20',
          gray500: '#90A4AE',
          gray600: '#727070',
          gray800: '#E3E3E3',
          gray900: '#F7F7FB',
          danger: '#CA3333',
        },
        keyframes: {
          animateTextBackground: {
            '0%': { backgroundPosition: '0 0' },
            '25%': { backgroundPosition: '100% 0' },
            '50%': { backgroundPosition: '100% 100%' },
            '75%': { backgroundPosition: '0 100%' },
            '100%': { backgroundPosition: '0 100%' },
          },
        },
        animation: {
          animateTextBackground:
            'animateTextBackground 10s ease-in-out infinite',
        },
        fontFamily: {
          rubik: ['Rubik', 'sans-serif'],
          poppins: ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [require('@kamona/tailwindcss-perspective')],
  }
);
