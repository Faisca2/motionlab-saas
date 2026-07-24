# MotionLab SaaS

# Design System

# 04. Botões

Versão: 0.1.0

---

# Essência

> **Todo botão deve representar uma ação clara e possuir uma justificativa funcional.**
>
> **Um botão comunica uma intenção antes mesmo de ser pressionado.**

# Objetivo

Definir os princípios e as diretrizes para a utilização dos botões no MotionLab, garantindo consistência visual, clareza na comunicação das ações e uma experiência previsível para o usuário.

Os botões representam os principais pontos de interação da interface e devem orientar o usuário de forma intuitiva e segura.

# Contexto

Os botões são os principais elementos de interação entre o usuário e a aplicação.

Cada botão comunica uma ação, uma intenção ou uma decisão. Quando utilizados de forma consistente, reduzem dúvidas, tornam a navegação mais intuitiva e aumentam a confiança do usuário durante a utilização do sistema.

No MotionLab, os botões fazem parte da comunicação da interface e não devem ser utilizados apenas como elementos decorativos.

# Princípios

Os botões do MotionLab devem ser:

- Consistentes;
- Claros;
- Objetivos;
- Acessíveis;
- Funcionais;
- Previsíveis.

Toda ação apresentada ao usuário deve possuir uma representação visual adequada e coerente com sua importância.

# Filosofia

Um botão representa uma decisão.

Antes de clicar, o usuário deve compreender claramente qual será o resultado daquela ação.

O MotionLab utiliza botões padronizados para reduzir a carga cognitiva, aumentar a previsibilidade da interface e transmitir segurança durante a navegação.

A aparência de um botão deve refletir sua importância e sua responsabilidade dentro da aplicação.

# Estrutura

O sistema de botões define padrões para:

- Botão Primário;
- Botão Secundário;
- Botão Terciário;
- Botão de Texto;
- Botão com Ícone;
- Botão com Ícone e Texto;
- Botão Destrutivo;
- Botão Desabilitado.

Cada variação possui uma finalidade específica e deve ser utilizada de forma consistente em toda a aplicação.

# Regras

- Cada tela deve possuir apenas uma ação principal em destaque.
- Botões com a mesma finalidade devem possuir a mesma aparência.
- O texto do botão deve iniciar com verbo de ação.
- Utilizar nomenclaturas claras e objetivas.
- Respeitar os estados definidos pelo Design System.
- Evitar múltiplos botões primários na mesma área de interação.

# Boas Práticas

- Destacar apenas a ação mais importante.
- Utilizar ícones apenas quando agregarem significado.
- Manter tamanho adequado para interação em dispositivos móveis.
- Garantir contraste suficiente entre texto e fundo.
- Utilizar espaçamento consistente entre botões.

# O que evitar

Evite:

- Utilizar muitos botões primários na mesma tela.
- Criar estilos diferentes para a mesma ação.
- Utilizar textos genéricos como "OK" ou "Confirmar" quando uma ação mais específica puder ser utilizada.
- Misturar diferentes tamanhos sem necessidade.
- Utilizar botões apenas por estética.

# Implementação (FlutterFlow)

No FlutterFlow, os botões devem ser implementados utilizando componentes reutilizáveis sempre que possível.

Os estilos devem ser definidos no Theme ou em Components, evitando personalizações individuais em cada página.

Todos os estados (Normal, Hover, Pressed, Disabled e Loading) devem seguir o padrão estabelecido pelo Design System.

# Design Tokens

Os valores oficiais referentes a cores, tipografia, bordas, espaçamentos e estados dos botões são definidos pelos respectivos Design Tokens.

Este documento descreve os princípios de utilização, enquanto os valores oficiais permanecem centralizados nos arquivos de Design Tokens.

# Critérios de Aceitação

Um componente está aderente ao Design System quando:

- Atende ao objetivo definido neste documento.
- Respeita os princípios estabelecidos.
- Segue as regras de utilização.
- Não apresenta nenhuma das situações descritas em "O que evitar".
- Está implementado conforme as diretrizes do FlutterFlow.
- Utiliza exclusivamente os Design Tokens oficiais.