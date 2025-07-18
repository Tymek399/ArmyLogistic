import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
    subscribeWithSelector((set, get) => ({
        // User state
        user: null,
        isAuthenticated: false,

        // Transport sets state
        transportSets: [
            {
                id: 1,
                name: 'Zestaw Alpha',
                transporter: {
                    id: 1,
                    model: 'MAN TGS 18.440',
                    type: 'Ciężarówka',
                    weight: 12000,
                    height: 350,
                    axles: 3,
                    maxLoad: 6000,
                    status: 'active'
                },
                cargo: {
                    id: 5,
                    model: 'PT-91 Twardy',
                    type: 'Czołg',
                    weight: 45000,
                    height: 320,
                    axles: 7,
                    maxLoad: 8000
                },
                totalWeight: 57000,
                totalHeight: 350,
                description: 'Transport czołgu głównego',
                status: 'available'
            },
            {
                id: 2,
                name: 'Zestaw Bravo',
                transporter: {
                    id: 2,
                    model: 'Scania R 500',
                    type: 'Ciężarówka',
                    weight: 13000,
                    height: 360,
                    axles: 3,
                    maxLoad: 6500,
                    status: 'active'
                },
                cargo: {
                    id: 6,
                    model: 'Rosomak',
                    type: 'Transporter',
                    weight: 24000,
                    height: 300,
                    axles: 6,
                    maxLoad: 7000
                },
                totalWeight: 37000,
                totalHeight: 360,
                description: 'Transport transportera opancerzonego',
                status: 'available'
            },
            {
                id: 3,
                name: 'Zestaw Charlie',
                transporter: {
                    id: 3,
                    model: 'Volvo FMX 460',
                    type: 'Ciężarówka',
                    weight: 12500,
                    height: 355,
                    axles: 3,
                    maxLoad: 6200,
                    status: 'active'
                },
                cargo: {
                    id: 7,
                    model: 'BMP-1',
                    type: 'Transporter',
                    weight: 13000,
                    height: 250,
                    axles: 5,
                    maxLoad: 5000
                },
                totalWeight: 25500,
                totalHeight: 355,
                description: 'Transport lekkiego transportera',
                status: 'available'
            },
        ],

        // Active transports state
        activeTransports: [
            {
                id: 1,
                name: 'Transport Alpha',
                sets: ['Zestaw Alpha', 'Zestaw Bravo'],
                status: 'W drodze',
                progress: 65,
                distanceCovered: 125,
                distanceRemaining: 67,
                totalTime: '4h 30m',
                eta: '14:30',
                route: 'Warszawa → Kraków',
                currentLocation: { lat: 51.7592, lng: 19.4560 },
                driver: { name: 'Jan Kowalski', phone: '+48 123 456 789' },
                createdAt: new Date('2025-01-08T08:00:00'),
                updatedAt: new Date()
            },
            {
                id: 2,
                name: 'Transport Bravo',
                sets: ['Zestaw Charlie'],
                status: 'Zatrzymany',
                progress: 45,
                distanceCovered: 89,
                distanceRemaining: 109,
                totalTime: '5h 15m',
                eta: '16:45',
                route: 'Gdańsk → Wrocław',
                currentLocation: { lat: 52.4064, lng: 16.9252 },
                driver: { name: 'Adam Nowak', phone: '+48 987 654 321' },
                createdAt: new Date('2025-01-08T09:30:00'),
                updatedAt: new Date()
            }
        ],

        // Alerts state
        alerts: [
            {
                id: 1,
                type: 'traffic',
                message: 'Korki na A1 - system przygotował objazd',
                transportId: 1,
                severity: 'medium',
                status: 'auto-resolved',
                createdAt: new Date('2025-01-08T12:15:00'),
                resolvedAt: new Date('2025-01-08T12:16:00')
            },
            {
                id: 2,
                type: 'infrastructure',
                message: 'Most A2 - automatycznie ominięty w trasie',
                transportId: 2,
                severity: 'low',
                status: 'auto-resolved',
                createdAt: new Date('2025-01-08T11:45:00'),
                resolvedAt: new Date('2025-01-08T11:46:00')
            }
        ],

        // Map state
        mapCenter: { lat: 52.0693, lng: 19.4803 }, // Center of Poland
        mapZoom: 6,
        selectedTransport: null,

        // UI state
        activeView: 'planner',
        isLoading: false,
        notifications: [],

        // Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),

        logout: () => set({ user: null, isAuthenticated: false }),

        setActiveView: (view) => set({ activeView: view }),

        setSelectedTransport: (transport) => set({ selectedTransport: transport }),

        addTransportSet: (transportSet) => set((state) => ({
            transportSets: [...state.transportSets, { ...transportSet, id: Date.now() }]
        })),

        updateTransportSet: (id, updates) => set((state) => ({
            transportSets: state.transportSets.map(set =>
                set.id === id ? { ...set, ...updates } : set
            )
        })),

        removeTransportSet: (id) => set((state) => ({
            transportSets: state.transportSets.filter(set => set.id !== id)
        })),

        addActiveTransport: (transport) => set((state) => ({
            activeTransports: [...state.activeTransports, { ...transport, id: Date.now() }]
        })),

        updateActiveTransport: (id, updates) => set((state) => ({
            activeTransports: state.activeTransports.map(transport =>
                transport.id === id ? { ...transport, ...updates, updatedAt: new Date() } : transport
            )
        })),

        removeActiveTransport: (id) => set((state) => ({
            activeTransports: state.activeTransports.filter(transport => transport.id !== id)
        })),

        addAlert: (alert) => set((state) => ({
            alerts: [...state.alerts, { ...alert, id: Date.now(), createdAt: new Date() }]
        })),

        updateAlert: (id, updates) => set((state) => ({
            alerts: state.alerts.map(alert =>
                alert.id === id ? { ...alert, ...updates } : alert
            )
        })),

        removeAlert: (id) => set((state) => ({
            alerts: state.alerts.filter(alert => alert.id !== id)
        })),

        addNotification: (notification) => set((state) => ({
            notifications: [...state.notifications, {
                ...notification,
                id: Date.now(),
                timestamp: new Date()
            }]
        })),

        removeNotification: (id) => set((state) => ({
            notifications: state.notifications.filter(notif => notif.id !== id)
        })),

        setMapCenter: (center) => set({ mapCenter: center }),

        setMapZoom: (zoom) => set({ mapZoom: zoom }),

        setLoading: (isLoading) => set({ isLoading }),

        // Computed getters
        getAvailableTransportSets: () => {
            const state = get();
            return state.transportSets.filter(set => set.status === 'available');
        },

        getActiveAlertsCount: () => {
            const state = get();
            return state.alerts.filter(alert => alert.status !== 'resolved').length;
        },

        getTransportById: (id) => {
            const state = get();
            return state.activeTransports.find(transport => transport.id === id);
        },

        // Bulk operations
        bulkUpdateTransports: (updates) => set((state) => ({
            activeTransports: state.activeTransports.map(transport => {
                const update = updates.find(u => u.id === transport.id);
                return update ? { ...transport, ...update, updatedAt: new Date() } : transport;
            })
        })),

        clearAllAlerts: () => set({ alerts: [] }),

        resetStore: () => set({
            user: null,
            isAuthenticated: false,
            selectedTransport: null,
            activeView: 'planner',
            isLoading: false,
            notifications: [],
            mapCenter: { lat: 52.0693, lng: 19.4803 },
            mapZoom: 6
        })
    }))
);

export default useStore;