import React, { useState, useEffect, useCallback } from 'react';
import {
  History as HistoryIcon,
  Sun,
  Moon,
  Trash2,
  X,
  Keyboard,
  ArrowRight,
  Check,
  Copy,
  ShieldAlert
} from 'lucide-react';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  raw: string;
  timestamp: string;
}

export const CalculatorSimulator: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [subDisplay, setSubDisplay] = useState<string>('');
  const [displayResult, setDisplayResult] = useState<string>('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState<boolean>(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [copiedResult, setCopiedResult] = useState<boolean>(false);

  // Formata números de maneira limpa
  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) {
      return num.toLocaleString('pt-BR');
    }
    const str = num.toFixed(8);
    const trimmed = parseFloat(str).toString();
    return trimmed;
  };

  // Adiciona dígitos (0-9)
  const handleDigit = useCallback((digit: string) => {
    setLastKeyPressed(digit);
    setTimeout(() => setLastKeyPressed(null), 150);

    setWaitingForNewNumber((prevWaiting) => {
      setExpression((prevExpr) => {
        if (prevWaiting || prevExpr === '0') {
          setDisplayResult(digit);
          return digit;
        }
        const next = prevExpr + digit;
        setDisplayResult(next);
        return next;
      });
      return false;
    });
  }, []);

  // Adiciona ponto decimal
  const handleDecimal = useCallback(() => {
    setLastKeyPressed('.');
    setTimeout(() => setLastKeyPressed(null), 150);

    setWaitingForNewNumber((prevWaiting) => {
      setExpression((prevExpr) => {
        if (prevWaiting || !prevExpr) {
          setDisplayResult('0.');
          return '0.';
        }
        const lastOp = Math.max(
          prevExpr.lastIndexOf('+'),
          prevExpr.lastIndexOf('-'),
          prevExpr.lastIndexOf('*'),
          prevExpr.lastIndexOf('/'),
          prevExpr.lastIndexOf('%')
        );
        const segment = prevExpr.slice(lastOp + 1);
        if (!segment.includes('.')) {
          const next = segment === '' ? prevExpr + '0.' : prevExpr + '.';
          setDisplayResult(next);
          return next;
        }
        return prevExpr;
      });
      return false;
    });
  }, []);

  // Adiciona operadores (+, -, *, /, **, %)
  const handleOperator = useCallback((op: string) => {
    setLastKeyPressed(op);
    setTimeout(() => setLastKeyPressed(null), 150);
    setWaitingForNewNumber(false);

    setExpression((prevExpr) => {
      if (!prevExpr) {
        if (op === '-') {
          setDisplayResult('-');
          return '-';
        }
        return '';
      }

      let exp = prevExpr.trim();
      const ops = ['+', '-', '*', '/', '%', '**'];
      for (const o of ops) {
        if (exp.endsWith(o)) {
          exp = exp.slice(0, -o.length).trim();
          break;
        }
      }
      const next = `${exp} ${op} `;
      setDisplayResult(next);
      return next;
    });
  }, []);

  // Inversão de sinal (±)
  const handleInvertSign = useCallback(() => {
    setLastKeyPressed('±');
    setTimeout(() => setLastKeyPressed(null), 150);

    setExpression((prevExpr) => {
      if (!prevExpr) return prevExpr;
      const parts = prevExpr.trim().split(' ');
      if (parts.length === 0) return prevExpr;

      const last = parts[parts.length - 1];
      const val = parseFloat(last);
      if (!isNaN(val)) {
        const inverted = (-val).toString();
        parts[parts.length - 1] = inverted;
        const next = parts.join(' ');
        setDisplayResult(next);
        return next;
      }
      return prevExpr;
    });
  }, []);

  // Apaga último dígito (⌫)
  const handleBackspace = useCallback(() => {
    setLastKeyPressed('⌫');
    setTimeout(() => setLastKeyPressed(null), 150);

    setWaitingForNewNumber((prevWaiting) => {
      if (prevWaiting) {
        setExpression('');
        setDisplayResult('0');
        return false;
      }
      setExpression((prevExpr) => {
        if (!prevExpr) return '';
        let trimmed = prevExpr.trimEnd();
        if (trimmed.length > 0) {
          trimmed = trimmed.slice(0, -1).trimEnd();
        }
        setDisplayResult(trimmed.length > 0 ? trimmed : '0');
        return trimmed;
      });
      return false;
    });
  }, []);

  // Limpa tudo (C)
  const handleClear = useCallback(() => {
    setLastKeyPressed('C');
    setTimeout(() => setLastKeyPressed(null), 150);
    setExpression('');
    setSubDisplay('');
    setDisplayResult('0');
    setWaitingForNewNumber(false);
  }, []);

  // Raiz Quadrada (√)
  const handleSquareRoot = useCallback(() => {
    setLastKeyPressed('√');
    setTimeout(() => setLastKeyPressed(null), 150);

    try {
      if (!expression) return;
      const val = evalSafeMath(expression);
      if (isNaN(val)) {
        showError('🕸️ Sentido aranha: Inválido');
        return;
      }
      if (val < 0) {
        showError('🕸️ Raiz de nº negativo');
        return;
      }
      const result = Math.sqrt(val);
      registerCalculation(`√(${formatNumber(val)})`, result, result.toString());
    } catch {
      showError('🕸️ Erro na raiz');
    }
  }, [expression]);

  // Porcentagem (%)
  const handlePercentage = useCallback(() => {
    setLastKeyPressed('%');
    setTimeout(() => setLastKeyPressed(null), 150);

    try {
      if (!expression) return;
      const parts = expression.trim().split(' ');
      if (parts.length === 1) {
        const val = parseFloat(parts[0]) / 100;
        const resStr = val.toString();
        setExpression(resStr);
        setDisplayResult(resStr);
        return;
      }
      if (parts.length >= 3 && ['+', '-', '*', '/'].includes(parts[parts.length - 2])) {
        const base = parseFloat(parts[0]);
        const op = parts[parts.length - 2];
        const pct = parseFloat(parts[parts.length - 1]);
        const calc = (op === '+' || op === '-') ? base * (pct / 100) : pct / 100;
        parts[parts.length - 1] = calc.toString();
        const next = parts.join(' ');
        setExpression(next);
        setDisplayResult(next);
        return;
      }
      const val = evalSafeMath(expression) / 100;
      setExpression(val.toString());
      setDisplayResult(val.toString());
    } catch {
      showError('🕸️ Erro em %');
    }
  }, [expression]);

  // Avaliação matemática isolada e segura
  const evalSafeMath = (exprStr: string): number => {
    let clean = exprStr.replace(/×/g, '*').replace(/÷/g, '/');

    // Validação de caracteres permitidos
    if (!/^[0-9+\-*/%(). ]+$/.test(clean)) {
      throw new Error('Caracteres inválidos');
    }

    // eslint-disable-next-line no-new-func
    const fn = new Function(`return ${clean}`);
    return fn();
  };

  // Registra cálculo com sucesso
  const registerCalculation = (expr: string, val: number, rawVal: string) => {
    const formatted = formatNumber(val);
    setSubDisplay(`${expr} =`);
    setDisplayResult(formatted);
    setExpression(rawVal);
    setWaitingForNewNumber(true);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setHistory((prev) => {
      const item: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        expression: expr,
        result: formatted,
        raw: rawVal,
        timestamp: timeStr,
      };
      const updated = [item, ...prev];
      return updated.slice(0, 10);
    });
  };

  // Exibe erro com estilo temático do Homem-Aranha
  const showError = (msg: string) => {
    setSubDisplay(expression);
    setDisplayResult(msg);
    setExpression('');
    setWaitingForNewNumber(true);
  };

  // Executa o cálculo (=)
  const handleEquals = useCallback(() => {
    setLastKeyPressed('=');
    setTimeout(() => setLastKeyPressed(null), 150);

    if (!expression) return;
    const originalExpr = expression;

    try {
      if (/\/\s*0(?![0-9.])/.test(expression)) {
        showError('🕸️ Divisão por zero!');
        return;
      }

      const res = evalSafeMath(expression);

      if (res === Infinity || res === -Infinity) {
        showError('🕸️ Divisão por zero!');
        return;
      }

      if (isNaN(res)) {
        showError('🕸️ Sentido aranha: Inválido');
        return;
      }

      registerCalculation(originalExpr, res, res.toString());
    } catch {
      showError('🕸️ Sentido aranha: Inválido');
    }
  }, [expression]);

  // Recupera cálculo do histórico de teias
  const handleUseHistory = (rawVal: string) => {
    setExpression(rawVal);
    setDisplayResult(rawVal);
    setSubDisplay('🕸️ Teia recuperada:');
    setWaitingForNewNumber(true);
    setShowHistoryModal(false);
  };

  // Limpa histórico
  const handleClearHistory = () => {
    if (window.confirm('Deseja realmente limpar o histórico de teias?')) {
      setHistory([]);
    }
  };

  // Copia resultado
  const handleCopyResult = () => {
    navigator.clipboard.writeText(displayResult);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        handleDigit(key);
      } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        e.preventDefault();
        handleOperator(key);
      } else if (key === '.' || key === ',') {
        handleDecimal();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleDecimal, handleEquals, handleBackspace, handleClear]);

  // Testes rápidos temáticos
  const runPreset = (expr: string) => {
    setExpression(expr);
    setDisplayResult(expr);
    setWaitingForNewNumber(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center">
      {/* ESQUERDA: Janela Tkinter Simulada do Homem-Aranha */}
      <div className="w-full lg:w-[420px] shrink-0 mx-auto">
        <div
          className={`rounded-2xl border-2 shadow-2xl transition-colors duration-200 overflow-hidden ${
            isDarkTheme
              ? 'bg-[#0f1017] border-[#E23636] shadow-[#E23636]/20'
              : 'bg-[#f8fafc] border-[#2B5EA7] shadow-[#2B5EA7]/20'
          }`}
        >
          {/* Barra de Título Tkinter */}
          <div
            className={`flex items-center justify-between px-4 py-2.5 border-b select-none ${
              isDarkTheme
                ? 'bg-[#171822] border-[#E23636]/40 text-zinc-100'
                : 'bg-[#2B5EA7] border-[#2B5EA7] text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E23636] inline-block shadow-xs"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-xs"></span>
              <span className="w-3 h-3 rounded-full bg-[#2B5EA7] inline-block shadow-xs"></span>
              <span className="ml-2 text-xs font-bold tracking-tight">
                🕷️ Calculadora do Homem-Aranha 🕸️
              </span>
            </div>
            <div className="text-[11px] font-mono opacity-80">
              390x640 px
            </div>
          </div>

          {/* Barra Superior Tkinter (Menu Topo) */}
          <div
            className={`flex items-center justify-between px-3 py-2 border-b text-xs ${
              isDarkTheme
                ? 'bg-[#0f1017] border-zinc-800'
                : 'bg-[#f1f5f9] border-zinc-200'
            }`}
          >
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                isDarkTheme
                  ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white'
                  : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe]'
              }`}
            >
              {isDarkTheme ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#2B5EA7]" />}
              <span>{isDarkTheme ? '🕸️ Traje Clássico' : '🕷️ Traje Noturno'}</span>
            </button>

            <span className="text-xs font-bold tracking-wider text-[#E23636] hidden sm:inline">
              SPIDER-CALC
            </span>

            <button
              onClick={() => setShowHistoryModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                isDarkTheme
                  ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white'
                  : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe]'
              }`}
            >
              <HistoryIcon className="w-3.5 h-3.5" />
              <span>🕸️ Teias ({history.length})</span>
            </button>
          </div>

          {/* Visor / Display com Borda Heroica */}
          <div className="p-4">
            <div
              className={`p-4 rounded-xl border-2 relative transition-colors ${
                isDarkTheme
                  ? 'bg-[#171822] border-[#E23636] text-white shadow-inner shadow-black/50'
                  : 'bg-white border-[#2B5EA7] text-zinc-900 shadow-inner'
              }`}
            >
              {/* Teia sutil decorativa de fundo */}
              <div className="absolute right-2 top-2 text-2xl select-none opacity-20 pointer-events-none">
                🕸️
              </div>

              {/* Expressão em andamento */}
              <div
                className={`text-right text-xs font-medium h-5 tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none font-mono ${
                  isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                {subDisplay || '\u00A0'}
              </div>

              {/* Linha principal: número ou resultado */}
              <div className="flex items-center justify-between gap-2 mt-1">
                <button
                  onClick={handleCopyResult}
                  className={`p-1.5 rounded-lg transition-colors text-xs ${
                    isDarkTheme
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="Copiar resultado"
                >
                  {copiedResult ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <div
                  className={`text-right font-bold text-3xl sm:text-4xl tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none font-mono tabular-nums ${
                    displayResult.includes('🕸️')
                      ? 'text-[#E23636] text-xl sm:text-2xl font-bold'
                      : isDarkTheme
                      ? 'text-white'
                      : 'text-[#0f172a]'
                  }`}
                >
                  {displayResult}
                </div>
              </div>
            </div>

            {/* Grade de Botões (Layout Homem-Aranha em 6 Linhas) */}
            <div className="grid grid-cols-4 gap-2 mt-4 select-none">
              {/* Linha 0: C, ⌫, %, ÷ */}
              <button
                onClick={handleClear}
                className={`py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#450a0a] text-[#fca5a5] hover:bg-[#7f1d1d] border border-red-900/60'
                    : 'bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca] border border-red-300'
                } ${lastKeyPressed === 'C' ? 'ring-2 ring-red-400 scale-95' : ''}`}
                title="Limpar tudo (Esc)"
              >
                C
              </button>

              <button
                onClick={handleBackspace}
                className={`py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '⌫' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Apagar último caractere (Backspace)"
              >
                ⌫
              </button>

              <button
                onClick={handlePercentage}
                className={`py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '%' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Porcentagem (%)"
              >
                %
              </button>

              <button
                onClick={() => handleOperator('/')}
                className={`py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '/' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Divisão (/)"
              >
                ÷
              </button>

              {/* Linha 1: √, xʸ, mod, × */}
              <button
                onClick={handleSquareRoot}
                className={`py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '√' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Raiz Quadrada (√)"
              >
                √
              </button>

              <button
                onClick={() => handleOperator('**')}
                className={`py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '**' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Potência (xʸ ou **)"
              >
                xʸ
              </button>

              <button
                onClick={() => handleOperator('%')}
                className={`py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '%' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Resto da Divisão (mod ou %)"
              >
                mod
              </button>

              <button
                onClick={() => handleOperator('*')}
                className={`py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '*' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Multiplicação (*)"
              >
                ×
              </button>

              {/* Linha 2: 7, 8, 9, − */}
              {['7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit)}
                  className={`py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                    isDarkTheme
                      ? 'bg-[#1c1e2b] text-zinc-100 hover:bg-[#282b3d] border border-zinc-800'
                      : 'bg-white text-zinc-900 hover:bg-slate-100 border border-slate-200 shadow-xs'
                  } ${lastKeyPressed === digit ? 'ring-2 ring-[#E23636] scale-95' : ''}`}
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => handleOperator('-')}
                className={`py-3.5 rounded-xl font-bold text-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '-' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Subtração (-)"
              >
                −
              </button>

              {/* Linha 3: 4, 5, 6, + */}
              {['4', '5', '6'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit)}
                  className={`py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                    isDarkTheme
                      ? 'bg-[#1c1e2b] text-zinc-100 hover:bg-[#282b3d] border border-zinc-800'
                      : 'bg-white text-zinc-900 hover:bg-slate-100 border border-slate-200 shadow-xs'
                  } ${lastKeyPressed === digit ? 'ring-2 ring-[#E23636] scale-95' : ''}`}
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => handleOperator('+')}
                className={`py-3.5 rounded-xl font-bold text-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '+' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Adição (+)"
              >
                +
              </button>

              {/* Linha 4: 1, 2, 3, ± */}
              {['1', '2', '3'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigit(digit)}
                  className={`py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                    isDarkTheme
                      ? 'bg-[#1c1e2b] text-zinc-100 hover:bg-[#282b3d] border border-zinc-800'
                      : 'bg-white text-zinc-900 hover:bg-slate-100 border border-slate-200 shadow-xs'
                  } ${lastKeyPressed === digit ? 'ring-2 ring-[#E23636] scale-95' : ''}`}
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleInvertSign}
                className={`py-3.5 rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1b2c4e] text-[#60a5fa] hover:bg-[#2B5EA7] hover:text-white border border-[#2B5EA7]/40'
                    : 'bg-[#e0e7ff] text-[#2B5EA7] hover:bg-[#c7d2fe] border border-[#2B5EA7]/30'
                } ${lastKeyPressed === '±' ? 'ring-2 ring-sky-400 scale-95' : ''}`}
                title="Inverter sinal (±)"
              >
                ±
              </button>

              {/* Linha 5: 0, ., = (Vermelho Aranha Heroico span-2) */}
              <button
                onClick={() => handleDigit('0')}
                className={`py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1c1e2b] text-zinc-100 hover:bg-[#282b3d] border border-zinc-800'
                    : 'bg-white text-zinc-900 hover:bg-slate-100 border border-slate-200 shadow-xs'
                } ${lastKeyPressed === '0' ? 'ring-2 ring-[#E23636] scale-95' : ''}`}
              >
                0
              </button>

              <button
                onClick={handleDecimal}
                className={`py-3.5 rounded-xl font-bold text-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkTheme
                    ? 'bg-[#1c1e2b] text-zinc-100 hover:bg-[#282b3d] border border-zinc-800'
                    : 'bg-white text-zinc-900 hover:bg-slate-100 border border-slate-200 shadow-xs'
                } ${lastKeyPressed === '.' ? 'ring-2 ring-[#E23636] scale-95' : ''}`}
                title="Ponto decimal (.)"
              >
                .
              </button>

              <button
                onClick={handleEquals}
                className={`col-span-2 py-3.5 rounded-xl font-bold text-lg sm:text-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 text-white bg-[#E23636] hover:bg-[#c92a2a] shadow-lg shadow-[#E23636]/40 border border-[#b91c1c] ${
                  lastKeyPressed === '=' ? 'ring-4 ring-red-400 scale-95' : ''
                }`}
                title="Calcular teia (Enter ou =)"
              >
                <span>🕸️</span>
                <span>=</span>
              </button>
            </div>
          </div>
        </div>

        {/* Indicador de Teclado Físico */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 text-center">
          <Keyboard className="w-3.5 h-3.5 text-[#E23636]" />
          <span>Atalhos ativos no teclado: 0-9, +, -, *, /, Enter, Backspace, Esc</span>
        </div>
      </div>

      {/* DIREITA: Testes Rápidos Heroicos e Histórico de Teias */}
      <div className="w-full lg:flex-1 space-y-4">
        {/* Painel de Missões & Testes Rápidos */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-base">🕷️</span>
              Cálculos Heroicos do Homem-Aranha
            </span>
            <span className="text-xs text-[#E23636] font-semibold">
              Clique para preencher
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => runPreset('625')}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-[#E23636] dark:hover:border-[#E23636] text-left transition-all hover:bg-red-50/50 dark:hover:bg-red-950/20 group cursor-pointer"
            >
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#E23636] flex items-center justify-between">
                <span>√625 (Teia)</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Depois aperte √ (= 25)
              </div>
            </button>

            <button
              onClick={() => runPreset('2 ** 8')}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-[#2B5EA7] dark:hover:border-[#2B5EA7] text-left transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20 group cursor-pointer"
            >
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#2B5EA7] flex items-center justify-between">
                <span>2 ** 8 (Balanço)</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Potência (= 256)
              </div>
            </button>

            <button
              onClick={() => runPreset('50 % 6')}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-[#2B5EA7] dark:hover:border-[#2B5EA7] text-left transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20 group cursor-pointer"
            >
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#2B5EA7] flex items-center justify-between">
                <span>50 % 6 (Salto)</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Resto de div (= 2)
              </div>
            </button>

            <button
              onClick={() => runPreset('125.75 * 4.2')}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-[#E23636] dark:hover:border-[#E23636] text-left transition-all hover:bg-red-50/50 dark:hover:bg-red-950/20 group cursor-pointer"
            >
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#E23636] flex items-center justify-between">
                <span>125.75 * 4.2</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Decimais (= 528.15)
              </div>
            </button>

            <button
              onClick={() => runPreset('250 * 15%')}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-[#E23636] dark:hover:border-[#E23636] text-left transition-all hover:bg-red-50/50 dark:hover:bg-red-950/20 group cursor-pointer"
            >
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#E23636] flex items-center justify-between">
                <span>250 * 15% (Força)</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Porcentagem (= 37.5)
              </div>
            </button>

            <button
              onClick={() => runPreset('10 / 0')}
              className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-500 text-left transition-all hover:bg-red-50/50 dark:hover:bg-red-950/20 group cursor-pointer"
            >
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-red-500 flex items-center justify-between">
                <span>10 / 0 (Perigo)</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-red-500 mt-0.5">
                Divisão por zero
              </div>
            </button>
          </div>
        </div>

        {/* Histórico Recente de Teias */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>🕸️</span>
                Teias Anteriores (Máx. 10)
              </span>
              <span className="text-xs text-[#E23636] font-mono font-bold">
                ({history.length}/10)
              </span>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 cursor-pointer font-medium"
              >
                <Trash2 className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
              🕸️ Nenhuma teia lançada ainda. Faça um cálculo para guardar no histórico!
            </div>
          ) : (
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-800/40 text-xs font-mono"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="text-zinc-500 dark:text-zinc-400 truncate">
                      {item.expression} =
                    </div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {item.result}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-zinc-400">{item.timestamp}</span>
                    <button
                      onClick={() => handleUseHistory(item.raw)}
                      className="px-2 py-1 text-[11px] font-bold text-[#E23636] hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors cursor-pointer"
                    >
                      Usar 🕷️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Toplevel Simulado do Histórico */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-2xl border-2 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
              isDarkTheme
                ? 'bg-[#0f1017] border-[#E23636] text-zinc-100'
                : 'bg-[#f8fafc] border-[#2B5EA7] text-zinc-900'
            }`}
          >
            {/* Título Toplevel */}
            <div
              className={`flex items-center justify-between px-4 py-2.5 border-b ${
                isDarkTheme
                  ? 'bg-[#171822] border-[#E23636]/40 text-zinc-100'
                  : 'bg-[#2B5EA7] border-[#2B5EA7] text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🕷️</span>
                <span className="text-xs font-bold">Teias Anteriores (Homem-Aranha)</span>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded hover:bg-zinc-700/40 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-4 max-h-[380px] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Últimas 10 Operações
                </span>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1 text-xs text-red-500 hover:underline cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpar Teias</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 italic">
                  🕸️ Nenhuma teia lançada ainda.
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        isDarkTheme
                          ? 'bg-[#171822] border-zinc-800'
                          : 'bg-white border-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {item.expression} =
                        </div>
                        <div className="text-sm font-bold font-mono">
                          {item.result}
                        </div>
                      </div>
                      <button
                        onClick={() => handleUseHistory(item.raw)}
                        className="px-2.5 py-1 text-xs font-bold bg-[#E23636] hover:bg-[#c92a2a] text-white rounded cursor-pointer"
                      >
                        Usar 🕷️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`p-3 border-t text-right ${
                isDarkTheme ? 'bg-[#171822] border-zinc-800' : 'bg-zinc-100 border-zinc-200'
              }`}
            >
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 text-xs font-bold rounded bg-zinc-700 text-zinc-200 hover:bg-zinc-600 cursor-pointer"
              >
                Fechar Janela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
