# MotionLab SaaS

# Design System

# 02. Tipografia

Versão: 0.1.0

---

# Essência

> **Toda escolha tipográfica deve possuir uma justificativa funcional.**
>
> **A tipografia organiza a informação antes de embelezar a interface.**

# Objetivo

A tipografia do MotionLab tem como objetivo proporcionar uma experiência de leitura clara, consistente e acessível.

Ela estabelece uma hierarquia visual que permite ao usuário identificar rapidamente informações, ações e conteúdos importantes.

---

# Contexto

A tipografia do MotionLab tem como principal objetivo organizar a informação e facilitar a comunicação entre a interface e o usuário.

Mais do que um elemento estético, a tipografia estabelece hierarquia visual, orienta a leitura e torna o conteúdo mais claro e acessível.

A utilização consistente dos estilos tipográficos permite que o usuário identifique rapidamente títulos, subtítulos, textos informativos e ações, reduzindo a carga cognitiva e proporcionando uma experiência de leitura previsível em toda a plataforma.

O MotionLab evita escolhas tipográficas baseadas apenas em preferência visual. Cada estilo, tamanho, peso e espaçamento entre textos deve possuir uma justificativa funcional, contribuindo para a clareza, consistência e escalabilidade do produto.

---

# Princípios

A tipografia deve ser:

- legível;
- consistente;
- escalável;
- acessível;
- reutilizável.

O tamanho do texto nunca deve ser utilizado como único recurso para destacar uma informação.

A combinação entre tamanho, peso, cor e espaçamento define a hierarquia visual.

---

# Filosofia

A tipografia deve permanecer uniforme em toda a aplicação.

O usuário deve reconhecer padrões de leitura independentemente da tela em que esteja navegando.

Mudanças de tamanho, peso ou estilo devem ocorrer apenas quando possuírem significado funcional.

---

# Hierarquia Tipográfica

O sistema tipográfico é organizado em níveis de importância.

## Display

Utilizado para títulos de destaque e apresentações institucionais.

---

## Headline

Utilizado para títulos principais das páginas.

---

## Title

Utilizado para seções internas.

---

## Subtitle

Utilizado para complementar títulos.

---

## Body

Utilizado para o conteúdo principal da aplicação.

---

## Caption

Utilizado para informações auxiliares.

---

## Label

Utilizado em:

- botões;
- campos;
- menus;
- indicadores.

---

## Overline

Utilizado apenas quando houver necessidade de categorizar informações.

---

# Regras

## Utilizar apenas estilos oficiais

Todos os textos devem utilizar estilos definidos pelo Design System.

---

## Não definir tamanhos manualmente

Os componentes devem utilizar os estilos tipográficos oficiais.

---

## Evitar excesso de variações

A aplicação deve utilizar o menor número possível de estilos diferentes.

---

## Hierarquia consistente

Cada nível de título deve manter o mesmo significado em toda a aplicação.

Exemplo:

Headline
↓
Title
↓
Subtitle
↓
Body
↓
Caption

---

# Peso da Fonte

Os pesos utilizados devem comunicar importância.

Exemplos:

- Regular
- Medium
- SemiBold
- Bold

Evitar utilizar múltiplos pesos sem necessidade.

---

# Alinhamento

Priorizar:

- alinhamento à esquerda para textos longos;
- centralização apenas quando houver justificativa visual;
- evitar textos justificados.

---

# Comprimento das linhas

Evitar linhas excessivamente longas.

Sempre priorizar conforto na leitura.

---

# Espaçamento

A tipografia deve respeitar:

- altura de linha;
- espaçamento entre títulos;
- espaçamento entre parágrafos.

O ritmo visual é tão importante quanto o tamanho da fonte.

---

# Acessibilidade

A tipografia deve:

- possuir contraste adequado;
- permitir ampliação;
- permanecer legível em diferentes resoluções;
- evitar fontes decorativas para textos funcionais.

---

# Responsividade

A hierarquia tipográfica deve ser preservada em diferentes tamanhos de tela.

O objetivo não é manter exatamente o mesmo tamanho da fonte, mas manter a proporção entre os estilos.

---

# FlutterFlow

Os estilos tipográficos devem ser definidos no Theme da aplicação.

Os componentes devem consumir apenas estilos oficiais.

Evitar configurações locais de fonte, tamanho ou peso.

---

# Design Tokens

Os valores oficiais encontram-se em:

design-tokens/typography.json

Este documento descreve apenas os princípios de utilização.

Os tamanhos, pesos, famílias tipográficas e espaçamentos pertencem exclusivamente aos Design Tokens.

# Critérios de Aceitação

Um componente está aderente ao Design System quando:

- Atende ao objetivo definido neste documento.
- Respeita os princípios estabelecidos.
- Segue as regras de utilização.
- Não apresenta nenhuma das situações descritas em "O que evitar".
- Está implementado conforme as diretrizes do FlutterFlow.
- Utiliza exclusivamente os Design Tokens oficiais.