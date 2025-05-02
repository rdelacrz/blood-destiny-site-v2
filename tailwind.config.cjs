import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/*.html"],
  theme: {
    screens: {
      sm: "600px",
      md: "968px",
      lg: "1200px",
      xl: "1600px",
      "2xl": "1920px",
    },
    extend: {
      animation: {
        "spin-step": "spin 1100ms infinite steps(12, end)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 24px 0 var(--tw-shadow)",
      },
      colors: {
        crimson: "#FF0000",
        "crimson-light": "#f06965 !important",
        "audio-player": "rgb(117 65 72 / 80%)",
        "blue-dark": "#0A101E",
        "white-hover": "rgb(85 85 85 / 60%)",
      },
      dropShadow: {
        "subtle-outline": "1px 1px 1px black",
      },
      fontFamily: {
        "prosto-one": ["Prosto One"],
        poppins: ["Poppins"],
      },
      textShadow: {
        DEFAULT:
          "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
      },
    },
  },
  plugins: [
    // For adding text-shadow capabilities
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      );
    }),
  ],
};
