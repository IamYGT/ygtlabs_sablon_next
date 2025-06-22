import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/[locale]/landing/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/[locale]/page.tsx",
    "./components/panel/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF1E1E",
          light: "#FF4D4D",
          dark: "#CC0000",
        },
        secondary: "#1A1A1A",
        accent: "#FFD700",
        dark: "#111111",
        light: "#F5F5F5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
      },
      boxShadow: {
        custom: "0 4px 20px rgba(0, 0, 0, 0.08)",
        hover: "0 8px 30px rgba(0, 0, 0, 0.12)",
        "inner-soft":
          "inset 0 2px 4px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
        glow: "0 0 20px rgba(255, 30, 30, 0.6)",
        "glow-strong": "0 0 30px rgba(255, 30, 30, 0.8)",
        "drop-shadow-glow": "0 0 10px rgba(255, 30, 30, 0.5)",
        "3d": "0 20px 40px -20px rgba(0, 0, 0, 0.3)",
        layered:
          "0 1px 2px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)",
        depth: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "depth-hover":
          "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
        "gradient-radial-soft":
          "radial-gradient(circle at center, var(--tw-gradient-stops))",
        "gradient-shine":
          "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)",
        "gradient-spotlight":
          "radial-gradient(circle at var(--mouse-x, center) var(--mouse-y, center), rgba(255,255,255,0.1) 0%, transparent 50%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-soft": "bounceSoft 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        spotlight: "spotlight 5s infinite linear",
        shimmer: "shimmer 3s infinite linear",
        magnetic: "magnetic 0.3s linear",
        neon: "neon-pulse 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".8" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spotlight: {
          "0%": { transform: "translateX(-100%) rotate(45deg)" },
          "100%": { transform: "translateX(100%) rotate(45deg)" },
        },
        magnetic: {
          "0%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(var(--mx, 0), var(--my, 0))" },
          "100%": { transform: "translate(0, 0)" },
        },
      },
      transitionTimingFunction: {
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.45, 0, 0.55, 1)",
        elastic: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
        "bounce-out": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;

export default config;
