/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { CalculatorSimulator } from './components/CalculatorSimulator';
import { CodeViewer } from './components/CodeViewer';
import { ExecutionGuide } from './components/ExecutionGuide';
import { FeaturesChecklist } from './components/FeaturesChecklist';
import { PYTHON_CODE } from './data/pythonCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulador' | 'codigo' | 'guia' | 'recursos'>('simulador');

  // Trigger file download of calculadora.py
  const handleDownloadPy = () => {
    const blob = new Blob([PYTHON_CODE], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calculadora.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDownload={handleDownloadPy}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'simulador' && <CalculatorSimulator />}
        {activeTab === 'codigo' && <CodeViewer onDownload={handleDownloadPy} />}
        {activeTab === 'guia' && <ExecutionGuide />}
        {activeTab === 'recursos' && <FeaturesChecklist />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-4 px-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            🕷️ Calculadora do Homem-Aranha com Tkinter · Cores #E23636, #2B5EA7 e Preto · 100% nativo sem dependências
          </span>
          <span className="font-mono text-[11px] text-[#E23636] font-bold">
            Python 3.8+ · tkinter · math · sys
          </span>
        </div>
      </footer>
    </div>
  );
}
