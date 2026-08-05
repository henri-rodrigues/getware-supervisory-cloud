import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { AuthModal } from '../auth/AuthModal';
import { BellRing, Sparkles, User, Sun, Moon, Database, Menu, ArrowLeft } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    theme, 
    setTheme, 
    activeView, 
    setActiveView, 
    alarms 
  } = useSupervisoryStore();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const unacknowledgedAlarms = alarms.filter(a => !a.isAcknowledged);
  const isLight = theme === 'light';

  const viewTitles: Record<string, string> = {
    overview: 'Visão Geral',
    hierarchy: 'Hierarquia & Planta',
    devices: 'Dispositivos',
    tags: 'Tabela de Parâmetros',
    synoptic: 'Sinóptico HMI',
    alarms: 'Alarmes & Eventos',
    'ai-reports': 'Relatório & IA',
    'db-test': 'Teste Banco de Dados',
    settings: 'Configurações'
  };

  return (
    <>
      <header className="h-12 px-4 bg-black text-white flex items-center justify-between select-none sticky top-0 z-30 shadow-md">
        
        {/* Left: Navigation Hamburger, Back Arrow, Logo & Current Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button className="p-1 text-slate-300 hover:text-white transition-colors" title="Menu principal">
            <Menu className="w-5 h-5" />
          </button>
          
          <button className="p-1 text-slate-300 hover:text-white transition-colors" title="Voltar">
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* BOSS mini Logo */}
          <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => setActiveView('devices')}>
            <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white text-xs">
              b
            </div>
            <div className="font-display font-bold text-sm tracking-tight text-white flex items-baseline space-x-0.5">
              <span>boss</span>
              <span className="font-normal text-xs text-slate-300">mini</span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Current Section Title */}
          <span className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide">
            {viewTitles[activeView] || 'Dispositivos'}
          </span>
        </div>

        {/* Right Actions: Theme, DB Test, AI, Alarms, User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          
          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title="Alternar Tema (Claro / Escuro)"
          >
            {isLight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          {/* Database Test Shortcut */}
          <button
            onClick={() => setActiveView('db-test')}
            className={`hidden md:flex items-center space-x-1 px-2.5 py-1 rounded text-xs border transition-colors ${
              activeView === 'db-test' ? 'bg-sky-600 text-white border-sky-500' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-[11px]">Teste DB</span>
          </button>

          {/* AI Reports */}
          <button
            onClick={() => setActiveView('ai-reports')}
            className={`hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded text-xs border transition-colors ${
              activeView === 'ai-reports' ? 'bg-purple-900 text-purple-100 border-purple-600' : 'bg-slate-900 hover:bg-slate-800 text-purple-300 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[11px]">IA Gemini</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setActiveView('alarms')}
            className="relative p-1.5 rounded-full hover:bg-slate-800 text-slate-200 transition-colors"
            title="Alarmes e Notificações"
          >
            <BellRing className="w-4 h-4" />
            {unacknowledgedAlarms.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 ring-2 ring-black" />
            )}
          </button>

          {/* Profile User Icon */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="p-1 rounded-full text-slate-200 hover:text-white transition-colors"
            title={isAuthenticated ? currentUser?.name : 'Login / Perfil'}
          >
            <div className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-600">
              <User className="w-3.5 h-3.5 text-slate-200" />
            </div>
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

