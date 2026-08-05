import React from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { Cpu, BellRing, Tag as TagIcon, Database, ShieldCheck, Activity } from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const { devices, tags, alarms, tenantName } = useSupervisoryStore();
  const onlineDevicesCount = devices.filter(d => d.isOnline).length;
  const unacknowledgedAlarms = alarms.filter(a => !a.isAcknowledged);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">Visão Geral da Planta</h1>
        <p className="text-xs text-isa-muted mt-1">
          Indicadores em tempo real e status de saúde do ecossistema Getware SCADA para <strong className="text-slate-300">{tenantName}</strong>.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-isa-surface border border-isa-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-isa-muted">Dispositivos Conectados</p>
            <h2 className="text-2xl font-bold font-mono text-slate-100 mt-1">{onlineDevicesCount} / {devices.length}</h2>
            <span className="text-[10px] text-emerald-400 font-mono">MQTT & Modbus TCP/RTU</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-950/60 border border-sky-800 flex items-center justify-center text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-isa-surface border border-isa-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-isa-muted">Alarmes Não Reconhecidos</p>
            <h2 className={`text-2xl font-bold font-mono mt-1 ${unacknowledgedAlarms.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {unacknowledgedAlarms.length}
            </h2>
            <span className="text-[10px] text-isa-muted font-mono">Norma ISA-101 (HH/H/L/LL)</span>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
            unacknowledgedAlarms.length > 0 ? 'bg-red-950/60 border-red-800 text-red-400 animate-pulse' : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
          }`}>
            <BellRing className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-isa-surface border border-isa-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-isa-muted">Total de Tags Ativas</p>
            <h2 className="text-2xl font-bold font-mono text-slate-100 mt-1">{tags.length}</h2>
            <span className="text-[10px] text-sky-400 font-mono">Polling a 10Hz</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <TagIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-isa-surface border border-isa-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-isa-muted">Janela de Retenção</p>
            <h2 className="text-2xl font-bold font-mono text-slate-100 mt-1">Até 30 dias</h2>
            <span className="text-[10px] text-purple-400 font-mono">Firebase Realtime DB</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-800 flex items-center justify-center text-purple-400">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Summary Table of Tags and Devices */}
      <div className="bg-isa-surface border border-isa-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-isa-border">
          <h2 className="font-display font-semibold text-base text-slate-100">Status das Variáveis Operacionais</h2>
          <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 inline animate-pulse" />
            <span>ISA-101 Data Stream</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-isa-border text-isa-muted uppercase text-[10px]">
                <th className="pb-2">Tag / Variável</th>
                <th className="pb-2">Dispositivo</th>
                <th className="pb-2">Endereço/Registrador</th>
                <th className="pb-2">Valor Atual</th>
                <th className="pb-2">Limites (LL - HH)</th>
                <th className="pb-2">Retenção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-isa-border/60">
              {tags.map((t) => (
                <tr key={t.id} className="hover:bg-isa-panel/50 transition-colors">
                  <td className="py-2.5 font-bold text-slate-200">{t.name}</td>
                  <td className="py-2.5 text-isa-muted">{t.deviceId === 'dev-01' ? 'CLP Forno 01' : 'Gateway Chiller'}</td>
                  <td className="py-2.5 text-sky-400">{t.address}</td>
                  <td className="py-2.5 font-bold text-slate-100">
                    {String(t.currentValue)} <span className="text-isa-muted text-[10px]">{t.unit}</span>
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {t.alarmLL || '—'} / {t.alarmHH || '—'}
                  </td>
                  <td className="py-2.5 text-purple-400">{t.retentionDays} dias</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
