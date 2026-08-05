/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boss: {
          header: '#1E222A',
          bg: '#F3F5F8',
          surface: '#FFFFFF',
          sidebar: '#F8FAFC',
          border: '#E2E8F0',
          hover: '#EDF2F7',
          active: '#64748B',
          text: '#1E293B',
          muted: '#64748B',
          subtle: '#94A3B8',
          accent: '#8B5CF6', // Boss mini purple logo accent
          status: {
            online: '#10B981',
            alarm: '#EF4444',
            offline: '#94A3B8',
            disabled: '#3B82F6',
          }
        },
        isa: {
          bg: '#181C22',
          surface: '#222831',
          panel: '#2A323D',
          border: '#3A4554',
          hover: '#333D4B',
          text: '#F1F5F9',
          muted: '#94A3B8',
          subtle: '#64748B',
          flow: '#38BDF8',
          normal: '#94A3B8',
          alarm: {
            critical: '#DC2626',
            warning: '#F59E0B',
            safe: '#10B981',
            maint: '#A855F7',
            offline: '#64748B'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
