import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        slate: {
          250: "#d8dee8",
          550: "#5b6b80",
          650: "#405168",
          805: "#1c2738",
          850: "#1a2332",
        },
        indigo: {
          650: "#4f46e5",
          660: "#4b42df",
          750: "#4338ca",
          760: "#3f34bd",
        },
        purple: {
          650: "#7e22ce",
        },
      },
      spacing: {
        "4.5": "1.125rem",
      },
    },
  },
  plugins: [],
};
export default config;
