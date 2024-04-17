const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  darkMode: 'class',
  content: [
    './public/*.css',
    './pages/*.html',
    './templates/**/*.html',
    './ctrl/**/*.js',
    './index.html',
    './*.js',
    './utils/**/*.js',
  ],
  theme: {
    screens: {
      xs: '400px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Inter', 'sans-serif'],
        mono: ['Inter', 'sans-serif'],
      },
      colors: {
        rd: {
          bg: '#ebeadd',
          text: '#000',
          link: '#76B041',
          highlight: '#bdad00',
          sagwa_young: '#76B041',
          sagwa: '#FFC107',
          sagwa_old: '#D32F2F',
          urban_gray: '#37474F',
          sand: '#DDD5C1',
          pur: '#ffffff',
        },
        dark: {
          text: '#ebeadd',
          bg: '#000',
          link: '#378C4C',
          highlight: '#bfba1d',
        },
      },
    },
  },
  plugins: [],
}
