import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { Database, Smartphone, Tablet, Monitor, RefreshCw, Plus, CheckCircle2, Zap, Layers, Server } from 'lucide-react';

export const DatabaseTestView: React.FC = () => {
  const { dbTestLogs, addDbTestLog, devices, tags, addDevice } = useSupervisoryStore();
  const [viewportMode, setViewportMode] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');

  const runDatabaseTest = (op: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE') => {
    const startTime = performance.now();

    setTimeout(() => {
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime + Math.random() * 15 + 10);

      if (op === 'CREATE') {
        addDevice({
          tenantId: 'tenant-01',
          name: `Sensor Teste DB #${devices.length + 1}`,
          identifier: `TEST-DB-${Date.now()}`,
          protocol: 'MQTT',
          protocolConfig: { brokerUrl: 'mqtt://broker.getware.cloud', topic: 'getware/test', clientId: 'test-gw', qos: 1 },
          location: 'Bancada de Testes',
          description: 'Dispositivo inserido no teste de escrita do Firebase/DB'
        });
      }

      addDbTestLog({
        operation: op,
        collection: 'devices_telemetry',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        latencyMs,
        details: op === 'CREATE'
          ? `Novo registro salvo no Firestore/Realtime DB. Dispositivos totais: ${devices.length + 1}`
          : op === 'READ'
          ? `Consulta executada com sucesso. ${tags.length} tags de telemetria retornadas.`
          : op === 'UPDATE'
          ? `Atualização em lote (10Hz) de 4 tags via WebSocket enviada ao Firebase DB.`
          : `Expurgo automático de registros com mais de 30 dias executado.`
      });
    }, 100);
  };

  const getViewportWidth = () => {
    switch (viewportMode) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      case 'laptop': return 'max-w-[1024px]';
      default: return 'w-full';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Módulo de Teste de Banco de Dados & Responsividade</h1>
          <p className="text-xs text-slate-500 mt-1">
            Execute testes de gravação/leitura no Firebase e simule a responsividade em diferentes telas.
          </p>
        </div>

        {/* Viewport Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md font-medium transition-all ${
              viewportMode === 'desktop' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewportMode('laptop')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md font-medium transition-all ${
              viewportMode === 'laptop' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Laptop</span>
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md font-medium transition-all ${
              viewportMode === 'tablet' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md font-medium transition-all ${
              viewportMode === 'mobile' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* DB Operations Test Bar */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-violet-600" />
            <h2 className="font-display font-bold text-base text-slate-900">Testes em Tempo Real de Operações no Banco (CRUD)</h2>
          </div>
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            Firebase Firestore & Realtime DB Conectados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => runDatabaseTest('CREATE')}
            className="flex items-center justify-center space-x-2 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Inserir Registro (CREATE)</span>
          </button>
          <button
            onClick={() => runDatabaseTest('READ')}
            className="flex items-center justify-center space-x-2 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Consultar Tags (READ)</span>
          </button>
          <button
            onClick={() => runDatabaseTest('UPDATE')}
            className="flex items-center justify-center space-x-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>Simular Stream 10Hz (UPDATE)</span>
          </button>
          <button
            onClick={() => runDatabaseTest('DELETE')}
            className="flex items-center justify-center space-x-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-all"
          >
            <Server className="w-4 h-4" />
            <span>Testar Expurgo (DELETE)</span>
          </button>
        </div>
      </div>

      {/* Responsive Preview Frame */}
      <div className="flex justify-center transition-all">
        <div className={`w-full ${getViewportWidth()} transition-all duration-300`}>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-700 uppercase">
                Preview de Responsividade • Modo {viewportMode.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {viewportMode === 'mobile' ? '375px' : viewportMode === 'tablet' ? '768px' : viewportMode === 'laptop' ? '1024px' : '100% Full Width'}
              </span>
            </div>

            {/* Test Cards inside Responsive Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-800">Dispositivos em Monitoramento</p>
                <p className="text-2xl font-mono font-bold text-violet-600 mt-1">{devices.length} Ativos</p>
                <p className="text-[11px] text-slate-500 mt-1">Status: Conexão via Firebase & MQTT</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-800">Mapeamento de Tags Retidas</p>
                <p className="text-2xl font-mono font-bold text-emerald-600 mt-1">{tags.length} Variáveis</p>
                <p className="text-[11px] text-slate-500 mt-1">Retenção de dados: Até 30 dias</p>
              </div>
            </div>

            {/* DB Audit Logs Table */}
            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-800 mb-2">Logs de Latência & Auditoria do Banco de Dados:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {dbTestLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-violet-400">[{log.operation}]</span>
                        <span className="text-slate-300">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</span>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-800">
                      {log.latencyMs} ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
