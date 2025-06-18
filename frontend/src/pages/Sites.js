// src/pages/Sites.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Building2, MapPin, Plus, Edit2, Trash2, Monitor } from 'lucide-react';
import api from '../services/api';

const Sites = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const queryClient = useQueryClient();

  const { data: sites, isLoading } = useQuery('sites', api.getSites);
  const { data: devices } = useQuery('devices', api.getDevices);

  const createMutation = useMutation(api.createSite, {
    onSuccess: () => {
      queryClient.invalidateQueries('sites');
      toast.success('Site créé avec succès');
      closeModal();
    },
    onError: () => {
      toast.error('Erreur lors de la création du site');
    }
  });

  const updateMutation = useMutation(
    ({ id, data }) => api.updateSite(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sites');
        toast.success('Site mis à jour');
        closeModal();
      }
    }
  );

  const deleteMutation = useMutation(api.deleteSite, {
    onSuccess: () => {
      queryClient.invalidateQueries('sites');
      toast.success('Site supprimé');
    }
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSite(null);
    setFormData({ name: '', address: '' });
  };

  const openModal = (site = null) => {
    if (site) {
      setEditingSite(site);
      setFormData({ name: site.name, address: site.address });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSite) {
      updateMutation.mutate({ id: editingSite.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getDeviceCount = (siteId) => {
    return devices?.filter(d => d.site_id === siteId).length || 0;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sites</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Gérez vos différents sites</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau site
        </button>
      </div>

      {/* Liste des sites */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : sites?.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun site</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Commencez par créer un site
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {sites?.map(site => (
              <motion.div
                key={site.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal(site)}
                      className="p-2 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer le site ${site.name} ?`)) {
                          deleteMutation.mutate(site.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {site.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span>{site.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span>{getDeviceCount(site.id)} écran(s)</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de création/édition */}
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
                    {editingSite ? 'Modifier le site' : 'Nouveau site'}
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
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
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                    >
                      {editingSite ? 'Modifier' : 'Créer'}
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

export default Sites;