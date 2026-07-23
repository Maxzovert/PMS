/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.js', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#34B17F',
        secondary: '#0E3B35',
        'secondary-deep': '#042C21',
        surface: '#F6F6F5',
        'surface-muted': '#E5F4EC',
        'surface-elevated': '#FFFFFF',
        border: '#878D95',
        warning: '#FDCA5E',
        'accent-soft': '#FDDFE0',
        muted: '#878D95',
      },
    },
  },
  plugins: [],
};
