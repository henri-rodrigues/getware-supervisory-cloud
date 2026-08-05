import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { ProtocolType, DeviceStatusFilter } from '../../types';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Wrench, 
  Bell, 
  TrendingUp, 
  FileText, 
  ArrowUpDown, 
  LayoutGrid, 
  ListFilter,
  Cpu,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Circle
} from 'lucide-react';

export const DeviceManager: React.FC = () => {
  const { 
    devices, 
    tags, 
    addDevice, 
    deleteDevice, 
    systems, 
    statusFilter, 
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    setActiveView
  } = useSupervisoryStore();

  const [activeTab, setActiveTab] = useState<'dispositivos' | 'parametros' | 'alarmes' | 'tendencia' | 'notas'>('dispositivos');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [systemId, setSystemId] = useState(systems[0]?.id || '');
  const [protocol, setProtocol] = useState<ProtocolType>('MODBUS_TCP');
  const [host, setHost] = useState('192.168.1.100');
  const [port, setPort] = useState(502);
  const [slaveId, setSlaveId] = useState(1);
  const [brokerUrl, setBrokerUrl] = useState('mqtt://broker.getware.cloud:1883');
  const [topic, setTopic] = useState('getware/tenant/device/telemetry');

  // Filter logic
  const filteredDevices = devices.filter((dev) => {
    const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dev.identifier.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'ONLINE') return matchesSearch && dev.isOnline;
    if (statusFilter === 'OFFLINE') return matchesSearch && !dev.isOnline;
    return matchesSearch;
  });

  const handleSubmitNewDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !identifier) return;

    const protocolConfig = protocol === 'MQTT'
      ? { brokerUrl, topic, clientId: `gw-${Date.now()}`, qos: 1 as const }
      : { host, port: Number(port), slaveId: Number(slaveId), pollingIntervalMs: 1000 };

    addDevice({
      tenantId: 'tenant-01',
      systemId,
      name,
      identifier,
      protocol,
      protocolConfig,
      location: 'Planta Industrial',
      description: 'Equipamento conectado pelo BOSS mini'
    });

    setName('');
    setIdentifier('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen p-4 sm:p-6 space-y-4 font-sans">
      
      {/* 1. Sub-Nav Bar with Date & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-2 gap-3">
        <div className="text-xs font-mono text-slate-500 font-medium">
          {new Date().toISOString().slice(0, 10).replace(/-/g, '/')} {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center space-x-4 text-xs font-medium overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('dispositivos')}
            className={`flex items-center space-x-1.5 pb-2 border-b-2 transition-all ${
              activeTab === 'dispositivos' ? 'border-slate-800 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Dispositivos</span>
          </button>

          <button
            onClick={() => { setActiveTab('parametros'); setActiveView('tags'); }}
            className={`flex items-center space-x-1.5 pb-2 border-b-2 transition-all ${
              activeTab === 'parametros' ? 'border-slate-800 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-slate-600" />
            <span>Parâmetros</span>
          </button>

          <button
            onClick={() => { setActiveTab('alarmes'); setActiveView('alarms'); }}
            className={`flex items-center space-x-1.5 pb-2 border-b-2 transition-all ${
              activeTab === 'alarmes' ? 'border-slate-800 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-slate-600" />
            <span>Alarmes</span>
          </button>

          <button
            onClick={() => setActiveTab('tendencia')}
            className={`flex items-center space-x-1.5 pb-2 border-b-2 transition-all ${
              activeTab === 'tendencia' ? 'border-slate-800 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
            <span>Tendência</span>
          </button>

          <button
            onClick={() => setActiveTab('notas')}
            className={`flex items-center space-x-1.5 pb-2 border-b-2 transition-all ${
              activeTab === 'notas' ? 'border-slate-800 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Notas</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        
        {/* Left: Group Dropdown & Search Field */}
        <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium whitespace-nowrap">
            <span>Grupo</span>
            <select className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-slate-500">
              <option>Global</option>
              <option>Planta Principal</option>
              <option>Chiller e Refrigeração</option>
            </select>
          </div>

          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md pl-8 pr-3 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Middle: Status Pills Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              statusFilter === 'ALL' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setStatusFilter('ONLINE')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              statusFilter === 'ONLINE' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Online</span>
          </button>

          <button
            onClick={() => setStatusFilter('ALARM')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              statusFilter === 'ALARM' ? 'bg-red-100 text-red-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span>Alarme</span>
          </button>

          <button
            onClick={() => setStatusFilter('OFFLINE')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              statusFilter === 'OFFLINE' ? 'bg-slate-200 text-slate-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
            <span>Offline</span>
          </button>

          <button
            onClick={() => setStatusFilter('DISABLED')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              statusFilter === 'DISABLED' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>Desativado</span>
          </button>
        </div>

        {/* Right: Sort & Display Controls */}
        <div className="flex items-center space-x-2 text-slate-600">
          <button className="flex items-center space-x-1 px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <span>Endereço</span>
          </button>

          <button className="flex items-center space-x-1 px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">
            <span>A-Z</span>
          </button>

          <div className="flex items-center space-x-1 border-l border-slate-300 pl-2">
            <button className="p-1 text-slate-700 hover:bg-slate-100 rounded">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-1 text-slate-400 hover:bg-slate-100 rounded">
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="ml-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo</span>
          </button>
        </div>
      </div>

      {/* 3. Devices Grid matching BOSS Mini design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Device Item 1: Internal IO */}
        {filteredDevices.map((device) => {
          const deviceTags = tags.filter(t => t.deviceId === device.id);

          return (
            <div key={device.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between space-x-4 hover:border-slate-300 transition-all">
              
              {/* Left Green Halo Circle & Device Graphic */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-500 p-1 flex items-center justify-center shrink-0 bg-white shadow-xs">
                  <div className="w-full h-full rounded-full bg-emerald-50/50 flex flex-col items-center justify-center p-2 text-slate-800">
                    <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M7 10h10" />
                      <path d="M12 7l5 5-5 5" />
                    </svg>
                  </div>
                </div>

                {/* Device Title & Outputs List */}
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-900 leading-tight">{device.name}</h3>
                  <div className="text-xs text-slate-600 space-y-0.5 font-medium">
                    <p>Digital output 1</p>
                    <p>Digital output 2</p>
                    <p>Digital output 3</p>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 pt-1">
                    {device.protocol} • {device.identifier}
                  </div>
                </div>
              </div>

              {/* Right Side: Options Menu Dots & Delete */}
              <div className="flex flex-col items-end justify-between h-full space-y-4">
                <button className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100">
                  <MoreVertical className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteDevice(device.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1"
                  title="Excluir dispositivo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Device Item 2: sensor (Multiparâmetro) - Exact screenshot match */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between space-x-4 hover:border-slate-300 transition-all">
          
          {/* Left Green Halo Circle & Sensor Graphic */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500 p-1 flex items-center justify-center shrink-0 bg-white shadow-xs">
              <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center p-2">
                <div className="w-9 h-11 bg-white border border-slate-300 rounded shadow-xs flex flex-col items-center justify-center p-1">
                  <div className="w-6 h-3 bg-sky-100 border border-sky-300 rounded text-[7px] text-sky-800 font-mono font-bold flex items-center justify-center">
                    552.
                  </div>
                </div>
              </div>
            </div>

            {/* Sensor Device Details & Live Readouts */}
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">sensor</h3>
              <div className="text-xs text-slate-600 space-y-0.5 font-medium">
                <p>Temperature °C/°F</p>
                <p>Relative % humidity</p>
              </div>
            </div>
          </div>

          {/* Right Live Tag Values */}
          <div className="text-right font-mono text-xs font-semibold text-slate-800 space-y-1">
            <div className="text-sm font-bold text-slate-900">9.001</div>
            <div>29.9 °C/°F</div>
            <div>38.0 %rH</div>
          </div>
        </div>

      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitNewDevice} className="bg-white border border-slate-300 p-6 rounded-xl max-w-lg w-full shadow-2xl space-y-4 text-slate-800">
            <h3 className="font-bold text-lg text-slate-900">Cadastrar Novo Dispositivo</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Nome do Equipamento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CLP Forno Indução 02"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Identificador (MAC/Serial):</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: MODBUS-PLC-02"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-slate-700">Protocolo Industrial:</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as ProtocolType)}
                className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-slate-500"
              >
                <option value="MODBUS_TCP">Modbus TCP (Ethernet Direct)</option>
                <option value="MODBUS_RTU">Modbus RTU (Serial via Gateway)</option>
                <option value="MQTT">MQTT Direct Cloud Broker</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors shadow-xs"
              >
                Salvar Dispositivo
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
