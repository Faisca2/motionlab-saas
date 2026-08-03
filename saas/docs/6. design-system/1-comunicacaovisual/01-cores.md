# MotionLab SaaS

# Design System

# 01. Cores

Versão: 0.1.0

---

# Essência

> **Toda escolha cromática deve possuir uma justificativa funcional.**

> **As cores comunicam significado antes de comunicar estilo.**

# Objetivo

As cores do MotionLab possuem função semântica.

Elas existem para comunicar estados, ações e identidade visual.

Nunca devem ser utilizadas apenas por preferência estética.

---

# Contexto
As cores do MotionLab seguem princípios de harmonia visual, buscando transmitir muito mais do que estilo. Elas são utilizadas como um elemento de comunicação, organização e orientação da interface.

Cada cor possui um propósito definido dentro do Design System, contribuindo para estabelecer hierarquia visual, reforçar a identidade da marca e facilitar a compreensão das informações pelo usuário.

O MotionLab evita a utilização de cores apenas por tendência ou costume. Toda escolha cromática deve possuir uma justificativa funcional, garantindo consistência, acessibilidade e uma experiência de uso previsível em toda a plataforma.

---

# Princípios

O sistema de cores deve ser:

- consistente;
- acessível;
- previsível;
- reutilizável;
- independente da tecnologia utilizada.

Toda cor utilizada no sistema deve possuir um significado.

---

# Identidade Visual

A identidade do MotionLab será baseada em uma paleta moderna com foco em:

- tecnologia;
- confiança;
- simplicidade;
- profissionalismo.

A identidade visual deve transmitir estabilidade e inovação.

---

# Estrutura da Paleta

A paleta é organizada em categorias.

## Brand

Representa a identidade principal da aplicação.

Exemplos:

- Primary
- Secondary
- Accent

---

## Surface

Representa superfícies da interface.

Exemplos:

- Background
- Surface
- Card
- Modal

---

## Content

Representa elementos de conteúdo.

Exemplos:

- Title
- Body
- Caption
- Disabled

---

## Border

Representa elementos de separação.

Exemplos:

- Border
- Divider
- Outline

---

## Feedback

Representa estados do sistema.

Exemplos:

- Success
- Warning
- Error
- Info

---

## Action

Representa ações executáveis.

Exemplos:

- Button Primary
- Button Secondary
- Hover
- Pressed
- Focus

---

## Status

Representa estados operacionais.

Exemplos:

- Active
- Inactive
- Pending
- Cancelled
- Archived

---

# Regras

## Nunca utilizar códigos HEX diretamente

Todo componente deve consumir Design Tokens.

Exemplo:

Correta:

Primary

Incorreta:

#3366FF

---

## Nunca repetir cores

Cada cor possui apenas um token oficial.

---

## Não criar novas cores sem necessidade

Antes de adicionar uma nova cor deve ser verificado se existe um token equivalente.

---

## Estados

Todo componente deve possuir estados visuais consistentes.

Exemplo:

- Normal
- Hover
- Focus
- Pressed
- Disabled

---

# Acessibilidade

As cores devem atender critérios mínimos de contraste.

Evitar utilizar apenas cor para transmitir informação.

Sempre que necessário utilizar:

- ícones;
- texto;
- indicadores visuais.

---

# Dark Mode

O sistema deverá ser preparado para suportar Dark Mode.

A troca entre temas deve ocorrer através dos Design Tokens.

Nunca através de alterações diretas nos componentes.

---

# Design Tokens

Os valores oficiais das cores encontram-se em:

design-tokens/colors.json

Este documento descreve apenas a utilização das cores.

Os valores numéricos pertencem exclusivamente aos Design Tokens.

# Critérios de Aceitação

Um componente está aderente ao Design System quando:

- Atende ao objetivo definido neste documento.
- Respeita os princípios estabelecidos.
- Segue as regras de utilização.
- Não apresenta nenhuma das situações descritas em "O que evitar".
- Está implementado conforme as diretrizes do FlutterFlow.
- Utiliza exclusivamente os Design Tokens oficiais.
