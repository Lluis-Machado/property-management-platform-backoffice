/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          100: '#EFE5D1',
          200: '#E2D2B4',
          300: '#D4C09A',
          400: '#C7AF82',
          500: '#b99f6c',
          600: '#9B7F4A',
          700: '#7C622E',
          800: '#5E4719',
          900: '#402E0A',
        },
        'secondary': {
          100: '#D2E1EE',
          200: '#9BB3C8',
          300: '#6C89A3',
          400: '#45637D',
          500: '#274158',
          600: '#1E3850',
          700: '#163047',
          800: '#0F283F',
          900: '#092136',
        },
        'custom-white': '#fbfbfd',
        'links': '#008af3',
      },
      height: {
        'header': '3.5rem',
        'footer': '4rem',
      },
      minHeight: {
        'footer': '4rem',
      },
      width: {
        'sidebar': '16rem',
        'sidebar-text': '10rem',
        'sidebar-icon': '3rem',
      },
      minWidth: {
        'sidebar-icon': '3rem',
      },
      spacing: {
        'sidebar': '16rem',
        'sidebar-icon': '3rem',
        'header': '3.5rem',
      },
      scale: {
        '80': '0.8'
      },
      zIndex: {
        '10k': 10000
      },
      boxShadow: {
        'header': '0px 2px 4px 2px #00000024',
        'footer': '0px -2px 4px 2px #00000024',
      },
      fontFamily: {
        barlow: ['var(--font-barlow)'],
      },
    },
  },
  plugins: [],
}