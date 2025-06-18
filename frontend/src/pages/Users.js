// src/pages/Users.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Shield, Building2, Plus, Edit2, Trash2, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Users = () => {
  const { isSuperAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
    site_id: null
  });
  const queryClient = useQueryClient();

  // Appeler tous les hooks en premier
  const { data: users, isLoading } = useQuery('users', api.getUsers, {
    enabled: isSuperAdmin // Ne faire la requête que si l'utilisateur est superadmin
  });
  const { data: sites } = useQuery('sites', api.getSites, {
    enabled: isSuperAdmin
  });

  const createMutation = useMutation(api.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('Utilisateur créé avec succès');
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  });

  const deleteMutation = useMutation(api.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('Utilisateur supprimé');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la suppression');
    }
  });

  // Vérification de permission après les hooks
  if (!isSuperAdmin) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Accès restreint
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Seuls les super administrateurs peuvent gérer les utilisateurs.
          </p>
        </div>
      </div>
    );
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      role: 'admin',
      site_id: null
    });
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '',
        role: user.role,
        site_id: user.site_id
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Email et mot de passe sont requis');
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    createMutation.mutate(formData);
  };

  const getRoleBadge = (role) => {
    if (role === 'superadmin') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
          <Shield className="w-3 h-3" />
          Super Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
        <User className="w-3 h-3" />
        Admin
      </span>
    );
  };

  const getSiteName = (siteId) => {
    return sites?.find(s => s.id === siteId)?.name || '-';
  };

  const canDeleteUser = (user) => {
    // Ne pas permettre de supprimer le superadmin par défaut
    return user.email !== 'ap@gpsoftware.fr';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Utilisateurs</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Gérez les accès à la plateforme</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvel utilisateur
        </button>
      </div>
      
      {/* Liste des utilisateurs */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Site assigné
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
              {users?.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white ${
                        user.role === 'superadmin' ? 'bg-purple-500' : 'bg-primary-500'
                      }`}>
                        {user.role === 'superadmin' ? (
                          <Shield className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          {user.email}
                          {user.email === 'ap@gpsoftware.fr' && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                              Par défaut
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    {user.site_id ? (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {getSiteName(user.site_id)}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">Tous les sites</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canDeleteUser(user) ? (
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer l'utilisateur ${user.email} ?`)) {
                            deleteMutation.mutate(user.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        <Trash2 className="w-5 h-5" />
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {(!users || users.length === 0) && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun utilisateur</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Commencez par créer un utilisateur
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de création */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Nouvel utilisateur
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
                    Créer un nouveau compte administrateur
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="admin@exemple.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Au moins 8 caractères"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
                      Minimum 8 caractères
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Rôle
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value, site_id: e.target.value === 'superadmin' ? null : formData.site_id })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="admin">Administrateur</option>
                      <option value="superadmin">Super Administrateur</option>
                    </select>
                  </div>
                  
                  {formData.role === 'admin' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Site assigné
                      </label>
                      <select
                        value={formData.site_id || ''}
                        onChange={(e) => setFormData({ ...formData, site_id: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Tous les sites</option>
                        {sites?.map(site => (
                          <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
                        Laissez vide pour accéder à tous les sites
                      </p>
                    </div>
                  )}

                  {formData.role === 'superadmin' && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Super Administrateur</strong> : Accès complet à toutes les fonctionnalités, peut gérer les utilisateurs et tous les sites.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-900"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {createMutation.isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Création...
                        </>
                      ) : (
                        'Créer'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;