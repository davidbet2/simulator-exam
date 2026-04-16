/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CertZen v3 — warm educational brand (Duolingo-inspired, light-first)
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8', // hover accents
          500: '#0ea5e9', // primary — ocean blue
          600: '#0284c7', // CTA, pressed state
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          sky:     '#38bdf8', // sky blue accent
          amber:   '#fbbf24', // achievements/gold
          rose:    '#f87171', // danger/wrong
          emerald: '#34d399', // success/correct
          violet:  '#a78bfa', // premium/pro
          peach:   '#fdba74', // warm orange
        },
        success: {
          50:  '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50:  '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50:  '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Light warm surfaces (replaces dark surface-*)
        surface: {
          DEFAULT: '#ffffff',
          soft:    '#f8f7f4', // warm off-white section bg
          card:    '#ffffff', // cards, panels
          muted:   '#f1f0ed', // hover, pressed
          border:  '#e8e6e1', // default borders
          'border-bright': '#c9c5bc', // active borders, focus
        },
        // Text hierarchy on light backgrounds
        ink: {
          DEFAULT: '#1a1a1a',
          soft:    '#4a4a4a',
          muted:   '#8a8680',
          faint:   '#b8b4ae',
        },
        // Keep legacy appian colors for backward compatibility
        appian: {
          blue: '#0052cc',
          'blue-dark': '#0047b3',
          'blue-light': '#e6f0ff',
          muted: '#5e6c84',
          bg: '#f4f5f7',
          border: '#dfe1e6',
          success: '#00875a',
          'success-light': '#e3fcef',
          error: '#de350b',
          'error-light': '#ffebe6',
          warning: '#ff991f',
          'warning-light': '#fffae6',
        },
      },
      fontFamily: {
        sans:    ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        toon:    ['Fredoka', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'brand':      '0 4px 14px rgba(14,165,233,0.25), 0 1px 4px rgba(14,165,233,0.12)',
        'brand-lg':   '0 8px 28px rgba(14,165,233,0.30), 0 3px 8px rgba(14,165,233,0.18)',
        'card':       '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'card-lift':  '0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
        // Legacy dark glows kept for exam/results pages
        'glow-brand':   '0 0 24px rgba(14,165,233,0.35), 0 0 48px rgba(14,165,233,0.12)',
        'glow-success': '0 0 20px rgba(52,211,153,0.4),  0 0 40px rgba(52,211,153,0.15)',
        'glow-danger':  '0 0 20px rgba(248,113,113,0.4), 0 0 40px rgba(248,113,113,0.15)',
        'glow-amber':   '0 0 20px rgba(251,191,36,0.4),  0 0 40px rgba(251,191,36,0.15)',
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'brand-gradient':   'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        'warm-gradient':    'linear-gradient(180deg, #f8f7f4 0%, #ffffff 100%)',
        'hero-warm':        'linear-gradient(165deg, #f0f9ff 0%, #f8f7f4 50%, #fefce8 100%)',
        'blob-blue':        'radial-gradient(ellipse, rgba(14,165,233,0.18) 0%, transparent 70%)',
        'blob-sky':         'radial-gradient(ellipse, rgba(56,189,248,0.15) 0%, transparent 70%)',
        'blob-amber':       'radial-gradient(ellipse, rgba(251,191,36,0.14) 0%, transparent 70%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-out',
        'slide-up':      'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'slide-in-right':'slideInRight 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        'scale-in':      'scaleIn 0.2s ease-out',
        'shake':         'shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97)',
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 9s ease-in-out infinite',
        'float-med':     'float 7.5s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2.5s ease-in-out infinite',
        'shimmer':       'shimmer 1.5s linear infinite',
        'count-up':      'countUp 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        'bounce-in':     'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        'spin-slow':     'spin 3s linear infinite',
        'bob':           'bob 4s ease-in-out infinite',
        'wiggle':        'wiggle 2s ease-in-out infinite',
        'blob-drift':    'blobDrift 14s ease-in-out infinite',
        'blob-drift-r':  'blobDrift 18s ease-in-out infinite reverse',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:      { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:      { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-8px)' },
          '30%': { transform: 'translateX(8px)' },
          '45%': { transform: 'translateX(-6px)' },
          '60%': { transform: 'translateX(6px)' },
          '75%': { transform: 'translateX(-3px)' },
          '90%': { transform: 'translateX(3px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '33%':      { transform: 'translateY(-14px) translateX(8px)' },
          '66%':      { transform: 'translateY(-6px) translateX(-6px)' },
        },
        blobDrift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
          '25%':      { transform: 'translateY(-30px) translateX(20px) scale(1.05)' },
          '50%':      { transform: 'translateY(-15px) translateX(-15px) scale(0.97)' },
          '75%':      { transform: 'translateY(-40px) translateX(10px) scale(1.02)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':      { transform: 'rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(10px) scale(0.8)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.3)' },
          '50%':  { opacity: '1', transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

