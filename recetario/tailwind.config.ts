// ============================================================
//  RECETARIO DIGITAL — Tailwind CSS config
//  tailwind.config.ts
// ============================================================

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Paleta de marca
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',   // ← color principal
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },

      // Tipografía del sistema (usa la variable CSS inyectada por next/font)
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },

      // Border radius coherente con el diseño
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // Sombras sutiles
      boxShadow: {
        card:  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 16px -4px rgb(0 0 0 / 0.12)',
      },

      // Animaciones
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'   },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        shimmer:   'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),   // Prose para richText de Payload
    require('@tailwindcss/forms'),        // Reset de inputs
  ],
}

export default config
