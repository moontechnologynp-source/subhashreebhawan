import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        floatSlow: 'floatSlow 10s ease-in-out infinite',
        floatSlow2: 'floatSlow2 11s ease-in-out infinite',
        pop: 'pop 220ms ease-out',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(-50%, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-50%, 16px, 0) scale(1.02)' },
        },
        floatSlow2: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, 18px, 0) scale(1.03)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
