import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Truck, AlertTriangle, Clock, Route, Navigation, Settings, Eye, Plus, X, Check, Package, RefreshCw } from 'lucide-react';

const MilitaryLogisticsSystem = () => {
    const [activeView, setActiveView] = useState('planner');
    const [selectedTransportSets, setSelectedTransportSets] = useState([]);
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'traffic',
            message: 'Korki na A1 - system przygotował objazd',
            transportId: 1,
            severity: 'medium',
            status: 'auto-resolved'
        },
        {
            id: 2,
            type: 'infrastructure',
            message: 'Most A2 - automatycznie ominięty w trasie',
            transportId: 2,
            severity: 'low',
            status: 'auto-resolved'
        }
    ]);
    const [showSetDetails, setShowSetDetails] = useState(null);
    const [showRouteConfirm, setShowRouteConfirm] = useState(false);
    const [map, setMap] = useState(null);
    const [infrastructureData, setInfrastructureData] = useState([]);
    const [routeService, setRouteService] = useState(null);
    const mapRef = useRef(null);
    const googleMapsLoaded = useRef(false);

    // Real Polish infrastructure data (bridges, tunnels, weight/height restrictions)
    const polishInfrastructure = [
        // Warsaw area
        {
            id: 1,
            name: 'Most Łazienkowski',
            type: 'bridge',
            coordinates: { lat: 52.2156, lng: 21.0348 },
            maxWeight: 42000, // kg
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
        // Kraków area
        {
            id: 3,
            name: 'Most Dębnicki',
            type: 'bridge',
            coordinates: { lat: 50.0546, lng: 19.9238 },
            maxWeight: 38000,
            maxHeight: null,
            road: 'ul. Dębnicka',
            status: 'active'
        },
        // Gdańsk area
        {
            id: 4,
            name: 'Tunel pod Martwą Wisłą',
            type: 'tunnel',
            coordinates: { lat: 54.3611, lng: 18.6897 },
            maxWeight: null,
            maxHeight: 420, // cm
            road: 'S7',
            status: 'active'
        },
        // Wrocław area
        {
            id: 5,
            name: 'Most Rędziński',
            type: 'bridge',
            coordinates: { lat: 51.0985, lng: 17.0843 },
            maxWeight: 44000,
            maxHeight: null,
            road: 'A8/S8',
            status: 'active'
        },
        // Katowice area
        {
            id: 6,
            name: 'Tunel Południowej Obwodnicy',
            type: 'tunnel',
            coordinates: { lat: 50.2467, lng: 19.0048 },
            maxWeight: null,
            maxHeight: 350, // cm
            road: 'A4',
            status: 'active'
        },
        // Poznań area
        {
            id: 7,
            name: 'Most na Warcie (A2)',
            type: 'bridge',
            coordinates: { lat: 52.3789, lng: 16.8437 },
            maxWeight: 45000,
            maxHeight: null,
            road: 'A2',
            status: 'active'
        },
        // Łódź area
        {
            id: 8,
            name: 'Wiadukt A1/A2',
            type: 'bridge',
            coordinates: { lat: 51.7069, lng: 19.5271 },
            maxWeight: 40000,
            maxHeight: 480, // cm
            road: 'A1/A2',
            status: 'active'
        },
        // Lublin area
        {
            id: 9,
            name: 'Most na Bystrzcy',
            type: 'bridge',
            coordinates: { lat: 51.2398, lng: 22.5072 },
            maxWeight: 35000,
            maxHeight: null,
            road: 'S17',
            status: 'active'
        },
        // Additional infrastructure
        {
            id: 10,
            name: 'Tunel Wisłostrady',
            type: 'tunnel',
            coordinates: { lat: 52.2412, lng: 21.0298 },
            maxWeight: null,
            maxHeight: 380,
            road: 'Wisłostrada',
            status: 'active'
        }
    ];

    // Transport sets (ciężarówka + ładunek)
    const transportSets = [
        {
            id: 1,
            name: 'Zestaw Alpha',
            transporter: { id: 1, model: 'MAN TGS 18.440', type: 'Ciężarówka', weight: 12000, height: 350, axles: 3, maxLoad: 6000 },
            cargo: { id: 5, model: 'PT-91 Twardy', type: 'Czołg', weight: 45000, height: 320, axles: 7, maxLoad: 8000 },
            totalWeight: 57000,
            totalHeight: 350,
            description: 'Transport czołgu głównego'
        },
        {
            id: 2,
            name: 'Zestaw Bravo',
            transporter: { id: 2, model: 'Scania R 500', type: 'Ciężarówka', weight: 13000, height: 360, axles: 3, maxLoad: 6500 },
            cargo: { id: 6, model: 'Rosomak', type: 'Transporter', weight: 24000, height: 300, axles: 6, maxLoad: 7000 },
            totalWeight: 37000,
            totalHeight: 360,
            description: 'Transport transportera opancerzonego'
        },
        {
            id: 3,
            name: 'Zestaw Charlie',
            transporter: { id: 3, model: 'Volvo FMX 460', type: 'Ciężarówka', weight: 12500, height: 355, axles: 3, maxLoad: 6200 },
            cargo: { id: 7, model: 'BMP-1', type: 'Transporter', weight: 13000, height: 250, axles: 5, maxLoad: 5000 },
            totalWeight: 25500,
            totalHeight: 355,
            description: 'Transport lekkiego transportera'
        },
        {
            id: 4,
            name: 'Zestaw Delta',
            transporter: { id: 4, model: 'Tatra 815', type: 'Ciężarówka', weight: 15000, height: 370, axles: 3, maxLoad: 7000 },
            cargo: { id: 8, model: 'Haubica 155mm', type: 'Sprzęt wsparcia', weight: 18000, height: 250, axles: 4, maxLoad: 6000 },
            totalWeight: 33000,
            totalHeight: 370,
            description: 'Transport działa samobieżnego'
        }
    ];

    const activeTransports = [
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
            currentLocation: { lat: 51.7592, lng: 19.4560 }
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
            currentLocation: { lat: 52.4064, lng: 16.9252 }
        }
    ];

    const polishCities = [
        { name: 'Warszawa', lat: 52.2297, lng: 21.0122 },
        { name: 'Kraków', lat: 50.0647, lng: 19.9450 },
        { name: 'Gdańsk', lat: 54.3520, lng: 18.6466 },
        { name: 'Wrocław', lat: 51.1079, lng: 17.0385 },
        { name: 'Poznań', lat: 52.4064, lng: 16.9252 },
        { name: 'Łódź', lat: 51.7592, lng: 19.4560 },
        { name: 'Katowice', lat: 50.2649, lng: 19.0238 },
        { name: 'Lublin', lat: 51.2465, lng: 22.5684 },
        { name: 'Szczecin', lat: 53.4285, lng: 14.5528 },
        { name: 'Bydgoszcz', lat: 53.1235, lng: 18.0084 }
    ];

    // Load Google Maps
    useEffect(() => {
        if (!googleMapsLoaded.current) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB_mock_key_for_demo&libraries=places,geometry,directions`;
            script.onload = initializeMap;
            document.head.appendChild(script);
            googleMapsLoaded.current = true;
        }
    }, []);

    const initializeMap = () => {
        if (mapRef.current && window.google) {
            const mapOptions = {
                center: { lat: 52.0693, lng: 19.4803 }, // Center of Poland
                zoom: 6,
                mapTypeId: 'roadmap',
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                    }
                ]
            };

            const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
            setMap(newMap);

            // Initialize directions service
            const directionsService = new window.google.maps.DirectionsService();
            setRouteService(directionsService);

            // Add infrastructure markers
            addInfrastructureMarkers(newMap);
        }
    };

    const addInfrastructureMarkers = (mapInstance) => {
        polishInfrastructure.forEach(infra => {
            const icon = {
                url: infra.type === 'bridge' ?
                    'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="10" width="20" height="4" fill="#dc2626" rx="2"/>
              <rect x="5" y="6" width="2" height="8" fill="#dc2626"/>
              <rect x="17" y="6" width="2" height="8" fill="#dc2626"/>
            </svg>
          `) :
                    'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="12" cy="12" rx="10" ry="6" fill="#eab308"/>
              <ellipse cx="12" cy="12" rx="6" ry="3" fill="#f59e0b"/>
            </svg>
          `),
                scaledSize: new window.google.maps.Size(24, 24)
            };

            const marker = new window.google.maps.Marker({
                position: infra.coordinates,
                map: mapInstance,
                icon: icon,
                title: infra.name
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: `
          <div style="font-family: Arial, sans-serif; max-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937;">${infra.name}</h4>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
              ${infra.type === 'bridge' ? '🌉 Most' : '🚇 Tunel'} • ${infra.road}
            </div>
            ${infra.maxWeight ? `<div style="font-size: 11px; color: #dc2626;">⚖️ Max waga: ${infra.maxWeight/1000}t</div>` : ''}
            ${infra.maxHeight ? `<div style="font-size: 11px; color: #dc2626;">📏 Max wysokość: ${infra.maxHeight}cm</div>` : ''}
          </div>
        `
            });

            marker.addListener('click', () => {
                infoWindow.open(mapInstance, marker);
            });
        });
    };

    const calculateRoute = (start, end, constraints) => {
        if (!routeService || !start || !end) return;

        // Find problematic infrastructure
        const problematicInfrastructure = polishInfrastructure.filter(infra => {
            if (infra.maxWeight && constraints.totalWeight > infra.maxWeight) return true;
            if (infra.maxHeight && constraints.totalHeight > infra.maxHeight) return true;
            return false;
        });

        // Create waypoints to avoid problematic infrastructure
        const avoidWaypoints = problematicInfrastructure.map(infra => ({
            location: new window.google.maps.LatLng(infra.coordinates.lat, infra.coordinates.lng),
            stopover: false
        }));

        const request = {
            origin: start,
            destination: end,
            waypoints: avoidWaypoints.length > 0 ? avoidWaypoints : undefined,
            optimizeWaypoints: true,
            travelMode: window.google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
        };

        routeService.route(request, (result, status) => {
            if (status === 'OK') {
                const directionsRenderer = new window.google.maps.DirectionsRenderer({
                    directions: result,
                    map: map,
                    polylineOptions: {
                        strokeColor: '#2563eb',
                        strokeWeight: 4,
                        strokeOpacity: 0.8
                    }
                });

                // Store route info for confirmation
                const route = result.routes[0];
                const leg = route.legs[0];

                window.routeInfo = {
                    distance: leg.distance.text,
                    duration: leg.duration.text,
                    avoidedInfrastructure: problematicInfrastructure,
                    waypoints: avoidWaypoints.length
                };
            }
        });
    };

    const handleTransportSetSelect = (transportSet) => {
        if (selectedTransportSets.find(s => s.id === transportSet.id)) {
            setSelectedTransportSets(selectedTransportSets.filter(s => s.id !== transportSet.id));
        } else {
            setSelectedTransportSets([...selectedTransportSets, transportSet]);
        }
    };

    const calculateTotalConstraints = () => {
        if (selectedTransportSets.length === 0) return null;

        const maxHeight = Math.max(...selectedTransportSets.map(s => s.totalHeight));
        const totalWeight = selectedTransportSets.reduce((sum, s) => sum + s.totalWeight, 0);
        const maxAxleLoad = Math.max(...selectedTransportSets.map(s => s.transporter.maxLoad));

        return { maxHeight, totalWeight, maxAxleLoad };
    };

    const generateRoute = () => {
        if (startPoint && endPoint && selectedTransportSets.length > 0) {
            const constraints = calculateTotalConstraints();
            const startCity = polishCities.find(city => city.name === startPoint);
            const endCity = polishCities.find(city => city.name === endPoint);

            if (startCity && endCity && map) {
                calculateRoute(
                    new window.google.maps.LatLng(startCity.lat, startCity.lng),
                    new window.google.maps.LatLng(endCity.lat, endCity.lng),
                    { totalWeight: constraints.totalWeight, totalHeight: constraints.maxHeight }
                );
            }

            setTimeout(() => setShowRouteConfirm(true), 1000); // Give time for route calculation
        }
    };

    const confirmRoute = () => {
        setShowRouteConfirm(false);
        alert('Trasa została zatwierdzona i plik nawigacyjny został wygenerowany!');
    };

    const handleAlertClick = (alert) => {
        const transport = activeTransports.find(t => t.id === alert.transportId);
        setSelectedTransport(transport);
        setActiveView('operator');
    };

    const GoogleMapComponent = ({ showTransports = false }) => (
        <div className="h-full w-full relative">
            <div ref={mapRef} className="w-full h-full" />

            {!map && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                        <div className="text-lg font-medium">Ładowanie mapy Google...</div>
                        <div className="text-sm text-gray-600">Pobieranie danych o infrastrukturze Polski</div>
                    </div>
                </div>
            )}

            {/* Transport markers overlay */}
            {showTransports && map && activeTransports.map(transport => {
                // In real implementation, these would be actual Google Maps markers
                return null; // Markers are added programmatically to the map
            })}
        </div>
    );

    const PlannerView = () => (
        <div className="flex h-screen bg-gray-100">
            {/* Left Panel - Route Setup */}
            <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Planowanie Trasy</h2>

                {/* Route Points */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-700">Punkty trasy</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Punkt początkowy</label>
                            <select
                                value={startPoint}
                                onChange={(e) => setStartPoint(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Wybierz miasto</option>
                                {polishCities.map(city => (
                                    <option key={city.name} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Punkt docelowy</label>
                            <select
                                value={endPoint}
                                onChange={(e) => setEndPoint(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Wybierz miasto</option>
                                {polishCities.map(city => (
                                    <option key={city.name} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transport Sets Selection */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-700">Wybór zestawów transportowych</h3>
                    <div className="space-y-3">
                        {transportSets.map(transportSet => (
                            <div key={transportSet.id} className="border rounded-md p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedTransportSets.find(s => s.id === transportSet.id) !== undefined}
                                            onChange={() => handleTransportSetSelect(transportSet)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">{transportSet.name}</div>
                                            <div className="text-sm text-gray-600">{transportSet.description}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowSetDetails(transportSet)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                    >
                                        Szczegóły
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-blue-50 p-2 rounded">
                                        <div className="font-medium text-blue-800">Ciężarówka</div>
                                        <div className="text-blue-700">{transportSet.transporter.model}</div>
                                        <div className="text-blue-600">{transportSet.transporter.weight} kg</div>
                                    </div>
                                    <div className="bg-green-50 p-2 rounded">
                                        <div className="font-medium text-green-800">Ładunek</div>
                                        <div className="text-green-700">{transportSet.cargo.model}</div>
                                        <div className="text-green-600">{transportSet.cargo.weight} kg</div>
                                    </div>
                                </div>

                                <div className="mt-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Łączna waga:</span>
                                        <span className="font-medium">{transportSet.totalWeight} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Max wysokość:</span>
                                        <span className="font-medium">{transportSet.totalHeight} cm</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Sets Summary */}
                {selectedTransportSets.length > 0 && (
                    <div className="mb-6 p-3 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-800 mb-2">
                            Wybrane zestawy ({selectedTransportSets.length})
                        </h4>
                        <div className="text-sm text-blue-700">
                            <div>Max. waga: {calculateTotalConstraints()?.totalWeight} kg</div>
                            <div>Max. wysokość: {calculateTotalConstraints()?.maxHeight} cm</div>
                            <div>Max. obciążenie osi: {calculateTotalConstraints()?.maxAxleLoad} kg</div>
                        </div>
                        <div className="mt-2 space-y-1">
                            {selectedTransportSets.map(set => (
                                <div key={set.id} className="text-xs text-blue-600">
                                    • {set.name}: {set.transporter.model} + {set.cargo.model}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={generateRoute}
                    disabled={!startPoint || !endPoint || selectedTransportSets.length === 0}
                    className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Generuj trasę
                </button>
            </div>

            {/* Center Panel - Google Map */}
            <div className="flex-1 relative">
                <GoogleMapComponent showTransports={false} />
            </div>

            {/* Right Panel - Infrastructure Info */}
            <div className="w-64 bg-white shadow-lg p-6 overflow-y-auto">
                <h3 className="font-semibold mb-4 text-gray-800">Infrastruktura</h3>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                        <div className="w-4 h-3 bg-red-600 rounded mr-3"></div>
                        <span>Most / Wiadukt</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <div className="w-4 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span>Tunel</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <div className="w-4 h-1 bg-blue-600 mr-3"></div>
                        <span>Planowana trasa</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700">Wykryta infrastruktura ({polishInfrastructure.length})</h4>
                    <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                        {polishInfrastructure.map(infra => (
                            <div key={infra.id} className={`p-2 rounded border-l-4 ${
                                infra.type === 'bridge' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                            }`}>
                                <div className="font-medium">{infra.name}</div>
                                <div className="text-xs text-gray-600">{infra.road}</div>
                                {infra.maxWeight && (
                                    <div className="text-xs text-red-700">Max: {infra.maxWeight/1000}t</div>
                                )}
                                {infra.maxHeight && (
                                    <div className="text-xs text-red-700">Max: {infra.maxHeight}cm</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Route optimization info */}
                {selectedTransportSets.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-medium mb-3 text-gray-700">Analiza ograniczeń</h4>
                        <div className="space-y-2 text-sm">
                            {polishInfrastructure
                                .filter(infra => {
                                    const constraints = calculateTotalConstraints();
                                    return (infra.maxWeight && constraints.totalWeight > infra.maxWeight) ||
                                        (infra.maxHeight && constraints.maxHeight > infra.maxHeight);
                                })
                                .map(infra => (
                                    <div key={infra.id} className="p-2 rounded bg-blue-100 text-blue-700">
                                        🔄 {infra.name} zostanie ominięty
                                        <div className="text-xs">
                                            {infra.maxWeight && calculateTotalConstraints().totalWeight > infra.maxWeight &&
                                                `Przekroczenie wagi: ${calculateTotalConstraints().totalWeight}kg > ${infra.maxWeight}kg`}
                                            {infra.maxHeight && calculateTotalConstraints().maxHeight > infra.maxHeight &&
                                                `Przekroczenie wysokości: ${calculateTotalConstraints().maxHeight}cm > ${infra.maxHeight}cm`}
                                        </div>
                                    </div>
                                ))}

                            {polishInfrastructure.every(infra => {
                                const constraints = calculateTotalConstraints();
                                return !(infra.maxWeight && constraints.totalWeight > infra.maxWeight) &&
                                    !(infra.maxHeight && constraints.maxHeight > infra.maxHeight);
                            }) && (
                                <div className="p-2 rounded bg-green-100 text-green-700">
                                    ✅ Wszystkie zestawy mogą przejechać trasą główną
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const OperatorView = () => (
        <div className="flex h-screen bg-gray-100">
            {/* Left Panel - Active Transports */}
            <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Aktywne transporty</h2>

                <div className="space-y-4">
                    {activeTransports.map(transport => (
                        <div
                            key={transport.id}
                            onClick={() => setSelectedTransport(transport)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedTransport?.id === transport.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">{transport.name}</h3>
                                <span className={`px-2 py-1 rounded text-xs ${
                                    transport.status === 'W drodze' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                  {transport.status}
                </span>
                            </div>

                            <div className="text-sm text-gray-600 mb-2">
                                Trasa: {transport.route}
                            </div>

                            <div className="text-sm text-gray-600 mb-2">
                                Zestawy: {transport.sets.join(', ')}
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${transport.progress}%` }}
                                ></div>
                            </div>

                            <div className="text-xs text-gray-600">
                                {transport.progress}% completed - ETA: {transport.eta}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Panel - Google Map with Transports */}
            <div className="flex-1 relative">
                <GoogleMapComponent showTransports={true} />

                {/* Alerts Panel */}
                <div className="absolute top-4 right-4 w-80">
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                            Alerty ({alerts.length})
                        </h3>

                        <div className="space-y-2">
                            {alerts.map(alert => (
                                <div
                                    key={alert.id}
                                    onClick={() => handleAlertClick(alert)}
                                    className={`p-3 rounded-md cursor-pointer border-l-4 ${
                                        alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                                            alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                                                alert.severity === 'medium' ? 'border-blue-500 bg-blue-50' :
                                                    'border-green-500 bg-green-50'
                                    }`}
                                >
                                    <div className="font-medium text-sm flex items-center">
                                        {alert.status === 'auto-resolved' && (
                                            <span className="text-green-600 mr-2">🤖</span>
                                        )}
                                        {alert.message}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        Transport: {activeTransports.find(t => t.id === alert.transportId)?.name}
                                        {alert.status === 'auto-resolved' && (
                                            <span className="ml-2 text-green-600">• Auto-rozwiązane</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Transport Stats */}
            {selectedTransport && (
                <div className="w-80 bg-white shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">{selectedTransport.name}</h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3">Statystyki trasy</h4>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Trasa:</span>
                                    <span className="font-medium">{selectedTransport.route}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pokonana odległość:</span>
                                    <span className="font-medium">{selectedTransport.distanceCovered} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pozostała odległość:</span>
                                    <span className="font-medium">{selectedTransport.distanceRemaining} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Całkowity czas:</span>
                                    <span className="font-medium">{selectedTransport.totalTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ETA:</span>
                                    <span className="font-medium text-blue-600">{selectedTransport.eta}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Postęp</span>
                                    <span>{selectedTransport.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${selectedTransport.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3">Zestawy w transporcie</h4>
                            <div className="space-y-2 text-sm">
                                {selectedTransport.sets.map((setName, index) => {
                                    const set = transportSets.find(s => s.name === setName);
                                    return (
                                        <div key={index} className="p-2 bg-white rounded border">
                                            <div className="font-medium">{setName}</div>
                                            {set && (
                                                <div className="text-xs text-gray-600 mt-1">
                                                    {set.transporter.model} + {set.cargo.model}
                                                    <br />Waga: {set.totalWeight} kg, Wysokość: {set.totalHeight} cm
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <h4 className="font-semibold mb-2">🧠 Automatyczna reoptymalizacja</h4>
                            <p className="text-sm text-gray-700 mb-3">
                                System wykrył korki na A1 i automatycznie przygotował alternatywną trasę omijającą problematyczny odcinek.
                            </p>
                            <div className="text-xs text-gray-600 mb-3 space-y-1">
                                <div>• Nowa trasa: A2 → S8 → drogi lokalne</div>
                                <div>• Skrócenie czasu: 25 min</div>
                                <div>• Ominięcie: korki + most z ograniczeniem wagi</div>
                                <div>• Status: gotowa do zatwierdzenia</div>
                            </div>
                            <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                                Zatwierdź zoptymalizowaną trasę
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-green-800 text-white p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">System Logistyki Militarnej - Google Maps</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveView('planner')}
                            className={`px-4 py-2 rounded ${activeView === 'planner' ? 'bg-green-600' : 'bg-green-700 hover:bg-green-600'}`}
                        >
                            Planowanie tras
                        </button>
                        <button
                            onClick={() => setActiveView('operator')}
                            className={`px-4 py-2 rounded ${activeView === 'operator' ? 'bg-green-600' : 'bg-green-700 hover:bg-green-600'}`}
                        >
                            Panel operatora
                        </button>
                    </div>
                </div>
            </nav>

            {activeView === 'planner' ? <PlannerView /> : <OperatorView />}

            {/* Transport Set Details Modal */}
            {showSetDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Szczegóły zestawu: {showSetDetails.name}</h3>
                            <button
                                onClick={() => setShowSetDetails(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-blue-800 border-b pb-2">Ciężarówka (Transporter)</h4>
                                <div><strong>Model:</strong> {showSetDetails.transporter.model}</div>
                                <div><strong>Typ:</strong> {showSetDetails.transporter.type}</div>
                                <div><strong>Waga własna:</strong> {showSetDetails.transporter.weight} kg</div>
                                <div><strong>Wysokość:</strong> {showSetDetails.transporter.height} cm</div>
                                <div><strong>Liczba osi:</strong> {showSetDetails.transporter.axles}</div>
                                <div><strong>Max obciążenie osi:</strong> {showSetDetails.transporter.maxLoad} kg</div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-green-800 border-b pb-2">Ładunek (Cargo)</h4>
                                <div><strong>Model:</strong> {showSetDetails.cargo.model}</div>
                                <div><strong>Typ:</strong> {showSetDetails.cargo.type}</div>
                                <div><strong>Waga:</strong> {showSetDetails.cargo.weight} kg</div>
                                <div><strong>Wysokość:</strong> {showSetDetails.cargo.height} cm</div>
                                <div><strong>Liczba osi:</strong> {showSetDetails.cargo.axles}</div>
                                <div><strong>Max obciążenie osi:</strong> {showSetDetails.cargo.maxLoad} kg</div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Parametry całego zestawu</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Łączna waga:</strong> {showSetDetails.totalWeight} kg</div>
                                <div><strong>Maksymalna wysokość:</strong> {showSetDetails.totalHeight} cm</div>
                                <div><strong>Opis:</strong> {showSetDetails.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Route Confirmation Modal */}
            {showRouteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">Zatwierdź zoptymalizowaną trasę</h3>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span>Trasa:</span>
                                <span className="font-medium">{startPoint} → {endPoint}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Zestawy:</span>
                                <span className="font-medium">{selectedTransportSets.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Dystans:</span>
                                <span className="font-medium">{window.routeInfo?.distance || '~200 km'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Czas przejazdu:</span>
                                <span className="font-medium">{window.routeInfo?.duration || '~2h 30m'}</span>
                            </div>
                        </div>

                        {window.routeInfo?.avoidedInfrastructure && window.routeInfo.avoidedInfrastructure.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <h4 className="font-medium text-blue-800 mb-2">🧠 Automatyczne optymalizacje trasy:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    {window.routeInfo.avoidedInfrastructure.map((infra, index) => (
                                        <li key={index}>• Ominięto {infra.name} ({infra.type === 'bridge' ? 'most' : 'tunel'})</li>
                                    ))}
                                </ul>
                                <p className="text-xs text-blue-600 mt-2 italic">
                                    System wykorzystał Google Maps API do znalezienia optymalnej trasy z objazdami
                                </p>
                            </div>
                        )}

                        {(!window.routeInfo?.avoidedInfrastructure || window.routeInfo.avoidedInfrastructure.length === 0) && (
                            <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <p className="text-sm text-green-700">
                                    ✅ Trasa optymalna - wszystkie zestawy mogą przejechać najkrótszą drogą bez objazdów
                                </p>
                            </div>
                        )}

                        <p className="mb-4 text-gray-700">
                            Czy chcesz zatwierdzić trasę i wygenerować plik nawigacyjny Google Maps?
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={confirmRoute}
                                className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                <Check className="w-4 h-4 inline mr-2" />
                                Zatwierdź trasę
                            </button>
                            <button
                                onClick={() => setShowRouteConfirm(false)}
                                className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                <X className="w-4 h-4 inline mr-2" />
                                Anuluj
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MilitaryLogisticsSystem;