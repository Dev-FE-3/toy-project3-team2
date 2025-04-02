/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    colors: {
      container: "#171A1A",
      main: "#27C49A",
      error: "#FF3B3B",
      success: "#25CD22",
      outline: "#3F4949",

      background: {
        main: "#1A1C1C",
        input: "#363838",
        toast: "#E6E0E9",
        tabbar: "#202525",
        playlist: "#333333",
      },

      font: {
        primary: "#FFFFFF",
        second: "#C3C7C7",
        muted: "#999999",
        placeholder: "#6C7374",
        toast: "#222423",
        more: "#666666",
      },

      overlay: {
        primary: "#000000A3", // 64% 불투명
        secondary: "#0000004D", // 30% 불투명
        muted: "#00000066", // 40% 불투명
      },
    },
    fontFamily: {},
    extend: {},
  },
  plugins: [],
};
