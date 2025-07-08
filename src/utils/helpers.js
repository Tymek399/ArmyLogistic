import { format, formatDistance, isToday, isYesterday, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

// =============================================================================
// FORMATOWANIE DAT I CZASU
// =============================================================================

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: pl });
};

export const formatDateTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: pl });
};

export const formatTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'HH:mm', { locale: pl });
};

export const formatRelativeTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();

    if (isToday(dateObj)) {
        return `Dzisiaj o ${formatTime(dateObj)}`;
    }

    if (isYesterday(dateObj)) {
        return `Wczoraj o ${formatTime(dateObj)}`;
    }

    return formatDistance(dateObj, now, {
        addSuffix: true,
        locale: pl
    });
};

export const formatDuration = (seconds) => {
    if (!seconds || seconds < 0) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
};

// =============================================================================
// FORMATOWANIE LICZB I JEDNOSTEK
// =============================================================================

export const formatNumber = (num, decimals = 0) => {
    if (num === null || num === undefined) return '';
    return new Intl.NumberFormat('pl-PL', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
};

export const formatCurrency = (amount, currency = 'PLN') => {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

export const formatDistance = (distanceInKm) => {
    if (!distanceInKm || distanceInKm < 0) return '0 km';

    if (distanceInKm < 1) {
        return `${Math.round(distanceInKm * 1000)} m`;
    }

    return `${formatNumber(distanceInKm, 1)} km`;
};

export const formatWeight = (weightInKg) => {
    if (!weightInKg || weightInKg < 0) return '0 kg';

    if (weightInKg >= 1000) {
        return `${formatNumber(weightInKg / 1000, 1)} t`;
    }

    return `${formatNumber(weightInKg)} kg`;
};

export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${formatNumber(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
};

// =============================================================================
// WALIDACJA
// =============================================================================

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+48\s?)?(\d{3}\s?\d{3}\s?\d{3}|\d{9})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidPassword = (password) => {
    // Co najmniej 8 znaków, jedna wielka litera, jedna mała, jedna cyfra
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const validateCoordinates = (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    return !isNaN(latitude) &&
        !isNaN(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180;
};

// =============================================================================
// MANIPULACJA STRINGÓW
// =============================================================================

export const truncateText = (text, maxLength = 100, suffix = '...') => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

export const slugify = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[ąćęłńóśźż]/g, (match) => {
            const polishChars = {
                'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
                'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
            };
            return polishChars[match] || match;
        })
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// =============================================================================
// PRACA Z TABLICAMI I OBIEKTAMI
// =============================================================================

export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = typeof key === 'function' ? key(a) : a[key];
        const bVal = typeof key === 'function' ? key(b) : b[key];

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

export const filterBy = (array, filters) => {
    return array.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === '' || value === null || value === undefined) return true;

            const itemValue = item[key];

            if (typeof value === 'string') {
                return itemValue.toString().toLowerCase().includes(value.toLowerCase());
            }

            if (Array.isArray(value)) {
                return value.includes(itemValue);
            }

            return itemValue === value;
        });
    });
};

export const uniqueBy = (array, key) => {
    const seen = new Set();
    return array.filter(item => {
        const value = typeof key === 'function' ? key(item) : item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
};

export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));

    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
};

// =============================================================================
// GEO I MAPY
// =============================================================================

export const calculateDistance = (point1, point2) => {
    const R = 6371; // Promień Ziemi w km
    const dLat = toRadians(point2.lat - point1.lat);
    const dLng = toRadians(point2.lng - point1.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

export const getBounds = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return null;

    const lats = coordinates.map(coord => coord.lat);
    const lngs = coordinates.map(coord => coord.lng);

    return {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs)
    };
};

export const isPointInBounds = (point, bounds) => {
    return point.lat >= bounds.south &&
        point.lat <= bounds.north &&
        point.lng >= bounds.west &&
        point.lng <= bounds.east;
};

// =============================================================================
// STORAGE
// =============================================================================

export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
};

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

// =============================================================================
// URL I ROUTING
// =============================================================================

export const buildUrl = (baseUrl, params = {}) => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.append(key, value);
        }
    });
    return url.toString();
};

export const parseUrlParams = (searchString) => {
    const params = new URLSearchParams(searchString);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
};

// =============================================================================
// DEBOUNCE I THROTTLE
// =============================================================================

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// =============================================================================
// KOLORY I STYLE
// =============================================================================

export const getStatusColor = (status) => {
    const colors = {
        'W drodze': 'green',
        'Zatrzymany': 'red',
        'Zakończony': 'gray',
        'Planowany': 'blue',
        'Anulowany': 'red',
        'Opóźniony': 'yellow'
    };
    return colors[status] || 'gray';
};

export const getAlertColor = (severity) => {
    const colors = {
        'critical': 'red',
        'high': 'orange',
        'medium': 'yellow',
        'low': 'blue'
    };
    return colors[severity] || 'gray';
};

export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

// =============================================================================
// EXPORT PLIKÓW
// =============================================================================

export const downloadFile = (data, filename, type = 'text/plain') => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const downloadJSON = (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, `${filename}.json`, 'application/json');
};

export const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',')
                ? `"${value}"`
                : value;
        }).join(','))
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

// =============================================================================
// DEVICE I BROWSER
// =============================================================================

export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback dla starszych przeglądarek
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    }
};

// =============================================================================
// ERROR HANDLING
// =============================================================================

export const handleApiError = (error) => {
    if (error.response) {
        // Błąd z odpowiedzią serwera
        const { status, data } = error.response;
        return {
            message: data?.message || `Błąd HTTP ${status}`,
            status,
            type: 'api_error'
        };
    } else if (error.request) {
        // Błąd sieci
        return {
            message: 'Brak połączenia z serwerem',
            type: 'network_error'
        };
    } else {
        // Inny błąd
        return {
            message: error.message || 'Wystąpił nieoczekiwany błąd',
            type: 'unknown_error'
        };
    }
};

export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;

            const delay = baseDelay * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

export default {
    // Date & Time
    formatDate,
    formatDateTime,
    formatTime,
    formatRelativeTime,
    formatDuration,

    // Numbers & Units
    formatNumber,
    formatCurrency,
    formatDistance,
    formatWeight,
    formatFileSize,

    // Validation
    isValidEmail,
    isValidPhone,
    isValidPassword,
    validateCoordinates,

    // Strings
    truncateText,
    capitalizeFirst,
    capitalizeWords,
    slugify,
    generateId,

    // Arrays & Objects
    groupBy,
    sortBy,
    filterBy,
    uniqueBy,
    deepClone,

    // Geo & Maps
    calculateDistance,
    getBounds,
    isPointInBounds,

    // Storage
    saveToLocalStorage,
    loadFromLocalStorage,
    removeFromLocalStorage,

    // Utils
    debounce,
    throttle,
    getStatusColor,
    getAlertColor,
    downloadFile,
    downloadJSON,
    downloadCSV,
    isMobile,
    copyToClipboard,
    handleApiError,
    retryWithBackoff
};