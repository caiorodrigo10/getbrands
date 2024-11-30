import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '960px',
        xl: '1000px',
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#FFFFFF",
        foreground: "#333333",
        primary: {
          DEFAULT: "#f0562e",
          light: "#f56d49",
          dark: "#d64a26",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1A1F2C",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#666666",
          foreground: "#333333",
        },
        accent: {
          DEFAULT: "#f0562e",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#333333",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
      spacing: {
        'page': '1.5rem',
        'section': '1rem',
      },
      fontSize: {
        'page-title': ['1.5rem', {
          lineHeight: '2rem',
          fontWeight: '700',
        }],
        'section-title': ['1.25rem', {
          lineHeight: '1.75rem',
          fontWeight: '600',
        }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scroll": "scroll 20s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
} satisfies Config;