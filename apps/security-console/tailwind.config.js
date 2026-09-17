/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        soc: {
          bg: '#0A0A0C',
          surface: '#121215',
          elevated: '#18181C',
          hover: '#1C1C22',
          inset: '#141418',
          border: '#222227',
          'border-hover': '#2E2E36',
          'border-subtle': '#1B1B20',
          'border-focus': '#38BDF8',
        },
        palette: {
          primary: '#EDEDEF',
          secondary: '#9898A0',
          muted: '#62626B',
          subtle: '#404048',
        },
        severity: {
          critical: '#F43F5E',
          'critical-bg': 'rgba(244, 63, 94, 0.08)',
          'critical-border': 'rgba(244, 63, 94, 0.25)',
          high: '#FB923C',
          'high-bg': 'rgba(251, 146, 60, 0.08)',
          'high-border': 'rgba(251, 146, 60, 0.25)',
          medium: '#FBBF24',
          'medium-bg': 'rgba(251, 191, 36, 0.08)',
          'medium-border': 'rgba(251, 191, 36, 0.25)',
          low: '#94A3B8',
          'low-bg': 'rgba(148, 163, 184, 0.08)',
          'low-border': 'rgba(148, 163, 184, 0.25)',
          info: '#38BDF8',
          'info-bg': 'rgba(56, 189, 248, 0.08)',
          'info-border': 'rgba(56, 189, 248, 0.25)',
        },
        status: {
          online: '#34D399',
          degraded: '#FBBF24',
          outage: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': '0.6875rem',
      },
    },
  },
  plugins: [],
};
