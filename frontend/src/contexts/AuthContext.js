// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import apiService from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Vérifier la validité du token au démarrage
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      // Décoder le JWT pour obtenir les informations utilisateur
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Vérifier si le token n'est pas expiré
        if (payload.exp * 1000 < Date.now()) {
          throw new Error('Token expiré');
        }
        
        setUser({ 
          email: payload.sub, 
          role: payload.role,
          site_id: payload.site_id || null
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Tentative de connexion avec:', { email }); // Debug
      
      const response = await apiService.login(email, password);
      const { access_token } = response.data;
      
      console.log('✅ Connexion réussie, token reçu'); // Debug
      
      localStorage.setItem('token', access_token);
      
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      setUser({ 
        email: payload.sub, 
        role: payload.role,
        site_id: payload.site_id || null
      });
      
      toast.success('Connexion réussie !');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur de connexion complète:', error);
      console.error('📄 Response data:', error.response?.data);
      console.error('📊 Response status:', error.response?.status);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur de connexion';
      if (error.response?.status === 400) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await apiService.changePassword(currentPassword, newPassword);
      toast.success('Mot de passe modifié avec succès');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors du changement de mot de passe');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Déconnexion réussie');
  };

  const value = {
    user,
    login,
    logout,
    changePassword,
    loading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'superadmin',
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};