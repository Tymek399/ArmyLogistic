import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
    const { isAuthenticated, user, hasPermission } = useAuth();
    const location = useLocation();

    // Loading state - możesz dodać spinner
    if (user === undefined) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
                    <div className="text-lg font-medium text-gray-700">Ładowanie...</div>
                    <div className="text-sm text-gray-500">Sprawdzanie uprawnień użytkownika</div>
                </div>
            </div>
        );
    }

    // Jeśli nie zalogowany, przekieruj do logowania
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Jeśli wymagane są określone uprawnienia
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <UnauthorizedPage />;
    }

    return children;
};

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Brak uprawnień
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Nie masz uprawnień do przeglądania tej strony. Skontaktuj się z administratorem systemu.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Wróć
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProtectedRoute;