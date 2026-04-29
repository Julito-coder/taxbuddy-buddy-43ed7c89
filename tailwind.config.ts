import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "ds-sm": "var(--ds-radius-sm)",
        "ds-md": "var(--ds-radius-md)",
        "ds-lg": "var(--ds-radius-lg)",
        "ds-xl": "var(--ds-radius-xl)",
        "ds-pill": "var(--ds-radius-pill)",
      },
      fontSize: {
        "ds-xs": ["var(--ds-text-xs)", { lineHeight: "var(--ds-lh-normal)" }],
        "ds-sm": ["var(--ds-text-sm)", { lineHeight: "var(--ds-lh-normal)" }],
        "ds-base": ["var(--ds-text-base)", { lineHeight: "var(--ds-lh-normal)" }],
        "ds-lg": ["var(--ds-text-lg)", { lineHeight: "var(--ds-lh-relaxed)" }],
        "ds-xl": ["var(--ds-text-xl)", { lineHeight: "var(--ds-lh-normal)" }],
        "ds-2xl": ["var(--ds-text-2xl)", { lineHeight: "var(--ds-lh-tight)" }],
        "ds-3xl": ["var(--ds-text-3xl)", { lineHeight: "var(--ds-lh-tight)" }],
        "ds-4xl": ["var(--ds-text-4xl)", { lineHeight: "var(--ds-lh-tight)" }],
      },
      spacing: {
        "ds-1": "var(--ds-space-1)",
        "ds-2": "var(--ds-space-2)",
        "ds-3": "var(--ds-space-3)",
        "ds-4": "var(--ds-space-4)",
        "ds-5": "var(--ds-space-5)",
        "ds-6": "var(--ds-space-6)",
        "ds-8": "var(--ds-space-8)",
        "ds-10": "var(--ds-space-10)",
        "ds-12": "var(--ds-space-12)",
        "ds-16": "var(--ds-space-16)",
        "ds-20": "var(--ds-space-20)",
        "ds-24": "var(--ds-space-24)",
      },
      colors: {
        // shadcn (existant)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Design system landing — couleurs accessibles WCAG AA
        ds: {
          primary: "var(--ds-color-primary)",
          "primary-hover": "var(--ds-color-primary-hover)",
          accent: "var(--ds-color-accent)",
          "accent-light": "var(--ds-color-accent-light)",
          "text-primary": "var(--ds-color-text-primary)",
          "text-secondary": "var(--ds-color-text-secondary)",
          "text-tertiary": "var(--ds-color-text-tertiary)",
          "text-inverse": "var(--ds-color-text-inverse)",
          "bg-primary": "var(--ds-color-bg-primary)",
          "bg-secondary": "var(--ds-color-bg-secondary)",
          "bg-tertiary": "var(--ds-color-bg-tertiary)",
          "bg-dark": "var(--ds-color-bg-dark)",
          "border-light": "var(--ds-color-border-light)",
          "border-default": "var(--ds-color-border-default)",
          success: "var(--ds-color-success)",
          error: "var(--ds-color-error)",
          warning: "var(--ds-color-warning)",
        },
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px -5px hsl(210 53% 23% / 0.2)" },
          "50%": { boxShadow: "0 0 30px -5px hsl(210 53% 23% / 0.35)" },
        },
        "number-count": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "number-count": "number-count 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
