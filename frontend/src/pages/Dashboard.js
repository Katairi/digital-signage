// src/pages/Dashboard.js
import React from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { 
  Monitor, Wifi, WifiOff, Play, Pause, TrendingUp, 
  Activity, Clock, AlertCircle 
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  // Fetch des statistiques
  const { data: stats } = useQuery('device-stats', () => api.getDeviceStatistics());
  const { data: devices } = useQuery('devices', () => api.getDevices(), {
    refetchInterval: 10000 // Rafraîchir toutes les 10 secondes
  });

  // Données pour les graphiques
  const pieData = [
    { name: 'En ligne', value: stats?.online || 0, color: '#10b981' },
    { name: 'Hors ligne', value: stats?.offline || 0, color: '#ef4444' },
  ];

  const activityData = [
    { time: '00:00', devices: 28 },
    { time: '04:00', devices: 25 },
    { time: '08:00', devices: 30 },
    { time: '12:00', devices: 32 },
    { time: '16:00', devices: 31 },
    { time: '20:00', devices: 29 },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-500 dark:text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  );

  const DeviceCard = ({ device }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${device.is_online ? 'bg-green-500' : 'bg-red-500'}`} />
        <div>
          <p className="font-medium text-sm text-gray-900 dark:text-white">{device.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{device.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {device.is_playing && <Play className="w-4 h-4 text-green-600 dark:text-green-400" />}
        {device.system_info && (
          <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {device.system_info.cpu_percent}% CPU
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">Vue d'ensemble de votre parc d'écrans</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Monitor}
          title="Total écrans"
          value={stats?.total || 0}
          color="blue"
        />
        <StatCard
          icon={Wifi}
          title="En ligne"
          value={stats?.online || 0}
          subtitle={`${Math.round((stats?.online / stats?.total) * 100) || 0}% du parc`}
          color="green"
        />
        <StatCard
          icon={Play}
          title="En diffusion"
          value={stats?.playing || 0}
          subtitle={`${Math.round((stats?.playing / stats?.total) * 100) || 0}% actifs`}
          color="purple"
        />
        <StatCard
          icon={WifiOff}
          title="Hors ligne"
          value={stats?.offline || 0}
          subtitle="Nécessitent attention"
          color="red"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* État des écrans */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">État des écrans</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activité sur 24h */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité sur 24h</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '8px',
                  color: 'var(--tooltip-color)'
                }}
              />
              <Area type="monotone" dataKey="devices" stroke="#3b82f6" fill="#dbeafe" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Alertes et écrans récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alertes</h3>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {devices?.filter(d => !d.is_online).slice(0, 3).map((device) => (
              <div key={device.id} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <WifiOff className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-500">
                    Hors ligne depuis {new Date(device.last_seen).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {(!devices || devices.filter(d => !d.is_online).length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 text-center py-4">Aucune alerte</p>
            )}
          </div>
        </motion.div>

        {/* Écrans actifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Écrans actifs</h3>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-2">
            {devices?.filter(d => d.is_online).slice(0, 5).map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;