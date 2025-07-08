import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
    Settings,
    User,
    Bell,
    Map,
    Shield,
    Database,
    Moon,
    Sun,
    Globe,
    Smartphone,
    Mail,
    Lock,
    Key,
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Eye,
    EyeOff
} from 'lucide-react';

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const { showSuccess, showError } = useNotifications();

    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [settings, setSettings] = useState({
        profile: {
            firstName: user?.fullName?.split(' ')[0] || '',
            lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
            email: user?.email || '',
            phone: user?.phone || '',
            position: user?.position || '',
            department: user?.department || ''
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            alertSounds: true,
            transportUpdates: true,
            systemMaintenance: true,
            weeklyReports: true
        },
        display: {
            theme: 'light',
            language: 'pl',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            mapStyle: 'military',
            autoRefresh: true,
            refreshInterval: 30
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: 60,
            passwordExpiry: 90,
            loginNotifications: true,
            deviceTracking: true
        },
        map: {
            defaultZoom: 6,
            defaultCenter: { lat: 52.0693, lng: 19.4803 },
            showTrafficLayer: true,
            showWeatherLayer: false,
            animateMarkers: true,
            clusterMarkers: true,
            autoFollowTransports: false
        },
        system: {
            enableOfflineMode: false,
            dataSyncInterval: 15,
            cacheSize: 100,
            enableAnalytics: true,
            debugMode: false
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadUserSettings();
    }, []);

    const loadUserSettings = async () => {
        // Symulacja ładowania ustawień użytkownika
        try {
            const savedSettings = localStorage.getItem(`settings_${user?.id}`);
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async (section = null) => {
        setIsLoading(true);
        try {
            // Symulacja zapisu ustawień
            await new Promise(resolve => setTimeout(resolve, 1000));

            const settingsToSave = section ? { [section]: settings[section] } : settings;
            localStorage.setItem(`settings_${user?.id}`, JSON.stringify(settingsToSave));

            showSuccess('Ustawienia zapisane', 'Twoje preferencje zostały pomyślnie zaktualizowane');
        } catch (error) {
            showError('Błąd zapisu', 'Nie udało się zapisać ustawień');
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showError('Błąd', 'Hasła nie są identyczne');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            showError('Błąd', 'Hasło musi mieć co najmniej 8 znaków');
            return;
        }

        setIsLoading(true);
        try {
            // Symulacja zmiany hasła
            await new Promise(resolve => setTimeout(resolve, 1500));

            showSuccess('Hasło zmienione', 'Twoje hasło zostało pomyślnie zaktualizowane');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showError('Błąd', 'Nie udało się zmienić hasła');
        } finally {
            setIsLoading(false);
        }
    };

    const resetToDefaults = (section) => {
        const defaultSettings = {
            notifications: {
                emailNotifications: true,
                pushNotifications: true,
                smsNotifications: false,
                alertSounds: true,
                transportUpdates: true,
                systemMaintenance: true,
                weeklyReports: true
            },
            display: {
                theme: 'light',
                language: 'pl',
                dateFormat: 'DD/MM/YYYY',
                timeFormat: '24h',
                mapStyle: 'military',
                autoRefresh: true,
                refreshInterval: 30
            },
            map: {
                defaultZoom: 6,
                defaultCenter: { lat: 52.0693, lng: 19.4803 },
                showTrafficLayer: true,
                showWeatherLayer: false,
                animateMarkers: true,
                clusterMarkers: true,
                autoFollowTransports: false
            }
        };

        if (defaultSettings[section]) {
            setSettings(prev => ({
                ...prev,
                [section]: defaultSettings[section]
            }));
            showSuccess('Przywrócono domyślne', `Ustawienia ${section} zostały przywrócone do wartości domyślnych`);
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === id
                    ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <Icon className="w-5 h-5 mr-3" />
            {label}
        </button>
    );

    const SettingItem = ({ label, description, children }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
            <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <div className="ml-4">
                {children}
            </div>
        </div>
    );

    const ToggleSwitch = ({ enabled, onChange }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-green-600' : 'bg-gray-200'
            }`}
        >
      <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
        </button>
    );

    const ProfileTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dane osobowe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imię</label>
                        <input
                            type="text"
                            value={settings.profile.firstName}
                            onChange={(e) => setSettings(prev => ({
                                ...prev,
                                profile: { ...prev.profile, firstName: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nazwisko</label>
                        <input
                            type="text"
                            value={settings.profile.lastName}
                            onChange={(e) => setSettings(prev => ({
                                ...prev,
                                profile: { ...prev.profile, lastName: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => setSettings(prev => ({
                                ...prev,
                                profile: { ...prev.profile, email: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                        <input
                            type="tel"
                            value={settings.profile.phone}
                            onChange={(e) => setSettings(prev => ({
                                ...prev,
                                profile: { ...prev.profile, phone: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>
                <button
                    onClick={() => saveSettings('profile')}
                    disabled={isLoading}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Zapisz zmiany'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Zmiana hasła</h3>
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Obecne hasło</label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nowe hasło</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Potwierdź nowe hasło</label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <button
                        onClick={changePassword}
                        disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        Zmień hasło
                    </button>
                </div>
            </div>
        </div>
    );

    const NotificationsTab = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Ustawienia powiadomień</h3>
                <button
                    onClick={() => resetToDefaults('notifications')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Przywróć domyślne
                </button>
            </div>

            <div className="space-y-4">
                <SettingItem
                    label="Powiadomienia email"
                    description="Otrzymuj powiadomienia na adres email"
                >
                    <ToggleSwitch
                        enabled={settings.notifications.emailNotifications}
                        onChange={(value) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, emailNotifications: value }
                        }))}
                    />
                </SettingItem>

                <SettingItem
                    label="Powiadomienia push"
                    description="Powiadomienia w przeglądarce"
                >
                    <ToggleSwitch
                        enabled={settings.notifications.pushNotifications}
                        onChange={(value) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, pushNotifications: value }
                        }))}
                    />
                </SettingItem>

                <SettingItem
                    label="Powiadomienia SMS"
                    description="Otrzymuj ważne alerty przez SMS"
                >
                    <ToggleSwitch
                        enabled={settings.notifications.smsNotifications}
                        onChange={(value) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, smsNotifications: value }
                        }))}
                    />
                </SettingItem>

                <SettingItem
                    label="Dźwięki alertów"
                    description="Odtwarzaj dźwięki przy alertach"
                >
                    <ToggleSwitch
                        enabled={settings.notifications.alertSounds}
                        onChange={(value) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, alertSounds: value }
                        }))}
                    />
                </SettingItem>
            </div>

            <button
                onClick={() => saveSettings('notifications')}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
                Zapisz ustawienia
            </button>
        </div>
    );

    const DisplayTab = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Ustawienia wyświetlania</h3>
                <button
                    onClick={() => resetToDefaults('display')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Przywróć domyślne
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Motyw</label>
                    <select
                        value={settings.display.theme}
                        onChange={(e) => setSettings(prev => ({
                            ...prev,
                            display: { ...prev.display, theme: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="light">Jasny</option>
                        <option value="dark">Ciemny</option>
                        <option value="auto">Automatyczny</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Język</label>
                    <select
                        value={settings.display.language}
                        onChange={(e) => setSettings(prev => ({
                            ...prev,
                            display: { ...prev.display, language: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="pl">Polski</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format daty</label>
                    <select
                        value={settings.display.dateFormat}
                        onChange={(e) => setSettings(prev => ({
                            ...prev,
                            display: { ...prev.display, dateFormat: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interwał odświeżania (sekundy)</label>
                    <input
                        type="number"
                        min="10"
                        max="300"
                        value={settings.display.refreshInterval}
                        onChange={(e) => setSettings(prev => ({
                            ...prev,
                            display: { ...prev.display, refreshInterval: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </div>

            <button
                onClick={() => saveSettings('display')}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
                Zapisz ustawienia
            </button>
        </div>
    );

    const MapTab = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Ustawienia mapy</h3>
                <button
                    onClick={() => resetToDefaults('map')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Przywróć domyślne
                </button>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Domyślny zoom</label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={settings.map.defaultZoom}
                            onChange={(e) => setSettings(prev => ({
                                ...prev,
                                map: { ...prev.map, defaultZoom: parseInt(e.target.value) }
                            }))}
                            className="w-full"
                        />
                        <div className="text-sm text-gray-500 mt-1">Zoom: {settings.map.defaultZoom}</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <SettingItem
                        label="Warstwa ruchu"
                        description="Pokazuj informacje o ruchu drogowym"
                    >
                        <ToggleSwitch
                            enabled={settings.map.showTrafficLayer}
                            onChange={(value) => setSettings(prev => ({
                                ...prev,
                                map: { ...prev.map, showTrafficLayer: value }
                            }))}
                        />
                    </SettingItem>

                    <SettingItem
                        label="Animowane markery"
                        description="Animuj markery transportów na mapie"
                    >
                        <ToggleSwitch
                            enabled={settings.map.animateMarkers}
                            onChange={(value) => setSettings(prev => ({
                                ...prev,
                                map: { ...prev.map, animateMarkers: value }
                            }))}
                        />
                    </SettingItem>

                    <SettingItem
                        label="Grupowanie markerów"
                        description="Grupuj markery gdy jest ich dużo"
                    >
                        <ToggleSwitch
                            enabled={settings.map.clusterMarkers}
                            onChange={(value) => setSettings(prev => ({
                                ...prev,
                                map: { ...prev.map, clusterMarkers: value }
                            }))}
                        />
                    </SettingItem>
                </div>
            </div>

            <button
                onClick={() => saveSettings('map')}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
                Zapisz ustawienia
            </button>
        </div>
    );

    const SecurityTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bezpieczeństwo konta</h3>

                <div className="space-y-4">
                    <SettingItem
                        label="Uwierzytelnianie dwuskładnikowe"
                        description="Dodatkowa warstwa bezpieczeństwa dla Twojego konta"
                    >
                        <ToggleSwitch
                            enabled={settings.security.twoFactorAuth}
                            onChange={(value) => setSettings(prev => ({
                                ...prev,
                                security: { ...prev.security, twoFactorAuth: value }
                            }))}
                        />
                    </SettingItem>

                    <SettingItem
                        label="Powiadomienia o logowaniu"
                        description="Otrzymuj powiadomienia o nowych logowaniach"
                    >
                        <ToggleSwitch
                            enabled={settings.security.loginNotifications}
                            onChange={(value) => setSettings(prev => ({
                                ...prev,
                                security: { ...prev.security, loginNotifications: value }
                            }))}
                        />
                    </SettingItem>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Timeout sesji (minuty)
                            </label>
                            <select
                                value={settings.security.sessionTimeout}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            >
                                <option value={30}>30 minut</option>
                                <option value={60}>1 godzina</option>
                                <option value={120}>2 godziny</option>
                                <option value={480}>8 godzin</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => saveSettings('security')}
                    className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    Zapisz ustawienia
                </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold text-red-900">Strefa niebezpieczna</h3>
                </div>
                <p className="text-red-700 mb-4">
                    Te akcje są nieodwracalne. Upewnij się, że rozumiesz ich konsekwencje.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={() => {
                            if (window.confirm('Czy na pewno chcesz wylogować się ze wszystkich urządzeń?')) {
                                logout();
                                showSuccess('Wylogowano', 'Zostałeś wylogowany ze wszystkich urządzeń');
                            }
                        }}
                        className="block w-full md:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Wyloguj ze wszystkich urządzeń
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>
                        <p className="text-gray-600">
                            Zarządzaj swoimi preferencjami i konfiguracją systemu
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <nav className="space-y-2">
                                <TabButton id="profile" label="Profil" icon={User} />
                                <TabButton id="notifications" label="Powiadomienia" icon={Bell} />
                                <TabButton id="display" label="Wyświetlanie" icon={Settings} />
                                <TabButton id="map" label="Mapa" icon={Map} />
                                <TabButton id="security" label="Bezpieczeństwo" icon={Shield} />
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-3/4">
                        {activeTab === 'profile' && <ProfileTab />}
                        {activeTab === 'notifications' && <NotificationsTab />}
                        {activeTab === 'display' && <DisplayTab />}
                        {activeTab === 'map' && <MapTab />}
                        {activeTab === 'security' && <SecurityTab />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;