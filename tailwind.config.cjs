/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                mainRed: '#e7515a',

                primary: {
                    // DEFAULT: '#3067DE',
                    DEFAULT: '#cc966a',
                    light: '#eaf1ff',
                    'dark-light': 'rgba(67,97,238,.15)',
                },
                secondary: {
                    DEFAULT: '#51AAAE',
                    light: '#ebe4f7',
                    'dark-light': 'rgb(128 93 202 / 15%)',
                },
                success: {
                    DEFAULT: '#00ab55',
                    light: '#ddf5f0',
                    'dark-light': 'rgba(0,171,85,.15)',
                },
                danger: {
                    DEFAULT: '#e7515a',
                    light: '#fff5f5',
                    'dark-light': 'rgba(231,81,90,.15)',
                },
                warning: {
                    DEFAULT: '#e2a03f',
                    light: '#fff9ed',
                    'dark-light': 'rgba(226,160,63,.15)',
                },
                info: {
                    DEFAULT: '#2196f3',
                    light: '#e7f7ff',
                    'dark-light': 'rgba(33,150,243,.15)',
                },
                dark: {
                    DEFAULT: '#3b3f5c',
                    light: '#eaeaec',
                    'dark-light': 'rgba(59,63,92,.15)',
                },
                black: {
                    DEFAULT: '#0e1726',
                    light: '#e3e4eb',
                    'dark-light': 'rgba(14,23,38,.15)',
                },
                white: {
                    DEFAULT: '#ffffff',
                    light: '#e0e6ed',
                    dark: '#888ea8',
                },
            },
            fontFamily: {
                din: ['Din', 'sans-serif'],
                switzer: ['Switzer', 'sans-serif'],
            },
            spacing: {
                4.5: '18px',
            },
            boxShadow: {
                '3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
            },
            // fontSize: {
            //     0.8: '0.8rem',
            //     1: '1rem',
            //     1.1: '1.1rem',
            //     1.2: '1.2rem',
            //     1.5: '1.5rem',
            //     1.6: '1.6rem',
            //     1.7: '1.7rem',
            //     1.8: '1.8rem',
            //     2: '2rem',
            //     2.1: '2.1rem',
            // },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-invert-headings': theme('colors.white.dark'),
                        '--tw-prose-invert-links': theme('colors.white.dark'),
                        h1: {
                            fontSize: '40px',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                        },
                        h2: {
                            fontSize: '32px',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                        },
                        h3: {
                            fontSize: '28px',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                        },
                        h4: {
                            fontSize: '24px',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                        },
                        h5: {
                            fontSize: '20px',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                        },
                        h6: {
                            fontSize: '16px',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                        },
                        p: {
                            marginBottom: '0.5rem',
                        },
                        li: { margin: 0 },
                        img: { margin: 0 },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
    ],
};
