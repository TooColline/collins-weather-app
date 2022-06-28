/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      '2xl': '28px',
      '3xl': '32px',
      '4xl': '40px',
    },
    lineHeight: {
      xs: '16px',
      sm: '20px',
      md: '22px',
      lg: '24px',
      xl: '32px',
      '2xl': '40px',
      '3xl': '42px',
      '4xl': '50px',
    },
    fontFamily: {
      nunito: ['Nunito', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}
