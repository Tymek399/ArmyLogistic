/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                // Kolory militarne
                military: {
                    50: '#f0f9f0',
                    100: '#dcf2dc',
                    200: '#bce5bc',
                    300: '#8dd28d',
                    400: '#5bb55b',
                    500: '#16a34a', // Główny zielony
                    600: '#15803d',
                    700: '#166534',
                    800: '#14532d',
                    900: '#052e16',
                },
                // Kolory alertów
                alert: {
                    critical: '#dc2626',
                    high: '#ea580c',
                    medium: '#d97706',
                    low: '#16a34a',
                },
                // Kolory transportu
                transport: {
                    active: '#16a34a',
                    planned: '#2563eb',
                    delayed: '#dc2626',
                    completed: '#6b7280',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '120': '30rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                }
            },
            boxShadow: {
                'military': '0 4px 6px -1px rgba(22, 163, 74, 0.1), 0 2px 4px -1px rgba(22, 163, 74, 0.06)',
                'alert': '0 4px 6px -1px rgba(220, 38, 38, 0.1), 0 2px 4px -1px rgba(220, 38, 38, 0.06)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'military-pattern': 'linear-gradient(45deg, #166534 25%, transparent 25%), linear-gradient(-45deg, #166534 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #166534 75%), linear-gradient(-45deg, transparent 75%, #166534 75%)',
            },
            screens: {
                'xs': '475px',
                '3xl': '1920px',
            },
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        // Plugin do dostępności
        function({ addUtilities }) {
            const newUtilities = {
                '.focus-visible-ring': {
                    '&:focus-visible': {
                        outline: '2px solid #16a34a',
                        outlineOffset: '2px',
                    },
                },
                '.sr-only-focusable': {
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: '0',
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: '0',
                    '&:focus': {
                        position: 'static',
                        width: 'auto',
                        height: 'auto',
                        padding: 'inherit',
                        margin: 'inherit',
                        overflow: 'visible',
                        clip: 'auto',
                        whiteSpace: 'normal',
                    },
                },
                // Przydatne dla map
                '.map-container': {
                    '& .gmnoprint': {
                        display: 'none !important',
                    },
                    '& .gm-style-cc': {
                        display: 'none !important',
                    },
                },
                // Style dla transportów na mapie
                '.transport-marker': {
                    animation: 'pulse 2s infinite',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                },
                '.route-line': {
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                },
            };

            addUtilities(newUtilities);
        },
    ],
    // Konfiguracja dla trybu ciemnego (opcjonalnie)
    darkMode: 'class',
    // Optymalizacje
    corePlugins: {
        preflight: true,
    },
};