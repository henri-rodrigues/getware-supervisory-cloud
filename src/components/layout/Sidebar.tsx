import React from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { 
  Bell, 
  FileText, 
  Settings, 
  Calendar, 
  Wrench, 
  Map, 
  Monitor,
  Database
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, alarms, theme } = useSupervisoryStore();
  const activeAlarmsCount = alarms.filter(a => !a.isAcknowledged).length;
  const isLight = theme === 'light';

  return (
    <aside className={`w-56 shrink-0 border-r select-none flex flex-col justify-between min-h-[calc(100vh-3rem)] text-xs font-sans transition-colors ${
      isLight ? 'bg-[#f0f2f5] border-slate-200 text-slate-800' : 'bg-isa-surface border-isa-border text-isa-text'
    }`}>
      
      <div className="p-3 space-y-4">
        
        {/* Main Section: Planta */}
        <div>
          <div className="flex items-center space-x-2 px-2 py-1.5 text-slate-700 font-medium cursor-pointer" onClick={() => setActiveView('devices')}>
            <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              b
            </div>
            <span className="text-sm font-semibold text-slate-800">Planta</span>
          </div>

          {/* Submenu under Planta */}
          <div className="ml-2 mt-1 space-y-0.5">
            <button
              onClick={() => setActiveView('devices')}
              className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'devices'
                  ? 'bg-slate-500 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              Dispositivos
            </button>

            <button
              onClick={() => setActiveView('synoptic')}
              className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'synoptic'
                  ? 'bg-slate-500 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              Mapa (Sinóptico)
            </button>

            <button
              onClick={() => setActiveView('hierarchy')}
              className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'hierarchy'
                  ? 'bg-slate-500 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              Secondary map
            </button>
          </div>
        </div>

        {/* Action Menu Sections with Color Circles */}
        <div className="space-y-1 pt-1">
          
          {/* Alarme/evento */}
          <button
            onClick={() => setActiveView('alarms')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
              activeView === 'alarms'
                ? 'bg-slate-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Bell className="w-3 h-3" />
              </div>
              <span className="font-semibold">Alarme/evento</span>
            </div>
            {activeAlarmsCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {activeAlarmsCount}
              </span>
            )}
          </button>

          {/* Relatório */}
          <button
            onClick={() => setActiveView('ai-reports')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
              activeView === 'ai-reports'
                ? 'bg-slate-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <FileText className="w-3 h-3" />
              </div>
              <span className="font-semibold">Relatório</span>
            </div>
          </button>

          {/* Configuração */}
          <button
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
              activeView === 'settings'
                ? 'bg-slate-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Settings className="w-3 h-3" />
              </div>
              <span className="font-semibold">Configuração</span>
            </div>
          </button>

          {/* Atividade / Overview */}
          <button
            onClick={() => setActiveView('overview')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
              activeView === 'overview'
                ? 'bg-slate-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Calendar className="w-3 h-3" />
              </div>
              <span className="font-semibold">Atividade</span>
            </div>
          </button>

          {/* Tools */}
          <button
            onClick={() => setActiveView('tags')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
              activeView === 'tags'
                ? 'bg-slate-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Wrench className="w-3 h-3" />
              </div>
              <span className="font-semibold">Tools</span>
            </div>
          </button>

          {/* Teste Banco de Dados */}
          <button
            onClick={() => setActiveView('db-test')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all ${
              activeView === 'db-test'
                ? 'bg-slate-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <Database className="w-3 h-3" />
              </div>
              <span className="font-semibold">Teste DB</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Text */}
      <div className="p-3 text-slate-400 text-[11px] font-normal tracking-tight">
        Págs sistema
      </div>
    </aside>
  );
};
