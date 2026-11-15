/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        container: "1200px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        // Surfaces
        base: "#0C0A09",
        surface: "#151210",
        raised: "#1E1A17",

        // Borders
        border: {
          DEFAULT: "#2A2420",
          strong: "#3A322C",
        },

        // Single Brand Accent
        accent: {
          DEFAULT: "#F2511B",
          hover: "#FF6A35",
          active: "#E04511",
          soft: "rgba(242, 81, 27, 0.12)",
        },

        // Typography Tokens
        primary: "#F5F1EE",
        secondary: "#B3A9A1",
        muted: "#7A6F67",

        // Single Source of Truth Severity Colors
        sev: {
          low: "#3FA66B",
          "low-bg": "rgba(63, 166, 107, 0.12)",
          "low-border": "rgba(63, 166, 107, 0.30)",

          medium: "#E8B431",
          "medium-bg": "rgba(232, 180, 49, 0.12)",
          "medium-border": "rgba(232, 180, 49, 0.30)",

          high: "#F2701D",
          "high-bg": "rgba(242, 112, 29, 0.12)",
          "high-border": "rgba(242, 112, 29, 0.30)",

          critical: "#E5484D",
          "critical-bg": "rgba(229, 72, 77, 0.12)",
          "critical-border": "rgba(229, 72, 77, 0.30)",
        },
      },
      borderRadius: {
        btn: "8px",
        card: "12px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [],
};
