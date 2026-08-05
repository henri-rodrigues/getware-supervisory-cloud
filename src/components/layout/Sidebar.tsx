import React from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { 
  LayoutDashboard, 
  Monitor, 
  FolderTree, 
  Cpu, 
  Tag as TagIcon, 
  BellRing, 
  Sparkles, 
  Settings,
  LucideIcon
} from 'lucide-react';

interface NavItem {
  id: 'overview' | 'hierarchy' | 'devices' | 'tags' | 'synoptic' | 'alarms' | 'ai-reports' | 'settings';
  label: string;
  icon: LucideIcon;
  badge?: string;
  count?: number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, alarms } = useSupervisoryStore();
  const activeAlarmsCount = alarms.filter(a => !a.isAcknowledged).length;

  const navItems: NavItem[] = [
    { id: 'synoptic', label: 'Sinóptico ISA-101', icon: Monitor, badge: 'HMI' },
    { id: 'overview', label: 'Visão Geral Planta', icon: LayoutDashboard },
    { id: 'hierarchy', label: 'Hierarquia & Sistemas', icon: FolderTree },
    { id: 'devices', label: 'Dispositivos & Gateway', icon: Cpu },
    { id: 'tags', label: 'Tabela de Variáveis', icon: TagIcon },
    { id: 'alarms', label: 'Central de Alarmes', icon: BellRing, count: activeAlarmsCount },
    { id: 'ai-reports', label: 'IA Gemini 2.5 Flash', icon: Sparkles, highlight: true },
    { id: 'settings', label: 'Configurações & DB', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-isa-surface border-r border-isa-border flex flex-col justify-between select-none shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold font-mono tracking-wider text-isa-subtle uppercase">
          Navegação Supervisória
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-isa-panel text-sky-400 border border-sky-500/30 font-semibold shadow-sm'
                  : item.highlight
                  ? 'text-purple-300 hover:bg-purple-950/20 hover:text-purple-200'
                  : 'text-isa-muted hover:bg-isa-hover hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : item.highlight ? 'text-purple-400' : 'text-isa-muted'}`} />
                <span>{item.label}</span>
              </div>

              {item.count !== undefined && item.count > 0 && (
                <span className="bg-red-600/90 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}

              {item.badge && (
                <span className="bg-slate-800 text-sky-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Info */}
      <div className="p-3 border-t border-isa-border bg-isa-bg/50">
        <div className="p-2.5 rounded-lg bg-isa-panel/80 border border-isa-border space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-isa-muted">Norma HMI:</span>
            <span className="font-mono text-emerald-400 font-semibold">ISA-101</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-isa-muted">Banco DB:</span>
            <span className="font-mono text-sky-400">Firebase</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-isa-muted">Retenção:</span>
            <span className="font-mono text-slate-300">Até 30 dias</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
