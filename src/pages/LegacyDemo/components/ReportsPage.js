import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useStore from '../store/userStore';
import {
    FileText,
    Download,
    Calendar,
    Filter,
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    MapPin,
    Clock,
    Truck,
    AlertTriangle,
    CheckCircle,
    Fuel,
    DollarSign,
    Users,
    Package
} from 'lucide-react';

const ReportsPage = () => {
    const { user } = useAuth();
    const { activeTransports, transportSets, alerts } = useStore();

    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedReport, setSelectedReport] = useState('overview');
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const [reportData, setReportData] = useState({
        transportStats: {
            total: 0,
            completed: 0,
            inProgress: 0,
            delayed: 0,
            cancelled: 0
        },
        performanceMetrics: {
            avgDeliveryTime: 0,
            onTimeDeliveryRate: 0,
            fuelEfficiency: 0,
            costPerKm: 0,
            utilizationRate: 0
        },
        routeAnalysis: {
            mostUsedRoutes: [],
            avgDistance: 0,
            totalDistance: 0,
            routeOptimizations: 0
        },
        alertsSummary: {
            total: 0,
            byType: {},
            byStatus: {},
            avgResolutionTime: 0
        }
    });

    useEffect(() => {
        generateReportData();
    }, [activeTransports, transportSets, alerts, selectedPeriod, dateRange]);

    const generateReportData = () => {
        // Symulacja generowania danych raportu
        const transportStats = {
            total: activeTransports.length + 45, // Dodatkowe zakończone transporty
            completed: 42,
            inProgress: activeTransports.filter(t => t.status === 'W drodze').length,
            delayed: activeTransports.filter(t => t.status === 'Zatrzymany').length,
            cancelled: 3
        };

        const performanceMetrics = {
            avgDeliveryTime: 4.2,
            onTimeDeliveryRate: 87.5,
            fuelEfficiency: 8.3,
            costPerKm: 2.45,
            utilizationRate: 74.2
        };

        const routeAnalysis = {
            mostUsedRoutes: [
                { route: 'Warszawa → Kraków', count: 12, avgTime: '3h 45m' },
                { route: 'Gdańsk → Wrocław', count: 8, avgTime: '5h 20m' },
                { route: 'Poznań → Katowice', count: 6, avgTime: '4h 15m' }
            ],
            avgDistance: 285,
            totalDistance: 14250,
            routeOptimizations: 18
        };

        const alertsSummary = {
            total: alerts.length + 23,
            byType: {
                traffic: 15,
                infrastructure: 8,
                weather: 4,
                mechanical: 6,
                security: 2
            },
            byStatus: {
                resolved: 28,
                'auto-resolved': 12,
                pending: 3
            },
            avgResolutionTime: 1.8
        };

        setReportData({
            transportStats,
            performanceMetrics,
            routeAnalysis,
            alertsSummary
        });
    };

    const exportReport = (format) => {
        // Symulacja eksportu raportu
        const filename = `raport_logistyczny_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.${format}`;
        alert(`Eksportowanie raportu: ${filename}`);
    };

    const ReportCard = ({ title, children, className = "" }) => (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            {children}
        </div>
    );

    const MetricItem = ({ label, value, unit, trend, icon: Icon, color = 'blue' }) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${color}-100 mr-3`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="text-right">
                <div className="flex items-center">
          <span className="text-lg font-bold text-gray-900">
            {value} {unit && <span className="text-sm font-normal">{unit}</span>}
          </span>
                    {trend && (
                        <div className="ml-2 flex items-center">
                            {trend > 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-xs ml-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}%
              </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const OverviewReport = () => (
        <div className="space-y-6">
            <ReportCard title="Statystyki transportów">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportData.transportStats.total}</div>
                        <div className="text-sm text-blue-700">Łącznie</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reportData.transportStats.completed}</div>
                        <div className="text-sm text-green-700">Zakończone</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportData.transportStats.inProgress}</div>
                        <div className="text-sm text-yellow-700">W trakcie</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{reportData.transportStats.delayed}</div>
                        <div className="text-sm text-red-700">Opóźnione</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">{reportData.transportStats.cancelled}</div>
                        <div className="text-sm text-gray-700">Anulowane</div>
                    </div>
                </div>
            </ReportCard>

            <ReportCard title="Metryki wydajności">
                <div className="space-y-3">
                    <MetricItem
                        label="Średni czas dostawy"
                        value={reportData.performanceMetrics.avgDeliveryTime}
                        unit="h"
                        trend={-8}
                        icon={Clock}
                        color="blue"
                    />
                    <MetricItem
                        label="Punktualność dostaw"
                        value={reportData.performanceMetrics.onTimeDeliveryRate}
                        unit="%"
                        trend={5}
                        icon={CheckCircle}
                        color="green"
                    />
                    <MetricItem
                        label="Efektywność paliwowa"
                        value={reportData.performanceMetrics.fuelEfficiency}
                        unit="l/100km"
                        trend={-3}
                        icon={Fuel}
                        color="orange"
                    />
                    <MetricItem
                        label="Koszt na km"
                        value={reportData.performanceMetrics.costPerKm}
                        unit="zł"
                        trend={2}
                        icon={DollarSign}
                        color="purple"
                    />
                    <MetricItem
                        label="Wykorzystanie floty"
                        value={reportData.performanceMetrics.utilizationRate}
                        unit="%"
                        trend={12}
                        icon={Truck}
                        color="indigo"
                    />
                </div>
            </ReportCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReportCard title="Analiza tras">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-blue-50 rounded">
                                <div className="text-xl font-bold text-blue-600">{reportData.routeAnalysis.totalDistance}</div>
                                <div className="text-xs text-blue-700">Łączny dystans (km)</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                                <div className="text-xl font-bold text-green-600">{reportData.routeAnalysis.routeOptimizations}</div>
                                <div className="text-xs text-green-700">Optymalizacje tras</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Najczęściej używane trasy:</h4>
                            {reportData.routeAnalysis.mostUsedRoutes.map((route, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                    <span className="text-sm text-gray-600">{route.route}</span>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{route.count}x</div>
                                        <div className="text-xs text-gray-500">{route.avgTime}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ReportCard>

                <ReportCard title="Podsumowanie alertów">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-red-50 rounded">
                                <div className="text-xl font-bold text-red-600">{reportData.alertsSummary.total}</div>
                                <div className="text-xs text-red-700">Łączna liczba alertów</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded">
                                <div className="text-xl font-bold text-blue-600">{reportData.alertsSummary.avgResolutionTime}</div>
                                <div className="text-xs text-blue-700">Śr. czas rozwiązania (h)</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Alerty według typu:</h4>
                            {Object.entries(reportData.alertsSummary.byType).map(([type, count]) => (
                                <div key={type} className="flex justify-between items-center py-1">
                                    <span className="text-sm text-gray-600 capitalize">{type}</span>
                                    <span className="text-sm font-medium">{count}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Status alertów:</h4>
                            {Object.entries(reportData.alertsSummary.byStatus).map(([status, count]) => (
                                <div key={status} className="flex justify-between items-center py-1">
                                    <span className="text-sm text-gray-600">{status}</span>
                                    <span className="text-sm font-medium">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ReportCard>
            </div>
        </div>
    );

    const DetailedReport = () => (
        <div className="space-y-6">
            <ReportCard title="Szczegółowe dane transportów">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transport
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trasa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Postęp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ETA
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {activeTransports.map((transport) => (
                            <tr key={transport.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {transport.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transport.route}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transport.status === 'W drodze' ? 'bg-green-100 text-green-800' :
                            transport.status === 'Zatrzymany' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                    }`}>
                      {transport.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${transport.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs mt-1">{transport.progress}%</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {transport.eta}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </ReportCard>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Raporty i analizy</h1>
                                <p className="text-gray-600">
                                    Przegląd wydajności i statystyk systemu logistycznego
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => exportReport('pdf')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    PDF
                                </button>
                                <button
                                    onClick={() => exportReport('xlsx')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Typ raportu
                            </label>
                            <select
                                value={selectedReport}
                                onChange={(e) => setSelectedReport(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="overview">Przegląd ogólny</option>
                                <option value="detailed">Szczegółowy</option>
                                <option value="performance">Wydajność</option>
                                <option value="routes">Analiza tras</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Okres
                            </label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="week">Ostatni tydzień</option>
                                <option value="month">Ostatni miesiąc</option>
                                <option value="quarter">Ostatni kwartał</option>
                                <option value="year">Ostatni rok</option>
                                <option value="custom">Niestandardowy</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data od
                            </label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data do
                            </label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Report Content */}
                {selectedReport === 'overview' && <OverviewReport />}
                {selectedReport === 'detailed' && <DetailedReport />}
                {selectedReport === 'performance' && <OverviewReport />}
                {selectedReport === 'routes' && <OverviewReport />}
            </div>
        </div>
    );
};

export default ReportsPage;