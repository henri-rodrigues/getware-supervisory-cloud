import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { DataType, AccessType } from '../../types';
import { Tag as TagIcon, Plus, Trash2, Sliders, Database, Clock } from 'lucide-react';

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Tabela de Variáveis (Tags SCADA)</h1>
          <p className="text-xs text-isa-muted mt-1">
            Mapeamento de registradores Modbus/MQTT, setpoints de alarme ISA-101 e política de retenção de dados temporais.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-mono font-semibold transition-all shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Tag</span>
        </button>
      </div>

      {/* Tags Table */}
      <div className="bg-isa-surface border border-isa-border rounded-xl p-5 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-isa-border text-isa-muted uppercase text-[10px]">
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
          <tbody className="divide-y divide-isa-border/60">
            {tags.map((t) => {
              const dev = devices.find(d => d.id === t.deviceId);
              return (
                <tr key={t.id} className="hover:bg-isa-panel/50 transition-colors">
                  <td className="py-3 font-bold text-slate-100 flex items-center space-x-2">
                    <TagIcon className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.name}</span>
                  </td>
                  <td className="py-3 text-isa-muted">{dev?.name || 'Equipamento'}</td>
                  <td className="py-3 text-sky-400">{t.address}</td>
                  <td className="py-3 text-slate-300">{t.dataType}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      t.accessType === 'READ_WRITE' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t.accessType}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-100">
                    {String(t.currentValue)} <span className="text-isa-muted text-[10px]">{t.unit}</span>
                  </td>
                  <td className="py-3 text-slate-300">
                    <span className="text-slate-500">{t.alarmLL ?? '—'}</span> / <span className="text-slate-500">{t.alarmL ?? '—'}</span> / <span className="text-amber-400 font-semibold">{t.alarmH ?? '—'}</span> / <span className="text-red-400 font-semibold">{t.alarmHH ?? '—'}</span>
                  </td>
                  <td className="py-3 text-purple-400 font-semibold">{t.retentionDays} dias</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteTag(t.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTag} className="bg-isa-surface border border-isa-border p-6 rounded-xl max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-100">Cadastrar Nova Variável (Tag)</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-slate-300">Dispositivo:</label>
                <select
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-slate-100"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-300">Nome da Tag:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pressao_Saida_01"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-slate-300">Registrador/Path:</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-300">Tipo de Dado:</label>
                <select
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value as DataType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-slate-100"
                >
                  <option value="FLOAT32">FLOAT32</option>
                  <option value="INT16">INT16</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                  <option value="STRING">STRING</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-300">Unidade:</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-slate-100"
                />
              </div>
            </div>

            {/* Setpoints ISA-101 */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <p className="text-[11px] font-mono font-semibold text-sky-400">Setpoints de Alarme (ISA-101):</p>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                <div>
                  <label className="text-slate-400 text-[10px]">Alarme LL</label>
                  <input type="number" value={alarmLL} onChange={(e) => setAlarmLL(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200" />
                </div>
                <div>
                  <label className="text-slate-400 text-[10px]">Alerta L</label>
                  <input type="number" value={alarmL} onChange={(e) => setAlarmL(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200" />
                </div>
                <div>
                  <label className="text-amber-400 text-[10px]">Alerta H</label>
                  <input type="number" value={alarmH} onChange={(e) => setAlarmH(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200" />
                </div>
                <div>
                  <label className="text-red-400 text-[10px]">Alarme HH</label>
                  <input type="number" value={alarmHH} onChange={(e) => setAlarmHH(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200" />
                </div>
              </div>
            </div>

            {/* Data Retention Selection */}
            <div className="space-y-1 text-xs">
              <label className="font-mono text-slate-300 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-purple-400 inline" />
                <span>Política de Retenção de Dados de Telemetria:</span>
              </label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-slate-100"
              >
                <option value={7}>7 dias de retenção</option>
                <option value={15}>15 dias de retenção</option>
                <option value={30}>30 dias de retenção (Máximo Padrão)</option>
              </select>
            </div>

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
                Salvar Tag
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
