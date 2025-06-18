// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  // Safelist pour éviter la purge des classes dynamiques
  safelist: [
    // Backgrounds
    'bg-white',
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
    
    // Dark mode backgrounds
    'dark:bg-gray-700',
    'dark:bg-gray-800',
    'dark:bg-gray-900',
    
    // Text colors
    'text-gray-400',
    'text-gray-500',
    'text-gray-600',
    'text-gray-700',
    'text-gray-900',
    'text-white',
    
    // Dark mode text
    'dark:text-white',
    'dark:text-gray-200',
    'dark:text-gray-300',
    'dark:text-gray-400',
    'dark:text-gray-500',
    
    // Borders
    'border-gray-200',
    'border-gray-300',
    'border-gray-600',
    'border-gray-700',
    
    // Dark mode borders
    'dark:border-gray-600',
    'dark:border-gray-700',
    
    // Hovers
    'hover:bg-gray-50',
    'hover:bg-gray-100',
    'hover:bg-gray-600',
    'hover:bg-gray-700',
    'hover:bg-gray-800',
    
    // Dark mode hovers
    'dark:hover:bg-gray-600',
    'dark:hover:bg-gray-700',
    'dark:hover:bg-gray-800',
    
    // Color variations pour les patterns dynamiques
    {
      pattern: /bg-(red|green|blue|yellow|purple|indigo|pink|gray)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['dark', 'hover', 'focus'],
    },
    {
      pattern: /text-(red|green|blue|yellow|purple|indigo|pink|gray)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['dark', 'hover', 'focus'],
    },
    {
      pattern: /border-(red|green|blue|yellow|purple|indigo|pink|gray)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['dark', 'hover', 'focus'],
    }
  ],
  plugins: [],
}