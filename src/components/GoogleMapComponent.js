import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    loadGoogleMaps,
    DEFAULT_MAP_OPTIONS,
    MARKER_ICONS,
    ROUTE_OPTIONS,
    createCustomMarker,
    createInfoWindow
} from '../config/googleMaps';
import useStore from '../store/userStore';
import { RefreshCw, MapPin, Navigation, Layers } from 'lucide-react';

const GoogleMapComponent = ({
                                showTransports = true,
                                showInfrastructure = true,
                                showRoutes = true,
                                onMapLoad = null,
                                className = "w-full h-full",
                                mapOptions = {}
                            }) => {
    const mapRef = useRef(null);
    const markersRef = useRef(new Map());
    const routesRef = useRef(new Map());
    const infoWindowRef = useRef(null);

    const [map, setMap] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapControls, setMapControls] = useState({
        traffic: false,
        satellite: false,
        terrain: false
    });

    const {
        activeTransports,
        mapCenter,
        mapZoom,
        setMapCenter,
        setMapZoom
    } = useStore();

    // Dane infrastruktury Polski
    const polishInfrastructure = [
        {
            id: 1,
            name: 'Most Łazienkowski',
            type: 'bridge',
            coordinates: { lat: 52.2156, lng: 21.0348 },
            maxWeight: 42000,
            maxHeight: null,
            road: 'Trasa Łazienkowska',
            status: 'active'
        },
        {
            id: 2,
            name: 'Most Północny',
            type: 'bridge',
            coordinates: { lat: 52.2693, lng: 20.9863 },
            maxWeight: 40000,
            maxHeight: null,
            road: 'S7/S8',
            status: 'active'
        },
        {
            id: 3,
            name: 'Tunel pod Martwą Wisłą',
            type: 'tunnel',
            coordinates: { lat: 54.3611, lng: 18.6897 },
            maxWeight: null,
            maxHeight: 420,
            road: 'S7',
            status: 'active'
        },
        {
            id: 4,
            name: 'Most Rędziński',
            type: 'bridge',
            coordinates: { lat: 51.0985, lng: 17.0843 },
            maxWeight: 44000,
            maxHeight: null,
            road: 'A8/S8',
            status: 'active'
        },
        {
            id: 5,
            name: 'Tunel Południowej Obwodnicy',
            type: 'tunnel',
            coordinates: { lat: 50.2467, lng: 19.0048 },
            maxWeight: null,
            maxHeight: 350,
            road: 'A4',
            status: 'active'
        },
        {
            id: 6,
            name: 'Most na Warcie (A2)',
            type: 'bridge',
            coordinates: { lat: 52.3789, lng: 16.8437 },
            maxWeight: 45000,
            maxHeight: null,
            road: 'A2',
            status: 'active'
        }
    ];

    // Inicjalizacja mapy
    useEffect(() => {
        initializeMap();
        return () => {
            // Cleanup markers and routes
            markersRef.current.forEach(marker => marker.setMap(null));
            routesRef.current.forEach(route => route.setMap(null));
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
        };
    }, []);

    // Aktualizacja markerów transportów
    useEffect(() => {
        if (map && showTransports) {
            updateTransportMarkers();
        }
    }, [map, activeTransports, showTransports]);

    // Aktualizacja markerów infrastruktury
    useEffect(() => {
        if (map && showInfrastructure) {
            updateInfrastructureMarkers();
        }
    }, [map, showInfrastructure]);

    const initializeMap = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const google = await loadGoogleMaps();

            if (mapRef.current) {
                const mapInstance = new google.maps.Map(mapRef.current, {
                    ...DEFAULT_MAP_OPTIONS,
                    center: mapCenter,
                    zoom: mapZoom,
                    ...mapOptions
                });

                // Dodaj nasłuchiwacze zdarzeń
                mapInstance.addListener('center_changed', () => {
                    const center = mapInstance.getCenter();
                    setMapCenter({ lat: center.lat(), lng: center.lng() });
                });

                mapInstance.addListener('zoom_changed', () => {
                    setMapZoom(mapInstance.getZoom());
                });

                // Dodaj niestandardowe kontrolki
                addCustomControls(mapInstance);

                setMap(mapInstance);

                if (onMapLoad) {
                    onMapLoad(mapInstance);
                }
            }
        } catch (err) {
            console.error('Error initializing map:', err);
            setError('Nie udało się załadować mapy Google. Sprawdź połączenie internetowe.');
        } finally {
            setIsLoading(false);
        }
    };

    const addCustomControls = (mapInstance) => {
        // Kontrolka warstw
        const layerControl = document.createElement('div');
        layerControl.className = 'map-control';
        layerControl.innerHTML = `
      <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 10px;">
        <button id="traffic-toggle" style="padding: 8px 12px; border: none; background: none; cursor: pointer; border-bottom: 1px solid #eee;">
          🚦 Ruch
        </button>
        <button id="satellite-toggle" style="padding: 8px 12px; border: none; background: none; cursor: pointer; border-bottom: 1px solid #eee;">
          🛰️ Satelita
        </button>
        <button id="center-map" style="padding: 8px 12px; border: none; background: none; cursor: pointer;">
          🎯 Centruj
        </button>
      </div>
    `;

        mapInstance.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(layerControl);

        // Dodaj funkcjonalność do kontrolek
        layerControl.querySelector('#traffic-toggle').addEventListener('click', () => {
            toggleTrafficLayer(mapInstance);
        });

        layerControl.querySelector('#satellite-toggle').addEventListener('click', () => {
            toggleSatelliteView(mapInstance);
        });

        layerControl.querySelector('#center-map').addEventListener('click', () => {
            mapInstance.setCenter(DEFAULT_MAP_OPTIONS.center);
            mapInstance.setZoom(DEFAULT_MAP_OPTIONS.zoom);
        });
    };

    const toggleTrafficLayer = (mapInstance) => {
        if (!window.trafficLayer) {
            window.trafficLayer = new window.google.maps.TrafficLayer();
        }

        const isVisible = window.trafficLayer.getMap();
        if (isVisible) {
            window.trafficLayer.setMap(null);
            setMapControls(prev => ({ ...prev, traffic: false }));
        } else {
            window.trafficLayer.setMap(mapInstance);
            setMapControls(prev => ({ ...prev, traffic: true }));
        }
    };

    const toggleSatelliteView = (mapInstance) => {
        const currentType = mapInstance.getMapTypeId();
        if (currentType === 'satellite') {
            mapInstance.setMapTypeId('roadmap');
            setMapControls(prev => ({ ...prev, satellite: false }));
        } else {
            mapInstance.setMapTypeId('satellite');
            setMapControls(prev => ({ ...prev, satellite: true }));
        }
    };

    const updateTransportMarkers = () => {
        if (!map) return;

        // Usuń istniejące markery transportów
        markersRef.current.forEach((marker, id) => {
            if (id.startsWith('transport_')) {
                marker.setMap(null);
                markersRef.current.delete(id);
            }
        });

        // Dodaj nowe markery transportów
        activeTransports.forEach(transport => {
            const markerId = `transport_${transport.id}`;

            const marker = createCustomMarker(
                transport.currentLocation,
                {
                    ...MARKER_ICONS.transport,
                    url: createTransportMarkerSVG(transport.status)
                },
                transport.name,
                map
            );

            // Dodaj info window
            const infoContent = createTransportInfoContent(transport);
            const infoWindow = createInfoWindow(infoContent);

            marker.addListener('click', () => {
                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                }
                infoWindow.open(map, marker);
                infoWindowRef.current = infoWindow;
            });

            markersRef.current.set(markerId, marker);

            // Animacja markera dla aktywnych transportów
            if (transport.status === 'W drodze') {
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                setTimeout(() => marker.setAnimation(null), 2000);
            }
        });
    };

    const updateInfrastructureMarkers = () => {
        if (!map) return;

        // Usuń istniejące markery infrastruktury
        markersRef.current.forEach((marker, id) => {
            if (id.startsWith('infra_')) {
                marker.setMap(null);
                markersRef.current.delete(id);
            }
        });

        // Dodaj markery infrastruktury
        polishInfrastructure.forEach(infra => {
            const markerId = `infra_${infra.id}`;

            const icon = infra.type === 'bridge' ? MARKER_ICONS.bridge : MARKER_ICONS.tunnel;
            const marker = createCustomMarker(
                infra.coordinates,
                icon,
                infra.name,
                map
            );

            // Info window dla infrastruktury
            const infoContent = createInfrastructureInfoContent(infra);
            const infoWindow = createInfoWindow(infoContent);

            marker.addListener('click', () => {
                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                }
                infoWindow.open(map, marker);
                infoWindowRef.current = infoWindow;
            });

            markersRef.current.set(markerId, marker);
        });
    };

    const createTransportMarkerSVG = (status) => {
        const color = status === 'W drodze' ? '#16a34a' :
            status === 'Zatrzymany' ? '#dc2626' : '#6b7280';

        return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="${color}" stroke="white" stroke-width="2"/>
        <rect x="8" y="12" width="16" height="8" rx="1" fill="white"/>
        <rect x="10" y="14" width="3" height="2" fill="${color}"/>
        <rect x="14.5" y="14" width="5" height="2" fill="${color}"/>
        <rect x="21" y="14" width="3" height="2" fill="${color}"/>
        <circle cx="12" cy="22" r="2" fill="white" stroke="${color}" stroke-width="1"/>
        <circle cx="20" cy="22" r="2" fill="white" stroke="${color}" stroke-width="1"/>
      </svg>
    `);
    };

    const createTransportInfoContent = (transport) => `
    <div style="font-family: Arial, sans-serif; max-width: 250px; padding: 8px;">
      <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${transport.name}</h4>
      <div style="margin-bottom: 8px;">
        <span style="display: inline-block; padding: 2px 8px; background: ${
        transport.status === 'W drodze' ? '#dcfce7' : '#fef2f2'
    }; color: ${
        transport.status === 'W drodze' ? '#166534' : '#991b1b'
    }; border-radius: 12px; font-size: 12px; font-weight: 500;">
          ${transport.status}
        </span>
      </div>
      <div style="font-size: 13px; color: #6b7280; line-height: 1.4;">
        <div><strong>Trasa:</strong> ${transport.route}</div>
        <div><strong>Postęp:</strong> ${transport.progress}%</div>
        <div><strong>ETA:</strong> ${transport.eta}</div>
        <div><strong>Zestawy:</strong> ${transport.sets.join(', ')}</div>
      </div>
    </div>
  `;

    const createInfrastructureInfoContent = (infra) => `
    <div style="font-family: Arial, sans-serif; max-width: 200px; padding: 8px;">
      <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">${infra.name}</h4>
      <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
        ${infra.type === 'bridge' ? '🌉 Most' : '🚇 Tunel'} • ${infra.road}
      </div>
      ${infra.maxWeight ? `<div style="font-size: 11px; color: #dc2626;">⚖️ Max waga: ${infra.maxWeight/1000}t</div>` : ''}
      ${infra.maxHeight ? `<div style="font-size: 11px; color: #dc2626;">📏 Max wysokość: ${infra.maxHeight}cm</div>` : ''}
      <div style="font-size: 11px; color: #16a34a; margin-top: 4px;">✅ Aktywny</div>
    </div>
  `;

    const drawRoute = useCallback((startPoint, endPoint, routeOptions = {}) => {
        if (!map || !window.google) return;

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
            ...ROUTE_OPTIONS.planned,
            ...routeOptions,
            map: map
        });

        directionsService.route({
            origin: startPoint,
            destination: endPoint,
            travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
                routesRef.current.set(`route_${Date.now()}`, directionsRenderer);
            }
        });
    }, [map]);

    const clearAllRoutes = () => {
        routesRef.current.forEach(route => route.setMap(null));
        routesRef.current.clear();
    };

    const centerOnTransport = (transportId) => {
        const transport = activeTransports.find(t => t.id === transportId);
        if (transport && map) {
            map.setCenter(transport.currentLocation);
            map.setZoom(12);
        }
    };

    const fitBoundsToTransports = () => {
        if (!map || activeTransports.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        activeTransports.forEach(transport => {
            bounds.extend(transport.currentLocation);
        });

        map.fitBounds(bounds);
    };

    if (error) {
        return (
            <div className={`${className} flex items-center justify-center bg-gray-100`}>
                <div className="text-center p-8">
                    <div className="text-red-500 mb-4">
                        <MapPin className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Błąd ładowania mapy</h3>
                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={initializeMap}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className} relative`}>
            <div ref={mapRef} className="w-full h-full" />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-green-600" />
                        <div className="text-lg font-medium text-gray-700">Ładowanie mapy...</div>
                        <div className="text-sm text-gray-500">Inicjalizacja Google Maps API</div>
                    </div>
                </div>
            )}

            {/* Map Status Indicator */}
            {map && (
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">
              Mapa załadowana • {activeTransports.length} transportów
            </span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Hook do używania mapy w innych komponentach
export const useMapActions = () => {
    const mapComponentRef = useRef();

    return {
        drawRoute: mapComponentRef.current?.drawRoute,
        clearAllRoutes: mapComponentRef.current?.clearAllRoutes,
        centerOnTransport: mapComponentRef.current?.centerOnTransport,
        fitBoundsToTransports: mapComponentRef.current?.fitBoundsToTransports
    };
};

export default GoogleMapComponent;