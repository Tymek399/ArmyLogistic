import React, { createContext, useContext, useEffect } from 'react';
import useStore from '../store/userStore';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const { user, isAuthenticated, setUser, logout, setLoading } = useStore();

    // Sprawdź czy użytkownik jest zalogowany przy ładowaniu aplikacji
    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            try {
                const savedUser = localStorage.getItem('military_logistics_user');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    // Sprawdź czy token jest ważny
                    if (userData.token && isTokenValid(userData.token)) {
                        setUser(userData);
                    } else {
                        localStorage.removeItem('military_logistics_user');
                    }
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                localStorage.removeItem('military_logistics_user');
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [setUser, setLoading]);

    const login = async (credentials) => {
        setLoading(true);
        try {
            // Symulacja API call
            const response = await simulateLogin(credentials);

            if (response.success) {
                const userData = {
                    id: response.user.id,
                    username: response.user.username,
                    role: response.user.role,
                    permissions: response.user.permissions,
                    token: response.token,
                    loginTime: new Date().toISOString()
                };

                setUser(userData);
                localStorage.setItem('military_logistics_user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Błąd połączenia z serwerem' };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem('military_logistics_user');
    };

    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) || user?.role === 'admin';
    };

    const value = {
        user,
        isAuthenticated,
        login,
        logout: handleLogout,
        hasPermission
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Pomocnicze funkcje
const isTokenValid = (token) => {
    try {
        // W prawdziwej aplikacji sprawdzaj JWT token
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

const simulateLogin = async (credentials) => {
    // Symulacja opóźnienia API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Domyślne dane logowania dla demonstracji
    const validCredentials = [
        {
            username: 'admin',
            password: 'admin123',
            user: {
                id: 1,
                username: 'admin',
                role: 'admin',
                fullName: 'Administrator Systemu',
                permissions: ['all']
            }
        },
        {
            username: 'operator',
            password: 'operator123',
            user: {
                id: 2,
                username: 'operator',
                role: 'operator',
                fullName: 'Operator Logistyczny',
                permissions: ['view_transports', 'manage_routes', 'view_reports']
            }
        },
        {
            username: 'planner',
            password: 'planner123',
            user: {
                id: 3,
                username: 'planner',
                role: 'planner',
                fullName: 'Planista Tras',
                permissions: ['plan_routes', 'view_transports', 'manage_transport_sets']
            }
        }
    ];

    const validUser = validCredentials.find(
        cred => cred.username === credentials.username && cred.password === credentials.password
    );

    if (validUser) {
        return {
            success: true,
            user: validUser.user,
            token: generateMockJWT(validUser.user)
        };
    } else {
        return {
            success: false,
            error: 'Nieprawidłowe dane logowania'
        };
    }
};

const generateMockJWT = (user) => {
    // Symulacja JWT token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        userId: user.id,
        username: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 godziny
    }));
    const signature = btoa('mock_signature');

    return `${header}.${payload}.${signature}`;
};