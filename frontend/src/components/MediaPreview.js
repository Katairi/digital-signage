// src/components/MediaPreview.js
import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';

const MediaPreview = ({ file, onClose }) => {
  const fileUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3040'}/static/${file.site_name}/${file.filename}`;
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file.filename);
  const isVideo = /\.(mp4|mov|avi)$/i.test(file.filename);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {file.filename}
            </h3>
            <div className="flex items-center gap-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
              </a>
              <a
                href={fileUrl}
                download={file.filename}
                className="p-2 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
              </a>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-center min-h-[400px]">
              {isImage && (
                <img
                  src={fileUrl}
                  alt={file.filename}
                  className="max-w-full max-h-[600px] object-contain"
                />
              )}
              {isVideo && (
                <video
                  controls
                  className="max-w-full max-h-[600px]"
                >
                  <source src={fileUrl} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              )}
              {!isImage && !isVideo && (
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    Aperçu non disponible pour ce type de fichier
                  </p>
                  <a
                    href={fileUrl}
                    download={file.filename}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Download className="w-5 h-5" />
                    Télécharger le fichier
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MediaPreview;