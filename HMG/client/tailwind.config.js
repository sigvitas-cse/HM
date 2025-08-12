export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00f0ff',
        secondary: '#ff00f0',
        'bg-dark': '#0a0a15',
        'bg-darker': '#050510',
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'share-tech': ['Share Tech Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};