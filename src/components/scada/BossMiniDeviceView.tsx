import React from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { DeviceStatusFilter } from '../../types';
import { Search, MoreVertical, CheckCircle2, ArrowUpDown, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

export const BossMiniDeviceView: React.FC = () => {
  const { 
    devices, 
    tags, 
    statusFilter, 
    setStatusFilter, 
    searchQuery, 
    setSearchQuery, 
    subTab, 
    setSubTab,
    setActiveView 
  } = useSupervisoryStore();

  const filteredDevices = devices.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.identifier.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'ONLINE') return matchesSearch && d.isOnline;
    if (statusFilter === 'OFFLINE') return matchesSearch && !d.isOnline;
    return matchesSearch;
  });

  return (
    <div className="flex-1 bg-[#F4F6F9] min-h-screen text-slate-800 font-sans select-none">
      
      {/* Sub-Header Tabs (Dispositivos, Parâmetros, Alarmes, Tendência, Notas) */}
      <div className="bg-white border-b border-slate-200 px-6 pt-3 flex items-center justify-between">
        <div className="flex space-x-6 text-xs font-semibold">
          <button
            onClick={() => setSubTab('dispositivos')}
            aria-label="Acessar aba Dispositivos"
            className={`pb-3 flex items-center space-x-1.5 border-b-2 transition-all ${
              subTab === 'dispositivos' ? 'border-violet-600 text-violet-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>✨ Dispositivos</span>
          </button>

          <button
            onClick={() => setSubTab('parametros')}
            aria-label="Acessar aba Parâmetros"
            className={`pb-3 flex items-center space-x-1.5 border-b-2 transition-all ${
              subTab === 'parametros' ? 'border-violet-600 text-violet-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>⚙️ Parâmetros</span>
          </button>

          <button
            onClick={() => setActiveView('alarms')}
            aria-label="Acessar aba Alarmes"
            className="pb-3 text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 border-b-2 border-transparent"
          >
            <span>🔔 Alarmes</span>
          </button>

          <button
            onClick={() => setActiveView('synoptic')}
            aria-label="Acessar aba Tendência e Sinóptico"
            className="pb-3 text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 border-b-2 border-transparent"
          >
            <span>📈 Tendência (Sinóptico)</span>
          </button>

          <button
            onClick={() => setActiveView('ai-reports')}
            aria-label="Acessar aba Notas e IA Studio"
            className="pb-3 text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 border-b-2 border-transparent"
          >
            <span>📝 Notas & IA Studio</span>
          </button>
        </div>

        <div className="pb-3 text-xs text-slate-400 font-mono">
          Visualização Limpa & Clara (Boss Mini HMI)
        </div>
      </div>

      {/* Main Filter & Action Bar */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Left Controls: Dropdown & Search */}
          <div className="flex items-center space-x-3 flex-1">
            <select className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-violet-600">
              <option value="global">Grupo Global</option>
              <option value="fornos">Grupo Fornos de Indução</option>
              <option value="chillers">Grupo Refrigeração & Chiller</option>
            </select>

            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Buscar equipamento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Center Controls: Status Filter Pills (Todos, Online, Alarme, Offline, Desativado) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-800 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todos
            </button>

            <button
              onClick={() => setStatusFilter('ONLINE')}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all ${
                statusFilter === 'ONLINE' ? 'bg-emerald-600 text-white border-emerald-600 font-bold' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Online</span>
            </button>

            <button
              onClick={() => setStatusFilter('ALARM')}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all ${
                statusFilter === 'ALARM' ? 'bg-red-600 text-white border-red-600 font-bold' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Alarme</span>
            </button>

            <button
              onClick={() => setStatusFilter('OFFLINE')}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all ${
                statusFilter === 'OFFLINE' ? 'bg-slate-600 text-white border-slate-600 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Offline</span>
            </button>

            <button
              onClick={() => setStatusFilter('DISABLED')}
              className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all ${
                statusFilter === 'DISABLED' ? 'bg-sky-600 text-white border-sky-600 font-bold' : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Desativado</span>
            </button>
          </div>

          {/* Right Controls: Sort & Grid Toggle */}
          <div className="flex items-center space-x-2 border-l border-slate-200 pl-3 text-xs text-slate-600">
            <button className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Endereço</span>
            </button>
            <button className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Equipment Cards List (Boss Mini Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDevices.map((device) => {
            const deviceTags = tags.filter(t => t.deviceId === device.id);

            return (
              <div 
                key={device.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start space-x-5 relative"
              >
                {/* Equipment Circular Ring Icon / Image */}
                <div className="relative shrink-0">
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center p-1 bg-slate-50 ${
                    device.isOnline ? 'border-emerald-500' : 'border-slate-300'
                  }`}>
                    {device.imageUrl ? (
                      <img src={device.imageUrl} alt={device.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-lg">
                        💻
                      </div>
                    )}
                  </div>
                  {device.isOnline && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Device Information & Tags */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
                        {device.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{device.identifier}</p>
                    </div>

                    <button 
                      aria-label="Opções do dispositivo"
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Registered Variables List (Boss Mini Style) */}
                  <div className="space-y-1.5 text-xs">
                    {deviceTags.map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-slate-600 font-mono py-0.5 border-b border-slate-100">
                        <span className="text-slate-700">{t.name}</span>
                        <span className="font-bold text-slate-900">
                          {String(t.currentValue)} <span className="text-slate-500 text-[10px]">{t.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
