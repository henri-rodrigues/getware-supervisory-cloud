import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { ProtocolType } from '../../types';
import { Cpu, Plus, Trash2, Wifi, ShieldCheck, Layers, Radio } from 'lucide-react';

export const DeviceManager: React.FC = () => {
  const { devices, addDevice, deleteDevice, systems } = useSupervisoryStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [systemId, setSystemId] = useState(systems[0]?.id || '');
  const [protocol, setProtocol] = useState<ProtocolType>('MODBUS_TCP');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Protocol Details
  const [host, setHost] = useState('192.168.1.100');
  const [port, setPort] = useState(502);
  const [slaveId, setSlaveId] = useState(1);
  
  const [brokerUrl, setBrokerUrl] = useState('mqtt://broker.getware.cloud:1883');
  const [topic, setTopic] = useState('getware/tenant/device/telemetry');

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
      location: location || 'Planta Industrial',
      description: description || 'Equipamento cadastrado pelo usuário'
    });

    // Reset Form
    setName('');
    setIdentifier('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Cadastro & Configuração de Dispositivos</h1>
          <p className="text-xs text-isa-muted mt-1">
            Gerencie os equipamentos conectados via protocolo Modbus TCP/RTU e MQTT.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-mono font-semibold transition-all shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Dispositivo</span>
        </button>
      </div>

      {/* Devices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="bg-isa-surface border border-isa-border p-5 rounded-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-slate-100">{device.name}</h3>
                  <p className="text-xs font-mono text-isa-muted">{device.identifier} • {device.location}</p>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                device.isOnline ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {device.isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            <p className="text-xs text-slate-400">{device.description}</p>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Protocolo:</span>
                <span className="text-sky-400 font-bold">{device.protocol}</span>
              </div>
              {device.protocol === 'MQTT' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Broker:</span>
                    <span className="text-slate-300">{(device.protocolConfig as any).brokerUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tópico:</span>
                    <span className="text-slate-300">{(device.protocolConfig as any).topic}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">IP Host / Porta:</span>
                    <span className="text-slate-300">{(device.protocolConfig as any).host}:{(device.protocolConfig as any).port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Slave ID Modbus:</span>
                    <span className="text-slate-300">ID {(device.protocolConfig as any).slaveId}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => deleteDevice(device.id)}
                className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitNewDevice} className="bg-isa-surface border border-isa-border p-6 rounded-xl max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-100">Cadastrar Novo Dispositivo</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-slate-300">Nome do Equipamento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CLP Forno Indução 02"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-300">Identificador (MAC/Serial):</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: MODBUS-PLC-02"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-mono text-slate-300">Protocolo Industrial:</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as ProtocolType)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="MODBUS_TCP">Modbus TCP (Ethernet Direct)</option>
                <option value="MODBUS_RTU">Modbus RTU (Serial via Gateway Getware)</option>
                <option value="MQTT">MQTT Direct Cloud Broker</option>
              </select>
            </div>

            {/* Protocol Conditional Fields */}
            {protocol === 'MQTT' ? (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div>
                  <label className="font-mono text-slate-400">Broker URL:</label>
                  <input
                    type="text"
                    value={brokerUrl}
                    onChange={(e) => setBrokerUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="font-mono text-slate-400">Tópico de Telemetria:</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-slate-200 mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="font-mono text-slate-400">IP Host:</label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="font-mono text-slate-400">Porta Modbus:</label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="font-mono text-slate-400">Slave ID:</label>
                  <input
                    type="number"
                    value={slaveId}
                    onChange={(e) => setSlaveId(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-slate-200 mt-1"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3 border-t border-isa-border">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-mono font-semibold transition-colors"
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
