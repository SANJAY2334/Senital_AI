/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soc: {
          bg: '#080C14',
          surface: '#0D1424',
          elevated: '#131B2E',
          hover: '#1B2640',
          inset: '#090E1A',
          border: '#1E293B',
          'border-subtle': '#162032',
          'border-focus': '#06B6D4',
        },
        severity: {
          critical: '#EF4444',
          'critical-bg': '#3F0E0E',
          'critical-border': '#7F1D1D',
          high: '#F97316',
          'high-bg': '#3C1608',
          'high-border': '#7C2D12',
          medium: '#F59E0B',
          'medium-bg': '#3B1F07',
          'medium-border': '#78350F',
          low: '#3B82F6',
          'low-bg': '#0F1E3D',
          'low-border': '#1E3A8A',
          info: '#06B6D4',
          'info-bg': '#082836',
          'info-border': '#164E63',
        },
        status: {
          online: '#10B981',
          degraded: '#F59E0B',
          outage: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
    },
  },
  plugins: [],
};
