// src/pages/Media.js
import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Upload, Film, Image, FileText, Trash2, Eye, Search, Grid, List, Check
} from 'lucide-react';
import api from '../services/api';
import MediaPreview from '../components/MediaPreview';

const Media = () => {
  const [selectedSite, setSelectedSite] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const queryClient = useQueryClient();

  // Queries
  const { data: sites = [] } = useQuery('sites', api.getSites);
  const { data: mediaFiles = { files: [] }, isLoading } = useQuery(
    ['media', selectedSite],
    () => api.getMediaList(selectedSite),
    { enabled: !!selectedSite }
  );

  // Mutations
  const uploadMutation = useMutation(
    ({ file, siteName }) => api.uploadMedia(file, siteName),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['media', selectedSite]);
        toast.success('Fichier uploadé avec succès');
      },
      onError: (error) => {
        toast.error(error.response?.data?.detail || 'Erreur lors de l\'upload');
      }
    }
  );

  const deleteMutation = useMutation(
    ({ siteName, filename }) => api.deleteMedia(siteName, filename),
    {
      onSuccess: (_, { filename }) => {
        queryClient.invalidateQueries(['media', selectedSite]);
        toast.success('Fichier supprimé');
        setSelectedFiles(prev => prev.filter(f => f !== filename));
      },
      onError: () => {
        toast.error('Erreur lors de la suppression');
      }
    }
  );

  // Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (!selectedSite) {
      toast.error('Veuillez sélectionner un site');
      return;
    }
    acceptedFiles.forEach(file => {
      uploadMutation.mutate({ file, siteName: selectedSite });
    });
  }, [selectedSite, uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    },
    disabled: !selectedSite
  });

  // Filtrage
  const filteredFiles = mediaFiles.files.filter(file =>
    file.filename.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'avi'].includes(ext)) return Film;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return Image;
    return FileText;
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'avi'].includes(ext)) return 'Vidéo';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'Image';
    return 'Fichier';
  };

  const toggleFileSelection = (filename) => {
    setSelectedFiles(prev => 
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  const deleteSelectedFiles = () => {
    if (!window.confirm(`Supprimer ${selectedFiles.length} fichier(s) ?`)) return;
    selectedFiles.forEach(filename => {
      deleteMutation.mutate({ siteName: selectedSite, filename });
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Médias</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Gérez vos fichiers médias</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sélection du site */}
          <select
            value={selectedSite}
            onChange={(e) => {
              setSelectedSite(e.target.value);
              setSelectedFiles([]);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Sélectionner un site</option>
            {sites.map(site => (
              <option key={site.id} value={site.name}>{site.name}</option>
            ))}
          </select>

          {/* Actions sur la sélection */}
          {selectedFiles.length > 0 && (
            <button
              onClick={deleteSelectedFiles}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer ({selectedFiles.length})
            </button>
          )}
        </div>
      </div>

      {selectedSite && (
        <>
          {/* Zone d'upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              {isDragActive
                ? 'Déposez les fichiers ici...'
                : 'Glissez-déposez des fichiers ici, ou cliquez pour sélectionner'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">
              Formats supportés : MP4, MOV, AVI, JPG, PNG, GIF
            </p>
          </div>

          {/* Barre d'outils */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des fichiers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100 dark:bg-gray-800'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100 dark:bg-gray-800'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Liste des fichiers */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <Film className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun fichier</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Commencez par uploader des médias
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                  {filteredFiles.map(file => {
                    const Icon = getFileIcon(file.filename);
                    const isSelected = selectedFiles.includes(file.filename);
                    return (
                      <motion.div
                        key={file.filename}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`relative group bg-white dark:bg-gray-800 rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                         isSelected ? 'border-primary-500 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => toggleFileSelection(file.filename)}
                      >
                        {/* Checkbox de sélection */}
                        <div className={`absolute top-2 left-2 z-10 transition-opacity ${
                          isSelected || 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-primary-500 border-primary-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                          }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>

                        {/* Aperçu */}
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-justify-center justify-center">
                          <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>

                        {/* Infos */}
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.filename}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
                            {getFileType(file.filename)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewFile(file);
                              }}
                              className="p-1.5 bg-white dark:bg-gray-800 rounded shadow-sm hover:shadow-md transition-shadow"
                            >
                              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMutation.mutate({ siteName: selectedSite, filename: file.filename });
                              }}
                              className="p-1.5 bg-white dark:bg-gray-800 rounded shadow-sm hover:shadow-md transition-shadow"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                      {filteredFiles.map(file => {
                        const Icon = getFileIcon(file.filename);
                        return (
                          <tr key={file.filename} className="hover:bg-gray-50 dark:bg-gray-900">
                            <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                              <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                              <span>{file.filename}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                              {getFileType(file.filename)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                onClick={() => setPreviewFile(file)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Eye className="w-5 h-5 inline" />
                              </button>
                              <button
                                onClick={() => deleteMutation.mutate({ siteName: selectedSite, filename: file.filename })}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-5 h-5 inline" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Preview Modal */}
          {previewFile && (
            <MediaPreview
              file={previewFile}
              site={selectedSite}
              onClose={() => setPreviewFile(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Media;
