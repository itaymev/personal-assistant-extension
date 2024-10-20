/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your React components
    "./dist/js/index.html",         // Include your HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
