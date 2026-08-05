import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { DataType, AccessType } from '../../types';
import { Tag as TagIcon, Plus, Trash2, Clock } from 'lucide-react';

export const TagManager: React.FC = () => {
  const { tags, devices, addTag, deleteTag } = useSupervisoryStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [deviceId, setDeviceId] = useState(devices[0]?.id || '');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('40005');
  const [dataType, setDataType] = useState<DataType>('FLOAT32');
  const [accessType, setAccessType] = useState<AccessType>('READ');
  const [unit, setUnit] = useState('°C');
  const [retentionDays, setRetentionDays] = useState(30);

  // Setpoints
  const [alarmLL, setAlarmLL] = useState('500');
  const [alarmL, setAlarmL] = useState('650');
  const [alarmH, setAlarmH] = useState('900');
  const [alarmHH, setAlarmHH] = useState('950');

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    addTag({
      deviceId,
      tenantId: 'tenant-01',
      name,
      address,
      dataType,
      accessType,
      scaleFactor: 1.0,
      offset: 0,
      unit,
      alarmLL: alarmLL ? Number(alarmLL) : undefined,
      alarmL: alarmL ? Number(alarmL) : undefined,
      alarmH: alarmH ? Number(alarmH) : undefined,
      alarmHH: alarmHH ? Number(alarmHH) : undefined,
      retentionDays: Number(retentionDays)
    });

    setName('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white text-slate-800 p-6 space-y-6 max-w-7xl mx-auto font-sans min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-slate-900">Tabela de Variáveis (Parâmetros SCADA)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Mapeamento de registradores Modbus/MQTT, setpoints de alarme e retenção de telemetria.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Tag</span>
        </button>
      </div>

      {/* Tags Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <th className="pb-3">Variável (Tag)</th>
              <th className="pb-3">Dispositivo</th>
              <th className="pb-3">Registrador / Path</th>
              <th className="pb-3">Tipo Dado</th>
              <th className="pb-3">Acesso</th>
              <th className="pb-3">Valor Atual</th>
              <th className="pb-3">Setpoints (LL / L / H / HH)</th>
              <th className="pb-3">Retenção</th>
              <th className="pb-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tags.map((t) => {
              const dev = devices.find(d => d.id === t.deviceId);
              return (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-bold text-slate-900 flex items-center space-x-2">
                    <TagIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t.name}</span>
                  </td>
                  <td className="py-3 text-slate-600">{dev?.name || 'Equipamento'}</td>
                  <td className="py-3 text-blue-600 font-bold">{t.address}</td>
                  <td className="py-3 text-slate-700">{t.dataType}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      t.accessType === 'READ_WRITE' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {t.accessType}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900">
                    {String(t.currentValue)} <span className="text-slate-500 text-[10px]">{t.unit}</span>
                  </td>
                  <td className="py-3 text-slate-600">
                    <span className="text-slate-400">{t.alarmLL ?? '—'}</span> / <span className="text-slate-400">{t.alarmL ?? '—'}</span> / <span className="text-amber-600 font-semibold">{t.alarmH ?? '—'}</span> / <span className="text-red-600 font-semibold">{t.alarmHH ?? '—'}</span>
                  </td>
                  <td className="py-3 text-purple-700 font-semibold">{t.retentionDays} dias</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteTag(t.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Excluir Tag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Add Tag */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTag} className="bg-white border border-slate-300 p-6 rounded-xl max-w-lg w-full shadow-2xl space-y-4 text-slate-800">
            <h3 className="font-bold text-lg text-slate-900">Cadastrar Nova Variável (Tag)</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Dispositivo:</label>
                <select
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-900"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Nome da Tag:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pressao_Saida_01"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Registrador/Path:</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 font-mono text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Tipo de Dado:</label>
                <select
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value as DataType)}
                  className="w-full border border-slate-300 rounded p-2 font-mono text-slate-900"
                >
                  <option value="FLOAT32">FLOAT32</option>
                  <option value="INT16">INT16</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                  <option value="STRING">STRING</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Unidade:</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>
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
                Salvar Tag
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
