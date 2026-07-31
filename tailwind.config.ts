import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        obsidian: "#0f0f0f",
        ivory: "#f4f1ea",
        mist: "#b8b5ad",
        gold: {
          300: "#e8d5a4",
          400: "#c8a96b",
          500: "#a98548",
        },
        champagne: "#e6d5b8",
        silver: "#c7c9cc",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"],
      },
      letterSpacing: {
        luxury: "0.22em",
        editorial: "0.08em",
      },
      boxShadow: {
        gold: "0 0 50px rgba(200, 169, 107, 0.16)",
        glass: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(circle at center, rgba(200, 169, 107, 0.12), transparent 65%)",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "line-in": "line-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 34s linear infinite",
      },
      keyframes: {
        "line-in": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
