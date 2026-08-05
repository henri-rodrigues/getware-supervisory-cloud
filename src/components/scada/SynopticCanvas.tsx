import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { Tag, AlarmSeverity } from '../../types';
import { Flame, Droplets, Gauge, Activity, Power, Sliders, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SynopticCanvas: React.FC = () => {
  const { tags, writeTagValue, alarms, isSimulatingTelemetry, toggleSimulation } = useSupervisoryStore();
  const [selectedTagForWrite, setSelectedTagForWrite] = useState<Tag | null>(null);
  const [writeInputValue, setWriteInputValue] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Helper to find tag by ID or Name
  const getTag = (name: string) => tags.find(t => t.name === name) || tags[0];

  const tempTag = getTag('Temperatura_Forno_01');
  const pressTag = getTag('Pressao_Camara_Vibro');
  const levelTag = getTag('Nivel_Tanque_Refrigeracao');
  const pumpTag = getTag('Status_Bomba_Circulacao');

  const getAlarmState = (tag?: Tag): AlarmSeverity => {
    if (!tag) return 'NORMAL';
    const val = typeof tag.currentValue === 'number' ? tag.currentValue : parseFloat(tag.currentValue as string) || 0;
    if (tag.alarmHH !== undefined && val >= tag.alarmHH) return 'CRITICAL_HH';
    if (tag.alarmH !== undefined && val >= tag.alarmH) return 'WARNING_H';
    if (tag.alarmLL !== undefined && val <= tag.alarmLL) return 'CRITICAL_LL';
    if (tag.alarmL !== undefined && val <= tag.alarmL) return 'WARNING_L';
    return 'NORMAL';
  };

  const tempAlarmState = getAlarmState(tempTag);
  const pressAlarmState = getAlarmState(pressTag);
  const levelAlarmState = getAlarmState(levelTag);

  const handleOpenWriteModal = (tag: Tag) => {
    if (tag.accessType !== 'READ_WRITE') return;
    setSelectedTagForWrite(tag);
    setWriteInputValue(String(tag.currentValue));
  };

  const handleExecuteWrite = () => {
    if (!selectedTagForWrite) return;
    let parsed: number | boolean | string = writeInputValue;
    if (selectedTagForWrite.dataType === 'BOOLEAN') {
      parsed = writeInputValue === 'true' || writeInputValue === '1';
    } else if (selectedTagForWrite.dataType === 'FLOAT32' || selectedTagForWrite.dataType === 'INT16') {
      parsed = parseFloat(writeInputValue) || 0;
    }
    
    writeTagValue(selectedTagForWrite.id, parsed);
    setSelectedTagForWrite(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header Banner ISA-101 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-isa-surface border border-isa-border p-4 rounded-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display font-bold text-xl text-slate-100">Sinóptico ISA-101 • Planta de Indução</h1>
            <span className="bg-sky-950 text-sky-400 text-xs px-2 py-0.5 rounded border border-sky-800 font-mono">
              Processo Ativo
            </span>
          </div>
          <p className="text-xs text-isa-muted mt-0.5">
            Monitoramento SCADA em tempo real conforme norma ISA-101 (Fundo Cinza Neutro Situacional).
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-isa-bg border border-isa-border px-3 py-1.5 rounded-lg font-mono">
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTelemetry ? 'animate-spin text-sky-400' : 'text-amber-400'}`} />
            <span className="text-isa-muted">Polling 10Hz:</span>
            <span className="font-semibold text-slate-200">{isSimulatingTelemetry ? 'Ativo' : 'Pausado'}</span>
          </div>
          <button
            onClick={toggleSimulation}
            className="px-3 py-1.5 rounded-lg bg-isa-panel hover:bg-isa-hover border border-isa-border text-slate-200 transition-colors"
          >
            {isSimulatingTelemetry ? 'Pausar' : 'Retomar'}
          </button>
        </div>
      </div>

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-lg flex items-center space-x-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Comando de Escrita enviado com sucesso ao CLP Modbus/MQTT!</span>
        </div>
      )}

      {/* ISA-101 SCADA CANVAS GRAPHICS AREA */}
      <div className="bg-[#1C2229] border border-isa-border rounded-xl p-6 relative overflow-hidden min-h-[500px]">
        {/* Subtle ISA Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Legend ISA-101 Standard */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-isa-muted mb-6 pb-4 border-b border-isa-border/60">
          <span className="font-semibold text-slate-300">Norma ISA-101 Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-slate-500" />
            <span>Normal (Desaturado)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-sky-500" />
            <span>Fluxo Ativo</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span>Advertência (H/L)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-red-600 animate-pulse" />
            <span>Alarme Crítico (HH/LL)</span>
          </div>
        </div>

        {/* Industrial Diagram Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch relative">
          
          {/* Equipment 1: Forno de Indução Principal */}
          <div className={`p-5 rounded-xl border transition-all ${
            tempAlarmState === 'CRITICAL_HH'
              ? 'bg-red-950/30 border-red-500 shadow-lg shadow-red-950/50 animate-alarm-flash'
              : tempAlarmState === 'WARNING_H'
              ? 'bg-amber-950/20 border-amber-500/80'
              : 'bg-isa-surface border-isa-border'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tempAlarmState === 'CRITICAL_HH' ? 'bg-red-600 text-white' : 'bg-slate-700 text-amber-400'
                }`}>
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-slate-100">Forno de Indução 01</h3>
                  <p className="text-[10px] text-isa-muted font-mono">Modbus ID: 40001 (CLP Forno)</p>
                </div>
              </div>
              
              <button
                onClick={() => handleOpenWriteModal(tempTag)}
                className="px-2 py-1 bg-isa-panel hover:bg-isa-hover border border-isa-border rounded text-[11px] font-mono text-sky-400 flex items-center space-x-1"
                title="Alterar Setpoint de Temperatura"
              >
                <Sliders className="w-3 h-3" />
                <span>Ajustar</span>
              </button>
            </div>

            {/* Visual Furnace Box */}
            <div className="h-32 bg-slate-900/80 border border-slate-700 rounded-lg flex flex-col items-center justify-center relative overflow-hidden my-3">
              <div className={`absolute bottom-0 w-full transition-all duration-500 ${
                tempAlarmState === 'CRITICAL_HH' ? 'bg-red-600/30 h-full' : 'bg-gradient-to-t from-amber-500/20 to-transparent h-2/3'
              }`} />
              <Flame className={`w-12 h-12 mb-1 transition-all ${
                tempAlarmState === 'CRITICAL_HH' ? 'text-red-500 animate-bounce' : 'text-amber-400'
              }`} />
              <span className="text-[10px] font-mono text-slate-400">Zona de Fusão 850°C Max</span>
            </div>

            {/* Readout Display */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">Temperatura Atual:</span>
              <div className="flex items-baseline space-x-1">
                <span className={`text-2xl font-bold ${
                  tempAlarmState === 'CRITICAL_HH' ? 'text-red-400' : tempAlarmState === 'WARNING_H' ? 'text-amber-400' : 'text-slate-100'
                }`}>
                  {tempTag.currentValue}
                </span>
                <span className="text-xs text-sky-400 font-semibold">{tempTag.unit}</span>
              </div>
            </div>

            {/* Setpoints Limits */}
            <div className="mt-3 grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="block text-slate-500">LL</span>
                <span className="text-slate-300">{tempTag.alarmLL}</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="block text-slate-500">L</span>
                <span className="text-slate-300">{tempTag.alarmL}</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="block font-semibold text-amber-400">H</span>
                <span className="text-slate-300">{tempTag.alarmH}</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="block font-semibold text-red-400">HH</span>
                <span className="text-slate-300">{tempTag.alarmHH}</span>
              </div>
            </div>
          </div>

          {/* Equipment 2: Pressão da Câmara & Tubulação de Fluxo */}
          <div className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
            pressAlarmState !== 'NORMAL' ? 'bg-amber-950/20 border-amber-500/80' : 'bg-isa-surface border-isa-border'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 text-sky-400 flex items-center justify-center">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-slate-100">Pressão da Câmara</h3>
                    <p className="text-[10px] text-isa-muted font-mono">Modbus ID: 40003</p>
                  </div>
                </div>
              </div>

              {/* Gauge Display */}
              <div className="my-4 bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <p className="text-[10px] font-mono text-isa-muted uppercase mb-1">Manômetro Digital ISA-101</p>
                <div className="text-3xl font-mono font-bold text-sky-400">
                  {pressTag.currentValue} <span className="text-sm text-slate-400">{pressTag.unit}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((Number(pressTag.currentValue) || 0) / 10) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Active Piping Flow Visual */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Activity className="w-4 h-4 text-sky-400 animate-spin" />
                <span>Linha Pneumática:</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                FLUXO OK
              </span>
            </div>
          </div>

          {/* Equipment 3: Tanque de Refrigeração & Bomba */}
          <div className="p-5 rounded-xl border bg-isa-surface border-isa-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 text-sky-400 flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-slate-100">Tanque de Refrigeração</h3>
                    <p className="text-[10px] text-isa-muted font-mono">Tópico MQTT Gateway</p>
                  </div>
                </div>
              </div>

              {/* Tank Level Bar Visual */}
              <div className="my-3 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Nível do Fluido:</span>
                  <span className="font-bold text-sky-400">{levelTag.currentValue} %</span>
                </div>
                <div className="h-24 bg-slate-950 rounded-lg border border-slate-800 p-1 flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded transition-all duration-500 relative"
                    style={{ height: `${Math.min(100, Math.max(5, Number(levelTag.currentValue) || 0))}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Circulation Pump Control Toggle */}
            <div className="pt-3 border-t border-isa-border flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <Power className={`w-4 h-4 ${pumpTag.currentValue ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-slate-300">Bomba Circuladora:</span>
              </div>
              <button
                onClick={() => handleOpenWriteModal(pumpTag)}
                className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all border ${
                  pumpTag.currentValue
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-700 hover:bg-emerald-900'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {pumpTag.currentValue ? 'LIGADA' : 'DESLIGADA'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Write Command Modal (Safe Operator Access) */}
      {selectedTagForWrite && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-isa-surface border border-isa-border p-6 rounded-xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-sky-400">
              <Sliders className="w-5 h-5" />
              <h3 className="font-display font-bold text-lg text-slate-100">Comando de Escrita SCADA</h3>
            </div>

            <p className="text-xs text-isa-muted">
              Você está alterando o valor da variável <strong className="text-slate-200">{selectedTagForWrite.name}</strong> ({selectedTagForWrite.address}).
            </p>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Valor Atual:</span>
                <span className="text-sky-400 font-bold">{String(selectedTagForWrite.currentValue)} {selectedTagForWrite.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipo de Dado:</span>
                <span className="text-slate-300">{selectedTagForWrite.dataType}</span>
              </div>
            </div>

            {selectedTagForWrite.dataType === 'BOOLEAN' ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setWriteInputValue('true')}
                  className={`py-2 rounded font-mono text-xs font-bold border transition-colors ${
                    writeInputValue === 'true' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  LIGAR (TRUE)
                </button>
                <button
                  onClick={() => setWriteInputValue('false')}
                  className={`py-2 rounded font-mono text-xs font-bold border transition-colors ${
                    writeInputValue === 'false' ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  DESLIGAR (FALSE)
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Novo Valor Desejado ({selectedTagForWrite.unit}):</label>
                <input
                  type="number"
                  step="0.1"
                  value={writeInputValue}
                  onChange={(e) => setWriteInputValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-isa-border">
              <button
                onClick={() => setSelectedTagForWrite(null)}
                className="px-4 py-2 rounded text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteWrite}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-mono font-semibold shadow transition-colors"
              >
                Confirmar & Escrever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
