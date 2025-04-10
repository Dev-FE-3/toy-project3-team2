/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        main: "#27C49A",
        error: "#FF3B3B",
        success: "#25CD22",
        container: "#171A1A",
        outline: "#3F4949",
        button_hover: "#1F9479",
        background: {
          main: "#1A1C1C",
          container: "#202525",
          input: "#363838",
          toast: "#E6E0E9",
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
          primary: "#000000A3",
          secondary: "#0000004D",
          muted: "#00000066",
        },
      },
      fontFamily: {
        sans: ["Noto Sans KR", "sans-serif"],
      },
      fontSize: {
        "title": ["18px", { fontWeight: "700", lineHeight: "normal" }],
        "body1": ["16px", { lineHeight: "1.3" }],
        "body1-bold": ["16px", { fontWeight: "700", lineHeight: "normal" }],
        "body2": ["14px", { lineHeight: "1.3" }],
        "body2-medium": ["14px", { fontWeight: "500", lineHeight: "1.3" }], // 미디움 추가
        "body2-bold": ["14px", { fontWeight: "700", lineHeight: "1.3" }],
        "sub": ["12px", { lineHeight: "1.3" }],
        "sub-bold": ["12px", { fontWeight: "700", lineHeight: "1.4" }],
        "sub2": ["12px", { lineHeight: "1.5" }],
        "tab": ["10px", { lineHeight: "normal" }],
        "tab-bold": ["10px", { fontWeight: "700", lineHeight: "normal" }],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/line-clamp"),
  ],
};
