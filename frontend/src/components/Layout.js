// src/components/Layout.js
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Menu, X, Home, Monitor, Film, Building2, Users, 
  Settings, LogOut, ChevronDown, User, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isSuperAdmin } = useAuth();
  const { theme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Écrans', href: '/devices', icon: Monitor },
    { name: 'Médias', href: '/media', icon: Film },
    ...(isSuperAdmin ? [
      { name: 'Sites', href: '/sites', icon: Building2 },
      { name: 'Utilisateurs', href: '/users', icon: Users },
    ] : []),
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const getRoleInfo = (role) => {
    if (role === 'superadmin') {
      return {
        label: 'Super Admin',
        icon: Shield,
        color: 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900'
      };
    }
    return {
      label: 'Admin',
      icon: User,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900'
    };
  };

  const roleInfo = getRoleInfo(user?.role);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et burger menu */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="ml-2 md:ml-0 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Digital Signage</h1>
              </div>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${roleInfo.color}`}>
                  <roleInfo.icon size={18} />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    {roleInfo.label}
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400 dark:text-gray-500" />
              </button>

              {/* Dropdown menu utilisateur */}
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleInfo.color}`}>
                            <roleInfo.icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {user?.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                              {roleInfo.label}
                              {user?.site_id && ` • Site ${user.site_id}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate('/settings');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2"
                        >
                          <Settings size={16} />
                          Paramètres
                        </button>
                        
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            navigate('/login');
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-3 ${
                      isActive(item.href)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Contenu principal */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;