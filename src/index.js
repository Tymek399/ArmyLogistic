import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import konfiguracji dla Service Worker (opcjonalnie)
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Komponent Error Boundary - MUSI być zadeklarowany PRZED użyciem
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error boundary caught an error:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // W produkcji można wysłać błędy do serwisu monitorowania
        if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
            // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💥</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Wystąpił błąd aplikacji
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
                            </p>

                            {process.env.NODE_ENV === 'development' && (
                                <details className="text-left mb-4 p-4 bg-gray-50 rounded">
                                    <summary className="cursor-pointer font-medium">Szczegóły błędu (development)</summary>
                                    <div className="mt-2 text-sm font-mono text-red-600">
                                        <div className="mb-2">
                                            <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                                        </div>
                                        <div>
                                            <strong>Component Stack:</strong>
                                            <pre className="whitespace-pre-wrap text-xs">
                                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    </div>
                                </details>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Odśwież stronę
                                </button>

                                <button
                                    onClick={() => {
                                        this.setState({ hasError: false, error: null, errorInfo: null });
                                    }}
                                    className="w-main bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Spróbuj ponownie
                                </button>
                            </div>

                            <div className="mt-6 text-xs text-gray-500">
                                Jeśli problem się powtarza, skontaktuj się z administratorem systemu.
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Konfiguracja dla development
if (process.env.NODE_ENV === 'development') {
    // Włącz React DevTools
    if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE = () => {};
    }

    // Dodatkowe logowanie w trybie development
    console.log('🎯 Military Logistics System - Development Mode');
    console.log('📊 Environment variables:', {
        API_URL: process.env.REACT_APP_API_URL,
        ENV: process.env.REACT_APP_ENV,
        VERSION: process.env.REACT_APP_VERSION,
        DEBUG: process.env.REACT_APP_DEBUG
    });
}

// Obsługa błędów globalnych
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);

    // W produkcji można wysłać błędy do serwisu monitorowania (np. Sentry)
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
        // Sentry.captureException(event.error);
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // W produkcji można wysłać błędy do serwisu monitorowania
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
        // Sentry.captureException(event.reason);
    }
});

// Sprawdzenie wsparcia dla geolokalizacji
if ('geolocation' in navigator) {
    console.log('✅ Geolocation API is supported');
} else {
    console.warn('❌ Geolocation API is not supported');
}

// Sprawdzenie wsparcia dla Service Worker
if ('serviceWorker' in navigator) {
    console.log('✅ Service Worker is supported');
} else {
    console.warn('❌ Service Worker is not supported');
}

// Sprawdzenie wsparcia dla WebSocket
if ('WebSocket' in window) {
    console.log('✅ WebSocket is supported');
} else {
    console.warn('❌ WebSocket is not supported');
}

// Utworzenie roota aplikacji
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderowanie aplikacji z obsługą błędów
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);

// Service Worker registration (opcjonalnie)
// if (process.env.NODE_ENV === 'production') {
//   serviceWorkerRegistration.register();
// }

// Funkcja do śledzenia wydajności (opcjonalnie)
function sendToAnalytics(metric) {
    // Google Analytics 4
    if (window.gtag && process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
        window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
        });
    }
}

// Eksport funkcji do pomiarów wydajności
reportWebVitals(sendToAnalytics);

// Hot Module Replacement dla development
if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default;
        root.render(
            <React.StrictMode>
                <ErrorBoundary>
                    <NextApp />
                </ErrorBoundary>
            </React.StrictMode>
        );
    });
}