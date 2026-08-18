module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        neon: {
          50: 'var(--neon-1)',
          100: 'var(--neon-2)'
        },
        vibe: {
          900: '#071025',
          800: '#041026'
        }
      },
      boxShadow: {
        'vibe-lg': '0 10px 30px rgba(2,6,23,0.6)'
      }
    }
  },
  plugins: []
}
