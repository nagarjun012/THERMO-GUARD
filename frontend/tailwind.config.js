/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#0B1117', // Canvas foundation
          900: '#101820', // Sidebar & Headers
          850: '#141E28', // Cards, Panels, Table backgrounds
          800: '#1A2634', // Inset wells, Table row hovers, Active states
          750: '#1E2D3E', // Sub-elevated surfaces
          700: '#223244', // Subtle 1px structural borders
          600: '#2D4158', // Elevated borders & Focus outlines
          500: '#4A627D', // Dim icons, subtle dividers
          400: '#7E93AA', // Muted helper text, timestamps, units
          300: '#9FB2C6', // Secondary text
          200: '#C4D1DF', // Tabular numerals & labels
          100: '#E1E9F1', // Off-white primary text
          50: '#F0F4F8',  // Highest contrast text & active indicators
        },
        thermal: {
          safe: '#10B981',      // Muted emerald for verified safe conditions
          safeBg: '#052E23',    // Safe badge background
          advisory: '#38BDF8',  // Cool sky blue for attention & secondary notices
          advisoryBg: '#082F49',
          warning: '#F59E0B',   // Warm controlled amber for heat warnings
          warningBg: '#451A03',
          critical: '#EF4444',  // Restrained red for emergency states
          criticalBg: '#450A0A',
        },
        dark: { 900: '#0B1117', 800: '#101820', 700: '#141E28', 600: '#223244' },
        risk: { safe: '#10B981', low: '#38BDF8', moderate: '#F59E0B', high: '#F97316', extreme: '#EF4444' },
        accent: { DEFAULT: '#38BDF8', light: '#7DD3FC', dark: '#0284C7' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

