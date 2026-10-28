import React, { useState } from 'react';
import { Copy, Check, Download, FileCode } from 'lucide-react';
import { PYTHON_CODE } from '../data/pythonCode';

interface CodeViewerProps {
  onDownload: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ onDownload }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = PYTHON_CODE.trim().split('\n');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🕷️</span>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Arquivo: calculadora.py (Edição Homem-Aranha)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-bold">
              Tkinter Nativo
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Classe <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[#E23636] font-bold">CalculadoraHomemAranha</code>. Código 100% autossuficiente baseado na biblioteca padrão do Python. Sem necessidade de <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200">pip install</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#E23636] hover:bg-[#c92a2a] text-white shadow-sm shadow-[#E23636]/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E23636] inline-block"></span>
            <span>calculadora.py — {lines.length} linhas (Spider-Man Edition)</span>
          </div>
          <span className="text-[#60a5fa]">UTF-8 / Python 3 (Tkinter)</span>
        </div>

        <div className="max-h-[620px] overflow-auto p-4 text-xs font-mono leading-relaxed select-text">
          <pre className="table w-full">
            {lines.map((line, idx) => {
              let colorClass = 'text-zinc-300';
              const trimmed = line.trim();

              if (trimmed.startsWith('#') || trimmed.startsWith('"""') || trimmed.startsWith('*') || trimmed.startsWith('=')) {
                colorClass = 'text-zinc-500 italic';
              } else if (trimmed.startsWith('class ') || trimmed.startsWith('def ')) {
                colorClass = 'text-amber-400 font-semibold';
              } else if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
                colorClass = 'text-purple-400 font-semibold';
              } else if (trimmed.startsWith('if ') || trimmed.startsWith('elif ') || trimmed.startsWith('else:') || trimmed.startsWith('try:') || trimmed.startsWith('except ') || trimmed.startsWith('return ') || trimmed.startsWith('for ')) {
                colorClass = 'text-sky-400 font-medium';
              } else if (trimmed.includes('self.')) {
                colorClass = 'text-zinc-200';
              }

              return (
                <div key={idx} className="table-row hover:bg-zinc-900/60 transition-colors">
                  <span className="table-cell pr-4 text-right select-none text-zinc-600 text-[11px] w-10">
                    {idx + 1}
                  </span>
                  <span className={`table-cell whitespace-pre ${colorClass}`}>
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
};
