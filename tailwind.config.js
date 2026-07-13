/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--color-app-bg)',
        'app-card': 'var(--color-app-card)',
        'app-card-soft': 'var(--color-app-card-soft)',
        'app-sheet': 'var(--color-app-sheet)',
        'app-input': 'var(--color-app-input)',
        'app-border': 'var(--color-app-border)',
        'app-text': 'var(--color-app-text)',
        'app-muted': 'var(--color-app-muted)',
        'app-tab': 'var(--color-app-tab)',
      },
    },
  },
  plugins: [],
};
