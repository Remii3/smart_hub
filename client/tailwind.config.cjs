/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      fontSize: {
        xs: ['clamp(0.64rem, 0.12vw + 0.62rem, 0.76rem)', 1.75],
        sm: ['clamp(0.8rem, 0.15vw + 0.77rem, 0.95rem)', 1.75],
        base: ['clamp(1rem, 0.19vw + 0.96rem, 1.19rem)', 1.75],
        md: ['clamp(1.25rem, 0.23vw + 1.2rem, 1.48rem)', 1.3],
        lg: ['clamp(1.56rem, 0.29vw + 1.5rem, 1.86rem)', 1.3],
        xl: ['clamp(1.95rem, 0.37vw + 1.88rem, 2.32rem)', 1.3],
        '2xl': ['clamp(2.44rem, 0.46vw + 2.35rem, 2.9rem)', 1.3],
        '3xl': ['clamp(3.05rem, 0.57vw + 2.94rem, 3.62rem)', 1.3],
        '4xl': ['clamp(3.81rem, 0.72vw + 3.67rem, 4.53rem)', 1.3],
      },
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
        transparentGray: 'rgba(0,0,0,0.21)',
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
