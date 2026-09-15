### Changedlog

## [0.4.0] - 2026-09-14

### Added

#### Dashboard Matriz

- Implementada a estrutura inicial do Dashboard Matriz no FlutterFlow.
- Implementados filtros globais de período:
  - Hoje
  - Semana
  - Mês
- Implementados filtros de faturamento:
  - Tudo
  - Serviço
  - Produto
- Implementados indicadores principais:
  - Receitas
  - Despesas
  - Agendados
- Implementadas comparações de período:
  - Vs Ontem
  - Vs Sem Ant
  - Vs Mês Ant
- Implementada seção de Filiais com indicadores operacionais:
  - Agendado
  - Realizado
  - Em Atendimento
  - Faturamento
- Implementado gráfico de participação das filiais no faturamento utilizando gráfico de rosca.
- Implementado gráfico de faturamento por filial utilizando gráfico de barras.
- Implementada alternância local entre gráfico de rosca e gráfico de barras através de Page State.
- Definida identidade visual consistente das filiais entre os diferentes gráficos.

#### Arquitetura

- Criado o ADR `ADR-001-agregacao-dashboard.md`.
- Definida a estratégia de agregação para evolução dos dashboards.
- Definido que transações e movimentações permanecem como fonte de verdade.
- Definido que agregados são projeções otimizadas para leitura.
- Definida a Filial como unidade persistida de agregação.
- Definido que a Matriz não possuirá acumuladores financeiros independentes.
- Definido que os indicadores da Matriz serão derivados dos agregados das Filiais.
- Definida granularidade diária como estratégia inicial prevista para agregações.
- Definidos princípios de concorrência, idempotência e reconciliação para evolução futura.

#### Modelo de Dados

- Criado o documento `modelo-de-dados.md`.
- Documentado o modelo organizacional:
  - Rede
  - Matriz
  - Filiais
  - Usuários
- Documentadas as coleções atualmente implementadas:
  - `redes_franquias`
  - `estabelecimentos`
  - `users`
- Separadas explicitamente estruturas:
  - Implementadas
  - Planejadas
  - Conceituais
- Definida conceitualmente a separação dos domínios:
  - Financeiro
  - Produtos
  - Estoque
  - Operação
  - Dashboard
- Definida a distinção entre produtos para revenda e produtos de consumo operacional.
- Definida classificação inicial das despesas operacionais, incluindo:
  - Aluguel
  - Energia elétrica
  - Água
  - Internet
  - Material de limpeza
  - Material de uso operacional
  - Aquisição de produtos para revenda
- Definida a separação entre movimentações de estoque e seus respectivos efeitos financeiros.

### Changed

#### Design System

- Atualizado o documento `10-dashboards.md` para versão 0.2.0.
- Consolidado o Dashboard Matriz como referência prática para aplicação das diretrizes de dashboard.
- Definidas regras para filtros, KPIs, gráficos e indicadores de Filiais.
- Definido que alterações exclusivamente visuais entre representações do mesmo conjunto de dados não devem provocar novas consultas ao backend.
- Reforçadas regras de responsividade e prevenção de overflow em interfaces mobile.

#### Arquitetura de Dados

- Evoluída a visão de dados do MotionLab para separar claramente:
  - Fonte transacional de verdade
  - Projeções agregadas para consulta
  - Consolidação da Matriz
- Definido que compras, vendas, estoque e despesas devem preservar a natureza da operação que representam.

### Defined

- A transação e a movimentação são as fontes de verdade.
- O agregado é uma projeção otimizada para leitura.
- A Filial é a unidade persistida de agregação.
- A Matriz é uma visão consolidada derivada das Filiais.
- Produtos para revenda e produtos de consumo operacional possuem naturezas distintas.
- Financeiro, estoque e operação permanecem domínios separados, ainda que uma mesma operação possa produzir efeitos relacionados.
- O MVP não deverá implementar antecipadamente infraestrutura de agregação que ainda não seja necessária para o volume atual.

### Milestone

Consolidada a primeira versão funcional e arquitetural do Dashboard Matriz.

O projeto passa a possuir uma direção definida para evolução dos dashboards em escala, preservando o foco atual na validação do MVP e evitando antecipação desnecessária de infraestrutura.

## [0.3.1] - 2026-08-03

### Added

#### Produto

- Definida a estrutura inicial de Personas.
- Definido o conceito de Jornadas do Usuário.
- Diferenciadas Jornadas Transversais e Jornadas Específicas.
- Estabelecida a relação entre Personas, Jornadas e Módulos.

#### MVP

- Definido o processo de inventário técnico do projeto FlutterFlow.
- Estabelecida a estratégia de documentação da evolução do MVP.

#### Estratégia de Produto

- Definida a separação entre documentação conceitual (Google Docs) e documentação técnica (VS Code).
- Formalizado o fluxo de evolução:
  - Ideia
  - Discussão
  - Documentação
  - Implementação
  - Validação

## [0.3.0] - 2026-07-29

### Added

#### Estrutura da Documentação

- Definida a organização oficial da pasta `docs`.
- Criação da pasta `docs/01-principios` como base conceitual do MotionLab.
- Definidas as cinco áreas oficiais da documentação:
  - 01-principios
  - 02-product
  - 03-architecture
  - 04-design-system
  - 05-modules

- Definida a estrutura inicial dos documentos de princípios:
  - 00-introducao
  - 01-clareza
  - 02-consistencia
  - 03-responsabilidade-compartilhada
  - 04-transparencia
  - 05-rastreabilidade
  - 06-orientacao

### Changed

#### Hierarquia Documental

A documentação oficial do MotionLab passa a seguir a seguinte ordem conceitual:

1. Princípios
2. Produto
3. Arquitetura
4. Design System
5. Módulos

Pastas como `design-tokens`, `references` e `changelog` permanecem independentes da documentação conceitual, atuando como artefatos de suporte ao projeto.

### Defined

- Os princípios tornam-se a camada mais alta da documentação do MotionLab.
- Todo documento de Produto, Arquitetura, Design System e Módulos deve estar alinhado aos princípios.
- Em caso de conflito entre implementação e princípio, o princípio prevalece.

### Notes

Foi consolidada a arquitetura documental do MotionLab, separando claramente documentação conceitual, artefatos técnicos e materiais de apoio.

### Progress

#### Design System

Concluída a primeira versão conceitual da documentação do Design System do MotionLab.

Foram definidos e documentados os seguintes tópicos:

1. Cores
2. Tipografia
3. Espaçamentos
4. Botões
5. Cards
6. Header
7. Navegação
8. Formulários
9. Tabelas
10. Dashboards
11. Estados

Durante a elaboração do documento **11 - Estados**, foi consolidada a filosofia de responsabilidade compartilhada entre operador e sistema, estabelecendo que:

- as decisões pertencem ao operador;
- o sistema executa as operações;
- o sistema comunica claramente as consequências de cada operação.

Essa definição passou a fundamentar a criação da pasta `docs/01-principios`, que se torna a base conceitual de toda a documentação do MotionLab.
### Milestone

Concluída a documentação conceitual da primeira versão do Design System do MotionLab.

A próxima etapa do projeto consiste em consolidar os documentos de Princípios e, posteriormente, revisar cada documento do Design System para garantir aderência aos princípios definidos.

# Changelog

## 2026-07-24

### Tipo
Documentação

---

## Design System

### Documento 04 - Botões

#### Concluído

- Estrutura completa do documento definida.
- Definida a Essência dos Botões.
- Definidos:
  - Objetivo
  - Contexto
  - Princípios
  - Filosofia
  - Estrutura
  - Regras
  - Boas Práticas
  - O que evitar
  - Implementação (FlutterFlow)
  - Design Tokens

#### Filosofia consolidada

> Todo botão deve representar uma ação clara e possuir uma justificativa funcional.

> Um botão comunica uma intenção antes mesmo de ser pressionado.

---

### Documento 05 - Cards

#### Iniciado

Definida a estrutura inicial do documento.

#### Concluído

- Essência
- Objetivo
- Contexto
- Princípios
- Estrutura
- Regras
- Boas Práticas
- O que evitar
- Implementação (FlutterFlow)
- Design Tokens

#### Filosofia consolidada

> Todo card deve representar uma unidade lógica de informação.

> Os cards organizam conteúdos relacionados e transformam informações dispersas em uma estrutura clara e compreensível.

---

## Evolução do Design System

Durante a elaboração dos documentos foi identificado um padrão de construção que passa a orientar toda a documentação.

Cada documento deverá responder inicialmente:

- Objetivo
- Contexto
- Princípios
- Filosofia

Em seguida apresentar sua aplicação prática:

- Estrutura
- Regras
- Boas Práticas
- O que evitar
- Implementação (FlutterFlow)
- Design Tokens

---

## Nova Diretriz

Foi identificada uma característica importante do Design System:

Cada componente comunica uma intenção específica ao usuário.

Exemplos:

- Cores comunicam significado.
- Tipografia comunica informação.
- Espaçamentos comunicam relacionamento.
- Botões comunicam ações.
- Cards comunicam organização da informação.

Esta filosofia deverá orientar os próximos documentos.

---

## Próximos Documentos

- 06 - Header
- 07 - Navegação
- 08 - Formulários
- 09 - Tabelas
- 10 - Dashboards
- 11 - Estados
- 12 - Ícones
- 13 - Componentes
- 14 - Responsividade
- 15 - Boas Práticas

---

## Observações

Durante a sessão surgiu a ideia de transformar os documentos do Design System em um instrumento de validação de qualidade, funcionando como um checklist para desenvolvimento.

A proposta consiste em avaliar cada componente segundo três perspectivas:

- Filosofia (por que existe)
- Diretrizes (como deve ser utilizado)
- Critérios de aceitação (como validar que está conforme o Design System)

Essa abordagem poderá ser incorporada futuramente após a conclusão dos quinze documentos.
# Changelog

## [0.1.0] - 2026-06-22

### Added

#### Product
- Criação do documento `00-principios-do-produto.md`
- Definição dos 17 princípios fundamentais do MotionLab

#### Design System
- Criação do documento `01-cores.md`
- Definição da filosofia de utilização das cores
- Definição da organização da paleta
- Definição das regras de utilização dos Design Tokens

- Criação do documento `02-tipografia.md`
- Definição da hierarquia tipográfica
- Definição das regras de utilização da tipografia
- Integração com Design Tokens

#### Repository
- Estrutura inicial da documentação do Design System