/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // On crée une couleur "Spotify" personnalisée
        'spotify-green': '#1DB954',
        'spotify-black': '#121212',
        'spotify-dark': '#191414',
      },
    },
  },
  plugins: [],
}