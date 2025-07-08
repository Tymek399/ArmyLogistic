import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { debounce, throttle, loadFromLocalStorage, saveToLocalStorage } from '../utils/helpers';

// =============================================================================
// HOOK DO LOKALNEGO STORAGE
// =============================================================================

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        return loadFromLocalStorage(key, initialValue);
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            saveToLocalStorage(key, valueToStore);
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
};

// =============================================================================
// HOOK DO DEBOUNCED VALUE
// =============================================================================

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// =============================================================================
// HOOK DO THROTTLED CALLBACK
// =============================================================================

export const useThrottle = (callback, delay) => {
    const throttledCallback = useMemo(
        () => throttle(callback, delay),
        [callback, delay]
    );

    return throttledCallback;
};

// =============================================================================
// HOOK DO ASYNC OPERATIONS
// =============================================================================

export const useAsync = (asyncFunction, dependencies = []) => {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        asyncFunction()
            .then(data => {
                setState({ data, loading: false, error: null });
            })
            .catch(error => {
                setState({ data: null, loading: false, error });
            });
    }, dependencies);

    return state;
};

// =============================================================================
// HOOK DO API CALLS Z RETRY
// =============================================================================

export const useApiCall = (apiCall, options = {}) => {
    const {
        immediate = true,
        retries = 3,
        retryDelay = 1000,
        onSuccess,
        onError
    } = options;

    const [state, setState] = useState({
        data: null,
        loading: immediate,
        error: null,
        isRetrying: false
    });

    const execute = useCallback(async (params) => {
        setState(prev => ({ ...prev, loading: true, error: null, isRetrying: false }));

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const data = await apiCall(params);
                setState({ data, loading: false, error: null, isRetrying: false });

                if (onSuccess) {
                    onSuccess(data);
                }

                return data;
            } catch (error) {
                if (attempt === retries) {
                    setState({ data: null, loading: false, error, isRetrying: false });

                    if (onError) {
                        onError(error);
                    }

                    throw error;
                } else {
                    setState(prev => ({ ...prev, isRetrying: true }));
                    await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
                }
            }
        }
    }, [apiCall, retries, retryDelay, onSuccess, onError]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, []);

    return {
        ...state,
        execute,
        refetch: () => execute()
    };
};

// =============================================================================
// HOOK DO GEOLOCATION
// =============================================================================

export const useGeolocation = (options = {}) => {
    const [state, setState] = useState({
        position: null,
        error: null,
        loading: true
    });

    const {
        enableHighAccuracy = true,
        timeout = 10000,
        maximumAge = 0,
        watch = false
    } = options;

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({
                position: null,
                error: new Error('Geolocation is not supported'),
                loading: false
            });
            return;
        }

        const handleSuccess = (position) => {
            setState({
                position: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                },
                error: null,
                loading: false
            });
        };

        const handleError = (error) => {
            setState({
                position: null,
                error,
                loading: false
            });
        };

        const geoOptions = {
            enableHighAccuracy,
            timeout,
            maximumAge
        };

        let watchId;

        if (watch) {
            watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions);
        } else {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions);
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [enableHighAccuracy, timeout, maximumAge, watch]);

    return state;
};

// =============================================================================
// HOOK DO INTERSECTION OBSERVER
// =============================================================================

export const useIntersectionObserver = (elementRef, options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);

            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true);
            }
        }, options);

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [elementRef, options, hasIntersected]);

    return { isIntersecting, hasIntersected };
};

// =============================================================================
// HOOK DO WINDOW SIZE
// =============================================================================

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
        isMobile: false,
        isTablet: false,
        isDesktop: false
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setWindowSize({
                width,
                height,
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

// =============================================================================
// HOOK DO CLICK OUTSIDE
// =============================================================================

export const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

// =============================================================================
// HOOK DO KEYBOARD SHORTCUTS
// =============================================================================

export const useKeyboardShortcut = (keys, callback, deps = []) => {
    const keysRef = useRef(keys);
    const callbackRef = useRef(callback);

    useEffect(() => {
        keysRef.current = keys;
        callbackRef.current = callback;
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (keysRef.current.every(key => {
                switch (key) {
                    case 'ctrl':
                        return event.ctrlKey;
                    case 'alt':
                        return event.altKey;
                    case 'shift':
                        return event.shiftKey;
                    case 'meta':
                        return event.metaKey;
                    default:
                        return event.key.toLowerCase() === key.toLowerCase();
                }
            })) {
                event.preventDefault();
                callbackRef.current(event);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, deps);
};

// =============================================================================
// HOOK DO PREVIOUS VALUE
// =============================================================================

export const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

// =============================================================================
// HOOK DO INTERVAL
// =============================================================================

export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

// =============================================================================
// HOOK DO TIMEOUT
// =============================================================================

export const useTimeout = (callback, delay) => {
    const savedCallback = useRef(callback);
    const timeoutRef = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    const start = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            savedCallback.current();
        }, delay);
    }, [delay]);

    const clear = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        return clear;
    }, [clear]);

    return { start, clear };
};

// =============================================================================
// HOOK DO FETCH WITH CACHE
// =============================================================================

export const useFetchWithCache = (url, options = {}) => {
    const { cacheTime = 5 * 60 * 1000 } = options; // 5 minut domyślnie
    const cacheRef = useRef(new Map());

    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null,
        fromCache: false
    });

    useEffect(() => {
        const fetchData = async () => {
            const cache = cacheRef.current;
            const cached = cache.get(url);

            if (cached && Date.now() - cached.timestamp < cacheTime) {
                setState({
                    data: cached.data,
                    loading: false,
                    error: null,
                    fromCache: true
                });
                return;
            }

            setState(prev => ({ ...prev, loading: true, fromCache: false }));

            try {
                const response = await fetch(url, options);
                const data = await response.json();

                cache.set(url, {
                    data,
                    timestamp: Date.now()
                });

                setState({
                    data,
                    loading: false,
                    error: null,
                    fromCache: false
                });
            } catch (error) {
                setState({
                    data: null,
                    loading: false,
                    error,
                    fromCache: false
                });
            }
        };

        fetchData();
    }, [url, cacheTime]);

    const clearCache = useCallback(() => {
        cacheRef.current.clear();
    }, []);

    return { ...state, clearCache };
};

// =============================================================================
// HOOK DO ONLINE STATUS
// =============================================================================

export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};

// =============================================================================
// HOOK DO FORM VALIDATION
// =============================================================================

export const useFormValidation = (initialValues, validationRules) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validate = useCallback((fieldName, value) => {
        const rules = validationRules[fieldName];
        if (!rules) return '';

        for (const rule of rules) {
            const error = rule(value, values);
            if (error) return error;
        }
        return '';
    }, [validationRules, values]);

    const setFieldValue = useCallback((fieldName, value) => {
        setValues(prev => ({ ...prev, [fieldName]: value }));

        if (touched[fieldName]) {
            const error = validate(fieldName, value);
            setErrors(prev => ({ ...prev, [fieldName]: error }));
        }
    }, [validate, touched]);

    const setFieldTouched = useCallback((fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));

        const error = validate(fieldName, values[fieldName]);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    }, [validate, values]);

    const validateAll = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            const error = validate(fieldName, values[fieldName]);
            newErrors[fieldName] = error;
            if (error) isValid = false;
        });

        setErrors(newErrors);
        setTouched(Object.keys(validationRules).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {}));

        return isValid;
    }, [validate, values, validationRules]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    const isValid = useMemo(() => {
        return Object.values(errors).every(error => !error);
    }, [errors]);

    return {
        values,
        errors,
        touched,
        isValid,
        setFieldValue,
        setFieldTouched,
        validateAll,
        reset
    };
};

// =============================================================================
// HOOK DO PAGINATION
// =============================================================================

export const usePagination = (data, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const goToPage = useCallback((page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return {
        currentData,
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        goToPage,
        nextPage,
        prevPage
    };
};

// =============================================================================
// HOOK DO WEBSOCKET
// =============================================================================

export const useWebSocket = (url, options = {}) => {
    const [socket, setSocket] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [readyState, setReadyState] = useState(WebSocket.CONNECTING);

    const {
        onOpen,
        onClose,
        onMessage,
        onError,
        reconnectAttempts = 5,
        reconnectInterval = 3000
    } = options;

    useEffect(() => {
        let ws;
        let reconnectCount = 0;

        const connect = () => {
            ws = new WebSocket(url);
            setSocket(ws);

            ws.onopen = (event) => {
                setReadyState(WebSocket.OPEN);
                reconnectCount = 0;
                if (onOpen) onOpen(event);
            };

            ws.onclose = (event) => {
                setReadyState(WebSocket.CLOSED);
                if (onClose) onClose(event);

                if (reconnectCount < reconnectAttempts) {
                    setTimeout(() => {
                        reconnectCount++;
                        connect();
                    }, reconnectInterval);
                }
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setLastMessage(message);
                if (onMessage) onMessage(message);
            };

            ws.onerror = (event) => {
                setReadyState(WebSocket.CLOSED);
                if (onError) onError(event);
            };
        };

        connect();

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [url]);

    const sendMessage = useCallback((message) => {
        if (socket && readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    }, [socket, readyState]);

    return {
        sendMessage,
        lastMessage,
        readyState,
        isConnected: readyState === WebSocket.OPEN
    };
};

export default {
    useLocalStorage,
    useDebounce,
    useThrottle,
    useAsync,
    useApiCall,
    useGeolocation,
    useIntersectionObserver,
    useWindowSize,
    useClickOutside,
    useKeyboardShortcut,
    usePrevious,
    useInterval,
    useTimeout,
    useFetchWithCache,
    useOnlineStatus,
    useFormValidation,
    usePagination,
    useWebSocket
};