import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",       // deep navy - primary text / headers
        paper: "#fbfaf7",     // warm off-white background
        line: "#e4e0d8",      // hairline borders
        accent: "#c76b3f",    // clay/rust accent - used sparingly for status & CTAs
        moss: "#4c6b52",      // muted green for "on track / submitted"
        clay: "#c76b3f",
        slate: "#5b6472",
      },
      fontFamily: {
        display: ["'Source Serif 4'", "Georgia", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
