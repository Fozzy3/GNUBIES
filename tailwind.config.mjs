/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
				gradient: 'gradient 15s ease infinite',
			},
			keyframes: {
				gradient: {
					'0%, 100%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
				},
			},
			backgroundSize: {
				'400%': '400% 400%',
			},
			backgroundImage: {
				'gradient-animated': 'linear-gradient(270deg, #ff7e5f, #feb47b, #86a8e7, #91eae4)',
			},
		},
	},
	plugins: [],
}
