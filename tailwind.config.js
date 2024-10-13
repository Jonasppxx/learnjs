/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards'
      },
      perspective: {
        '1000': '1000px',
      },
      rotate: {
        'y-10': '10deg',
      },
    },
  },
  variants: {
    extend: {
      scale: ['hover', 'group-hover'],
      rotate: ['hover', 'group-hover'],
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
};
