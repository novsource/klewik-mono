/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  darkMode: 'selector',
  theme: {
    colors: {
      white: '#FFF',
      green: {
        DEFAULT: '#48C07A',
        accent: '#74DFA2',
      },
      dark: {
        DEFAULT: '#27272A',
        accent: '#3E4145',
        foreground: '#18181B',
      },
      yellow: {
        DEFAULT: '#CFC56F',
      },
      red: {
        DEFAULT: '#CF6F6F',
      },
      gray: {
        DEFAULT: '#555',
        accent: '#AAA',
      },
      purple: {
        DEFAULT: '#505285',
      },
    },
    fontSize: {
      sm: '11px',
      body: '14px',
      title: '17px',
      titleXL: '21px',
    },
    borderRadius: {
      small: '8px',
      medium: '12px',
      large: '24px',
      pill: '10000px',
    },
    borderColor: {
      dark: '#2A2D32',
    },
    extend: {
      spacing: {
        '4xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
