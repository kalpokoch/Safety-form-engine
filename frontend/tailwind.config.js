/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        input: {
          bg: '#F5F5F5',
          border: '#E5E5E5',
          focus: '#6366F1',
          error: '#EF4444',
          success: '#059669',
          disabled: '#9CA3AF',
        },
        dark: {
          bg: '#0F0F0F',
          sidebar: '#18181B',
          card: '#1C1C1E',
          border: '#2D2D2F',
          hover: '#27272A',
          active: '#3F3F46',
          text: {
            primary: '#FAFAFA',
            secondary: '#A1A1AA',
            muted: '#71717A',
          }
        }
      },
      borderRadius: {
        'input': '0.5rem',
      }
    },
  },
  plugins: [],
}
