import React from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { FolderTree, Cpu, Tag as TagIcon, Layers, ShieldCheck } from 'lucide-react';

export const HierarchyManager: React.FC = () => {
  const { systems, devices, tags, tenantName } = useSupervisoryStore();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">Estrutura & Hierarquia de Ativos</h1>
        <p className="text-xs text-isa-muted mt-1">
          Organização em árvore dos sistemas industriais da empresa <strong className="text-slate-300">{tenantName}</strong>.
        </p>
      </div>

      <div className="bg-isa-surface border border-isa-border rounded-xl p-6 space-y-6">
        <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
          <Layers className="w-6 h-6 text-sky-400" />
          <div>
            <h2 className="font-display font-bold text-base text-slate-100">{tenantName} (Organização Tenant)</h2>
            <p className="text-xs font-mono text-isa-muted">Isolamento Multi-tenant ID: tenant-01</p>
          </div>
        </div>

        {/* Systems Tree */}
        <div className="pl-6 border-l-2 border-slate-700 space-y-6">
          {systems.map((sys) => {
            const systemDevices = devices.filter(d => d.systemId === sys.id);

            return (
              <div key={sys.id} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FolderTree className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-100">{sys.name}</h3>
                    <p className="text-xs text-isa-muted">{sys.description}</p>
                  </div>
                </div>

                {/* Devices Tree */}
                <div className="pl-6 border-l-2 border-slate-800 space-y-4">
                  {systemDevices.map((dev) => {
                    const devTags = tags.filter(t => t.deviceId === dev.id);

                    return (
                      <div key={dev.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Cpu className="w-4 h-4 text-sky-400" />
                            <span className="font-mono font-bold text-xs text-slate-100">{dev.name}</span>
                            <span className="text-[10px] font-mono text-isa-muted">({dev.identifier})</span>
                          </div>
                          <span className="text-[10px] font-mono bg-slate-900 text-sky-400 px-2 py-0.5 rounded border border-slate-800">
                            Protocolo: {dev.protocol}
                          </span>
                        </div>

                        {/* Tags Sublist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {devTags.map((t) => (
                            <div key={t.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center space-x-1.5">
                                <TagIcon className="w-3 h-3 text-sky-400" />
                                <span className="text-slate-200">{t.name}</span>
                              </div>
                              <span className="font-bold text-sky-400">{String(t.currentValue)} {t.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
