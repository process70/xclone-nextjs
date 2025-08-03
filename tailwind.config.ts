import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xsm: "500px",
        sm: "600px",
        md: "690px",
        lg: "988px",
        xl: "1078px",
        xxl: "1265px",
      },
      colors: {
        textGray: "#71767b",
        textGrayLight: "#e7e9ea",
        inputGray: "#202327",
        borderGray: "#2f3336",
        iconBlue: "#1d9bf0",
        textGreen: "#00ba7c",
        textPink: "#f91880",
      },
    },
  },
  plugins: [],
};

export default config;
