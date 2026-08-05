import React from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { Cpu, BellRing, Tag as TagIcon, Database, Activity } from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const { devices, tags, alarms, tenantName } = useSupervisoryStore();
  const onlineDevicesCount = devices.filter(d => d.isOnline).length;
  const unacknowledgedAlarms = alarms.filter(a => !a.isAcknowledged);

  return (
    <div className="bg-white text-slate-800 p-6 space-y-6 max-w-7xl mx-auto font-sans min-h-screen">
      {/* Title */}
      <div>
        <h1 className="font-bold text-xl text-slate-900">Visão Geral da Planta</h1>
        <p className="text-xs text-slate-500 mt-1">
          Indicadores em tempo real e status de saúde do ecossistema Getware SCADA para <strong className="text-slate-700">{tenantName}</strong>.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">Dispositivos Conectados</p>
            <h2 className="text-2xl font-bold font-mono text-slate-900 mt-1">{onlineDevicesCount} / {devices.length}</h2>
            <span className="text-[10px] text-emerald-600 font-semibold">MQTT & Modbus TCP/RTU</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">Alarmes Não Reconhecidos</p>
            <h2 className={`text-2xl font-bold font-mono mt-1 ${unacknowledgedAlarms.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {unacknowledgedAlarms.length}
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Norma ISA-101 (HH/H/L/LL)</span>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
            unacknowledgedAlarms.length > 0 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
          }`}>
            <BellRing className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">Total de Tags Ativas</p>
            <h2 className="text-2xl font-bold font-mono text-slate-900 mt-1">{tags.length}</h2>
            <span className="text-[10px] text-blue-600 font-mono">Polling a 10Hz</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <TagIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-slate-500">Janela de Retenção</p>
            <h2 className="text-2xl font-bold font-mono text-slate-900 mt-1">Até 30 dias</h2>
            <span className="text-[10px] text-purple-600 font-mono">Firebase Realtime DB</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Summary Table of Tags and Devices */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="font-bold text-base text-slate-900">Status das Variáveis Operacionais</h2>
          <span className="text-xs font-mono text-emerald-600 flex items-center space-x-1 font-semibold">
            <Activity className="w-3.5 h-3.5 inline animate-pulse" />
            <span>ISA-101 Data Stream</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <th className="pb-2">Tag / Variável</th>
                <th className="pb-2">Dispositivo</th>
                <th className="pb-2">Endereço/Registrador</th>
                <th className="pb-2">Valor Atual</th>
                <th className="pb-2">Limites (LL - HH)</th>
                <th className="pb-2">Retenção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tags.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 font-bold text-slate-900">{t.name}</td>
                  <td className="py-2.5 text-slate-600">{t.deviceId === 'dev-01' ? 'CLP Forno 01' : 'Gateway Chiller'}</td>
                  <td className="py-2.5 text-blue-600 font-bold">{t.address}</td>
                  <td className="py-2.5 font-bold text-slate-900">
                    {String(t.currentValue)} <span className="text-slate-500 text-[10px]">{t.unit}</span>
                  </td>
                  <td className="py-2.5 text-slate-600">
                    {t.alarmLL || '—'} / {t.alarmHH || '—'}
                  </td>
                  <td className="py-2.5 text-purple-600 font-semibold">{t.retentionDays} dias</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
