import React, { useState } from 'react';
import { useSupervisoryStore } from '../../store/useSupervisoryStore';
import { ShieldCheck, LogIn, UserPlus, Mail, Lock, Building, Sparkles, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, isAuthenticated, currentUser, logout } = useSupervisoryStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegistering) {
      if (!name || !email || !password || !tenantName) {
        setErrorMsg('Por favor, preencha todos os campos.');
        return;
      }
      const ok = register(name, email, password, tenantName);
      if (ok) {
        setSuccessMsg('Conta e Organização criadas com sucesso!');
        setTimeout(() => onClose(), 1200);
      } else {
        setErrorMsg('Falha ao cadastrar usuário.');
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Preencha e-mail e senha.');
        return;
      }
      const ok = login(email, password);
      if (ok) {
        setSuccessMsg('Autenticado com sucesso!');
        setTimeout(() => onClose(), 1000);
      } else {
        setErrorMsg('E-mail ou senha incorretos.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative text-slate-800">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 text-white font-bold text-xl shadow-lg shadow-violet-200">
            b
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {isAuthenticated ? 'Sua Conta Getware' : isRegistering ? 'Criar Conta Supervisória' : 'Acessar o Sistema'}
          </h2>
          <p className="text-xs text-slate-500">
            {isAuthenticated
              ? `Conectado como ${currentUser?.name} (${currentUser?.tenantName})`
              : 'Entre com suas credenciais ou cadastre um novo equipamento/empresa.'}
          </p>
        </div>

        {/* Success or Error Messages */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
            {successMsg}
          </div>
        )}

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Usuário:</span>
                <span className="font-bold text-slate-800">{currentUser?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">E-mail:</span>
                <span className="text-slate-700">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Empresa/Tenant:</span>
                <span className="text-violet-600 font-bold">{currentUser?.tenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Perfil:</span>
                <span className="text-emerald-600 font-bold">{currentUser?.role}</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium text-xs shadow transition-all"
            >
              Sair da Conta (Logout)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegistering && (
              <>
                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Nome Completo:</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Engenheiro Carlos Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pl-9 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                    />
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-700">Nome da Empresa / Projeto:</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Indústria Metalúrgica Getware"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pl-9 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                    />
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="font-medium text-slate-700">E-mail de Acesso:</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="operador@getware.cloud"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pl-9 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Senha:</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pl-9 text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-xs shadow-lg shadow-violet-200 transition-all flex items-center justify-center space-x-2"
            >
              {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isRegistering ? 'Cadastrar e Acessar' : 'Entrar no Supervisório'}</span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              {isRegistering ? (
                <span>
                  Já possui conta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-violet-600 font-semibold hover:underline"
                  >
                    Fazer Login
                  </button>
                </span>
              ) : (
                <span>
                  Não tem conta cadastrada?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="text-violet-600 font-semibold hover:underline"
                  >
                    Criar Cadastro Grátis
                  </button>
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
