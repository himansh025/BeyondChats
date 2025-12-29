/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                },
                blue: {
                    50: '#eff6ff',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
            },
        },
    },
    plugins: [],
}
