"""
=============================================================================
Calculadora do Homem-Aranha com Interface Gráfica em Python (Tkinter)
=============================================================================
Autor: Edição Especial Homem-Aranha (Spider-Man Edition)
Dependências: Nenhuma externa (utiliza apenas a biblioteca padrão do Python).

Características e Identidade Visual:
- Cores Oficiais: Vermelho Homem-Aranha (#E23636), Azul Heróico (#2B5EA7) e Preto (#12131C)
- Símbolos temáticos: Teia de aranha (🕸️), Aranha heróica (🕷️), raio de teia
- Alternância de Temas:
    * Traje Noturno / Miles Morales (Tema Escuro com preto, vermelho vibrante e azul)
    * Traje Clássico / Peter Parker (Tema Claro com branco teia, vermelho carmesim e azul royal)

Funcionalidades:
- Operações básicas: Adição (+), Subtração (-), Multiplicação (*), Divisão (/)
- Operações avançadas: Potência (xʸ ou **), Raiz Quadrada (√), Porcentagem (%), Resto da Divisão (mod / %)
- Decimais e inversão de sinal (±)
- Histórico das últimas 10 operações com janela temática dedicada (Toplevel)
- Limpeza de histórico e recuperação de cálculos passados
- Tratamento robusto de erros (Divisão por zero, raiz de número negativo, etc.)
- Suporte a atalhos do teclado físico
=============================================================================
"""

import tkinter as tk
from tkinter import messagebox
import math
import sys


class CalculadoraHomemAranha:
    """
    Classe principal que gerencia a interface gráfica temática do Homem-Aranha
    e toda a lógica matemática da calculadora.
    """

    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("🕷️ Calculadora do Homem-Aranha 🕸️")
        self.root.geometry("390x640")
        self.root.minsize(350, 580)

        # Estado interno da calculadora
        self.expressao = ""           # Expressão matemática em digitação
        self.resultado_anterior = ""   # Último resultado calculado
        self.historico = []           # Lista com as últimas 10 operações
        self.tema_escuro = True        # True = Traje Noturno, False = Traje Clássico
        self.aguardando_novo_numero = False  # Flag para resetar display após '='

        # Janela secundária de histórico
        self.janela_historico = None

        # Definição das paletas inspiradas no Homem-Aranha
        self.definir_paletas()

        # Construção da interface
        self.criar_menu_topo()
        self.criar_display()
        self.criar_teclado()

        # Atalhos do teclado físico
        self.configurar_atalhos()

        # Aplica o tema inicial
        self.aplicar_tema()

    def definir_paletas(self):
        """
        Define as paletas com as cores oficiais do Homem-Aranha:
        - Vermelho aranha: #E23636 / #C62828
        - Azul heróico: #2B5EA7 / #1D428A
        - Preto e teia: #12131C / #1F2232 / #F4F6F9
        """
        self.temas = {
            # Tema Escuro (Traje Noturno / Miles Morales / Stealth Suit)
            "escuro": {
                "nome_tema": "🕸️ Traje Clássico",
                "fundo_janela": "#0f1017",       # Preto azulado profundo
                "fundo_display": "#171822",      # Fundo do visor com teia sutil
                "borda_display": "#E23636",      # Contorno vermelho aranha
                "texto_expressao": "#94a3b8",    # Cinza azulado para expressão
                "texto_resultado": "#ffffff",    # Branco puro para destaque
                "btn_num_bg": "#1c1e2b",         # Teclas numéricas escuras
                "btn_num_fg": "#f1f5f9",         # Texto das teclas numéricas
                "btn_num_hover": "#282b3d",      # Hover nas teclas numéricas
                "btn_op_bg": "#1b2c4e",          # Azul escuro heróico (#2B5EA7 adaptado)
                "btn_op_fg": "#60a5fa",          # Azul luminoso
                "btn_op_hover": "#2B5EA7",       # Hover azul ativo
                "btn_action_bg": "#E23636",      # Vermelho Homem-Aranha principal
                "btn_action_fg": "#ffffff",      # Texto branco no botão igual
                "btn_action_hover": "#b91c1c",   # Vermelho carmesim hover
                "btn_clear_bg": "#450a0a",       # Vermelho escuro para C
                "btn_clear_fg": "#fca5a5",       # Texto vermelho claro
                "btn_clear_hover": "#7f1d1d",    # Hover botão C
                "teia_detalhe": "#E23636",       # Cor de acento decorativo
                "titulo_cor": "#E23636"
            },
            # Tema Claro (Traje Peter Parker / Clássico de HQ)
            "claro": {
                "nome_tema": "🕷️ Traje Noturno",
                "fundo_janela": "#f8fafc",       # Branco neve leve
                "fundo_display": "#ffffff",      # Display branco com contraste
                "borda_display": "#2B5EA7",      # Borda azul heróico
                "texto_expressao": "#64748b",    # Cinza ardósia
                "texto_resultado": "#0f172a",    # Azul marinho escuro quase preto
                "btn_num_bg": "#ffffff",         # Teclas numéricas brancas
                "btn_num_fg": "#0f172a",         # Texto numérico escuro
                "btn_num_hover": "#e2e8f0",      # Hover cinza claro
                "btn_op_bg": "#e0e7ff",          # Fundo azul suave
                "btn_op_fg": "#2B5EA7",          # Azul Homem-Aranha
                "btn_op_hover": "#c7d2fe",       # Hover azul suave
                "btn_action_bg": "#E23636",      # Vermelho Homem-Aranha vibrante
                "btn_action_fg": "#ffffff",      # Texto branco
                "btn_action_hover": "#dc2626",   # Vermelho hover
                "btn_clear_bg": "#fee2e2",       # Rosa claro
                "btn_clear_fg": "#991b1b",       # Vermelho escuro
                "btn_clear_hover": "#fecaca",    # Hover
                "teia_detalhe": "#2B5EA7",       # Cor de acento decorativo
                "titulo_cor": "#2B5EA7"
            }
        }

    @property
    def cores(self):
        """Retorna o conjunto de cores ativo."""
        return self.temas["escuro"] if self.tema_escuro else self.temas["claro"]

    def criar_menu_topo(self):
        """Barra superior com emblema do Homem-Aranha e botões de ação rápida."""
        self.frame_topo = tk.Frame(self.root, bg=self.cores["fundo_janela"], pady=8, padx=12)
        self.frame_topo.pack(fill=tk.X)

        # Botão de alternância de traje / tema
        self.btn_tema = tk.Button(
            self.frame_topo,
            text=self.cores["nome_tema"],
            command=self.alternar_tema,
            font=("Segoe UI", 9, "bold"),
            relief=tk.FLAT,
            cursor="hand2",
            padx=10,
            pady=4
        )
        self.btn_tema.pack(side=tk.LEFT)

        # Emblema central sutil
        self.lbl_emblema = tk.Label(
            self.frame_topo,
            text="🕷️ SPIDER-CALC",
            font=("Segoe UI", 9, "bold"),
            bg=self.cores["fundo_janela"],
            fg=self.cores["titulo_cor"]
        )
        self.lbl_emblema.pack(side=tk.LEFT, expand=True)

        # Botão do histórico de teias
        self.btn_historico = tk.Button(
            self.frame_topo,
            text="🕸️ Teias (0)",
            command=self.abrir_janela_historico,
            font=("Segoe UI", 9, "bold"),
            relief=tk.FLAT,
            cursor="hand2",
            padx=10,
            pady=4
        )
        self.btn_historico.pack(side=tk.RIGHT)

    def criar_display(self):
        """Tela de exibição estilizada com contorno de teia heróica."""
        self.frame_display = tk.Frame(
            self.root,
            bg=self.cores["fundo_display"],
            highlightthickness=2,
            highlightbackground=self.cores["borda_display"],
            padx=16,
            pady=12
        )
        self.frame_display.pack(fill=tk.X, padx=12, pady=(2, 10))

        # Expressão matemática em andamento
        self.lbl_expressao = tk.Label(
            self.frame_display,
            text="",
            font=("Segoe UI", 12),
            anchor="e",
            bg=self.cores["fundo_display"],
            fg=self.cores["texto_expressao"]
        )
        self.lbl_expressao.pack(fill=tk.X)

        # Resultado principal em destaque com visual heróico
        self.lbl_resultado = tk.Label(
            self.frame_display,
            text="0",
            font=("Segoe UI", 28, "bold"),
            anchor="e",
            bg=self.cores["fundo_display"],
            fg=self.cores["texto_resultado"]
        )
        self.lbl_resultado.pack(fill=tk.X)

    def criar_teclado(self):
        """Grade de botões estilizados no padrão uniforme do Homem-Aranha."""
        self.frame_botoes = tk.Frame(self.root, bg=self.cores["fundo_janela"], padx=10, pady=4)
        self.frame_botoes.pack(fill=tk.BOTH, expand=True)

        for i in range(4):
            self.frame_botoes.columnconfigure(i, weight=1, uniform="botao")
        for j in range(6):
            self.frame_botoes.rowconfigure(j, weight=1, uniform="botao")

        # Configuração: (texto, linha, coluna, tipo, comando)
        botoes = [
            # Linha 0: Limpeza e operadores superiores
            ("C", 0, 0, "limpar", self.limpar_tudo),
            ("⌫", 0, 1, "op", self.apagar_ultimo),
            ("%", 0, 2, "op", self.calcular_porcentagem),
            ("÷", 0, 3, "op", lambda: self.adicionar_operador("/")),

            # Linha 1: Operações avançadas (Raiz, Potência, Modulo, Multiplicação)
            ("√", 1, 0, "op", self.calcular_raiz_quadrada),
            ("xʸ", 1, 1, "op", lambda: self.adicionar_operador("**")),
            ("mod", 1, 2, "op", lambda: self.adicionar_operador("%")),
            ("×", 1, 3, "op", lambda: self.adicionar_operador("*")),

            # Linha 2: Números 7, 8, 9 e subtração
            ("7", 2, 0, "num", lambda: self.adicionar_digito("7")),
            ("8", 2, 1, "num", lambda: self.adicionar_digito("8")),
            ("9", 2, 2, "num", lambda: self.adicionar_digito("9")),
            ("−", 2, 3, "op", lambda: self.adicionar_operador("-")),

            # Linha 3: Números 4, 5, 6 e adição
            ("4", 3, 0, "num", lambda: self.adicionar_digito("4")),
            ("5", 3, 1, "num", lambda: self.adicionar_digito("5")),
            ("6", 3, 2, "num", lambda: self.adicionar_digito("6")),
            ("+", 3, 3, "op", lambda: self.adicionar_operador("+")),

            # Linha 4: Números 1, 2, 3 e inversão de sinal
            ("1", 4, 0, "num", lambda: self.adicionar_digito("1")),
            ("2", 4, 1, "num", lambda: self.adicionar_digito("2")),
            ("3", 4, 2, "num", lambda: self.adicionar_digito("3")),
            ("±", 4, 3, "op", self.inverter_sinal),

            # Linha 5: 0, ponto decimal e igual (= com visual heróico duplo)
            ("0", 5, 0, "num", lambda: self.adicionar_digito("0")),
            (".", 5, 1, "num", self.adicionar_ponto),
            ("🕸️ =", 5, 2, "igual", self.calcular_resultado),  # Abrange 2 colunas
        ]

        self.widget_botoes = []

        for item in botoes:
            texto = item[0]
            linha = item[1]
            coluna = item[2]
            tipo = item[3]
            comando = item[4]

            colspan = 2 if "igual" in tipo else 1

            btn = tk.Button(
                self.frame_botoes,
                text=texto,
                command=comando,
                font=("Segoe UI", 13, "bold"),
                relief=tk.FLAT,
                cursor="hand2",
                takefocus=False
            )
            btn.grid(row=linha, column=coluna, columnspan=colspan, padx=3, pady=3, sticky="nsew")
            self.widget_botoes.append((btn, tipo))

    def aplicar_tema(self):
        """Aplica a paleta de cores inspirada no Homem-Aranha a todos os componentes."""
        c = self.cores

        self.root.configure(bg=c["fundo_janela"])
        self.frame_topo.configure(bg=c["fundo_janela"])
        self.frame_botoes.configure(bg=c["fundo_janela"])

        self.lbl_emblema.configure(
            bg=c["fundo_janela"],
            fg=c["titulo_cor"]
        )

        self.frame_display.configure(
            bg=c["fundo_display"],
            highlightbackground=c["borda_display"]
        )
        self.lbl_expressao.configure(
            bg=c["fundo_display"],
            fg=c["texto_expressao"]
        )
        self.lbl_resultado.configure(
            bg=c["fundo_display"],
            fg=c["texto_resultado"]
        )

        self.btn_tema.configure(
            bg=c["btn_op_bg"],
            fg=c["btn_op_fg"],
            activebackground=c["btn_op_hover"],
            activeforeground=c["btn_op_fg"],
            text=c["nome_tema"]
        )
        self.btn_historico.configure(
            bg=c["btn_op_bg"],
            fg=c["btn_op_fg"],
            activebackground=c["btn_op_hover"],
            activeforeground=c["btn_op_fg"],
            text=f"🕸️ Teias ({len(self.historico)})"
        )

        for btn, tipo in self.widget_botoes:
            if tipo == "num":
                bg = c["btn_num_bg"]
                fg = c["btn_num_fg"]
                hover = c["btn_num_hover"]
            elif tipo == "op":
                bg = c["btn_op_bg"]
                fg = c["btn_op_fg"]
                hover = c["btn_op_hover"]
            elif tipo == "limpar":
                bg = c["btn_clear_bg"]
                fg = c["btn_clear_fg"]
                hover = c["btn_clear_hover"]
            elif tipo == "igual":
                bg = c["btn_action_bg"]
                fg = c["btn_action_fg"]
                hover = c["btn_action_hover"]
            else:
                bg = c["btn_op_bg"]
                fg = c["btn_op_fg"]
                hover = c["btn_op_hover"]

            btn.configure(
                bg=bg,
                fg=fg,
                activebackground=hover,
                activeforeground=fg
            )

    def alternar_tema(self):
        """Alterna entre o Traje Noturno (Escuro) e Traje Clássico (Claro)."""
        self.tema_escuro = not self.tema_escuro
        self.aplicar_tema()

    # -------------------------------------------------------------------------
    # Manipulação e Lógica dos Números
    # -------------------------------------------------------------------------

    def adicionar_digito(self, digito: str):
        """Adiciona um dígito numérico (0-9)."""
        if self.aguardando_novo_numero:
            self.expressao = ""
            self.aguardando_novo_numero = False

        if self.expressao == "0":
            self.expressao = digito
        else:
            self.expressao += digito

        self.atualizar_display()

    def adicionar_ponto(self):
        """Insere o ponto decimal no número atual."""
        if self.aguardando_novo_numero:
            self.expressao = "0."
            self.aguardando_novo_numero = False
            self.atualizar_display()
            return

        if not self.expressao:
            self.expressao = "0."
            self.atualizar_display()
            return

        ultimo_op = max(
            self.expressao.rfind("+"),
            self.expressao.rfind("-"),
            self.expressao.rfind("*"),
            self.expressao.rfind("/"),
            self.expressao.rfind("%")
        )

        segmento = self.expressao[ultimo_op + 1:]
        if "." not in segmento:
            if segmento == "":
                self.expressao += "0."
            else:
                self.expressao += "."

        self.atualizar_display()

    def adicionar_operador(self, operador: str):
        """Adiciona um operador matemático com proteção contra duplicidade."""
        self.aguardando_novo_numero = False

        if not self.expressao:
            if operador == "-":
                self.expressao = "-"
                self.atualizar_display()
            elif self.resultado_anterior:
                self.expressao = self.resultado_anterior + " " + operador + " "
                self.atualizar_display()
            return

        exp = self.expressao.rstrip()
        operadores_fim = ["+", "-", "*", "/", "%", "**"]
        for op in operadores_fim:
            if exp.endswith(op):
                exp = exp[:-len(op)].rstrip()
                break

        self.expressao = exp + f" {operador} "
        self.atualizar_display()

    def inverter_sinal(self):
        """Inverte o sinal do último número (positivo / negativo)."""
        if not self.expressao:
            return

        partes = self.expressao.split()
        if not partes:
            return

        ultimo = partes[-1]
        try:
            val = float(ultimo)
            val = -val
            if val.is_integer():
                partes[-1] = str(int(val))
            else:
                partes[-1] = str(val)

            self.expressao = " ".join(partes)
            self.atualizar_display()
        except ValueError:
            pass

    def apagar_ultimo(self):
        """Apaga o último caractere digitado (backspace ⌫)."""
        if self.aguardando_novo_numero:
            self.expressao = ""
            self.aguardando_novo_numero = False
            self.atualizar_display()
            return

        if self.expressao:
            self.expressao = self.expressao.rstrip()
            if self.expressao:
                self.expressao = self.expressao[:-1].rstrip()
            self.atualizar_display()

    def limpar_tudo(self):
        """Limpa o visor e zera a expressão (botão C)."""
        self.expressao = ""
        self.lbl_expressao.configure(text="")
        self.lbl_resultado.configure(text="0")
        self.aguardando_novo_numero = False

    def calcular_raiz_quadrada(self):
        """Calcula a raiz quadrada do número ou expressão."""
        try:
            alvo = self.obter_valor_para_calculo()
            if alvo is None:
                return

            if alvo < 0:
                self.exibir_erro("🕸️ Raiz de nº negativo")
                return

            resultado = math.sqrt(alvo)
            expressao_formatada = f"√({self.formatar_numero(alvo)})"
            self.registrar_sucesso(expressao_formatada, resultado)

        except Exception:
            self.exibir_erro("🕸️ Erro na raiz")

    def calcular_porcentagem(self):
        """Calcula a porcentagem (%) sobre o valor atual ou dentro de operação."""
        try:
            if not self.expressao:
                return

            partes = self.expressao.strip().split()
            if not partes:
                return

            # Caso 1: número simples (ex: 50 -> 0.5)
            if len(partes) == 1:
                val = float(partes[0]) / 100.0
                self.expressao = self.formatar_numero(val)
                self.atualizar_display()
                return

            # Caso 2: dentro de operação (ex: 200 * 15% -> 200 * 30 ou 200 + 10% -> 200 + 20)
            if len(partes) >= 3 and partes[-2] in ["+", "-", "*", "/"]:
                base = float(partes[0])
                op = partes[-2]
                pct = float(partes[-1])

                if op in ["+", "-"]:
                    valor_calc = base * (pct / 100.0)
                else:
                    valor_calc = pct / 100.0

                partes[-1] = self.formatar_numero(valor_calc)
                self.expressao = " ".join(partes)
                self.atualizar_display()
                return

            alvo = self.obter_valor_para_calculo()
            if alvo is not None:
                val = alvo / 100.0
                self.expressao = self.formatar_numero(val)
                self.atualizar_display()

        except Exception:
            self.exibir_erro("🕸️ Erro em %")

    def obter_valor_para_calculo(self):
        """Avalia a expressão atual e retorna como número float."""
        if not self.expressao:
            if self.resultado_anterior:
                return float(self.resultado_anterior)
            return 0.0

        try:
            res = self.avaliar_expressao_segura(self.expressao)
            return float(res)
        except Exception:
            return None

    # -------------------------------------------------------------------------
    # Avaliação Matemática e Tratamento de Erros
    # -------------------------------------------------------------------------

    def avaliar_expressao_segura(self, texto: str):
        """Avalia expressões matemáticas em ambiente seguro restrito."""
        sanitizado = texto.replace("×", "*").replace("÷", "/")
        caracteres_permitidos = set("0123456789.+-*/% ()")
        if not all(c in caracteres_permitidos for c in sanitizado):
            raise ValueError("Caracteres inválidos")

        ambiente_seguro = {
            "__builtins__": {},
            "math": math,
        }
        return eval(sanitizado, ambiente_seguro, {})

    def calcular_resultado(self):
        """Calcula o resultado final ao pressionar '='."""
        if not self.expressao:
            return

        expressao_original = self.expressao

        try:
            expr = self.expressao.strip()
            resultado = self.avaliar_expressao_segura(expr)

            if isinstance(resultado, complex):
                self.exibir_erro("🕸️ Resultado complexo")
                return

            self.registrar_sucesso(expressao_original, resultado)

        except ZeroDivisionError:
            self.exibir_erro("🕸️ Divisão por zero!")
        except OverflowError:
            self.exibir_erro("🕸️ Força excessiva (Overflow)")
        except (SyntaxError, ValueError):
            self.exibir_erro("🕸️ Sentido aranha: Inválido")
        except Exception:
            self.exibir_erro("🕸️ Erro de cálculo")

    def formatar_numero(self, num):
        """Formata o resultado para exibição limpa e legível."""
        if isinstance(num, (int, float)):
            if round(num, 10).is_integer():
                return f"{int(round(num, 10)):,}".replace(",", ".")
            else:
                return f"{num:.8f}".rstrip("0").rstrip(".")
        return str(num)

    def registrar_sucesso(self, expressao_str: str, resultado: float):
        """Registra o cálculo e armazena no histórico de teias."""
        resultado_formatado = self.formatar_numero(resultado)

        self.lbl_expressao.configure(text=f"{expressao_str} =")
        self.lbl_resultado.configure(text=resultado_formatado)

        self.resultado_anterior = str(resultado)
        self.expressao = str(resultado)
        self.aguardando_novo_numero = True

        registro = {
            "expressao": expressao_str,
            "resultado": resultado_formatado,
            "valor_bruto": str(resultado)
        }
        self.historico.insert(0, registro)
        if len(self.historico) > 10:
            self.historico.pop()

        self.btn_historico.configure(text=f"🕸️ Teias ({len(self.historico)})")
        self.atualizar_janela_historico()

    def exibir_erro(self, mensagem: str):
        """Exibe uma mensagem temática de erro no display."""
        self.lbl_expressao.configure(text=self.expressao)
        self.lbl_resultado.configure(text=mensagem)
        self.expressao = ""
        self.aguardando_novo_numero = True

    def atualizar_display(self):
        """Atualiza o display em tempo real."""
        texto = self.expressao if self.expressao else "0"
        self.lbl_resultado.configure(text=texto)

    # -------------------------------------------------------------------------
    # Janela de Histórico Temática (Últimas 10 Operações)
    # -------------------------------------------------------------------------

    def abrir_janela_historico(self):
        """Abre a janela de teias anteriores (Toplevel)."""
        if self.janela_historico is not None and self.janela_historico.winfo_exists():
            self.janela_historico.lift()
            return

        self.janela_historico = tk.Toplevel(self.root)
        self.janela_historico.title("🕸️ Teias Anteriores - Homem-Aranha")
        self.janela_historico.geometry("340x440")
        self.janela_historico.minsize(300, 320)

        c = self.cores
        self.janela_historico.configure(bg=c["fundo_janela"])

        frame_header = tk.Frame(self.janela_historico, bg=c["fundo_janela"], padx=14, pady=10)
        frame_header.pack(fill=tk.X)

        lbl_titulo = tk.Label(
            frame_header,
            text="🕷️ Histórico de Cálculos",
            font=("Segoe UI", 12, "bold"),
            bg=c["fundo_janela"],
            fg=c["titulo_cor"]
        )
        lbl_titulo.pack(side=tk.LEFT)

        btn_limpar_hist = tk.Button(
            frame_header,
            text="🗑️ Limpar Teias",
            command=self.limpar_historico,
            font=("Segoe UI", 9, "bold"),
            bg=c["btn_clear_bg"],
            fg=c["btn_clear_fg"],
            relief=tk.FLAT,
            cursor="hand2",
            padx=8,
            pady=2
        )
        btn_limpar_hist.pack(side=tk.RIGHT)

        self.frame_lista_hist = tk.Frame(self.janela_historico, bg=c["fundo_janela"], padx=14, pady=4)
        self.frame_lista_hist.pack(fill=tk.BOTH, expand=True)

        self.atualizar_janela_historico()

    def atualizar_janela_historico(self):
        """Atualiza a lista de teias/operações passadas."""
        if not self.janela_historico or not self.janela_historico.winfo_exists():
            return

        c = self.cores
        for widget in self.frame_lista_hist.winfo_children():
            widget.destroy()

        if not self.historico:
            lbl_vazio = tk.Label(
                self.frame_lista_hist,
                text="🕸️ Nenhuma teia lançada ainda.\nFaça um cálculo para registrar!",
                font=("Segoe UI", 10, "italic"),
                bg=c["fundo_janela"],
                fg=c["texto_expressao"],
                pady=50
            )
            lbl_vazio.pack()
            return

        for item in self.historico:
            card = tk.Frame(
                self.frame_lista_hist,
                bg=c["fundo_display"],
                highlightthickness=1,
                highlightbackground=c["borda_display"],
                padx=10,
                pady=6
            )
            card.pack(fill=tk.X, pady=3)

            lbl_exp = tk.Label(
                card,
                text=f"{item['expressao']} =",
                font=("Segoe UI", 9),
                bg=c["fundo_display"],
                fg=c["texto_expressao"],
                anchor="w"
            )
            lbl_exp.pack(fill=tk.X)

            frame_bottom = tk.Frame(card, bg=c["fundo_display"])
            frame_bottom.pack(fill=tk.X)

            lbl_res = tk.Label(
                frame_bottom,
                text=item["resultado"],
                font=("Segoe UI", 11, "bold"),
                bg=c["fundo_display"],
                fg=c["texto_resultado"],
                anchor="w"
            )
            lbl_res.pack(side=tk.LEFT)

            btn_usar = tk.Button(
                frame_bottom,
                text="Usar 🕷️",
                command=lambda val=item["valor_bruto"]: self.reutilizar_do_historico(val),
                font=("Segoe UI", 8, "bold"),
                bg=c["btn_op_bg"],
                fg=c["btn_op_fg"],
                relief=tk.FLAT,
                cursor="hand2"
            )
            btn_usar.pack(side=tk.RIGHT)

    def reutilizar_do_historico(self, valor_bruto: str):
        """Carrega um valor do histórico de teias para o visor."""
        self.expressao = valor_bruto
        self.aguardando_novo_numero = True
        self.lbl_expressao.configure(text="🕸️ Teia recuperada:")
        self.atualizar_display()
        if self.janela_historico and self.janela_historico.winfo_exists():
            self.janela_historico.destroy()

    def limpar_historico(self):
        """Limpa todo o histórico de operações com confirmação."""
        if not self.historico:
            return

        confirmar = messagebox.askyesno(
            "Limpar Teias",
            "Deseja realmente apagar o histórico de operações?",
            parent=self.janela_historico
        )
        if confirmar:
            self.historico.clear()
            self.btn_historico.configure(text="🕸️ Teias (0)")
            self.atualizar_janela_historico()

    # -------------------------------------------------------------------------
    # Atalhos de Teclado Físico
    # -------------------------------------------------------------------------

    def configurar_atalhos(self):
        """Vincula os eventos do teclado físico."""
        self.root.bind("<Key>", self.tratar_tecla)
        self.root.bind("<Return>", lambda e: self.calcular_resultado())
        self.root.bind("<KP_Enter>", lambda e: self.calcular_resultado())
        self.root.bind("<BackSpace>", lambda e: self.apagar_ultimo())
        self.root.bind("<Escape>", lambda e: self.limpar_tudo())

    def tratar_tecla(self, evento):
        """Trata as teclas pressionadas no teclado."""
        char = evento.char
        if char in "0123456789":
            self.adicionar_digito(char)
        elif char in "+-*/%":
            self.adicionar_operador(char)
        elif char in ".,":
            self.adicionar_ponto()
        elif char == "=":
            self.calcular_resultado()


# =============================================================================
# Execução da Aplicação
# =============================================================================
def main():
    root = tk.Tk()
    try:
        root.tk.call('tk', 'scaling', 1.25)
    except Exception:
        pass
    app = CalculadoraHomemAranha(root)
    root.mainloop()


if __name__ == "__main__":
    main()
