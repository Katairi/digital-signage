// src/pages/Settings.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { 
  User, Lock, Bell, Globe, Palette, Save, 
  ChevronRight, Monitor, Wifi, HardDrive, Shield, AlertTriangle,
  Sun, Moon, Laptop
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Select } from '../components/ui/ThemedComponents';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Sécurité', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'display', name: 'Affichage', icon: Palette },
    { id: 'system', name: 'Système', icon: Globe },
  ];

  const TabContent = ({ tabId }) => {
    switch (tabId) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'display':
        return <DisplaySettings />;
      case 'system':
        return <SystemSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Gérez vos préférences et paramètres</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Sidebar */}
          <div className="border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-gray-800 border-l-4 border-primary-500' 
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className={`w-5 h-5 ${
                    activeTab === tab.id ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className={`font-medium ${
                    activeTab === tab.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {tab.name}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 ${
                  activeTab === tab.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="col-span-3 p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TabContent tabId={activeTab} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composants pour chaque section
const ProfileSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: '',
  });

  const getRoleBadge = (role) => {
    if (role === 'superadmin') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
          <Shield className="w-4 h-4" />
          Super Administrateur
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
        <User className="w-4 h-4" />
        Administrateur
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations du profil</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
          Vos informations personnelles et rôle
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
            L'email ne peut pas être modifié
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rôle
          </label>
          <div className="py-2">
            {getRoleBadge(user?.role)}
          </div>
        </div>

        {user?.site_id && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site assigné
            </label>
            <p className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
              Site ID: {user.site_id}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    const success = await changePassword(formData.currentPassword, formData.newPassword);
    if (success) {
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sécurité</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
          Gérez la sécurité de votre compte
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mot de passe actuel
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Votre mot de passe actuel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Au moins 8 caractères"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Répétez le nouveau mot de passe"
          />
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
            Conseils pour un mot de passe sécurisé :
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Au moins 8 caractères</li>
            <li>• Mélange de lettres majuscules et minuscules</li>
            <li>• Inclure des chiffres et des caractères spéciaux</li>
            <li>• Éviter les informations personnelles</li>
          </ul>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleChangePassword}
          disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Lock className="w-4 h-4" />
          {loading ? 'Modification...' : 'Changer le mot de passe'}
        </button>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    deviceOffline: true,
    newMedia: true,
    systemUpdates: false,
    dailyReport: false,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Préférences mises à jour');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
          Choisissez les notifications que vous souhaitez recevoir
        </p>
      </div>

      <div className="space-y-4">
        {[
          { key: 'deviceOffline', label: 'Écran hors ligne', description: 'Recevoir une alerte quand un écran se déconnecte' },
          { key: 'newMedia', label: 'Nouveaux médias', description: 'Être notifié lors de l\'ajout de nouveaux médias' },
          { key: 'systemUpdates', label: 'Mises à jour système', description: 'Informations sur les mises à jour disponibles' },
          { key: 'dailyReport', label: 'Rapport quotidien', description: 'Recevoir un résumé quotidien de l\'activité' },
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{description}</p>
            </div>
            <button
              onClick={() => toggleNotification(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications[key] ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
                  notifications[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DisplaySettings = () => {
  const { theme, density, changeTheme, changeDensity } = useTheme();

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    toast.success('Thème mis à jour');
  };

  const handleDensityChange = (newDensity) => {
    changeDensity(newDensity);
    toast.success('Densité mise à jour');
  };

  const getThemeIcon = (themeType) => {
    switch (themeType) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'auto': return Laptop;
      default: return Sun;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Affichage</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
          Personnalisez l'apparence de l'interface
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Thème
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light', label: 'Clair' },
              { value: 'dark', label: 'Sombre' },
              { value: 'auto', label: 'Automatique' }
            ].map((t) => {
              const IconComponent = getThemeIcon(t.value);
              return (
                <button
                  key={t.value}
                  onClick={() => handleThemeChange(t.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    theme === t.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                    theme === t.value ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    theme === t.value ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

          <Select
            label="Densité d'affichage"
            value={density}
            onChange={(e) => handleDensityChange(e.target.value)}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'normal', label: 'Normal' },
              { value: 'comfortable', label: 'Confortable' }
            ]}
          />

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
            💡 Astuce
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Le thème "Automatique" s'adapte à vos préférences système (jour/nuit).
          </p>
        </div>
      </div>
    </div>
  );
};

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations système</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
          Détails sur votre installation
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Version</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Digital Signage v1.0.0</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Wifi className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">API</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">FastAPI v0.104.1</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <HardDrive className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Base de données</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">PostgreSQL 14</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Frontend</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">React 18.2.0</p>
          </div>
        </div>

        <div className="pt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Ressources</h4>
          <div className="space-y-2">
            <a href="/api/docs" target="_blank" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Documentation API →
            </a>
            <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Guide d'utilisation →
            </a>
            <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Support technique →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;