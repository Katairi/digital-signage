// src/pages/Devices.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Monitor, Power, Volume2, RefreshCw, Settings, Play, Pause,
  Wifi, WifiOff, Cpu, HardDrive, Thermometer, Clock, Search,
  Filter, MoreVertical, X, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import DeviceModal from '../components/DeviceModal';
import ActionModal from '../components/ActionModal';

const Devices = () => {
  const [search, setSearch] = useState('');
  const [filterSite, setFilterSite] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, device: null, action: null });
  const queryClient = useQueryClient();

  // Queries
  const { data: devices, isLoading } = useQuery('devices', api.getDevices, {
    refetchInterval: 10000
  });
  const { data: sites } = useQuery('sites', api.getSites);

  // Mutations
  const actionMutation = useMutation(
    ({ deviceId, action, params }) => api.sendDeviceAction(deviceId, action, params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('devices');
        toast.success('Action envoyée avec succès');
      },
      onError: () => {
        toast.error('Erreur lors de l\'envoi de l\'action');
      }
    }
  );

  // Filtrage
  const filteredDevices = devices?.filter(device => {
    const matchSearch = device.name.toLowerCase().includes(search.toLowerCase()) ||
                       device.location.toLowerCase().includes(search.toLowerCase());
    const matchSite = filterSite === 'all' || device.site_id === parseInt(filterSite);
    return matchSearch && matchSite;
  }) || [];

  const formatUptime = (seconds) => {
    if (!seconds) return '-';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}j ${hours}h`;
  };

  const getStatusColor = (device) => {
    if (!device.is_online) return 'bg-red-100 text-red-800';
    if (device.is_playing) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (device) => {
    if (!device.is_online) return 'Hors ligne';
    if (device.is_playing) return 'En diffusion';
    return 'En ligne';
  };

  const DeviceCard = ({ device }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* En-tête */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${device.is_online ? 'bg-green-50' : 'bg-red-50'}`}>
              {device.is_online ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{device.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{device.location}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(device)}`}>
            {getStatusText(device)}
          </span>
        </div>
      </div>

      {/* Informations */}
      <div className="p-4 space-y-3">
        {device.is_online && (
          <>
            {/* Média en cours */}
            {device.current_media && (
              <div className="flex items-center gap-2 text-sm">
                <Play className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300 truncate">{device.current_media}</span>
              </div>
            )}

            {/* Statistiques système */}
            {device.system_info && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <span>CPU: {device.system_info.cpu_percent}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <span>RAM: {device.system_info.memory_percent}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <span>{device.system_info.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <span>{formatUptime(device.system_info.uptime)}</span>
                </div>
              </div>
            )}

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <div className="flex-1">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all"
                    style={{ width: `${device.volume}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{device.volume}%</span>
            </div>
          </>
        )}

        {/* IP Address */}
        <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
          IP: {device.ip_address || 'N/A'}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
        {device.is_online ? (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActionModal({ 
                open: true, 
                device, 
                action: device.is_playing ? 'pause' : 'play' 
              })}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 text-sm transition-colors"
            >
              {device.is_playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {device.is_playing ? 'Pause' : 'Play'}
              </span>
            </button>
            <button
              onClick={() => setActionModal({ open: true, device, action: 'reboot' })}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reboot</span>
            </button>
            <button
              onClick={() => setSelectedDevice(device)}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Config</span>
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 py-2">
            Device hors ligne
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Écrans</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Gérez vos écrans d'affichage</p>
        </div>
        
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          {/* Filtre par site */}
          <select
            value={filterSite}
            onChange={(e) => setFilterSite(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les sites</option>
            {sites?.map(site => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des devices */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredDevices.length === 0 ? (
        <div className="text-center py-12">
          <Monitor className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun écran trouvé</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {search || filterSite !== 'all' ? 'Essayez de modifier vos filtres' : 'Commencez par ajouter un écran'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredDevices.map(device => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      {selectedDevice && (
        <DeviceModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}
      
      {actionModal.open && (
        <ActionModal
          device={actionModal.device}
          action={actionModal.action}
          onConfirm={(params) => {
            actionMutation.mutate({
              deviceId: actionModal.device.id,
              action: actionModal.action,
              params
            });
            setActionModal({ open: false, device: null, action: null });
          }}
          onClose={() => setActionModal({ open: false, device: null, action: null })}
        />
      )}
    </div>
  );
};

export default Devices;