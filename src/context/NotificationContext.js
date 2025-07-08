import React, { createContext, useContext, useEffect } from 'react';
import useStore from '../store/userStore';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const {
        notifications,
        addNotification,
        removeNotification,
        alerts,
        activeTransports
    } = useStore();

    // Auto-remove notifications after timeout
    useEffect(() => {
        notifications.forEach(notification => {
            if (notification.autoRemove !== false) {
                const timeout = notification.duration || 5000;
                setTimeout(() => {
                    removeNotification(notification.id);
                }, timeout);
            }
        });
    }, [notifications, removeNotification]);

    // Monitor alerts and create notifications
    useEffect(() => {
        const latestAlert = alerts[alerts.length - 1];
        if (latestAlert && latestAlert.status !== 'resolved') {
            const transport = activeTransports.find(t => t.id === latestAlert.transportId);

            addNotification({
                type: 'alert',
                title: getAlertTitle(latestAlert.type),
                message: latestAlert.message,
                severity: latestAlert.severity,
                transportName: transport?.name,
                alertId: latestAlert.id,
                autoRemove: false
            });
        }
    }, [alerts, activeTransports, addNotification]);

    // Monitor transport status changes
    useEffect(() => {
        activeTransports.forEach(transport => {
            // Powiadom o zakończeniu transportu
            if (transport.progress >= 100) {
                addNotification({
                    type: 'success',
                    title: 'Transport zakończony',
                    message: `${transport.name} dotarł do celu`,
                    severity: 'low',
                    transportName: transport.name
                });
            }

            // Powiadom o opóźnieniach
            if (transport.status === 'Zatrzymany') {
                addNotification({
                    type: 'warning',
                    title: 'Transport zatrzymany',
                    message: `${transport.name} został zatrzymany na trasie ${transport.route}`,
                    severity: 'medium',
                    transportName: transport.name,
                    autoRemove: false
                });
            }
        });
    }, [activeTransports, addNotification]);

    const showNotification = (type, title, message, options = {}) => {
        addNotification({
            type,
            title,
            message,
            severity: options.severity || 'medium',
            duration: options.duration || 5000,
            autoRemove: options.autoRemove !== false,
            ...options
        });
    };

    const showSuccess = (title, message, options = {}) => {
        showNotification('success', title, message, { ...options, severity: 'low' });
    };

    const showError = (title, message, options = {}) => {
        showNotification('error', title, message, { ...options, severity: 'high', autoRemove: false });
    };

    const showWarning = (title, message, options = {}) => {
        showNotification('warning', title, message, { ...options, severity: 'medium' });
    };

    const showInfo = (title, message, options = {}) => {
        showNotification('info', title, message, { ...options, severity: 'low' });
    };

    const clearAllNotifications = () => {
        notifications.forEach(notification => {
            removeNotification(notification.id);
        });
    };

    const value = {
        notifications,
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
        clearAllNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

// Komponent wyświetlający powiadomienia
const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotifications();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map(notification => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

const NotificationItem = ({ notification, onClose }) => {
    const { type, title, message, severity } = notification;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-100 border-green-500 text-green-800';
            case 'error':
                return 'bg-red-100 border-red-500 text-red-800';
            case 'warning':
                return 'bg-yellow-100 border-yellow-500 text-yellow-800';
            case 'alert':
                return severity === 'high' ? 'bg-red-100 border-red-500 text-red-800' :
                    severity === 'medium' ? 'bg-orange-100 border-orange-500 text-orange-800' :
                        'bg-blue-100 border-blue-500 text-blue-800';
            default:
                return 'bg-blue-100 border-blue-500 text-blue-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'alert':
                return '🚨';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className={`p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${getTypeStyles()}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center">
                        <span className="mr-2">{getIcon()}</span>
                        <h4 className="font-semibold">{title}</h4>
                    </div>
                    <p className="mt-1 text-sm">{message}</p>
                    {notification.transportName && (
                        <p className="mt-1 text-xs opacity-75">
                            Transport: {notification.transportName}
                        </p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

// Pomocnicze funkcje
const getAlertTitle = (alertType) => {
    switch (alertType) {
        case 'traffic':
            return 'Problem z ruchem';
        case 'infrastructure':
            return 'Problem z infrastrukturą';
        case 'weather':
            return 'Ostrzeżenie pogodowe';
        case 'mechanical':
            return 'Problem techniczny';
        case 'security':
            return 'Alert bezpieczeństwa';
        default:
            return 'Nowy alert';
    }
};