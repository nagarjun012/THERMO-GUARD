/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 900: '#0a0e1a', 800: '#111827', 700: '#1a1f2e', 600: '#242b3d' },
        risk: { safe: '#10b981', low: '#eab308', moderate: '#f97316', high: '#ef4444', extreme: '#a855f7' },
        accent: { DEFAULT: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
