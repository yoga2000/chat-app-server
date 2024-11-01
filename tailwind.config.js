/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "custom-pattern":
          "linear-gradient(#202C33 2px, transparent 2px), linear-gradient(to right, #202C33 2px, transparent 2px)",
      },
      backgroundSize: {
        33: "33px 33px",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
