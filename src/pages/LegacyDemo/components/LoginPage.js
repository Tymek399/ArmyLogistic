import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Lock, AlertCircle, Loader } from 'lucide-react';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();

    // Przekieruj jeśli już zalogowany
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(credentials);
            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError('Wystąpił nieoczekiwany błąd');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const quickLogin = (userType) => {
        const credentials = {
            admin: { username: 'admin', password: 'admin123' },
            operator: { username: 'operator', password: 'operator123' },
            planner: { username: 'planner', password: 'planner123' }
        };

        setCredentials(credentials[userType]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                        <Shield className="w-8 h-8 text-green-700" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        System Logistyki Militarnej
                    </h1>
                    <p className="text-green-100">
                        Zaloguj się aby uzyskać dostęp do systemu
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nazwa użytkownika
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Wprowadź nazwę użytkownika"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hasło
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Wprowadź hasło"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin mr-2" />
                                    Logowanie...
                                </>
                            ) : (
                                'Zaloguj się'
                            )}
                        </button>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Demo - Szybkie logowanie:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => quickLogin('admin')}
                                className="text-xs py-2 px-3 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                                Admin
                            </button>
                            <button
                                onClick={() => quickLogin('operator')}
                                className="text-xs py-2 px-3 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                                Operator
                            </button>
                            <button
                                onClick={() => quickLogin('planner')}
                                className="text-xs py-2 px-3 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                                Planista
                            </button>
                        </div>
                    </div>

                    {/* Credentials Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Dane testowe:</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                            <div><strong>Admin:</strong> admin / admin123</div>
                            <div><strong>Operator:</strong> operator / operator123</div>
                            <div><strong>Planista:</strong> planner / planner123</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-green-100 text-sm">
                        © 2025 System Logistyki Militarnej. Wszystkie prawa zastrzeżone.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;