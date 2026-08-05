import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { AuthModal } from '../auth/AuthModal';
import { BellRing, Sparkles, User, Sun, Moon, Database, ShieldCheck, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    theme, 
    setTheme, 
    tenantName, 
    activeView, 
    setActiveView, 
    alarms 
  } = useSupervisoryStore();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const unacknowledgedAlarms = alarms.filter(a => !a.isAcknowledged);

  const isLight = theme === 'light';

  return (
    <>
      <header className={`h-14 px-6 flex items-center justify-between select-none sticky top-0 z-30 transition-colors ${
        isLight ? 'bg-[#1E222A] text-white border-b border-slate-800' : 'bg-isa-surface text-isa-text border-b border-isa-border'
      }`}>
        
        {/* Left Branding & Date Time */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
              b
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base tracking-tight text-white">BOSS mini</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800 uppercase">
                  Getware IoT
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-xs font-mono text-slate-400">
            {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Right Actions: Theme Toggle, DB Test, AI Studio, Alarms, Auth */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Alternar entre Tema Claro Boss Mini e Escuro ISA-101"
          >
            {isLight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            <span className="hidden md:inline font-mono">{isLight ? 'Tema Claro' : 'ISA-101 Dark'}</span>
          </button>

          {/* Database Test Page Shortcut */}
          <button
            onClick={() => setActiveView('db-test')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeView === 'db-test' ? 'bg-sky-600 text-white border-sky-500 font-bold' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Database className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline font-mono">Teste DB & Responsividade</span>
          </button>

          {/* AI Studio */}
          <button
            onClick={() => setActiveView('ai-reports')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeView === 'ai-reports' ? 'bg-purple-900/60 text-purple-200 border-purple-500 font-bold' : 'bg-slate-800/80 hover:bg-slate-700 text-purple-300 border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="hidden lg:inline font-mono">IA Gemini 2.5</span>
          </button>

          {/* Alarms Bell */}
          <button
            onClick={() => setActiveView('alarms')}
            className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Central de Alarmes"
          >
            <BellRing className="w-4 h-4" />
            {unacknowledgedAlarms.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold font-mono px-1.5 py-0.2 rounded-full">
                {unacknowledgedAlarms.length}
              </span>
            )}
          </button>

          {/* User Account / Profile Button */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-[10px]">
              {isAuthenticated ? currentUser?.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden md:inline font-medium text-xs">
              {isAuthenticated ? currentUser?.name : 'Login / Cadastro'}
            </span>
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
