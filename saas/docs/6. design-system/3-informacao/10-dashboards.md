# MotionLab SaaS

# Design System

# 10. Dashboards

Versão: 0.2.0

---

# Essência

> **Todo dashboard deve transformar dados em conhecimento para apoiar a tomada de decisão.**

> **Os dashboards comunicam indicadores, tendências e oportunidades, permitindo que o usuário compreenda rapidamente a situação do negócio.**

---

# Objetivo

Definir os princípios e diretrizes para construção dos dashboards do MotionLab, garantindo consistência visual, facilidade de interpretação e suporte eficiente à tomada de decisão.

Os dashboards devem apresentar informações relevantes de forma clara, objetiva e orientada aos objetivos do usuário.

---

# Contexto

Os dashboards representam a visão consolidada das informações do sistema.

Eles reúnem indicadores, métricas e tendências provenientes de diferentes processos, permitindo que o usuário acompanhe a evolução do negócio e identifique rapidamente situações que demandam atenção.

No MotionLab, todo dashboard deve priorizar informação útil em vez de quantidade de informação.

---

# Princípios

Os dashboards do MotionLab devem ser:

- Objetivos;
- Analíticos;
- Claros;
- Consistentes;
- Atualizados;
- Acessíveis;
- Eficientes.

Cada indicador deve possuir um propósito claramente definido.

---

# Filosofia

Um dashboard não existe para impressionar.

Ele existe para apoiar decisões.

O usuário deve conseguir responder rapidamente perguntas como:

- O que está acontecendo?
- O que mudou?
- O que merece atenção?
- O que precisa ser feito?

Quanto menor o tempo necessário para compreender o cenário apresentado, maior será a efetividade do dashboard.

---

# Estrutura

Os dashboards podem ser compostos por:

- KPIs;
- Cards de indicadores;
- Gráficos;
- Tabelas resumidas;
- Filtros;
- Comparativos;
- Tendências;
- Alertas;
- Períodos de análise;
- Ações rápidas.

Cada elemento deve contribuir para a compreensão do contexto analisado.

---

# Padrões de Indicadores

Todo indicador apresentado deve possuir:

- Nome claro;
- Definição objetiva;
- Unidade de medida padronizada;
- Período de referência;
- Origem dos dados;
- Frequência de atualização;
- Contexto suficiente para interpretação.

Sempre que possível, apresentar comparativos com períodos anteriores e indicar tendências de evolução.

---

# Regras

Os dashboards devem seguir as seguintes regras:

- Exibir apenas indicadores relevantes;
- Evitar excesso de gráficos;
- Priorizar indicadores acionáveis;
- Manter padronização visual entre dashboards;
- Utilizar escalas consistentes;
- Destacar informações críticas;
- Evidenciar o período analisado;
- Manter consistência entre filtros, indicadores e gráficos relacionados;
- Evitar consultas desnecessárias ao backend;
- Preservar estabilidade visual durante alterações de estado da interface.

---

# Boas Práticas

Para manter uma boa experiência recomenda-se:

- Organizar indicadores por prioridade;
- Destacar os KPIs principais;
- Utilizar gráficos adequados ao tipo de informação;
- Permitir filtros quando agregarem valor;
- Facilitar comparações entre períodos;
- Priorizar leitura rápida;
- Manter equilíbrio entre indicadores e detalhes;
- Reutilizar dados já carregados quando diferentes visualizações utilizarem a mesma informação;
- Evitar elementos visuais que não contribuam para a tomada de decisão.

---

# Hierarquia da Informação

Todo dashboard deve organizar seus elementos segundo uma hierarquia visual clara:

1. Objetivo do dashboard;
2. KPIs principais;
3. Tendências e comparativos;
4. Indicadores complementares;
5. Detalhamento dos dados.

A hierarquia deve permitir que o usuário compreenda o cenário geral antes de analisar informações específicas.

---

# Padrão de Referência — Dashboard Matriz

O Dashboard Matriz estabelece a primeira implementação de referência para dashboards operacionais do MotionLab.

Sua composição deve permitir uma leitura progressiva do negócio, partindo dos indicadores consolidados e avançando para a análise das unidades.

---

## Estrutura Visual

A organização adotada segue a seguinte sequência:

1. Identificação da Matriz;
2. Filtros globais;
3. KPIs principais;
4. Análise gráfica do faturamento;
5. Relação das filiais e seus indicadores operacionais.

A disposição deve preservar a leitura vertical natural em dispositivos móveis.

---

## Filtros Globais

O Dashboard Matriz utiliza dois grupos principais de filtros.

### Período

- Hoje;
- Semana;
- Mês.

O período selecionado deve ser visualmente destacado.

Os comparativos dos KPIs devem acompanhar o período selecionado:

- Hoje → Vs Ontem;
- Semana → Vs Sem Ant;
- Mês → Vs Mês Ant.

Uma referência de data deve permanecer visível para contextualizar o período analisado.

### Tipo de Faturamento

- Tudo;
- Serviço;
- Produto.

O filtro permite analisar diferentes composições do faturamento.

Sua aplicação deve ocorrer somente sobre indicadores aos quais essa classificação seja pertinente.

Os filtros devem afetar de forma consistente todos os indicadores e gráficos relacionados.

---

## KPIs Principais

O Dashboard Matriz utiliza como indicadores principais:

- Receitas;
- Despesas;
- Agendados.

Cada KPI deve apresentar, quando aplicável:

- Ícone representativo;
- Nome do indicador;
- Valor principal;
- Variação percentual;
- Período utilizado na comparação.

Os cards devem permanecer compactos e permitir leitura rápida em dispositivos móveis.

A utilização de cores deve reforçar o significado da informação sem depender exclusivamente delas para comunicação.

---

## Indicadores das Filiais

Cada filial deve ser representada por um card resumido.

O card apresenta:

- Nome da filial;
- Agendado;
- Realizado;
- Em atendimento;
- Faturamento;
- Ação para acessar o dashboard específico da filial.

Os indicadores devem utilizar ícones e cores consistentes em todos os cards.

No layout mobile, textos secundários podem utilizar abreviações quando necessário para preservar a legibilidade e evitar overflow.

A implementação de referência utiliza largura padronizada para os blocos internos de indicadores, garantindo alinhamento visual entre diferentes filiais.

O card da filial deve permitir leitura rápida sem substituir o dashboard detalhado da própria unidade.

---

# Visualização do Faturamento por Filial

O Dashboard Matriz disponibiliza duas formas complementares de analisar o faturamento das filiais.

As duas visualizações representam o mesmo conjunto lógico de informações sob perspectivas diferentes.

---

## Participação no Faturamento

A participação das filiais no faturamento consolidado deve ser representada por gráfico de rosca (Donut Chart).

Cada segmento representa uma filial.

A visualização deve permitir identificar rapidamente a participação percentual de cada unidade no faturamento correspondente aos filtros selecionados.

Sempre que possível:

- Exibir o percentual de participação;
- Identificar cada filial por cor;
- Apresentar legenda correspondente;
- Evitar quantidade excessiva de segmentos.

---

## Faturamento por Filial

O faturamento absoluto das filiais deve ser representado por gráfico de barras.

Cada barra representa o faturamento de uma filial no período e classificação selecionados.

A visualização deve permitir comparar rapidamente os valores entre unidades.

Sempre que possível:

- Apresentar escala monetária;
- Identificar as filiais;
- Utilizar legenda quando necessária;
- Preservar espaço adequado para eixos e rótulos;
- Evitar sobreposição de textos.

---

## Identidade Visual das Filiais

Uma filial deve manter a mesma identificação por cor nas diferentes visualizações apresentadas simultaneamente ou alternativamente dentro do mesmo contexto.

Exemplo:

- Cor atribuída à Filial 01 na rosca;
- Mesma cor atribuída à Filial 01 nas barras;
- Mesmo princípio para as demais filiais.

Essa consistência reduz o esforço cognitivo necessário para comparar as diferentes representações.

As cores utilizadas devem respeitar os Design Tokens oficiais.

---

# Alternância entre Gráficos

Em dispositivos móveis, diferentes gráficos não devem ser apresentados simultaneamente quando isso comprometer a área útil de visualização.

O padrão adotado pelo Dashboard Matriz utiliza um único card com alternância entre:

- Rosca → participação percentual no faturamento;
- Barras → valor monetário do faturamento por filial.

O ícone localizado no cabeçalho do card representa a visualização alternativa disponível.

Quando a rosca estiver visível, deve ser disponibilizada a ação para acessar o gráfico de barras.

Quando o gráfico de barras estiver visível, deve ser disponibilizada a ação para retornar à visualização em rosca.

---

## Estado da Visualização

Na implementação FlutterFlow, o estado local de referência é:

`graficoSelecionado`

Valores previstos:

- `ROSCA`;
- `BARRAS`.

Esse estado controla:

- Gráfico visível;
- Título apresentado;
- Ícone de alternância.

A alteração desse estado representa exclusivamente uma mudança de apresentação.

---

# Eficiência de Navegação entre Visualizações

Alterações exclusivamente visuais não devem provocar novas consultas ao backend quando os dados necessários já estiverem disponíveis.

A alternância entre rosca e barras deve reutilizar o mesmo conjunto de dados carregado para o dashboard.

Esse princípio reduz:

- Leituras desnecessárias;
- Latência;
- Consumo de recursos;
- Tráfego de dados;
- Custos operacionais.

A representação visual deve ser desacoplada da obtenção dos dados sempre que possível.

---

# Responsividade e Controle de Overflow

Dashboards mobile devem priorizar estabilidade do layout.

Sempre que necessário:

- Utilizar largura controlada nos indicadores;
- Abreviar textos secundários;
- Evitar múltiplos gráficos lado a lado em telas estreitas;
- Preservar espaço para legendas;
- Preservar espaço para eixos e seus rótulos;
- Controlar padding e espaçamentos;
- Evitar alterações significativas de altura durante alternâncias;
- Validar o comportamento com diferentes quantidades e tamanhos de dados.

A apresentação das informações nunca deve comprometer a legibilidade ou provocar overflow.

Quando uma limitação do componente utilizado exigir a manutenção de determinado elemento visual, o layout deve acomodá-lo adequadamente em vez de comprometer a estabilidade da interface.

---

# O que evitar

Evite:

- Dashboards excessivamente carregados;
- Indicadores sem contexto;
- Gráficos inadequados ao tipo de dado;
- Uso excessivo de cores;
- Informações redundantes;
- Misturar indicadores estratégicos e operacionais sem organização;
- Atualizações inconsistentes;
- Consultas ao backend provocadas apenas por mudanças de apresentação;
- Gráficos comprimidos para exibir múltiplas visualizações simultaneamente;
- Legendas, eixos ou textos sobrepostos;
- Overflow em resoluções suportadas.

---

# Implementação (FlutterFlow)

No FlutterFlow, os dashboards devem ser construídos utilizando componentes reutilizáveis.

Sempre que possível:

- Utilizar componentes padronizados para KPIs;
- Reutilizar gráficos;
- Centralizar estilos;
- Utilizar Design Tokens;
- Organizar filtros de forma consistente;
- Evitar lógica duplicada entre dashboards;
- Utilizar Page State para estados exclusivamente locais da interface;
- Utilizar Conditional Visibility para alternância de visualizações;
- Separar estado de apresentação de operações de leitura e persistência de dados.

Estados como seleção de período, classificação e visualização gráfica devem possuir nomes claros e domínio de valores conhecido.

Na implementação de referência são utilizados conceitos equivalentes a:

- `periodoSelecionado`;
- `tipoFaturamento`;
- `graficoSelecionado`.

---

# Evolução para Outros Dashboards

O Dashboard Matriz serve como referência visual e comportamental para dashboards derivados.

Dashboards de Filial podem reutilizar:

- Estrutura de filtros;
- KPIs;
- Cards;
- Comparativos;
- Padrões gráficos;
- Alternância de visualizações;
- Hierarquia de informações.

Entretanto, cada dashboard deve apresentar indicadores adequados ao seu próprio contexto.

A reutilização do padrão não implica repetição obrigatória de todos os elementos.

---

# Design Tokens

Os dashboards utilizam os Design Tokens oficiais referentes a:

- Cores;
- Tipografia;
- Espaçamentos;
- Cards;
- Gráficos;
- Estados;
- Ícones.

Este documento descreve os princípios de utilização dos dashboards.

Os valores oficiais permanecem centralizados nos arquivos de Design Tokens.

---

# Critérios de Aceitação

Um dashboard está aderente ao Design System quando:

- Atende ao objetivo definido neste documento;
- Respeita os princípios estabelecidos;
- Segue as regras de utilização;
- Não apresenta nenhuma das situações descritas em "O que evitar";
- Está implementado conforme as diretrizes do FlutterFlow;
- Utiliza exclusivamente os Design Tokens oficiais;
- Mantém consistência visual com os demais componentes do MotionLab;
- Contribui para uma tomada de decisão rápida, clara e confiável;
- Mantém consistência entre filtros, KPIs e gráficos relacionados;
- Evita consultas ao backend para alterações exclusivamente visuais;
- Mantém estabilidade de layout nas diferentes visualizações;
- Não apresenta overflow nas resoluções suportadas;
- Mantém consistência na identificação visual das mesmas entidades entre diferentes gráficos.