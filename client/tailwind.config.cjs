/** @type {import('tailwindcss').Config} */

(
  module.exports = {
    mode: 'jit',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

    theme: {
      extend: {
        colors: {
          primary: '#42a8ef',
          secondary: '#254463',
          pageBackground: '#0d1c25',
          primaryGradient: 'linear-graident()',
          primaryText: '#ffffff',
          secondaryText: '#416c97',
        },
        backgroundSize: {
          '400%': '400%',
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
