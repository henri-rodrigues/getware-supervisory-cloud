import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { BellRing, CheckCircle2, Send, ShieldAlert, MessageSquare } from 'lucide-react';

export const AlarmCenter: React.FC = () => {
  const { alarms, acknowledgeAlarm, notifications } = useSupervisoryStore();
  const [operatorName, setOperatorName] = useState('Eng. Operador Turno A');
  const [activeTab, setActiveTab] = useState<'alarms' | 'notifications'>('alarms');

  const handleAck = (id: string) => {
    acknowledgeAlarm(id, operatorName);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Central de Alarmes & Notificações</h1>
          <p className="text-xs text-isa-muted mt-1">
            Gestão de ocorrências normatizadas ISA-101 e registro de mensagens enviadas via Telegram/WhatsApp.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-isa-surface border border-isa-border p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('alarms')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'alarms' ? 'bg-isa-panel text-sky-400 border border-sky-500/30' : 'text-isa-muted hover:text-slate-200'
            }`}
          >
            Alarmes Ativos ({alarms.filter(a => !a.isAcknowledged).length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'notifications' ? 'bg-isa-panel text-purple-400 border border-purple-500/30' : 'text-isa-muted hover:text-slate-200'
            }`}
          >
            Notificações Telegram/WhatsApp
          </button>
        </div>
      </div>

      {activeTab === 'alarms' ? (
        <div className="space-y-4">
          <div className="bg-isa-surface border border-isa-border p-4 rounded-xl flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Operador Autenticado para Reconhecimento (ACK):</span>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-3 py-1 text-slate-100 w-64"
            />
          </div>

          <div className="bg-isa-surface border border-isa-border rounded-xl p-5 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-isa-border text-isa-muted uppercase text-[10px]">
                  <th className="pb-3">Severidade ISA-101</th>
                  <th className="pb-3">Horário</th>
                  <th className="pb-3">Equipamento</th>
                  <th className="pb-3">Variável (Tag)</th>
                  <th className="pb-3">Valor Lido / Setpoint</th>
                  <th className="pb-3">Mensagem do Alarme</th>
                  <th className="pb-3 text-right">Status ACK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-isa-border/60">
                {alarms.map((a) => (
                  <tr key={a.id} className={`hover:bg-isa-panel/50 transition-colors ${!a.isAcknowledged ? 'bg-red-950/10' : ''}`}>
                    <td className="py-3 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        a.severity === 'CRITICAL_HH' || a.severity === 'CRITICAL_LL'
                          ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 text-isa-muted">{new Date(a.timestamp).toLocaleTimeString('pt-BR')}</td>
                    <td className="py-3 text-slate-200 font-semibold">{a.deviceName}</td>
                    <td className="py-3 text-sky-400">{a.tagName}</td>
                    <td className="py-3 font-bold text-slate-100">
                      {a.triggerValue} <span className="text-isa-muted text-[10px]">(Ref: {a.setpointValue})</span>
                    </td>
                    <td className="py-3 text-slate-300 max-w-xs truncate">{a.message}</td>
                    <td className="py-3 text-right">
                      {a.isAcknowledged ? (
                        <span className="text-emerald-400 font-semibold flex items-center justify-end space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ACK por {a.acknowledgedBy}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAck(a.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold shadow transition-colors"
                        >
                          Dar ACK (Confirmar)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Notifications Tab */
        <div className="bg-isa-surface border border-isa-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-isa-border">
            <h2 className="font-display font-semibold text-base text-slate-100">Logs de Disparo Multi-Canal</h2>
            <span className="text-xs font-mono text-purple-400">Telegram Bot & WhatsApp Webhook</span>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-start justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${n.channel === 'TELEGRAM' ? 'bg-sky-950 text-sky-400' : 'bg-emerald-950 text-emerald-400'}`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="font-bold text-slate-200">{n.channel}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-purple-400">{n.recipient}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-isa-muted">{new Date(n.timestamp).toLocaleTimeString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-mono">{n.content}</p>
                  </div>
                </div>

                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  {n.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
