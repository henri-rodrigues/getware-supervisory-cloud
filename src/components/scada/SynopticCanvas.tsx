import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { Tag, AlarmSeverity } from '../../types';
import { Flame, Droplets, Gauge, Activity, Power, Sliders, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SynopticCanvas: React.FC = () => {
  const { tags, writeTagValue, isSimulatingTelemetry, toggleSimulation } = useSupervisoryStore();
  const [selectedTagForWrite, setSelectedTagForWrite] = useState<Tag | null>(null);
  const [writeInputValue, setWriteInputValue] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
    <div className="bg-white text-slate-800 p-6 space-y-6 max-w-7xl mx-auto font-sans min-h-screen select-none">
      {/* Header Banner ISA-101 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-xl text-slate-900">Sinóptico HMI • Mapa da Planta</h1>
            <span className="bg-sky-100 text-sky-800 text-xs px-2 py-0.5 rounded font-semibold">
              Processo Ativo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoramento SCADA em tempo real (Norma ISA-101 Situational Awareness).
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-mono">
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTelemetry ? 'animate-spin text-sky-600' : 'text-amber-500'}`} />
            <span className="text-slate-500">Polling 10Hz:</span>
            <span className="font-bold text-slate-800">{isSimulatingTelemetry ? 'Ativo' : 'Pausado'}</span>
          </div>
          <button
            onClick={toggleSimulation}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-medium transition-colors"
          >
            {isSimulatingTelemetry ? 'Pausar' : 'Retomar'}
          </button>
        </div>
      </div>

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg flex items-center space-x-2 text-xs font-semibold animate-bounce shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Comando de Escrita enviado com sucesso ao CLP Modbus/MQTT!</span>
        </div>
      )}

      {/* ISA-101 SCADA CANVAS GRAPHICS AREA */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden min-h-[500px] shadow-xs">
        
        {/* Legend ISA-101 Standard */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-600 mb-6 pb-4 border-b border-slate-200">
          <span className="font-bold text-slate-800">ISA-101 Standard Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-slate-400" />
            <span>Normal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-sky-500" />
            <span>Fluxo Ativo</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span>Advertência</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-red-600 animate-pulse" />
            <span>Alarme Crítico</span>
          </div>
        </div>

        {/* Industrial Diagram Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch relative">
          
          {/* Equipment 1: Forno de Indução Principal */}
          <div className={`p-5 rounded-xl border transition-all ${
            tempAlarmState === 'CRITICAL_HH'
              ? 'bg-red-50 border-red-500 shadow-md'
              : tempAlarmState === 'WARNING_H'
              ? 'bg-amber-50 border-amber-400'
              : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tempAlarmState === 'CRITICAL_HH' ? 'bg-red-600 text-white' : 'bg-slate-100 text-amber-500 border border-slate-300'
                }`}>
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Forno de Indução 01</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Modbus ID: 40001</p>
                </div>
              </div>
              
              <button
                onClick={() => handleOpenWriteModal(tempTag)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-medium text-slate-700 flex items-center space-x-1"
              >
                <Sliders className="w-3 h-3 text-slate-500" />
                <span>Ajustar</span>
              </button>
            </div>

            {/* Visual Furnace Box */}
            <div className="h-32 bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden my-3">
              <Flame className={`w-12 h-12 mb-1 transition-all ${
                tempAlarmState === 'CRITICAL_HH' ? 'text-red-500 animate-bounce' : 'text-amber-500'
              }`} />
              <span className="text-[10px] font-mono text-slate-500">Zona de Fusão 850°C Max</span>
            </div>

            {/* Readout Display */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-600 font-medium">Temperatura Atual:</span>
              <div className="flex items-baseline space-x-1">
                <span className={`text-2xl font-bold ${
                  tempAlarmState === 'CRITICAL_HH' ? 'text-red-600' : 'text-slate-900'
                }`}>
                  {tempTag.currentValue}
                </span>
                <span className="text-xs text-blue-600 font-bold">{tempTag.unit}</span>
              </div>
            </div>
          </div>

          {/* Equipment 2: Pressão da Câmara */}
          <div className="p-5 rounded-xl border bg-white border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 text-blue-600 flex items-center justify-center">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Pressão da Câmara</h3>
                    <p className="text-[10px] text-slate-500 font-mono">Modbus ID: 40003</p>
                  </div>
                </div>
              </div>

              {/* Gauge Display */}
              <div className="my-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Manômetro Digital</p>
                <div className="text-3xl font-mono font-bold text-blue-600">
                  {pressTag.currentValue} <span className="text-sm text-slate-500">{pressTag.unit}</span>
                </div>
              </div>
            </div>

            {/* Active Piping Flow Visual */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
                <Activity className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Linha Pneumática:</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                FLUXO OK
              </span>
            </div>
          </div>

          {/* Equipment 3: Tanque de Refrigeração */}
          <div className="p-5 rounded-xl border bg-white border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 text-blue-600 flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Tanque de Refrigeração</h3>
                    <p className="text-[10px] text-slate-500 font-mono">MQTT Gateway</p>
                  </div>
                </div>
              </div>

              <div className="my-3 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600">Nível do Fluido:</span>
                  <span className="font-bold text-blue-600">{levelTag.currentValue} %</span>
                </div>
                <div className="h-24 bg-slate-100 rounded-lg border border-slate-200 p-1 flex items-end">
                  <div 
                    className="w-full bg-blue-500 rounded transition-all duration-500 relative"
                    style={{ height: `${Math.min(100, Math.max(5, Number(levelTag.currentValue) || 0))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Circulation Pump Control Toggle */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-medium">
                <Power className={`w-4 h-4 ${pumpTag.currentValue ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-slate-700">Bomba Circuladora:</span>
              </div>
              <button
                onClick={() => handleOpenWriteModal(pumpTag)}
                className={`px-3 py-1 rounded font-mono text-xs font-bold transition-all border ${
                  pumpTag.currentValue
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {pumpTag.currentValue ? 'LIGADA' : 'DESLIGADA'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Write Command Modal */}
      {selectedTagForWrite && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 p-6 rounded-xl max-w-md w-full shadow-2xl space-y-4 text-slate-800">
            <div className="flex items-center space-x-2 text-blue-600">
              <Sliders className="w-5 h-5" />
              <h3 className="font-bold text-lg text-slate-900">Comando de Escrita SCADA</h3>
            </div>

            <p className="text-xs text-slate-600">
              Você está alterando o valor da variável <strong className="text-slate-900">{selectedTagForWrite.name}</strong> ({selectedTagForWrite.address}).
            </p>

            {selectedTagForWrite.dataType === 'BOOLEAN' ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setWriteInputValue('true')}
                  className={`py-2 rounded font-bold text-xs border transition-colors ${
                    writeInputValue === 'true' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  LIGAR (TRUE)
                </button>
                <button
                  onClick={() => setWriteInputValue('false')}
                  className={`py-2 rounded font-bold text-xs border transition-colors ${
                    writeInputValue === 'false' ? 'bg-red-600 text-white border-red-600' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  DESLIGAR (FALSE)
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Novo Valor Desejado ({selectedTagForWrite.unit}):</label>
                <input
                  type="number"
                  step="0.1"
                  value={writeInputValue}
                  onChange={(e) => setWriteInputValue(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedTagForWrite(null)}
                className="px-4 py-2 rounded text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteWrite}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow-xs transition-colors"
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
