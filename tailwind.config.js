/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F766E', // Deep teal - warm yet professional
        secondary: '#059669', // Emerald green - complementary to teal
        accent: '#D97706', // Warm amber - for highlights and ratings
        background: '#F8FAFC', // Soft off-white - main background
        surface: '#FDFCFA', // Warm off-white - card backgrounds
        surfaceAlt: '#F8F7F4', // Warm light beige - alternate section backgrounds
        text: {
          primary: '#0F172A', // Deep slate - excellent readability
          secondary: '#475569', // Medium slate - secondary text
          muted: '#64748B', // Light slate - muted text
        },
        border: '#CBD5E1', // Soft gray - subtle borders
        success: '#059669', // Emerald - success states
        warning: '#D97706', // Amber - warning states
        error: '#DC2626', // Red - error states
        highlight: '#F0FDFA', // Very light teal - subtle highlights
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
