import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      mobile: "390px",
      tablet: "810px",
      pc: "1200px",
      desktop: "1920px",
    },
    extend: {
      colors: {
        background: "hsl(0 0% 0%)",
        foreground: "hsl(0 0% 100%)",
        primary: {
          DEFAULT: "hsl(66 84% 53%)",
          foreground: "hsl(0 0% 0%)",
        },
        secondary: {
          DEFAULT: "hsl(65 85% 53%)",
        },
        accent: {
          DEFAULT: "hsl(37 58% 66%)",
        },
        muted: {
          DEFAULT: "hsl(0 0% 86%)",
        },
        neon: {
          green: "#adec19",
          yellow: "#eceb21",
        },
      },
      fontFamily: {
        heading: ["Cook Conthic", "sans-serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
      },
    },
  },
  plugins: [],
};
export default config;
