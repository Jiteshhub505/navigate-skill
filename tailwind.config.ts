import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./content/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                purple: {
                    primary: "#7c3aed",
                    dark: "#5b21b6",
                    light: "#a78bfa",
                },
            },
            animation: {
                'pulse-purple': 'pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'gradient': 'gradient-shift 8s ease infinite',
                'marquee': 'marquee 30s linear infinite',
            },
            keyframes: {
                'pulse-purple': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(124, 58, 237, 0.7)' },
                    '50%': { boxShadow: '0 0 0 20px rgba(124, 58, 237, 0)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'marquee': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
        },
    },
};

export default config;
