import { Loader } from '@googlemaps/js-api-loader';

// Konfiguracja Google Maps API
export const GOOGLE_MAPS_CONFIG = {
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
    version: 'weekly',
    libraries: ['places', 'geometry', 'directions', 'visualization'],
    region: 'PL',
    language: 'pl'
};

// Loader dla Google Maps
let mapLoader = null;
let isLoading = false;
let isLoaded = false;

export const getGoogleMapsLoader = () => {
    if (!mapLoader) {
        mapLoader = new Loader(GOOGLE_MAPS_CONFIG);
    }
    return mapLoader;
};

export const loadGoogleMaps = async () => {
    if (isLoaded) {
        return window.google;
    }

    if (isLoading) {
        // Czekaj na zakończenie ładowania
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return window.google;
    }

    try {
        isLoading = true;
        const loader = getGoogleMapsLoader();
        const google = await loader.load();
        isLoaded = true;
        return google;
    } catch (error) {
        console.error('Error loading Google Maps:', error);
        throw error;
    } finally {
        isLoading = false;
    }
};

// Style mapy
export const MAP_STYLES = {
    default: [],
    military: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'road',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ visibility: 'off' }]
        }
    ],
    satellite: [
        {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ]
};

// Domyślne opcje mapy
export const DEFAULT_MAP_OPTIONS = {
    zoom: 6,
    center: { lat: 52.0693, lng: 19.4803 }, // Centrum Polski
    mapTypeId: 'roadmap',
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: MAP_STYLES.military
};

// Ikony markerów
export const MARKER_ICONS = {
    transport: {
        url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="24" height="16" rx="2" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
        <rect x="6" y="10" width="4" height="3" fill="#1e40af"/>
        <rect x="12" y="10" width="8" height="3" fill="#1e40af"/>
        <rect x="22" y="10" width="4" height="3" fill="#1e40af"/>
        <circle cx="10" cy="26" r="3" fill="#374151" stroke="#1f2937" stroke-width="1"/>
        <circle cx="22" cy="26" r="3" fill="#374151" stroke="#1f2937" stroke-width="1"/>
      </svg>
    `),
        scaledSize: { width: 32, height: 32 },
        anchor: { x: 16, y: 16 }
    },

    bridge: {
        url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="10" width="20" height="4" fill="#dc2626" rx="2"/>
        <rect x="5" y="6" width="2" height="8" fill="#dc2626"/>
        <rect x="17" y="6" width="2" height="8" fill="#dc2626"/>
      </svg>
    `),
        scaledSize: { width: 24, height: 24 },
        anchor: { x: 12, y: 12 }
    },

    tunnel: {
        url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="12" rx="10" ry="6" fill="#eab308"/>
        <ellipse cx="12" cy="12" rx="6" ry="3" fill="#f59e0b"/>
      </svg>
    `),
        scaledSize: { width: 24, height: 24 },
        anchor: { x: 12, y: 12 }
    },

    checkpoint: {
        url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="2" width="8" height="20" fill="#16a34a"/>
        <rect x="2" y="8" width="20" height="8" fill="#16a34a"/>
        <circle cx="12" cy="12" r="4" fill="#ffffff"/>
      </svg>
    `),
        scaledSize: { width: 24, height: 24 },
        anchor: { x: 12, y: 12 }
    }
};

// Kolory tras
export const ROUTE_COLORS = {
    planned: '#2563eb',
    active: '#16a34a',
    completed: '#6b7280',
    delayed: '#dc2626',
    optimized: '#8b5cf6'
};

// Opcje renderowania tras
export const ROUTE_OPTIONS = {
    planned: {
        strokeColor: ROUTE_COLORS.planned,
        strokeWeight: 4,
        strokeOpacity: 0.8,
        geodesic: true
    },
    active: {
        strokeColor: ROUTE_COLORS.active,
        strokeWeight: 5,
        strokeOpacity: 0.9,
        geodesic: true
    },
    optimized: {
        strokeColor: ROUTE_COLORS.optimized,
        strokeWeight: 4,
        strokeOpacity: 0.8,
        strokePattern: [
            { icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 }, offset: '0', repeat: '20px' }
        ],
        geodesic: true
    }
};

// Funkcje pomocnicze
export const createCustomMarker = (position, icon, title, map) => {
    if (!window.google) return null;

    return new window.google.maps.Marker({
        position,
        map,
        icon,
        title
    });
};

export const createInfoWindow = (content) => {
    if (!window.google) return null;

    return new window.google.maps.InfoWindow({
        content,
        maxWidth: 300
    });
};

export const calculateDistance = (point1, point2) => {
    if (!window.google) return 0;

    const service = new window.google.maps.DistanceMatrixService();
    return new Promise((resolve, reject) => {
        service.getDistanceMatrix({
            origins: [point1],
            destinations: [point2],
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC
        }, (response, status) => {
            if (status === 'OK') {
                resolve(response.rows[0].elements[0]);
            } else {
                reject(new Error(`Distance calculation failed: ${status}`));
            }
        });
    });
};

export const geocodeAddress = (address) => {
    if (!window.google) return Promise.reject(new Error('Google Maps not loaded'));

    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK') {
                resolve(results[0]);
            } else {
                reject(new Error(`Geocoding failed: ${status}`));
            }
        });
    });
};