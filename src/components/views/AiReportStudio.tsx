import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { generateGeminiSCADAReport } from '../../lib/gemini';
import { Sparkles, Send, Key, FileText, CheckCircle2, RefreshCw, Cpu, BrainCircuit } from 'lucide-react';

export const AiReportStudio: React.FC = () => {
  const { tags, devices, alarms, geminiApiKey, setGeminiApiKey, aiReports, addAIReport } = useSupervisoryStore();
  const [prompt, setPrompt] = useState('Gere um relatório completo da planta supervisória destacando potenciais riscos operacionais e predição de falhas.');
  const [isLoading, setIsLoading] = useState(false);
  const [activeReportText, setActiveReportText] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);

  const quickPrompts = [
    'Gere um relatório executivo de desempenho da planta para a gerência de automação.',
    'Analise as variáveis de temperatura do Forno 01 e indique riscos de fadiga de isolamento.',
    'Faça um parecer preditivo do sistema de água gelada (Chiller) e níveis de água dos tanques.',
    'Monte o resumo de passagem de turno destacando os alarmes da ISA-101 registrados hoje.'
  ];

  const handleGenerateReport = async (promptToUse?: string) => {
    const finalPrompt = promptToUse || prompt;
    if (!finalPrompt.trim()) return;

    setIsLoading(true);

    const telemetrySample = tags.map(t => ({
      deviceName: devices.find(d => d.id === t.deviceId)?.name || 'Equipamento',
      tagName: t.name,
      currentValue: t.currentValue,
      unit: t.unit,
      status: t.alarmHH !== undefined && Number(t.currentValue) >= t.alarmHH ? 'CRITICAL_HH' : 'NORMAL'
    }));

    const activeAlarmsCount = alarms.filter(a => !a.isAcknowledged).length;

    try {
      const { reportText, modelUsed } = await generateGeminiSCADAReport(
        finalPrompt,
        telemetrySample,
        activeAlarmsCount,
        geminiApiKey
      );

      setActiveReportText(reportText);
      addAIReport({
        timestamp: new Date().toISOString(),
        prompt: finalPrompt,
        content: reportText,
        summary: `Relatório SCADA gerado em ${new Date().toLocaleTimeString('pt-BR')}`,
        model: modelUsed
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-purple-950/20 border border-purple-800/40 p-5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-900/50 border border-purple-600/50 flex items-center justify-center text-purple-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-purple-100 flex items-center space-x-2">
              <span>IA Studio • Google Gemini 2.5 Flash</span>
              <span className="text-[10px] font-mono bg-purple-900 text-purple-300 px-2 py-0.5 rounded border border-purple-700">
                Modelo LLM Gratuito
              </span>
            </h1>
            <p className="text-xs text-purple-300/80 mt-0.5">
              Gere relatórios customizados e diagnósticos preditivos via prompt alimentados pela amostragem de dados do supervisório.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700/60 rounded-lg text-xs font-mono text-purple-200 transition-colors"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{geminiApiKey ? 'API Key Configurada' : 'Configurar Gemini API Key'}</span>
        </button>
      </div>

      {/* API Key Modal / Drawer */}
      {showKeyInput && (
        <div className="bg-isa-surface border border-isa-border p-4 rounded-xl space-y-2 text-xs font-mono">
          <label className="text-slate-300 block">Sua chave Google Gemini API (Opcional - caso vazia usará o modo mock de demonstração):</label>
          <div className="flex space-x-2">
            <input
              type="password"
              placeholder="Cole sua API Key AIzaSy..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold"
            >
              Salvar Chave
            </button>
          </div>
        </div>
      )}

      {/* Prompt Input Area */}
      <div className="bg-isa-surface border border-isa-border p-5 rounded-xl space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-mono font-semibold text-slate-200 flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span>Digite seu Prompt para a IA (Relatórios, Predições ou Instruções de Turno):</span>
          </label>

          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escreva aqui o que deseja solicitar à IA..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-isa-muted">Sugestões de Prompts Rápidos:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(qp);
                  handleGenerateReport(qp);
                }}
                className="text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded transition-colors text-left"
              >
                💡 {qp}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleGenerateReport()}
            disabled={isLoading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-md"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processando com Gemini 2.5...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gerar Relatório por IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Active Report Output */}
      {activeReportText && (
        <div className="bg-isa-surface border border-purple-800/60 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-isa-border">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <h2 className="font-display font-bold text-lg text-slate-100">Resultado do Relatório Preditivo</h2>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2 py-1 rounded border border-purple-800">
              Modelo: Gemini 2.5 Flash
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-xs font-sans leading-relaxed space-y-2 whitespace-pre-wrap bg-slate-950 p-5 rounded-lg border border-slate-800 text-slate-200">
            {activeReportText}
          </div>
        </div>
      )}

      {/* Report History */}
      {aiReports.length > 0 && (
        <div className="bg-isa-surface border border-isa-border rounded-xl p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-slate-200">Histórico de Relatórios Gerados</h3>
          <div className="space-y-2">
            {aiReports.map((r) => (
              <div
                key={r.id}
                onClick={() => setActiveReportText(r.content)}
                className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-xs font-mono font-bold text-purple-300">{r.prompt}</p>
                  <p className="text-[10px] text-isa-muted font-mono mt-0.5">{r.summary}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Ver Relatório</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
