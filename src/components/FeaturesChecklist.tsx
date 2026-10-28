import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const FeaturesChecklist: React.FC = () => {
  const grupos = [
    {
      titulo: '1. Funcionalidades Matemáticas',
      itens: [
        { nome: 'Operações Básicas', detalhe: 'Adição (+), Subtração (−), Multiplicação (×), Divisão (÷)' },
        { nome: 'Operações Avançadas', detalhe: 'Potência (**), Raiz Quadrada (√), Porcentagem (%), Resto da Divisão (mod / %)' },
        { nome: 'Números Decimais', detalhe: 'Suporte a ponto flutuante com formatação limpa e proteção contra múltiplos pontos' },
        { nome: 'Inversão de Sinal (±)', detalhe: 'Alterna entre positivo e negativo dinamicamente' },
        { nome: 'Histórico das Últimas 10 Operações', detalhe: 'Fila rotativa com os últimos 10 cálculos de teias' },
        { nome: 'Limpeza de Histórico', detalhe: 'Botão com diálogo de confirmação para limpar teias registradas' },
        { nome: 'Recuperação de Cálculos', detalhe: 'Botão "Usar 🕷️" para recarregar qualquer resultado anterior' },
        { nome: 'Tratamento de Erros', detalhe: 'Divisão por zero, raiz de número negativo, overflow e sintaxe' },
      ],
    },
    {
      titulo: '2. Identidade Visual do Homem-Aranha',
      itens: [
        { nome: 'Cores Principais Oficiais', detalhe: 'Vermelho (#E23636), Azul Escuro (#2B5EA7) e Preto (#12131C)' },
        { nome: 'Símbolos Temáticos', detalhe: 'Emblema da aranha (🕷️) e teias (🕸️) no visor, botões e histórico' },
        { nome: 'Alternância de Trajes (Temas)', detalhe: 'Traje Noturno (Escuro) e Traje Clássico (Claro) com paleta Spider-Man' },
        { nome: 'Display Heroico', detalhe: 'Contorno temático com expressão e resultado em tipografia destacada' },
        { nome: 'Botões Grandes e Responsivos', detalhe: 'Distribuição em grid uniforme com feedback ao clicar e atalhos' },
      ],
    },
    {
      titulo: '3. Requisitos Técnicos & Extras',
      itens: [
        { nome: 'Orientação a Objetos', detalhe: 'Classe CalculadoraHomemAranha bem estruturada e modular' },
        { nome: '100% Biblioteca Padrão', detalhe: 'Executável sem qualquer dependência externa (zero "pip install")' },
        { nome: 'Comentários em Português', detalhe: 'Docstrings e explicações detalhadas em todas as funções' },
        { nome: 'Atalhos de Teclado Físico (Extra)', detalhe: 'Eventos vinculados: 0-9, +, -, *, /, Enter, Backspace e Escape' },
        { nome: 'Janela Toplevel de Histórico (Extra)', detalhe: 'Janela secundária temática independente com lista e botão de reuso' },
        { nome: 'Pronto para Execução', detalhe: 'Compatível com Windows, macOS, Linux, VS Code, IDLE e PyCharm' },
      ],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="text-xl">🕷️</span>
          Especificações do Tema Homem-Aranha Atendidas
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Todos os requisitos funcionais, estéticos (cores #E23636, #2B5EA7, preto e teias) e técnicos foram rigorosamente implementados tanto no arquivo <code className="font-mono text-[#E23636] font-bold">calculadora.py</code> quanto no simulador interativo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {grupos.map((grupo, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs"
          >
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span>{grupo.titulo}</span>
            </h3>

            <div className="space-y-3">
              {grupo.itens.map((item, iIdx) => (
                <div key={iIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E23636] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {item.nome}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      {item.detalhe}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
