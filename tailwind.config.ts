import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F6F7FB",
        surface: "#FFFFFF",
        surfaceAlt: "#EFF1F7",
        ink: "#1F2330",
        inkSoft: "#6B7280",
        inkFaint: "#AEB4C2",
        primary: "#1FC99B",
        primaryDark: "#10A982",
        primarySoft: "#E3FBF3",
        gold: "#FFB020",
        goldDark: "#E0911A",
        easy: "#34D399",
        medium: "#FBBF24",
        hard: "#FB7185",
        rare: "#3B82F6",
        mega: "#A855F7",
        ultra: "#F59E0B",
        streak: "#FF7A45",
        nodeLocked: "#E3E6EE",
        nodeLockedRing: "#CFD4E0",
        pathLine: "#E0E4EE",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 18px rgba(42, 47, 69, 0.10)",
        softUp: "0 -2px 16px rgba(42, 47, 69, 0.08)",
      },
      keyframes: {
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.35" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        popIn: {
          "0%": { transform: "scale(0.7)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        bob: "bob 2.2s ease-in-out infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite",
        popIn: "popIn 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
