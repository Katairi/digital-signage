// src/hooks/useThemeClasses.js
import { useTheme } from '../contexts/ThemeContext';

export const useThemeClasses = () => {
  const { isDark } = useTheme();

  const getClasses = (lightClasses, darkClasses) => {
    return isDark ? darkClasses : lightClasses;
  };

  // Classes prédéfinies communes
  const classes = {
    // Backgrounds
    cardBg: getClasses('bg-white', 'bg-gray-800'),
    pageBg: getClasses('bg-gray-50', 'bg-gray-900'),
    modalBg: getClasses('bg-white', 'bg-gray-800'),
    headerBg: getClasses('bg-white', 'bg-gray-800'),
    sidebarBg: getClasses('bg-gray-50', 'bg-gray-900'),
    
    // Textes
    primaryText: getClasses('text-gray-900', 'text-white'),
    secondaryText: getClasses('text-gray-600', 'text-gray-300'),
    mutedText: getClasses('text-gray-500', 'text-gray-400'),
    lightText: getClasses('text-gray-400', 'text-gray-500'),
    
    // Bordures
    border: getClasses('border-gray-200', 'border-gray-700'),
    borderLight: getClasses('border-gray-300', 'border-gray-600'),
    
    // Hovers
    hoverBg: getClasses('hover:bg-gray-100', 'hover:bg-gray-700'),
    hoverBgLight: getClasses('hover:bg-gray-50', 'hover:bg-gray-800'),
    
    // Inputs
    input: getClasses(
      'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    ),
    
    // Boutons
    buttonSecondary: `${getClasses('bg-white', 'bg-gray-700')} ${getClasses('text-gray-700', 'text-gray-200')} ${getClasses('border-gray-300', 'border-gray-600')} ${getClasses('hover:bg-gray-50', 'hover:bg-gray-600')}`,
    
    // Tableaux
    tableHeader: getClasses('bg-gray-50', 'bg-gray-900'),
    tableRow: getClasses('hover:bg-gray-50', 'hover:bg-gray-700'),
    
    // Alertes
    alertInfo: getClasses(
      'bg-blue-50 border-blue-200 text-blue-800',
      'bg-blue-900/20 border-blue-800 text-blue-300'
    ),
    alertSuccess: getClasses(
      'bg-green-50 border-green-200 text-green-800',
      'bg-green-900/20 border-green-800 text-green-300'
    ),
    alertWarning: getClasses(
      'bg-yellow-50 border-yellow-200 text-yellow-800',
      'bg-yellow-900/20 border-yellow-800 text-yellow-300'
    ),
    alertError: getClasses(
      'bg-red-50 border-red-200 text-red-800',
      'bg-red-900/20 border-red-800 text-red-300'
    )
  };

  return { classes, getClasses };
};