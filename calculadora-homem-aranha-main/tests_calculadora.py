"""
=============================================================================
Suite de Testes Automatizados - Calculadora do Homem-Aranha
=============================================================================
Cobre:
1. Avaliador Matemático Seguro (AST) & Validação de Parênteses
2. Prevenção de Injeção de Código e Segurança
3. Gerenciador de Áudio Nativo (winsound e Fallback Resiliente)
4. Testes de Regressão das Operações Matemáticas (Básicas e Avançadas)
5. Testes de Lógica da Interface (Tkinter headless)
=============================================================================
"""

import unittest
import math
import time
import os
import sys

# Garante importação do módulo calculadora
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from calculadora import AvaliadorMatematico, GerenciadorAudio, CalculadoraHomemAranha
import tkinter as tk


class TestAvaliadorMatematicoAST(unittest.TestCase):
    """Testes unitários para o avaliador seguro com AST e regras de parênteses."""

    def test_exemplos_obrigatorios_especificacao(self):
        """Valida exatamente os exemplos solicitados no desafio."""
        self.assertEqual(AvaliadorMatematico.avaliar("(10 + 5) * 2"), 30)
        self.assertEqual(AvaliadorMatematico.avaliar("(20 - 5) / 3"), 5.0)
        self.assertEqual(AvaliadorMatematico.avaliar("10 * (2 + 3)"), 50)
        self.assertEqual(AvaliadorMatematico.avaliar("((5 + 5) * 2)"), 20)

    def test_precedencia_de_operadores(self):
        """Verifica se a precedência matemática convencional é rigorosamente respeitada."""
        # Multiplicação antes da adição
        self.assertEqual(AvaliadorMatematico.avaliar("2 + 3 * 4"), 14)
        # Parênteses alterando a precedência
        self.assertEqual(AvaliadorMatematico.avaliar("(2 + 3) * 4"), 20)
        # Potência antes da multiplicação
        self.assertEqual(AvaliadorMatematico.avaliar("2 * 3 ** 2"), 18)
        # Parênteses aninhados complexos
        self.assertEqual(AvaliadorMatematico.avaliar("((2 + 3) * (4 + 1)) / 5"), 5.0)

    def test_operacoes_basicas_e_avancadas(self):
        """Testa adição, subtração, multiplicação, divisão, potência, resto e unários."""
        self.assertEqual(AvaliadorMatematico.avaliar("15 + 25"), 40)
        self.assertEqual(AvaliadorMatematico.avaliar("100 - 35"), 65)
        self.assertEqual(AvaliadorMatematico.avaliar("12 * 12"), 144)
        self.assertEqual(AvaliadorMatematico.avaliar("100 / 4"), 25.0)
        self.assertEqual(AvaliadorMatematico.avaliar("17 % 5"), 2)
        self.assertEqual(AvaliadorMatematico.avaliar("2 ** 8"), 256)
        self.assertEqual(AvaliadorMatematico.avaliar("-10 + 20"), 10)
        self.assertEqual(AvaliadorMatematico.avaliar("+15 - 5"), 10)

    def test_validacao_sintaxe_parenteses(self):
        """Testa mensagens de erro claras para parênteses mal formados."""
        # Parêntese aberto e não fechado
        with self.assertRaises(ValueError) as ctx:
            AvaliadorMatematico.avaliar("(10 + 5")
        self.assertIn("não fechado", str(ctx.exception))

        # Parêntese fechado sem abertura prévia
        with self.assertRaises(ValueError) as ctx:
            AvaliadorMatematico.avaliar("10 + 5)")
        self.assertIn("inesperado", str(ctx.exception))

        # Ordem invertida: fecha antes de abrir
        with self.assertRaises(ValueError) as ctx:
            AvaliadorMatematico.avaliar(") 10 + 5 (")
        self.assertIn("inesperado", str(ctx.exception))

        # Parênteses vazios
        with self.assertRaises(ValueError) as ctx:
            AvaliadorMatematico.avaliar("()")
        self.assertIn("vazio", str(ctx.exception))

        with self.assertRaises(ValueError) as ctx:
            AvaliadorMatematico.avaliar("10 + ()")
        self.assertIn("vazio", str(ctx.exception))

    def test_seguranca_bloqueio_injecao_codigo(self):
        """Garante que qualquer tentativa de execução arbitrária é bloqueada."""
        comandos_maliciosos = [
            "__import__('os').system('echo hack')",
            "open('arquivo.txt', 'w')",
            "(lambda: 123)()",
            "print('ataque')",
            "(1).__class__",
            "globals()",
            "locals()",
            "exit()",
            "sys.exit()",
            "exec('a = 1')"
        ]
        for cmd in comandos_maliciosos:
            with self.assertRaises(ValueError, msg=f"Deveria ter bloqueado: {cmd}") as ctx:
                AvaliadorMatematico.avaliar(cmd)
            self.assertTrue(
                str(ctx.exception).startswith("🕸️"),
                f"Mensagem de erro temática esperada para '{cmd}', recebido: {ctx.exception}"
            )

    def test_tratamento_divisao_por_zero(self):
        """Garante disparo correto de ZeroDivisionError."""
        with self.assertRaises(ZeroDivisionError):
            AvaliadorMatematico.avaliar("10 / 0")

        with self.assertRaises(ZeroDivisionError):
            AvaliadorMatematico.avaliar("10 % 0")

    def test_protecao_overflow_potencia(self):
        """Garante proteção contra expoentes gigantes que congelariam a CPU."""
        with self.assertRaises(OverflowError):
            AvaliadorMatematico.avaliar("9999 ** 9999")


class TestGerenciadorAudio(unittest.TestCase):
    """Testes do subsistema de som não bloqueante e fallback."""

    def test_reproducao_sem_bloqueio_ui(self):
        """Garante que a chamada dos métodos de áudio retorna imediatamente (< 10ms)."""
        audio = GerenciadorAudio()
        t0 = time.time()
        audio.reproduzir_clique()
        audio.reproduzir_thwip()
        tempo_decorrido = time.time() - t0
        self.assertLess(tempo_decorrido, 0.05, "Chamada de áudio não pode bloquear!")

    def test_resiliencia_quando_winsound_indisponivel(self):
        """Simula ambiente sem winsound e garante que nada trava."""
        audio = GerenciadorAudio()
        audio._disponivel = False  # Simula fallback gracioso
        try:
            audio.reproduzir_clique()
            audio.reproduzir_thwip()
        except Exception as e:
            self.fail(f"GerenciadorAudio falhou no modo fallback: {e}")


class TestCalculadoraIntegracao(unittest.TestCase):
    """Testes de integração das regras de negócio da calculadora."""

    @classmethod
    def setUpClass(cls):
        # Inicializa Tkinter em modo oculto (headless)
        cls.root = tk.Tk()
        cls.root.withdraw()
        cls.app = CalculadoraHomemAranha(cls.root)

    @classmethod
    def tearDownClass(cls):
        cls.root.destroy()

    def setUp(self):
        self.app.limpar_tudo()

    def test_fluxo_digitacao_parenteses_e_multiplicacao_implicita(self):
        """Verifica a conveniência de multiplicação implícita ao digitar '5('."""
        self.app.adicionar_digito("5")
        self.app.adicionar_parentese("(")
        self.assertEqual(self.app.expressao, "5 * (")

        self.app.adicionar_digito("2")
        self.app.adicionar_operador("+")
        self.app.adicionar_digito("3")
        self.app.adicionar_parentese(")")
        self.assertEqual(self.app.expressao, "5 * (2 + 3)")

        self.app.calcular_resultado()
        self.assertEqual(self.app.lbl_resultado.cget("text"), "25")

    def test_historico_ultimas_operacoes(self):
        """Valida que o histórico armazena corretamente até 10 cálculos."""
        self.app.historico.clear()
        for i in range(1, 15):
            self.app.expressao = f"{i} + 1"
            self.app.calcular_resultado()

        self.assertEqual(len(self.app.historico), 10)
        # Mais recente no topo
        self.assertEqual(self.app.historico[0]["expressao"], "14 + 1")
        self.assertEqual(self.app.historico[0]["resultado"], "15")

    def test_raiz_quadrada(self):
        """Testa o cálculo da raiz quadrada."""
        self.app.expressao = "144"
        self.app.calcular_raiz_quadrada()
        self.assertEqual(self.app.lbl_resultado.cget("text"), "12")

    def test_porcentagem(self):
        """Testa operação de porcentagem."""
        self.app.expressao = "200 + 10"
        self.app.calcular_porcentagem()
        # 10% de 200 = 20 -> expressao vira '200 + 20'
        self.assertEqual(self.app.expressao, "200 + 20")
        self.app.calcular_resultado()
        self.assertEqual(self.app.lbl_resultado.cget("text"), "220")

    def test_tratamento_erro_nao_encerra_aplicacao(self):
        """Testa exibição de erro amigável mantendo a aplicação viva."""
        self.app.expressao = "(10 + 5"
        self.app.calcular_resultado()
        self.assertIn("não fechado", self.app.lbl_resultado.cget("text"))
        # Verifica se a calculadora continua funcional após o erro
        self.app.adicionar_digito("9")
        self.assertEqual(self.app.expressao, "9")

    def test_entrada_teclado_fisico_parenteses(self):
        """Simula a captura de eventos de teclado físico para parênteses e operadores."""
        class MockEvent:
            def __init__(self, char):
                self.char = char

        for ch in ["(", "2", "0", "-", "5", ")", "*", "3"]:
            self.app.tratar_tecla(MockEvent(ch))

        self.assertEqual(self.app.expressao, "(20 - 5) * 3")
        self.app.calcular_resultado()
        self.assertEqual(self.app.lbl_resultado.cget("text"), "45")

    def test_operacoes_com_decimais_e_parenteses(self):
        """Testa cálculos combinando decimais e parênteses."""
        self.app.expressao = "(1.5 + 2.5) * 4"
        self.app.calcular_resultado()
        self.assertEqual(self.app.lbl_resultado.cget("text"), "16")

    def test_potencia_e_modulo_com_parenteses(self):
        """Testa potência e resto da divisão aninhados em parênteses."""
        self.app.expressao = "(2 + 1) ** 3"
        self.app.calcular_resultado()
        self.assertEqual(self.app.lbl_resultado.cget("text"), "27")

        self.app.expressao = "(10 % 4) * 5"
        self.app.calcular_resultado()
        self.assertEqual(self.app.lbl_resultado.cget("text"), "10")

    def test_inversao_sinal_e_backspace(self):
        """Testa inversão de sinal (±) e backspace (⌫)."""
        self.app.expressao = "10 + 5"
        self.app.inverter_sinal()
        self.assertEqual(self.app.expressao, "10 + -5")

        self.app.apagar_ultimo()
        self.assertEqual(self.app.expressao, "10 + -")

    def test_alternancia_de_temas(self):
        """Testa a troca dinâmica entre Traje Noturno e Traje Clássico."""
        tema_inicial = self.app.tema_escuro
        self.app.alternar_tema()
        self.assertNotEqual(self.app.tema_escuro, tema_inicial)
        self.app.alternar_tema()
        self.assertEqual(self.app.tema_escuro, tema_inicial)


if __name__ == "__main__":
    unittest.main()
