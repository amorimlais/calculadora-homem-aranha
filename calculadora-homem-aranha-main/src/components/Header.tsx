import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulador' | 'codigo' | 'guia' | 'recursos';
  onTabChange: (tab: 'simulador' | 'codigo' | 'guia' | 'recursos') => void;
  onDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onDownload }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#E23636] flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-[#E23636]/30">
          🕷️
        </div>
        <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap shrink-0">
          Calculadora do Homem-Aranha
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        <button
          onClick={() => onTabChange('simulador')}
          className={`hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'simulador'
              ? 'text-[#E23636] dark:text-[#E23636] border-b-2 border-[#E23636] font-semibold'
              : ''
          }`}
        >
          Simulador Heroico
        </button>
        <button
          onClick={() => onTabChange('codigo')}
          className={`hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'codigo'
              ? 'text-[#E23636] dark:text-[#E23636] border-b-2 border-[#E23636] font-semibold'
              : ''
          }`}
        >
          Código Python (.py)
        </button>
        <button
          onClick={() => onTabChange('guia')}
          className={`hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'guia'
              ? 'text-[#E23636] dark:text-[#E23636] border-b-2 border-[#E23636] font-semibold'
              : ''
          }`}
        >
          Como Rodar
        </button>
        <button
          onClick={() => onTabChange('recursos')}
          className={`hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'recursos'
              ? 'text-[#E23636] dark:text-[#E23636] border-b-2 border-[#E23636] font-semibold'
              : ''
          }`}
        >
          Especificações
        </button>
      </nav>

      {/* Zone 3: Primary CTA */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#E23636] hover:bg-[#c92a2a] rounded-lg shadow-sm shadow-[#E23636]/30 transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          title="Baixar calculadora.py temática do Homem-Aranha"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar calculadora.py</span>
        </button>
      </div>
    </header>
  );
};
