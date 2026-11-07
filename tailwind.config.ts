import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Clean geometric Ukrainian fintech/super-app typography (Monobank / Diia style)
        display: ['var(--font-manrope)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-inter)', 'var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Remap slate to pure Monobank Carbon-Titanium neutral graphite (no muddy navy blue)
        slate: {
          50: '#FAFAFC',
          100: '#F4F4F7',
          200: '#E6E6EC',
          300: '#D1D1DB',
          400: '#9E9EAA',
          500: '#70707D',
          600: '#4A4A57',
          700: '#2A2A33',
          800: '#1D1D24',
          900: '#131318',
          950: '#0A0A0D',
        },
        obsidian: {
          950: '#070709',
          900: '#111115',
          800: '#18181E',
          700: '#23232B',
        },
        pitch: {
          DEFAULT: '#32E89F',
          dim: '#1FC784',
          glow: 'rgba(50, 232, 159, 0.2)',
        },
        gold: {
          DEFAULT: '#F5C96B',
          bright: '#FFE4A3',
          deep: '#C89629',
        },
        coral: {
          DEFAULT: '#FF5C39',
        },
        cyber: {
          DEFAULT: '#7CC6FE',
          deep: '#0284C7',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 7s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
