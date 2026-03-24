/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Chinese Classical Colors
        primary: {
          DEFAULT: '#8B0000',
          light: '#A52A2A',
          dark: '#6B0000',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C158',
          dark: '#B8960C',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          light: '#333333',
        },
        cream: {
          DEFAULT: '#FDF5E6',
          dark: '#F5E6D3',
        },
        navy: {
          DEFAULT: '#1E3A5F',
          light: '#2E4A6F',
          dark: '#0E2A4F',
        },
        purple: {
          DEFAULT: '#4A0E4E',
          light: '#6B2E6E',
          dark: '#2A0E2E',
        },
      },
      fontFamily: {
        serif: ['Noto Serif TC', 'serif'],
        sans: ['Noto Sans TC', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper.png')",
        'cloud-pattern': "url('/textures/cloud.png')",
      },
      boxShadow: {
        'classical': '0 4px 6px -1px rgba(139, 0, 0, 0.1), 0 2px 4px -1px rgba(139, 0, 0, 0.06)',
        'gold': '0 4px 14px 0 rgba(212, 175, 55, 0.3)',
      },
      borderRadius: {
        'classical': '0.125rem',
      },
    },
  },
  plugins: [],
}
