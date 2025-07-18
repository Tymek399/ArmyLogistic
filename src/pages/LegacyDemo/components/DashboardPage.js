import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/userStore';
import { useAuth } from '../context/AuthContext';
import {
    Truck,
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    MapPin,
    Router,
    Package,
    Users,
    Activity,
    Calendar,
    BarChart3,
    PieChart,
    Plus
} from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();
    const {
        activeTransports,
        transportSets,
        alerts,
        setActiveView
    } = useStore();

    const [stats, setStats] = useState({
        totalTransports: 0,
        activeTransports: 0,
        completedToday: 0,
        delayedTransports: 0,
        totalDistance: 0,
        avgDeliveryTime: 0,
        fuelEfficiency: 0,
        alertsCount: 0
    });

    useEffect(() => {
        calculateStats();
    }, [activeTransports, alerts]);

    const calculateStats = () => {
        const total = activeTransports.length;
        const active = activeTransports.filter(t => t.status === 'W drodze').length;
        const completed = activeTransports.filter(t => t.progress >= 100).length;
        const delayed = activeTransports.filter(t => t.status === 'Zatrzymany').length;
        const totalDist = activeTransports.reduce((sum, t) => sum + t.distanceCovered + t.distanceRemaining, 0);
        const alertsCount = alerts.filter(a => a.status !== 'resolved').length;

        setStats({
            totalTransports: total,
            activeTransports: active,
            completedToday: completed,
            delayedTransports: delayed,
            totalDistance: totalDist,
            avgDeliveryTime: 4.5, // Przykładowa wartość
            fuelEfficiency: 8.2, // Przykładowa wartość
            alertsCount
        });
    };

    const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    {trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% vs poprzedni tydzień
          </span>
                </div>
            )}
        </div>
    );

    const QuickActionCard = ({ title, description, icon: Icon, onClick, color = 'green' }) => (
        <button
            onClick={onClick}
            className={`w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left group`}
        >
            <div className="flex items-start">
                <div className={`p-2 rounded-lg bg-${color}-100 mr-4 group-hover:bg-${color}-200 transition-colors`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-green-700">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
            </div>
        </button>
    );

    const RecentActivityItem = ({ activity }) => (
        <div className="flex items-start space-x-3 py-3">
            <div className={`p-1 rounded-full ${
                activity.type === 'transport' ? 'bg-blue-100' :
                    activity.type === 'alert' ? 'bg-red-100' :
                        activity.type === 'complete' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
                {activity.type === 'transport' && <Truck className="w-4 h-4 text-blue-600" />}
                {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                {activity.type === 'complete' && <CheckCircle className="w-4 h-4 text-green-600" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
        </div>
    );

    const recentActivities = [
        {
            id: 1,
            type: 'transport',
            title: 'Nowy transport utworzony',
            description: 'Transport Delta - Warszawa → Gdańsk',
            time: '15 minut temu'
        },
        {
            id: 2,
            type: 'alert',
            title: 'Alert ruchu drogowego',
            description: 'Korki na A1 - automatycznie ominięte',
            time: '32 minuty temu'
        },
        {
            id: 3,
            type: 'complete',
            title: 'Transport zakończony',
            description: 'Transport Alpha dotarł do celu',
            time: '1 godzinę temu'
        },
        {
            id: 4,
            type: 'transport',
            title: 'Aktualizacja trasy',
            description: 'Transport Bravo - nowa trasa zoptymalizowana',
            time: '2 godziny temu'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Panel główny
                                </h1>
                                <p className="text-gray-600">
                                    Witaj z powrotem, {user?.fullName || user?.username}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-sm text-gray-500">
                                    Ostatnia aktualizacja: {new Date().toLocaleTimeString('pl-PL')}
                                </div>
                                <Link
                                    to="/"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Przejdź do mapy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Aktywne transporty"
                        value={stats.activeTransports}
                        subtitle={`z ${stats.totalTransports} łącznie`}
                        icon={Truck}
                        trend={12}
                        color="blue"
                    />
                    <StatCard
                        title="Zakończone dzisiaj"
                        value={stats.completedToday}
                        subtitle="transporty"
                        icon={CheckCircle}
                        trend={8}
                        color="green"
                    />
                    <StatCard
                        title="Opóźnione"
                        value={stats.delayedTransports}
                        subtitle="wymagają uwagi"
                        icon={Clock}
                        trend={-15}
                        color="red"
                    />
                    <StatCard
                        title="Aktywne alerty"
                        value={stats.alertsCount}
                        subtitle="do rozwiązania"
                        icon={AlertTriangle}
                        trend={-25}
                        color="yellow"
                    />
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Metryki wydajności
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Całkowity dystans</span>
                                <span className="font-medium">{stats.totalDistance} km</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Średni czas dostawy</span>
                                <span className="font-medium">{stats.avgDeliveryTime}h</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Efektywność paliwowa</span>
                                <span className="font-medium">{stats.fuelEfficiency} l/100km</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Dostępne zestawy</span>
                                <span className="font-medium">{transportSets.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Status transportów
                        </h3>
                        <div className="space-y-3">
                            {activeTransports.slice(0, 3).map(transport => (
                                <div key={transport.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-sm">{transport.name}</p>
                                        <p className="text-xs text-gray-600">{transport.route}</p>
                                    </div>
                                    <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        transport.status === 'W drodze' ? 'bg-green-100 text-green-800' :
                            transport.status === 'Zatrzymany' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                    }`}>
                      {transport.status}
                    </span>
                                        <p className="text-xs text-gray-500 mt-1">{transport.progress}%</p>
                                    </div>
                                </div>
                            ))}
                            {activeTransports.length > 3 && (
                                <button
                                    onClick={() => setActiveView('operator')}
                                    className="w-full text-center text-sm text-green-600 hover:text-green-700 py-2"
                                >
                                    Zobacz wszystkie ({activeTransports.length - 3} więcej)
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Ostatnia aktywność
                        </h3>
                        <div className="space-y-1">
                            {recentActivities.slice(0, 4).map(activity => (
                                <RecentActivityItem key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <QuickActionCard
                        title="Nowy transport"
                        description="Utwórz nowy transport"
                        icon={Plus}
                        onClick={() => setActiveView('planner')}
                        color="green"
                    />
                    <QuickActionCard
                        title="Zobacz mapę"
                        description="Monitor transportów"
                        icon={MapPin}
                        onClick={() => setActiveView('operator')}
                        color="blue"
                    />
                    <QuickActionCard
                        title="Planowanie tras"
                        description="Optymalizuj trasy"
                        icon={Router}
                        onClick={() => setActiveView('planner')}
                        color="purple"
                    />
                    <QuickActionCard
                        title="Raporty"
                        description="Analizy i statystyki"
                        icon={BarChart3}
                        onClick={() => window.location.href = '/reports'}
                        color="orange"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Transporty w czasie
                            </h3>
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Wykres będzie dostępny po integracji z biblioteką wykresów</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Rozkład typów ładunków
                            </h3>
                            <PieChart className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Wykres kołowy typów ładunków</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;