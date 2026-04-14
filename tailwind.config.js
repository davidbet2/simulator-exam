/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
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
    },
  },
  plugins: [],
}

