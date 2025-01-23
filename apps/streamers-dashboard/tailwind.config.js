/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  darkMode: ['class'],
  theme: {
    colors: {
      white: {
        accent: '#F8F8FF',
        DEFAULT: '#f4f4f4',
      },
      green: {
        DEFAULT: '#3F9663',
        accent: '#74DFA2',
      },
      black: {
        DEFAULT: '#000',
      },
      dark: {
        DEFAULT: '#27272A',
        accent: '#3E4145',
        foreground: '#19191B',
      },
      yellow: {
        DEFAULT: '#CFC56F',
      },
      red: {
        DEFAULT: '#e74c3c',
      },
      gray: {
        DEFAULT: '#555',
        light: '#888',
        accent: '#AAA',
      },
      purple: {
        DEFAULT: '#505285',
      },
      transparent: {
        DEFAULT: 'rgba(255,255,255,0)',
      },
    },
    fontSize: {
      sm: '12px',
      md: '14px',
      title: '17px',
      titleLg: '21px',
      titleXL: '24px',
    },
    borderRadius: {
      none: '0px',
      small: '8px',
      medium: '10px',
      large: '16px',
      pill: '10000px',
    },
    screens: {
      mobile: '640px',
      tablet: '1024px',
      landtop: '1440px',
      desktop: '1920px',
      desktopLg: '2560px',
    },
    extend: {
      keyframes: {
        fadeChange: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 2s ease',
        fadeOut: 'fadeIn 2s ease reverse',
        fadeChange: 'fadeChange 2s ease',
      },
      height: {
        sheet: 'var(--sheet-height)',
      },
      gridTemplateRows: {
        slotsDesktop: 'max(62px) minmax(40px, 42px) 1fr',
        slotsTable: 'minmax(40px, 42px) 1fr',
      },
      spacing: {
        '4xl': '1.5rem',
      },
      borderWidth: {
        1: '1px',
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
    boxShadow: {
      tableBorder: '0px 4x 0px 0px rgba(85, 85, 85, 0.7)',
    },
    fontFamily: {
      golosF: ["'Golos'"],
    },
  },
  plugins: [require('tailwindcss-animate')],
}
