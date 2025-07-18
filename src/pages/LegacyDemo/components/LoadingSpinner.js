import React from 'react';
import { Loader, RefreshCw, Truck, MapPin } from 'lucide-react';

const LoadingSpinner = ({
                            size = 'medium',
                            type = 'default',
                            message = null,
                            subtitle = null,
                            overlay = false,
                            className = ''
                        }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
        xlarge: 'w-16 h-16'
    };

    const getIcon = () => {
        switch (type) {
            case 'refresh':
                return <RefreshCw className={`${sizeClasses[size]} animate-spin text-green-600`} />;
            case 'transport':
                return <Truck className={`${sizeClasses[size]} animate-pulse text-blue-600`} />;
            case 'map':
                return <MapPin className={`${sizeClasses[size]} animate-bounce text-red-600`} />;
            default:
                return <Loader className={`${sizeClasses[size]} animate-spin text-green-600`} />;
        }
    };

    const containerClasses = overlay
        ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
        : 'flex items-center justify-center';

    return (
        <div className={`${containerClasses} ${className}`}>
            <div className="text-center">
                <div className="flex justify-center mb-3">
                    {getIcon()}
                </div>

                {message && (
                    <div className="text-lg font-medium text-gray-700 mb-1">
                        {message}
                    </div>
                )}

                {subtitle && (
                    <div className="text-sm text-gray-500">
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    );
};

// Wrapper dla overlay loading
export const LoadingOverlay = ({ isLoading, children, ...props }) => {
    if (!isLoading) return children;

    return (
        <div className="relative">
            {children}
            <LoadingSpinner overlay {...props} />
        </div>
    );
};

// Loading placeholder dla list
export const LoadingList = ({ count = 3, height = 'h-16' }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
            <div key={index} className={`${height} bg-gray-200 animate-pulse rounded-lg`} />
        ))}
    </div>
);

// Loading placeholder dla kart
export const LoadingCard = ({ className = '' }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="mt-4 flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    </div>
);

// Loading dla tabel
export const LoadingTable = ({ columns = 4, rows = 5 }) => (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
            <tr>
                {Array.from({ length: columns }).map((_, index) => (
                    <th key={index} className="px-6 py-3">
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

// Loading button state
export const LoadingButton = ({
                                  isLoading,
                                  children,
                                  loadingText = 'Ładowanie...',
                                  className = '',
                                  disabled = false,
                                  ...props
                              }) => (
    <button
        className={`inline-flex items-center justify-center ${className}`}
        disabled={isLoading || disabled}
        {...props}
    >
        {isLoading ? (
            <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                {loadingText}
            </>
        ) : (
            children
        )}
    </button>
);

// Presets dla różnych scenariuszy
export const MapLoading = () => (
    <LoadingSpinner
        type="map"
        size="large"
        message="Ładowanie mapy Google..."
        subtitle="Pobieranie danych o infrastrukturze Polski"
        className="h-full bg-gray-100"
    />
);

export const TransportLoading = () => (
    <LoadingSpinner
        type="transport"
        size="medium"
        message="Aktualizowanie transportów..."
        subtitle="Synchronizacja z systemem GPS"
    />
);

export const DataLoading = () => (
    <LoadingSpinner
        type="refresh"
        size="medium"
        message="Ładowanie danych..."
        subtitle="Proszę czekać"
    />
);

// Page loading dla całej strony
export const PageLoading = ({ message = "Ładowanie strony..." }) => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner
            size="xlarge"
            message={message}
            subtitle="System Logistyki Militarnej"
        />
    </div>
);

export default LoadingSpinner;