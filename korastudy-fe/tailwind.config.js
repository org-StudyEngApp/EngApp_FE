/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Định nghĩa bộ màu chuẩn để dùng khắp dự án
        primary: {
          DEFAULT: '#0EA5E9', // Sky 500
          hover: '#0284C7',   // Sky 600
          light: '#E0F2FE',   // Sky 100 (dùng cho background nút phụ)
        },
        secondary: {
          DEFAULT: '#0284C7', // Sky 600
        },
        dark: '#0F172A',      // Slate 900 (Text chính)
        muted: '#64748B',     // Slate 500 (Text phụ)
        bg: '#F0F9FF',        // Sky 50 (Nền web)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Font chữ hiện đại, dễ đọc
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'flip': 'flip 0.6s ease-in-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Plugin cho bài đọc
  ],
}
