/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        corgi: {
          orange: "#F15A22",
          "orange-soft": "#FF7A45",
          navy: "#152238",
          "navy-soft": "#26365A",
          cream: "#FAF8F5",
          sand: "#F0EBE3",
        },
      },
      fontFamily: {
        display: ["Sora", "Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(21, 34, 56, 0.12)",
        "card-lg": "0 12px 40px -8px rgba(21, 34, 56, 0.18)",
      },
    },
  },
  plugins: [],
};
