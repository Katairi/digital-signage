// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('normal');

  // Charger les préférences depuis localStorage au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDensity = localStorage.getItem('density') || 'normal';
    
    setTheme(savedTheme);
    setDensity(savedDensity);
    
    // Appliquer le thème au DOM
    applyTheme(savedTheme);
  }, []);

  // Fonction pour appliquer le thème au DOM
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else { // auto
      // Détecter la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Changer le thème
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Changer la densité
  const changeDensity = (newDensity) => {
    setDensity(newDensity);
    localStorage.setItem('density', newDensity);
    
    // Appliquer la densité au body
    const body = document.body;
    body.classList.remove('density-compact', 'density-normal', 'density-comfortable');
    body.classList.add(`density-${newDensity}`);
  };

  // Écouter les changements de préférence système pour le thème auto
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('auto');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    density,
    changeTheme,
    changeDensity,
    isDark: theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};