/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4ECDC4', // Teal - main brand color
        'primary-dark': '#45B7AA', // Darker teal for hover states
        secondary: '#44A08D', // Green - complementary color
        accent: '#FF6B35', // Orange - accent color
        background: '#F8F7F4', // Soft off-white - main background
        surface: '#FFFFFF', // White - card backgrounds
        surfaceAlt: '#F3F4F6', // Light gray - alternate section backgrounds
        text: {
          primary: '#1F2937', // Dark gray - excellent readability
          secondary: '#6B7280', // Medium gray - secondary text
          muted: '#9CA3AF', // Light gray - muted text
        },
        border: '#E5E7EB', // Soft gray - subtle borders
        success: '#10B981', // Green - success states
        warning: '#F59E0B', // Amber - warning states
        error: '#EF4444', // Red - error states
        highlight: '#F0FDFA', // Very light teal - subtle highlights
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
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
