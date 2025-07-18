import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import MilitaryLogisticsSystem from './components/MilitaryLogisticsSystem';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NotificationProvider>
                    <Router future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true
                    }}>
                        <div className="App">
                            <Routes>
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute>
                                            <MilitaryLogisticsSystem />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <DashboardPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/reports"
                                    element={
                                        <ProtectedRoute>
                                            <ReportsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <ProtectedRoute>
                                            <SettingsPage />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </div>
                    </Router>
                </NotificationProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;