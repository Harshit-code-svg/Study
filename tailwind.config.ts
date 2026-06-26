import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(240 10% 3.9%)",
        foreground: "hsl(0 0% 98%)",
        card: {
          DEFAULT: "hsl(240 10% 5.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        popover: {
          DEFAULT: "hsl(240 10% 3.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        primary: {
          DEFAULT: "hsl(263 70% 50%)",
          foreground: "hsl(0 0% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(240 3.7% 15.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(240 3.7% 15.9%)",
          foreground: "hsl(240 5% 64.9%)",
        },
        accent: {
          DEFAULT: "hsl(191 91% 37%)",
          foreground: "hsl(0 0% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 72% 51%)",
          foreground: "hsl(0 0% 98%)",
        },
        border: "hsl(240 3.7% 15.9%)",
        input: "hsl(240 3.7% 15.9%)",
        ring: "hsl(263 70% 50%)",
        boss: "hsl(0 84% 60%)",
        neon: "hsl(160 84% 39%)",
        amberglow: "hsl(38 92% 50%)",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.3rem",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "boss-flicker": "boss-flicker 1.8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(124,58,237,0.35)" },
          "50%": { boxShadow: "0 0 22px rgba(124,58,237,0.62)" },
        },
        "boss-flicker": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(239,68,68,0.45), inset 0 0 10px rgba(239,68,68,0.08)" },
          "50%": { boxShadow: "0 0 28px rgba(239,68,68,0.85), inset 0 0 18px rgba(239,68,68,0.15)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
