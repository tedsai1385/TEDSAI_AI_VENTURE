import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // TEDSAI Cortex - "Complex Colors" Palette
                'cortex': {
                    'garden': '#006400',          // Emerald/Jungle Green
                    'restaurant': '#D4A017',      // Warm Gold
                    'restaurant-accent': '#C0392B', // Bordeaux/Red
                    'shop': '#0A2540',            // Night Blue
                    'shop-accent': '#3498DB',       // Tech Cyan
                    'ia': '#4B0082',              // Deep Purple/Indigo
                    'primary': '#0E7C7B',         // Legacy Primary (Teal) for general UI
                    'success': '#10B981',
                    'danger': '#EF4444',
                    'warning': '#F59E0B',
                },
                // Dark mode optimized
                'dark': {
                    'bg': '#0A0A0A',
                    'surface': '#1A1A1A',
                    'surface-elevated': '#222222',
                    'border': '#2A2A2A',
                    'text': '#E0E0E0',
                    'text-secondary': '#A0A0A0',
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            fontFamily: {
                'heading': ['Montserrat', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                'cortex': '0 4px 20px rgba(14, 124, 123, 0.15)',
                'cortex-lg': '0 10px 40px rgba(14, 124, 123, 0.2)',
                'glow-green': '0 0 20px rgba(14, 124, 123, 0.4)',
                'glow-gold': '0 0 20px rgba(212, 165, 116, 0.4)',
            },
            animation: {
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-in',
            },
            keyframes: {
                glowPulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
