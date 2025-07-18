import axios from 'axios';

// Konfiguracja podstawowa
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Utworzenie instancji axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor dla żądań - dodaje token autoryzacji
apiClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('military_logistics_user') || '{}');
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor dla odpowiedzi - obsługa błędów
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token wygasł lub jest nieprawidłowy
            localStorage.removeItem('military_logistics_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// =============================================================================
// SERWISY UWIERZYTELNIANIA
// =============================================================================

export const authService = {
    login: async (credentials) => {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Błąd logowania');
        }
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            localStorage.removeItem('military_logistics_user');
        }
    },

    refreshToken: async () => {
        try {
            const response = await apiClient.post('/auth/refresh');
            return response.data;
        } catch (error) {
            throw new Error('Failed to refresh token');
        }
    },

    verifyToken: async () => {
        try {
            const response = await apiClient.get('/auth/verify');
            return response.data;
        } catch (error) {
            throw new Error('Token verification failed');
        }
    }
};

// =============================================================================
// SERWISY ZESTAWÓW TRANSPORTOWYCH
// =============================================================================

export const transportSetsService = {
    getAll: async () => {
        try {
            const response = await apiClient.get('/transport-sets');
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania zestawów transportowych');
        }
    },

    getById: async (id) => {
        try {
            const response = await apiClient.get(`/transport-sets/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania zestawu transportowego');
        }
    },

    create: async (transportSet) => {
        try {
            const response = await apiClient.post('/transport-sets', transportSet);
            return response.data;
        } catch (error) {
            throw new Error('Błąd tworzenia zestawu transportowego');
        }
    },

    update: async (id, updates) => {
        try {
            const response = await apiClient.put(`/transport-sets/${id}`, updates);
            return response.data;
        } catch (error) {
            throw new Error('Błąd aktualizacji zestawu transportowego');
        }
    },

    delete: async (id) => {
        try {
            await apiClient.delete(`/transport-sets/${id}`);
        } catch (error) {
            throw new Error('Błąd usuwania zestawu transportowego');
        }
    },

    checkAvailability: async (setIds, timeRange) => {
        try {
            const response = await apiClient.post('/transport-sets/check-availability', {
                setIds,
                timeRange
            });
            return response.data;
        } catch (error) {
            throw new Error('Błąd sprawdzania dostępności zestawów');
        }
    }
};

// =============================================================================
// SERWISY TRANSPORTÓW
// =============================================================================

export const transportsService = {
    getAll: async (filters = {}) => {
        try {
            const response = await apiClient.get('/transports', { params: filters });
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania transportów');
        }
    },

    getById: async (id) => {
        try {
            const response = await apiClient.get(`/transports/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania transportu');
        }
    },

    create: async (transport) => {
        try {
            const response = await apiClient.post('/transports', transport);
            return response.data;
        } catch (error) {
            throw new Error('Błąd tworzenia transportu');
        }
    },

    update: async (id, updates) => {
        try {
            const response = await apiClient.put(`/transports/${id}`, updates);
            return response.data;
        } catch (error) {
            throw new Error('Błąd aktualizacji transportu');
        }
    },

    updateLocation: async (id, location) => {
        try {
            const response = await apiClient.patch(`/transports/${id}/location`, location);
            return response.data;
        } catch (error) {
            throw new Error('Błąd aktualizacji lokalizacji');
        }
    },

    cancel: async (id, reason) => {
        try {
            const response = await apiClient.patch(`/transports/${id}/cancel`, { reason });
            return response.data;
        } catch (error) {
            throw new Error('Błąd anulowania transportu');
        }
    },

    getHistory: async (id) => {
        try {
            const response = await apiClient.get(`/transports/${id}/history`);
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania historii transportu');
        }
    }
};

// =============================================================================
// SERWISY TRAS
// =============================================================================

export const routesService = {
    calculate: async (routeData) => {
        try {
            const response = await apiClient.post('/routes/calculate', routeData);
            return response.data;
        } catch (error) {
            throw new Error('Błąd obliczania trasy');
        }
    },

    optimize: async (routeId, constraints) => {
        try {
            const response = await apiClient.post(`/routes/${routeId}/optimize`, constraints);
            return response.data;
        } catch (error) {
            throw new Error('Błąd optymalizacji trasy');
        }
    },

    getAlternatives: async (routeData) => {
        try {
            const response = await apiClient.post('/routes/alternatives', routeData);
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania alternatywnych tras');
        }
    },

    validateRoute: async (routeData) => {
        try {
            const response = await apiClient.post('/routes/validate', routeData);
            return response.data;
        } catch (error) {
            throw new Error('Błąd walidacji trasy');
        }
    },

    exportGPX: async (routeId) => {
        try {
            const response = await apiClient.get(`/routes/${routeId}/export/gpx`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw new Error('Błąd eksportu trasy');
        }
    }
};

// =============================================================================
// SERWISY INFRASTRUKTURY
// =============================================================================

export const infrastructureService = {
    getAll: async (bounds = null) => {
        try {
            const params = bounds ? { bounds: JSON.stringify(bounds) } : {};
            const response = await apiClient.get('/infrastructure', { params });
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania infrastruktury');
        }
    },

    getRestrictions: async (coordinates) => {
        try {
            const response = await apiClient.post('/infrastructure/restrictions', { coordinates });
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania ograniczeń infrastruktury');
        }
    },

    reportIssue: async (issue) => {
        try {
            const response = await apiClient.post('/infrastructure/issues', issue);
            return response.data;
        } catch (error) {
            throw new Error('Błąd zgłaszania problemu z infrastrukturą');
        }
    },

    getTrafficData: async (routeId) => {
        try {
            const response = await apiClient.get(`/infrastructure/traffic/${routeId}`);
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania danych o ruchu');
        }
    }
};

// =============================================================================
// SERWISY ALERTÓW
// =============================================================================

export const alertsService = {
    getAll: async (filters = {}) => {
        try {
            const response = await apiClient.get('/alerts', { params: filters });
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania alertów');
        }
    },

    create: async (alert) => {
        try {
            const response = await apiClient.post('/alerts', alert);
            return response.data;
        } catch (error) {
            throw new Error('Błąd tworzenia alertu');
        }
    },

    update: async (id, updates) => {
        try {
            const response = await apiClient.put(`/alerts/${id}`, updates);
            return response.data;
        } catch (error) {
            throw new Error('Błąd aktualizacji alertu');
        }
    },

    resolve: async (id, resolution) => {
        try {
            const response = await apiClient.patch(`/alerts/${id}/resolve`, resolution);
            return response.data;
        } catch (error) {
            throw new Error('Błąd rozwiązywania alertu');
        }
    },

    subscribe: async (criteria) => {
        try {
            const response = await apiClient.post('/alerts/subscribe', criteria);
            return response.data;
        } catch (error) {
            throw new Error('Błąd subskrypcji alertów');
        }
    }
};

// =============================================================================
// SERWISY RAPORTÓW
// =============================================================================

export const reportsService = {
    getTransportStats: async (timeRange) => {
        try {
            const response = await apiClient.get('/reports/transport-stats', {
                params: { timeRange }
            });
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania statystyk transportu');
        }
    },

    getEfficiencyReport: async (filters) => {
        try {
            const response = await apiClient.get('/reports/efficiency', { params: filters });
            return response.data;
        } catch (error) {
            throw new Error('Błąd pobierania raportu efektywności');
        }
    },

    generatePDF: async (reportType, filters) => {
        try {
            const response = await apiClient.post('/reports/generate-pdf', {
                type: reportType,
                filters
            }, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw new Error('Błąd generowania raportu PDF');
        }
    },

    exportData: async (dataType, format, filters) => {
        try {
            const response = await apiClient.post('/reports/export', {
                dataType,
                format,
                filters
            }, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw new Error('Błąd eksportu danych');
        }
    }
};

// =============================================================================
// SERWISY WEBSOCKET (dla aktualizacji w czasie rzeczywistym)
// =============================================================================

export const websocketService = {
    connect: (onMessage, onError) => {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';
        const user = JSON.parse(localStorage.getItem('military_logistics_user') || '{}');

        const ws = new WebSocket(`${wsUrl}?token=${user.token}`);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            onError && onError(error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            // Automatyczne ponowne połączenie po 5 sekundach
            setTimeout(() => {
                websocketService.connect(onMessage, onError);
            }, 5000);
        };

        return ws;
    },

    subscribe: (ws, channel) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                action: 'subscribe',
                channel
            }));
        }
    },

    unsubscribe: (ws, channel) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                action: 'unsubscribe',
                channel
            }));
        }
    }
};

// Export domyślny
export default {
    auth: authService,
    transportSets: transportSetsService,
    transports: transportsService,
    routes: routesService,
    infrastructure: infrastructureService,
    alerts: alertsService,
    reports: reportsService,
    websocket: websocketService
};