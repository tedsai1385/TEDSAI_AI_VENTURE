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
            // ═════════════════════════════════════════════════════════════════
            // TAILLES DE POLICE FLUIDES - Contraintes User (Clamp)
            // ═════════════════════════════════════════════════════════════════
            fontSize: {
                // Titres principaux (Desktop: ~60px -> Mobile: ~28-32px)
                'hero': ['clamp(1.75rem, 4.5vw, 3.75rem)', { lineHeight: '1.1', fontWeight: '700' }],
                // Sous-titres (Desktop: ~20px -> Mobile: ~16px)
                'hero-sub': ['clamp(1rem, 2vw, 1.25rem)', { lineHeight: '1.5' }],
                // Titres de section
                'section': ['clamp(1.5rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
                // Titres de cartes / petits titres
                'card-title': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '600' }],
                // Corps de texte (Lisibilité mobile garantie 14-16px)
                'body': ['clamp(0.875rem, 1.5vw, 1rem)', { lineHeight: '1.6' }],
                // Petits textes
                'small': ['clamp(0.75rem, 1.2vw, 0.875rem)', { lineHeight: '1.5' }],
                // Boutons (Compact sur mobile)
                'btn': ['clamp(0.875rem, 1.5vw, 1rem)', { lineHeight: '1', fontWeight: '600' }],
            },

            // ═════════════════════════════════════════════════════════════════
            // ESPACEMENTS RESPONSIVES
            // ═════════════════════════════════════════════════════════════════
            spacing: {
                'section': 'clamp(2.5rem, 6vw, 5rem)',     // Marges verticales sections
                'container': 'clamp(1rem, 4vw, 3rem)',     // Padding horizontal conteneurs
                'gap-grid': 'clamp(1rem, 3vw, 2rem)',      // Gap grilles
                'gap-card': 'clamp(0.75rem, 2vw, 1.5rem)', // Gap interne cartes
            },

            // ═════════════════════════════════════════════════════════════════
            // BREAKPOINTS PERSONNALISÉS
            // ═════════════════════════════════════════════════════════════════
            screens: {
                'xs': '375px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
            },
        },
        plugins: [require("tailwindcss-animate")],
    };

    export default config;
