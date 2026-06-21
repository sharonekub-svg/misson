import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Friendly, light navy-blue world ──
        bg: "#F4F7FF",
        surface: "#FFFFFF",
        soft: "#EAF0FF",
        line: "#E3E9F6",
        navy: "#16224A",
        ink: "#16224A",
        inkSoft: "#5A6B92",
        inkFaint: "#9AA7C7",
        // ── Primary blue ──
        primary: "#3B6EF6",
        primaryDark: "#2B57D4",
        primarySoft: "#E7EEFF",
        // ── Warm accents ──
        coin: "#F5A524",
        coinDark: "#D88A12",
        streak: "#FF8A3D",
        freeze: "#59C3F5",
        // ── Difficulty (soft) ──
        easy: "#2DBE7E",
        medium: "#F5A524",
        hard: "#FF6B6B",
        // ── Rewards ──
        rare: "#3B6EF6",
        mega: "#8B5CF6",
        ultra: "#F5A524",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 18px rgba(22, 34, 74, 0.08)",
        softUp: "0 -4px 18px rgba(22, 34, 74, 0.06)",
        card: "0 10px 26px rgba(22, 34, 74, 0.10)",
        glow: "0 0 0 4px rgba(59, 110, 246, 0.18)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        pop: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "70%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "55%": { transform: "scale(1.2)" },
          "75%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        flicker: {
          "0%, 100%": { transform: "scale(1) rotate(-2deg)", opacity: "1" },
          "50%": { transform: "scale(1.12) rotate(2deg)", opacity: "0.92" },
        },
        ring: {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        confetti: {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(120px) rotate(360deg)", opacity: "0" },
        },
        countUp: {
          "0%": { transform: "translateY(8px) scale(0.8)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        pop: "pop 0.4s cubic-bezier(0.2,0.9,0.3,1.3) both",
        bounceIn: "bounceIn 0.6s cubic-bezier(0.2,0.9,0.3,1.3) both",
        flicker: "flicker 0.7s ease-in-out infinite",
        ring: "ring 1.6s ease-out infinite",
        confetti: "confetti 1.1s ease-in forwards",
        countUp: "countUp 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
