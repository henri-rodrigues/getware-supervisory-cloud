import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { CheckCircle2, MessageSquare } from 'lucide-react';

export const AlarmCenter: React.FC = () => {
  const { alarms, acknowledgeAlarm, notifications } = useSupervisoryStore();
  const [operatorName, setOperatorName] = useState('Eng. Operador Turno A');
  const [activeTab, setActiveTab] = useState<'alarms' | 'notifications'>('alarms');

  const handleAck = (id: string) => {
    acknowledgeAlarm(id, operatorName);
  };

  return (
    <div className="bg-white text-slate-800 p-6 space-y-6 max-w-7xl mx-auto font-sans min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-xl text-slate-900">Central de Alarmes & Notificações</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de ocorrências ISA-101 e registros de disparo de mensagens.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('alarms')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'alarms' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alarmes Ativos ({alarms.filter(a => !a.isAcknowledged).length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'notifications' ? 'bg-white text-purple-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Notificações Telegram/WhatsApp
          </button>
        </div>
      </div>

      {activeTab === 'alarms' ? (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
            <span className="text-slate-700 font-medium">Operador Autenticado para Reconhecimento (ACK):</span>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="bg-white border border-slate-300 rounded px-3 py-1 text-slate-900 w-64 focus:outline-none"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Severidade</th>
                  <th className="pb-3">Horário</th>
                  <th className="pb-3">Equipamento</th>
                  <th className="pb-3">Variável (Tag)</th>
                  <th className="pb-3">Valor Lido / Setpoint</th>
                  <th className="pb-3">Mensagem do Alarme</th>
                  <th className="pb-3 text-right">Status ACK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alarms.map((a) => (
                  <tr key={a.id} className={`hover:bg-slate-50 transition-colors ${!a.isAcknowledged ? 'bg-red-50/50' : ''}`}>
                    <td className="py-3 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        a.severity === 'CRITICAL_HH' || a.severity === 'CRITICAL_LL'
                          ? 'bg-red-100 text-red-800 font-bold'
                          : 'bg-amber-100 text-amber-800 font-bold'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{new Date(a.timestamp).toLocaleTimeString('pt-BR')}</td>
                    <td className="py-3 text-slate-900 font-semibold">{a.deviceName}</td>
                    <td className="py-3 text-blue-600 font-bold">{a.tagName}</td>
                    <td className="py-3 font-bold text-slate-900">
                      {a.triggerValue} <span className="text-slate-500 text-[10px]">(Ref: {a.setpointValue})</span>
                    </td>
                    <td className="py-3 text-slate-700 max-w-xs truncate">{a.message}</td>
                    <td className="py-3 text-right">
                      {a.isAcknowledged ? (
                        <span className="text-emerald-700 font-semibold flex items-center justify-end space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ACK por {a.acknowledgedBy}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAck(a.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
                        >
                          Dar ACK
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
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="font-bold text-base text-slate-900">Logs de Disparo Multi-Canal</h2>
            <span className="text-xs font-mono text-purple-700 font-bold">Telegram Bot & WhatsApp Webhook</span>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${n.channel === 'TELEGRAM' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="font-bold text-slate-900">{n.channel}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-purple-700 font-semibold">{n.recipient}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{new Date(n.timestamp).toLocaleTimeString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-mono">{n.content}</p>
                  </div>
                </div>

                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
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
