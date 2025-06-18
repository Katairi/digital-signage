// src/components/DeviceModal.js
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import { X, Save, Volume2, Monitor, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const DeviceModal = ({ device, onClose }) => {
  const [formData, setFormData] = useState({
    enabled: device.enabled,
    volume: device.volume,
    screen_on: device.screen_on,
    schedule: device.schedule || {}
  });
  
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation(
    (data) => api.updateDevice(device.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('devices');
        toast.success('Configuration mise à jour');
        onClose();
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Configuration de {device.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
            </button>
          </div>
          
          {/* Contenu */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* État de l'appareil */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Appareil activé
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
                    formData.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Volume */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <Volume2 className="w-4 h-4" />
                Volume : {formData.volume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.volume}
                onChange={(e) => setFormData(prev => ({ ...prev, volume: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Écran */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Monitor className="w-4 h-4" />
                Écran allumé
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, screen_on: !prev.screen_on }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.screen_on ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
                    formData.screen_on ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Programmation (simplifiée pour la démo) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <Clock className="w-4 h-4" />
                Programmation
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Fonctionnalité de programmation horaire à venir
              </p>
            </div>
          </form>
          
          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-900"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={updateMutation.isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeviceModal;