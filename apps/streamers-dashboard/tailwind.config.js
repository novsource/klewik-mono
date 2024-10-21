/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  darkMode: ['class'],
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
      medium: '10px',
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
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
