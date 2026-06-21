import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Inked-grimoire surfaces (obsidian) ──
        bg: "#0D0E12",
        panel: "#171A21",
        raised: "#222732",
        line: "#2C313C",
        ink: "#ECEEF2",
        inkSoft: "#A6AEBC",
        inkFaint: "#6B7384",
        // ── The one dangerous accent: ember = heat, energy, progress ──
        ember: "#FF6A2B",
        emberDark: "#D8501A",
        emberSoft: "#2A1A12",
        // ── Semantic difficulty (faceted runes) ──
        lesser: "#46C26A",
        greater: "#E2B53C",
        dire: "#E5484D",
        // ── Spoils ──
        rare: "#5B8CFF",
        mega: "#B06BFF",
        ultra: "#FF6A2B",
        gold: "#E2B53C",
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 10px 30px rgba(0, 0, 0, 0.45)",
        ember: "0 0 22px rgba(255, 106, 43, 0.35)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        emberPulse: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        rise: {
          "0%": { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        sweep: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        emberPulse: "emberPulse 2.4s ease-in-out infinite",
        rise: "rise 0.4s ease-out both",
        pop: "pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.3) both",
        sweep: "sweep 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
