/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Define custom font families
        'outfit': ['Outfit-Regular'],
        'outfit-light': ['Outfit-Light'],
        'outfit-medium': ['Outfit-Medium'],
        'outfit-semibold': ['Outfit-SemiBold'],
        'outfit-bold': ['Outfit-Bold'],
        'outfit-extrabold': ['Outfit-ExtraBold'],
        // Set Outfit as default sans font
        sans: ['Outfit-Regular', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};