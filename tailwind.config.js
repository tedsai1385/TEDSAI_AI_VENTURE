/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6eaf4',
                    100: '#ccd5e9',
                    200: '#99abd3',
                    300: '#6681bd',
                    400: '#3357a7',
                    500: '#0A2463',
                    DEFAULT: '#0A2463',
                    600: '#081d50',
                    700: '#06163c',
                    800: '#040e28',
                    900: '#020714',
                },
                secondary: {
                    50: '#eef7fd',
                    100: '#ddeffc',
                    200: '#bbdff8',
                    300: '#99cff5',
                    400: '#77bff1',
                    500: '#5AA9E6',
                    600: '#4887b8',
                    700: '#36658a',
                    800: '#24435c',
                    900: '#12222e',
                },
                vitedia: {
                    primary: '#8B1E3F',
                    accent: '#D4AF37',
                    bg: '#F4EDE3',
                },
                garden: {
                    primary: '#2D5A27',
                    accent: '#B68D40',
                    bg: '#C9D5B5',
                },
                spice: {
                    primary: '#D35400',
                    accent: '#F39C12',
                },
            },
            fontFamily: {
                heading: ['Inter', 'sans-serif'],
                body: ['Open Sans', 'sans-serif'],
                accent: ['Playfair Display', 'serif'],
            },
            fontSize: {
                'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
                'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
                'fluid-base': 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
                'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
                'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)',
                'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
                'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
                'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
                'fluid-5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)',
                'fluid-6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5.5rem)',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 12px 24px rgba(0, 0, 0, 0.15)',
                'glow': '0 0 20px rgba(90, 169, 230, 0.3)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #0A2463 0%, #1e3a8a 50%, #0A2463 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
};
