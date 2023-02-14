/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {
        },
        fontFamily: {
            'body': [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ],
            'sans': [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ]
        }
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('flowbite/plugin')],
}
