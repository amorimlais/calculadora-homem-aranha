# 🕷️ Calculadora do Homem-Aranha

Calculadora completa desenvolvida em Python com interface gráfica usando Tkinter, inspirada no universo do Homem-Aranha.

## ✨ Funcionalidades
- **Operações básicas:** adição (+), subtração (-), multiplicação (*) e divisão (/)
- **Operações avançadas:** parênteses `(` e `)`, potência (**), raiz quadrada (√), porcentagem (%) e resto da divisão (`mod` / %)
- **Avaliador Seguro com AST:** Substituição total de `eval` por árvore sintática restrita, impedindo injeção de código e validando parênteses aninhados e desbalanceados
- **Feedback Sonoro Nativo (Thwip!):** Sons nativos de clique e disparo de teia utilizando exclusivamente a biblioteca `winsound` em thread desacoplada
- **Suporte a números decimais** e inversão de sinal (±)
- **Histórico das últimas 10 operações** em janela secundária (Toplevel) com reutilização de valores
- **Opção de limpar o histórico**
- **Tratamento de erros temático:** avisos claros para divisão por zero, parênteses não fechados e overflow

## 🎨 Interface
- Design temático com as cores clássicas do Homem-Aranha (vermelho, azul e preto)
- Alternância entre Traje Noturno (Miles Morales) e Traje Clássico (Peter Parker)
- Botões grandes e organizados em grade harmônica com barra heróica de resultado (`🕸️ =`)
- Display claro que mostra a expressão e o resultado

## 🛠️ Tecnologias
- Python 3.8+
- Tkinter (biblioteca nativa)
- AST (Abstract Syntax Tree para segurança matemática)
- Winsound & Threading (áudio nativo assíncrono)

## 🚀 Como Executar
1. Clone o repositório:
```bash
git clone https://github.com/amorimlais/calculadora-homem-aranha.git
cd calculadora-homem-aranha
```
2. Execute a aplicação:
```bash
python calculadora.py
```

## 🧪 Como Executar a Suíte de Testes
Para rodar os testes automatizados unitários e de regressão:
```bash
python tests_calculadora.py
```
