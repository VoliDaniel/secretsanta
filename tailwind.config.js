/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pine: "#0f3b1f",
        holly: "#db1b3a",
        gold: "#f7d046",
        snow: "#f9fbff"
      },
      backgroundImage: {
        "candy-cane":
          "linear-gradient(135deg, rgba(219,27,58,0.18) 25%, transparent 25%), linear-gradient(225deg, rgba(219,27,58,0.18) 25%, transparent 25%), linear-gradient(315deg, rgba(219,27,58,0.18) 25%, transparent 25%), linear-gradient(45deg, rgba(219,27,58,0.18) 25%, transparent 25%)"
      },
      fontFamily: {
        festive: ["var(--font-festive)", "serif"],
        warmth: ["var(--font-warmth)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 25px rgba(247, 208, 70, 0.35)",
        card: "0 15px 40px rgba(0,0,0,0.25)"
      }
    }
  },
  plugins: []
};

export default config;
