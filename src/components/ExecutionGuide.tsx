import React from 'react';
import { Terminal, CheckCircle2, AlertCircle, Laptop, Play, FileCode, Copy, Check } from 'lucide-react';

export const ExecutionGuide: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = React.useState<string | null>(null);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          Como Executar o Programa no seu Computador
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          O arquivo <code className="font-mono text-sky-600 dark:text-sky-400 font-semibold">calculadora.py</code> foi desenvolvido utilizando <strong>exclusivamente a biblioteca padrão do Python</strong> (<code className="font-mono">tkinter</code>, <code className="font-mono">math</code>, <code className="font-mono">sys</code>). Não é necessário instalar nenhum pacote externo via <code className="font-mono">pip</code>.
        </p>
      </div>

      {/* Step by Step OS Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Windows */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm mb-3">
              <Laptop className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Windows</span>
            </div>
            <ol className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2.5 list-decimal pl-4 leading-relaxed">
              <li>
                Baixe o arquivo <strong className="text-zinc-800 dark:text-zinc-200">calculadora.py</strong> e salve em uma pasta (ex: Downloads ou Documentos).
              </li>
              <li>
                Abra o <strong>Prompt de Comando (CMD)</strong> ou <strong>PowerShell</strong> na pasta do arquivo.
              </li>
              <li>Execute o comando abaixo:</li>
            </ol>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs flex items-center justify-between">
            <code>python calculadora.py</code>
            <button
              onClick={() => copyCommand('python calculadora.py')}
              className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
              title="Copiar comando"
            >
              {copiedCmd === 'python calculadora.py' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Linux */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm mb-3">
              <Terminal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Linux (Ubuntu / Debian / Mint)</span>
            </div>
            <ol className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2.5 list-decimal pl-4 leading-relaxed">
              <li>
                Em algumas distribuições Linux, o Tkinter vem separado. Se necessário, instale com:
                <div className="my-1.5 p-1.5 rounded bg-zinc-950 text-zinc-100 font-mono text-[11px] flex items-center justify-between">
                  <code>sudo apt install python3-tk</code>
                  <button
                    onClick={() => copyCommand('sudo apt install python3-tk')}
                    className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
                  >
                    {copiedCmd === 'sudo apt install python3-tk' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </li>
              <li>Abra o Terminal na pasta onde baixou o arquivo e rode:</li>
            </ol>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs flex items-center justify-between">
            <code>python3 calculadora.py</code>
            <button
              onClick={() => copyCommand('python3 calculadora.py')}
              className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
              title="Copiar comando"
            >
              {copiedCmd === 'python3 calculadora.py' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* macOS */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm mb-3">
              <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>macOS</span>
            </div>
            <ol className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2.5 list-decimal pl-4 leading-relaxed">
              <li>
                O Python 3 oficial baixado em python.org já inclui o Tkinter integrado por padrão.
              </li>
              <li>
                Abra o <strong>Terminal</strong> do Mac (<code className="font-mono text-zinc-800 dark:text-zinc-200">Spotlight &gt; Terminal</code>).
              </li>
              <li>Navegue até a pasta e execute:</li>
            </ol>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs flex items-center justify-between">
            <code>python3 calculadora.py</code>
            <button
              onClick={() => copyCommand('python3 calculadora.py')}
              className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
              title="Copiar comando"
            >
              {copiedCmd === 'python3 calculadora.py' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Running via IDEs */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          Como Rodar pelo VS Code, PyCharm ou IDLE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
            <strong className="text-zinc-900 dark:text-zinc-100 block mb-1">Visual Studio Code:</strong>
            Abra o arquivo <code className="font-mono">calculadora.py</code>, certifique-se de que a extensão Python está instalada, e clique no botão de Play (triângulo superior direito) ou aperte <kbd className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">F5</kbd>.
          </div>

          <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
            <strong className="text-zinc-900 dark:text-zinc-100 block mb-1">Python IDLE nativo:</strong>
            Clique com o botão direito no arquivo <code className="font-mono">calculadora.py</code> &gt; <em>Edit with IDLE</em>. Quando abrir a janela de código, aperte <kbd className="font-mono bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">F5</kbd> para rodar.
          </div>

          <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
            <strong className="text-zinc-900 dark:text-zinc-100 block mb-1">PyCharm:</strong>
            Crie um novo projeto ou arraste <code className="font-mono">calculadora.py</code> para dentro do PyCharm. Clique com o botão direito no código e escolha <em>Run 'calculadora'</em>.
          </div>
        </div>
      </div>
    </div>
  );
};
