// src/services/api.js
import axios from 'axios';

// Configuration de l'URL de base
// En production (Docker) : REACT_APP_API_URL="/api" 
// En développement : REACT_APP_API_URL="http://localhost:3040/api"
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Instance axios configurée
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services API
const apiService = {
  // Auth
  login: (email, password) => 
    api.post('/auth/login', { email, password }),

  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { 
      current_password: currentPassword, 
      new_password: newPassword 
    }),

  getCurrentUser: () =>
    api.get('/auth/me').then(res => res.data),

  // Devices
  getDevices: () => 
    api.get('/devices/').then(res => res.data),
  
  getDevice: (id) => 
    api.get(`/devices/${id}`).then(res => res.data),
  
  getDeviceStatistics: () => 
    api.get('/devices/statistics').then(res => res.data),
  
  createDevice: (data) =>
    api.post('/devices/', data).then(res => res.data),
  
  updateDevice: (id, data) => 
    api.put(`/devices/${id}`, data).then(res => res.data),
  
  sendDeviceAction: (deviceId, action, params = null) => 
    api.post(`/devices/${deviceId}/action`, { action, params }).then(res => res.data),
  
  deleteDevice: (id) => 
    api.delete(`/devices/${id}`).then(res => res.data),

  // Media
  uploadMedia: (file, siteName, replace = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('site_name', siteName);
    formData.append('replace', replace);
    
    return api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },
  
  getMediaList: (siteName) => 
    api.get('/media/list', { params: { site_name: siteName } }).then(res => res.data),
  
  deleteMedia: (siteName, filename) => 
    api.delete('/media/delete', { params: { site_name: siteName, filename } }).then(res => res.data),

  // Sites
  getSites: () => 
    api.get('/sites/').then(res => res.data),
  
  createSite: (data) => 
    api.post('/sites/', data).then(res => res.data),
  
  updateSite: (id, data) => 
    api.put(`/sites/${id}`, data).then(res => res.data),
  
  deleteSite: (id) => 
    api.delete(`/sites/${id}`).then(res => res.data),

  // Users (seulement pour les superadmins)
  getUsers: () => 
    api.get('/users/').then(res => res.data),
  
  createUser: (data) => 
    api.post('/users/', data).then(res => res.data),
  
  updateUser: (id, data) => 
    api.put(`/users/${id}`, data).then(res => res.data),
  
  deleteUser: (id) => 
    api.delete(`/users/${id}`).then(res => res.data),
};

export default apiService;