module.exports = {
  content: ['./index.html', './src/**/*.{svelte,ts}'],
  theme: {
    extend: {
      colors: {
        midnight: '#303349',
        ink: '#25283a',
        panel: '#373b55',
        line: '#69708f',
        accent: '#f47c55',
        mint: '#4fca91'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px rgb(244 124 85 / 0.24)'
      }
    }
  },
  plugins: []
};
