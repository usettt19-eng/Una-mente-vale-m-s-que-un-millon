import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#0F172A",
          900: "#0B1120",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155",
        },
        emerald: { DEFAULT: "#10B981" },
        gold: { DEFAULT: "#F59E0B", soft: "#FCD34D" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      gridTemplateColumns: { 14: "repeat(14, minmax(0, 1fr))" },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
