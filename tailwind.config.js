/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        script: ['Great Vibes', 'cursive'],
      },
      colors: {
        // Core palette
        'blush':       '#FDF0F3',
        'soft-rose':   '#FCDFE5',
        'rose-gold':   '#C2788A',
        'deep-rose':   '#9C4A5C',
        'dark-rose':   '#6B2D3E',
        'soft-pink':   '#F4B8C6',
        // Gold / warm tones
        'champagne':   '#F5E6C8',
        'luxury-gold': '#C9A96E',
        'warm-gold':   '#DEB887',
        'antique-gold':'#AA8744',
        // Neutral
        'cream':       '#FBF7F1',
        'ivory':       '#F8F4EE',
        'charcoal':    '#1C1C1E',
        'slate':       '#3A3540',
        'muted':       '#7A6E78',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FDF0F3 0%, #FBF7F1 45%, #F5E6C8 100%)',
        'section-gradient': 'linear-gradient(160deg, #FBF7F1 0%, #FDF0F3 100%)',
        'gift-gradient': 'linear-gradient(160deg, #FDF0F3 0%, #F8F4EE 50%, #F5E6C8 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.15) 50%, transparent 100%)',
        'rose-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(194,120,138,0.12) 50%, transparent 100%)',
      },
      animation: {
        'float-slow':   'float 9s ease-in-out infinite',
        'float-delay':  'float 11s ease-in-out 3s infinite',
        'float-fast':   'float 6s ease-in-out 1.5s infinite',
        'spin-slow':    'spin 30s linear infinite',
        'fade-in-up':   'fadeInUp 1.2s ease-out forwards',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s ease-in-out infinite',
        'twinkle':      'twinkle 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':      { transform: 'translateY(-18px) rotate(1.2deg)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(194,120,138,0.2)' },
          '50%':      { boxShadow: '0 0 45px rgba(194,120,138,0.45)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        twinkle: {
          '0%':   { opacity: '0.3', transform: 'scale(0.8)' },
          '100%': { opacity: '1',   transform: 'scale(1.2)' },
        },
      },
      boxShadow: {
        'card':       '0 4px 24px rgba(156,74,92,0.08), 0 1px 4px rgba(156,74,92,0.04)',
        'card-hover': '0 16px 48px rgba(156,74,92,0.14), 0 4px 12px rgba(156,74,92,0.08)',
        'glass':      '0 8px 32px rgba(194,120,138,0.12), inset 0 0 24px rgba(255,255,255,0.3)',
        'gold':       '0 4px 20px rgba(201,169,110,0.25)',
        'gold-hover': '0 8px 32px rgba(201,169,110,0.4)',
      },
    },
  },
  plugins: [],
}