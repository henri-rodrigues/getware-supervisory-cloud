import React from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { Settings, Database, Clock, Key, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { geminiApiKey, setGeminiApiKey, tenantName } = useSupervisoryStore();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">Configurações & Parâmetros do Supervisório</h1>
        <p className="text-xs text-isa-muted mt-1">
          Ajustes de banco de dados Firebase, política de retenção temporal, chaves de API e integração com Telegram/WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firebase Config Card */}
        <div className="bg-isa-surface border border-isa-border p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-base text-slate-100">Banco de Dados Firebase</h2>
              <p className="text-xs text-isa-muted">Firestore & Realtime Database Prototipagem</p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Status Conexão:</span>
              <span className="text-emerald-400 font-semibold">ONLINE (Ativo)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Projeto Firebase:</span>
              <span className="text-slate-200">getware-supervisory</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tempo de Polling Rtdb:</span>
              <span className="text-sky-400 font-bold">10 Hz (Sub-segundo)</span>
            </div>
          </div>
        </div>

        {/* Data Retention Card */}
        <div className="bg-isa-surface border border-isa-border p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-base text-slate-100">Política de Retenção de Telemetria</h2>
              <p className="text-xs text-isa-muted">Expurgo Automático de Dados Históricos</p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Retenção Padrão:</span>
              <span className="text-purple-400 font-bold">Até 30 dias de histórico</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Configuração de Usuário:</span>
              <span className="text-slate-200">7, 15 ou 30 dias por Tag</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Auto-Cleanup Job:</span>
              <span className="text-emerald-400">Agendado (Diário)</span>
            </div>
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="bg-isa-surface border border-isa-border p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-600 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-base text-slate-100">API Google Gemini 2.5 Flash</h2>
              <p className="text-xs text-isa-muted">Chave de IA para Relatórios por Prompt</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-mono text-slate-300">Chave da API Gemini:</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 font-mono text-slate-100"
            />
          </div>
        </div>

        {/* Telegram & WhatsApp Credentials */}
        <div className="bg-isa-surface border border-isa-border p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-base text-slate-100">Disparador Telegram & WhatsApp</h2>
              <p className="text-xs text-isa-muted">Canais de Alertas Críticos (HH/LL)</p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Bot Telegram:</span>
              <span className="text-emerald-400 font-semibold">@GetwareSCADABot (Ativo)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">WhatsApp Webhook:</span>
              <span className="text-slate-200">Evolution API Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
