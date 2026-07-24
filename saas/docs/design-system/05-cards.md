# MotionLab SaaS

# Design System

# 05. Cards

Versão: 0.1.0

---

# Essência

> **Todo card deve representar uma unidade lógica de informação.**
>
> **Os cards organizam conteúdos relacionados e transformam informações dispersas em uma estrutura clara e compreensível.**

# Objetivo

Definir os princípios para utilização dos cards no MotionLab, garantindo organização, consistência visual e uma apresentação clara das informações.

Os cards devem agrupar conteúdos relacionados, facilitar a leitura da interface e contribuir para uma experiência previsível para o usuário.

---

# Contexto

Os cards são utilizados para organizar informações em unidades visuais independentes.

Eles permitem que o usuário compreenda rapidamente o conteúdo apresentado, identificando relações entre informações sem a necessidade de analisar toda a interface.

No MotionLab, os cards representam agrupamentos lógicos de informações e devem manter consistência em toda a aplicação.

---

# Princípios

Os cards do MotionLab devem ser:

- Organizados;
- Consistentes;
- Objetivos;
- Escaneáveis;
- Reutilizáveis;
- Funcionais.

# Estrutura

O sistema de cards do MotionLab define padrões para organização e apresentação das informações.

Os cards podem ser utilizados para representar:

- Resumos;
- Indicadores;
- Cadastros;
- Registros;
- Produtos;
- Clientes;
- Agendamentos;
- Relatórios;
- Ações rápidas.

Independentemente do conteúdo apresentado, todos os cards devem seguir a mesma identidade visual, preservando consistência, previsibilidade e facilidade de leitura.

---

# Regras

Os cards do MotionLab devem seguir as seguintes regras:

- Cada card deve representar apenas uma unidade lógica de informação.
- O conteúdo deve possuir hierarquia visual bem definida.
- Informações relacionadas devem permanecer agrupadas.
- O tamanho do card deve ser determinado pelo conteúdo, evitando espaços desnecessários.
- Ações pertencentes ao card devem estar claramente identificadas.
- Cards semelhantes devem possuir a mesma estrutura visual.

---

# Boas Práticas

Para manter a consistência do Design System, recomenda-se:

- Utilizar títulos claros e objetivos.
- Destacar apenas as informações mais relevantes.
- Manter espaçamentos internos consistentes.
- Organizar informações utilizando tipografia e espaçamento, evitando excesso de elementos gráficos.
- Posicionar ações sempre em locais previsíveis.
- Priorizar leitura rápida e fácil identificação do conteúdo.

---

# O que evitar

Evite:

- Misturar informações de assuntos diferentes no mesmo card.
- Criar cards excessivamente grandes.
- Inserir muitas ações em um único card.
- Alterar a estrutura visual sem necessidade.
- Utilizar estilos diferentes para cards com a mesma finalidade.
- Inserir elementos decorativos que não agreguem informação.

---

# Implementação (FlutterFlow)

No FlutterFlow, os cards devem ser implementados utilizando componentes reutilizáveis.

Sempre que possível:

- Criar Components para os tipos de card mais utilizados.
- Centralizar estilos no Theme.
- Utilizar os Design Tokens de cores, tipografia, espaçamento e bordas.
- Evitar personalizações específicas em cada página.
- Manter a estrutura consistente entre listas, dashboards e formulários.

---

# Design Tokens

Os valores oficiais referentes aos cards são definidos pelos Design Tokens correspondentes.

Os principais tokens utilizados incluem:

- Cores;
- Tipografia;
- Espaçamentos;
- Bordas;
- Raios de arredondamento;
- Elevação (quando aplicável).

Este documento descreve os princípios de utilização dos cards.

Os valores oficiais permanecem centralizados nos arquivos de Design Tokens, garantindo uma única fonte de verdade para todas as aplicações do MotionLab.

# Critérios de Aceitação

Um componente está aderente ao Design System quando:

- Atende ao objetivo definido neste documento.
- Respeita os princípios estabelecidos.
- Segue as regras de utilização.
- Não apresenta nenhuma das situações descritas em "O que evitar".
- Está implementado conforme as diretrizes do FlutterFlow.
- Utiliza exclusivamente os Design Tokens oficiais.