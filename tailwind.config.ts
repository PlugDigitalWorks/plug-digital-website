import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				navy: {
					600: '#1e3a8a',
					800: '#0f172a',
					900: '#0a0f1d',
				},
				turquoise: {
					400: '#2dd4bf',
					500: '#14b8a6',
					600: '#0d9488',
				},
				primary: {
					DEFAULT: '#3A2121',
				},
				secondary: {
					DEFAULT: '#E3B685',
				},
			},
			fontFamily: {
				primary: ['var(--font-primary)'],
				secondary: ['var(--font-secondary)'],
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				marquee: 'marquee 10s linear infinite',
				'marquee-slow': 'marquee 20s linear infinite',
				'spin-slow': 'spin-slow 30s linear infinite',
			},
		},
	},
	plugins: [],
} satisfies Config;