### Changedlog

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