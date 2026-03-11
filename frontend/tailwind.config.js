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
          focus: '#3B82F6',
          error: '#EF4444',
          success: '#10B981',
          disabled: '#9CA3AF',
        }
      },
      borderRadius: {
        'input': '0.5rem',
      }
    },
  },
  plugins: [],
}
