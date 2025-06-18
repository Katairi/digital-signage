// src/components/ActionModal.js
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Power, Play, Pause } from 'lucide-react';

const ActionModal = ({ device, action, onConfirm, onClose }) => {
  const actionDetails = {
    reboot: {
      title: 'Redémarrer l\'écran',
      description: 'Êtes-vous sûr de vouloir redémarrer cet écran ? La diffusion sera interrompue pendant quelques minutes.',
      icon: RefreshCw,
      color: 'orange',
      confirmText: 'Redémarrer'
    },
    shutdown: {
      title: 'Éteindre l\'écran',
      description: 'Êtes-vous sûr de vouloir éteindre cet écran ? Il devra être rallumé manuellement.',
      icon: Power,
      color: 'red',
      confirmText: 'Éteindre'
    },
    play: {
      title: 'Démarrer la diffusion',
      description: 'Démarrer la lecture de la playlist sur cet écran ?',
      icon: Play,
      color: 'green',
      confirmText: 'Démarrer'
    },
    pause: {
      title: 'Mettre en pause',
      description: 'Mettre en pause la diffusion sur cet écran ?',
      icon: Pause,
      color: 'yellow',
      confirmText: 'Mettre en pause'
    }
  };

  const details = actionDetails[action] || {};
  const Icon = details.icon || AlertTriangle;

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
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        >
          <div className="p-6">
            {/* Icon */}
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-${details.color}-100`}>
              <Icon className={`h-6 w-6 text-${details.color}-600`} />
            </div>
            
            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {details.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                {details.description}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Écran : {device.name}
              </p>
            </div>
            
            {/* Actions */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-sm font-medium text-white bg-${details.color}-600 rounded-lg hover:bg-${details.color}-700`}
              >
                {details.confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActionModal;