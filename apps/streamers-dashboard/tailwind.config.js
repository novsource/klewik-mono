/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  theme: {
    colors: {
      white: '#FFF',
      green: {
        DEFAULT: '#74DFA2',
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
    extend: {},
  },
  plugins: [],
};
