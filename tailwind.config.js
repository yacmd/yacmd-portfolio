/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        neon: "#00f2ff",
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "drift": "drift 20s ease-in-out infinite",
        "scroll-left": "scrollLeft 30s linear infinite",
      },
    },
  },
  plugins: [],
};
