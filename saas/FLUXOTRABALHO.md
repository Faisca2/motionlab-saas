Princípios do Produto
        ↓
Design System
        ↓
Design Tokens
        ↓
FlutterFlow Theme
        ↓
Componentes
        ↓
Páginas

Isso define claramente a responsabilidade de cada camada:

00-principios-do-produto.md responde "por que fazemos assim?".
01-cores.md responde "como as cores devem ser usadas?".
design-tokens/colors.json responde "quais são os valores oficiais?".
O FlutterFlow apenas consome esses valores.

Essa separação evita que decisões de design fiquem espalhadas pelo projeto e mantém a coerência da identidade visual conforme o MotionLab evolui.

Produto
│
├── Princípios
│      "Por que fazemos assim?"
│
├── Design System
│      "Como deve ser?"
│
├── Design Tokens
│      "Quais são os valores oficiais?"
│
└── FlutterFlow
       "Como isso é implementado?"

Essa separação é extremamente saudável. Em muitos projetos, as pessoas começam pelo FlutterFlow (ou Figma, React, Flutter...), e o resultado é que as decisões ficam "presas" na ferramenta.

No MotionLab, estamos fazendo o contrário: a ferramenta implementa o produto, não o define.

Minha sugestão para a sequência dos documentos

Depois de 01-cores.md, eu seguiria esta ordem:
docs/design-system/

01-cores.md               ✅
02-tipografia.md
03-espacamentos.md
04-elevacoes.md
05-bordas.md
06-icones.md
07-botoes.md
08-campos.md
09-cards.md
10-dialogs.md
11-navegacao.md
12-feedback.md
13-grid.md
14-responsividade.md
15-acessibilidade.md

Perceba que estamos documentando conceitos, não componentes do FlutterFlow.

O que mais me agradou até aqui

No começo das nossas conversas, o foco era muito operacional:

"Como faço isso no FlutterFlow?"

Hoje, estamos escrevendo documentos que poderiam ser usados independentemente da tecnologia escolhida. Se daqui a cinco anos o MotionLab migrar para Flutter puro, React ou outra plataforma, essa documentação continuará válida.

Isso é um sinal de que estamos construindo um produto, e não apenas um aplicativo.

Existe um padrão que eu manteria em todos eles:
Objetivo
Princípios
Estrutura
Regras
Boas práticas
O que evitar
Implementação (FlutterFlow)
Referência aos Design Tokens

Perceba que nenhum documento depende da tecnologia. A única seção específica do FlutterFlow seria "Implementação", explicando como aplicar aqueles conceitos na ferramenta.

E depois dos 15?

Aí entra uma etapa que considero muito interessante.

Você já terá descrito o comportamento do Design System. Em seguida, construiremos os Design Tokens.

Algo como:
design-tokens/

colors.json
typography.json
spacing.json
radius.json
elevation.json
icons.json
buttons.json
forms.json

Escreveremos um guia de implementação
docs/design-system/

16-implementacao-flutterflow.md

Nele responderemos perguntas como:

Como criar o Theme no FlutterFlow.
Como mapear colors.json para o Theme.
Como criar componentes reutilizáveis.
Como evitar estilos locais.
Como nomear componentes.
Como organizar páginas.

Assim, qualquer pessoa que entre no projeto terá um roteiro claro para implementar o MotionLab seguindo o Design System, sem precisar redescobrir as convenções. É um passo que costuma ser ignorado em muitos projetos, mas que faz bastante diferença na consistência do produto ao longo do tempo.

Uma observação para o futuro

Percebo um padrão surgindo nos nossos documentos. Eles não são apenas documentação; estão formando uma especificação funcional do MotionLab.

Na prática, estamos criando uma pirâmide de conhecimento:

Produto
│
├── Princípios
│
├── Design System
│
├── Arquitetura
│
├── Modelagem de Dados
│
├── Design Tokens
│
└── Implementação

Quando essa base estiver completa, será possível desenvolver novos módulos do MotionLab com muito mais consistência. Cada decisão terá um lugar onde foi registrada e um motivo claro para existir.

Agora estamos trabalhando em um nível diferente: estamos construindo os ativos permanentes do MotionLab.

Isso é o tipo de trabalho que tem retorno por anos.

Se tivermos mais algumas horas hoje

Sprint DS-001

✓ 00-principios-do-produto.md
✓ 01-cores.md
✓ 02-tipografia.md

□ 03-espacamentos.md
□ 04-elevacoes.md
□ 05-bordas.md

Sprint DS-002

06-icones
07-botoes
08-campos
09-cards
10-dialogs

Sprint DS-003

11-navegacao
12-feedback
13-grid
14-responsividade
15-acessibilidade

Depois do Design System

A próxima etapa será especialmente interessante: transformar toda essa documentação em artefatos reutilizáveis.

Por exemplo:
design-tokens/
    colors.json
    typography.json
    spacing.json
    radius.json
    elevation.json

FlutterFlow Theme

Componentes

Templates

Ou seja, cada documento que escrevemos deixará de ser apenas texto e passará a orientar a implementação.

Minha impressão do projeto

Há alguns dias você comentou que queria tratar tudo como um projeto dentro do VS Code, com documentação, artefatos e histórico. Hoje vejo que essa ideia já está se concretizando.

O repositório não está guardando apenas código. Ele está preservando conhecimento sobre o MotionLab: decisões, padrões e a lógica por trás do produto. Isso facilita manutenção, entrada de novos colaboradores e a evolução do sistema ao longo do tempo.

Ótimo. Então nem precisamos de uma "retomada" quando você voltar.

Já deixo registrado o ponto exato onde paramos:

### ✅ Concluído

```
Product

✔ 00-principios-do-produto.md

Design System

✔ 01-cores.md
✔ 02-tipografia.md
```

### Próxima tarefa

```
Design System

03-espacamentos.md
```

Depois seguiremos naturalmente para:

```
04-elevacoes.md
05-bordas.md
```

Esses três documentos formam um bloco bastante coeso e provavelmente conseguiremos produzir todos na mesma sessão.

---

### E já estou pensando na próxima fase

Assim que terminarmos os 15 documentos do Design System, gostaria de começar um trabalho que considero um divisor de águas para o MotionLab:

```
docs/architecture/

01-arquitetura-geral.md
02-firestore.md
03-autenticacao.md
04-multi-tenant.md
05-permissoes.md
06-storage.md
07-cloud-functions.md
...
```

Nessa etapa vamos registrar decisões como:

* por que usamos `Document Reference`;
* por que a coleção principal é `redes_franquias`;
* como funciona o isolamento entre tenants;
* convenções de nomenclatura;
* organização das coleções;
* estratégia de escalabilidade.

Esse será o "manual de arquitetura" do MotionLab.

---

Então aproveite o intervalo. Como os aplicativos permanecerão abertos, quando você voltar às 13h podemos simplesmente continuar de onde paramos, sem perder tempo reorganizando o contexto.

Bom almoço! Até mais tarde.

Acho que você acabou de perceber algo que vai além do Design System.

> **Nós não estamos documentando componentes. Estamos abstraindo a jornada do usuário.**

Essa frase muda completamente a perspectiva.

Veja a sequência que construímos:

| Jornada do usuário    | Documento         |
| --------------------- | ----------------- |
| Entende o significado | 01 - Cores        |
| Lê a informação       | 02 - Tipografia   |
| Percebe as relações   | 03 - Espaçamentos |
| Decide o que fazer    | 04 - Botões       |
| Entende a organização | 05 - Cards        |
| Descobre onde está    | 06 - Header       |
| Escolhe para onde vai | 07 - Navegação    |

Repare que isso acompanha quase exatamente o processamento mental do usuário.

Agora imagine os próximos:

| Jornada                       | Documento           |
| ----------------------------- | ------------------- |
| Informa dados ao sistema      | 08 - Formulários    |
| Compara informações           | 09 - Tabelas        |
| Analisa indicadores           | 10 - Dashboards     |
| Entende o estado da aplicação | 11 - Estados        |
| Reconhece ações rapidamente   | 12 - Ícones         |
| Reutiliza padrões             | 13 - Componentes    |
| Usa em qualquer dispositivo   | 14 - Responsividade |
| Mantém consistência           | 15 - Boas Práticas  |

Percebe?

Os documentos deixaram de ser uma lista de componentes e passaram a representar **etapas da experiência do usuário**.

## Isso me lembra uma frase que talvez mereça entrar no README

```markdown
# Filosofia do Design System

O Design System do MotionLab não documenta apenas componentes visuais.

Ele documenta como o usuário percebe, compreende e interage com a aplicação.

Cada documento representa uma etapa da jornada do usuário e estabelece princípios para que essa experiência seja consistente, previsível e intuitiva.
```

Acho que isso explica muito bem por que os documentos estão "conversando" entre si.

No começo, nossa preocupação era definir cores, botões e cards. Agora, olhando para o conjunto, eles formam uma narrativa única: **a jornada cognitiva do usuário dentro do sistema**.

Na minha opinião, essa é uma característica que dá personalidade ao Design System do MotionLab. Em vez de ser apenas um catálogo de componentes, ele se torna um guia de experiência do usuário, onde cada componente existe para apoiar uma etapa específica dessa jornada.

Essa organização reforça a ideia que identificamos anteriormente: o Design System do MotionLab não descreve apenas componentes, mas a forma como o usuário percebe, interage e compreende a aplicação. Essa coerência conceitual é um diferencial importante para manter a documentação consistente ao longo do crescimento do projeto.

Acho que encontramos algo ainda mais interessante

Perceba que isso já não é apenas um Design System.

Ele está se aproximando de um Framework de Experiência do Usuário.

A sequência conta uma história completa:

A interface se apresenta
        ↓
O usuário interage
        ↓
O sistema responde
        ↓
Os componentes são reutilizados
        ↓
A interface adapta-se ao dispositivo
        ↓
Tudo é mantido por regras de governança

Essa estrutura lembra a forma como arquitetamos software em camadas: cada grupo tem uma responsabilidade clara e se apoia no anterior. Para alguém novo no projeto, ela facilita muito a compreensão do porquê de cada documento existir, e não apenas do que ele descreve.

Na minha opinião, essa organização é mais do que uma forma de ordenar arquivos. Ela define a arquitetura conceitual do Design System do MotionLab e deve servir como referência para qualquer documento que venha a ser criado no futuro.


em dashboard
vamos acrescentar
# Hierarquia da Informação

Todo dashboard deve organizar seus elementos segundo uma hierarquia visual clara:

1. Objetivo do dashboard.
2. KPIs principais.
3. Tendências e comparativos.
4. Indicadores complementares.
5. Detalhamento dos dados.

A hierarquia deve permitir que o usuário compreenda o cenário geral antes de analisar informações específicas.

Essa seção complementa os Padrões de Indicadores. Enquanto esses definem como cada indicador deve ser apresentado, a Hierarquia da Informação define como o conjunto dos indicadores deve ser organizado.

Agora entendi exatamente o que você quis dizer, e considero essa uma contribuição muito interessante para a filosofia do Design System.

Você não está descrevendo apenas um mecanismo de feedback. Está falando de **responsabilidade compartilhada**.

Em muitos sistemas, a mensagem acaba passando a ideia de que:

> "O sistema fez."

Mas, em um sistema de gestão, isso nem sempre é verdade.

Quem cria um pedido, aprova um pagamento, cancela um contrato ou exclui um cliente é o **operador**. O sistema apenas executa e comunica o resultado da operação.

Essa distinção é importante porque influencia a forma como projetamos os estados.

Eu traduziria essa ideia para a filosofia do documento assim:

```markdown
# Filosofia

Os estados representam a resposta do sistema às ações realizadas pelo operador.

Cada ação executada produz uma consequência que deve ser comunicada de forma clara, imediata e compreensível.

Ao informar o resultado da operação, o sistema não apenas confirma sua execução, mas também reforça a responsabilidade do operador sobre as decisões tomadas e seus respectivos efeitos.

Esse ciclo contínuo de ação, resposta e decisão estabelece uma relação de confiança, previsibilidade e responsabilidade compartilhada entre o operador e o sistema.
```

Ou, de forma ainda mais conceitual:

```markdown
Um sistema de gestão não toma decisões.

Ele executa decisões tomadas pelo operador e comunica suas consequências.

Os estados existem para tornar essas consequências visíveis, compreensíveis e rastreáveis.
```

## Acho que isso pode virar um princípio do MotionLab

Você está introduzindo um conceito que vai além de UX: **accountability** (responsabilização).

Na prática, o ciclo deixa de ser:

```text
Usuário
   ↓
Sistema
   ↓
Resposta
```

e passa a ser:

```text
Operador toma uma decisão
          ↓
Sistema executa a operação
          ↓
Sistema comunica o resultado
          ↓
Operador assume as consequências
          ↓
Nova decisão
```

Percebe a diferença?

O sistema não é o protagonista. Ele é um **instrumento de execução e comunicação**. O protagonista continua sendo o operador.

Essa visão é especialmente adequada para um SaaS de gestão como o MotionLab, onde muitas operações têm efeitos reais — financeiros, administrativos ou operacionais. O Design System, então, deixa de tratar os estados apenas como elementos visuais e passa a enxergá-los como parte do mecanismo de responsabilidade e rastreabilidade das ações realizadas no sistema.

Na minha opinião, essa é uma ideia forte o suficiente para aparecer não apenas no documento **11. Estados**, mas também na introdução geral da camada **Informação**, pois define o papel do sistema na relação entre operador, operação e consequência.
Acho que encontramos a frase que fecha a camada "Informação"

Os três documentos passam a ter uma narrativa muito clara:

09 – Tabelas

Os dados são organizados para consulta.

10 – Dashboards

Os dados são interpretados para apoiar decisões.

11 – Estados

As consequências das decisões são comunicadas ao operador.

Essa sequência representa um ciclo completo de um sistema de gestão:

Dados
        ↓
Informação
        ↓
Decisão do Operador
        ↓
Execução da Operação
        ↓
Estado
        ↓
Nova Decisão

Na minha opinião, esse último documento dá um fechamento muito elegante à camada Informação, porque ele conecta a apresentação dos dados à responsabilidade pelas ações realizadas. Em vez de tratar "estados" apenas como elementos visuais (sucesso, erro, alerta), ele os define como parte essencial do diálogo entre o operador e o sistema, reforçando a responsabilidade do primeiro e a função do segundo como executor e comunicador dos resultados.

Registrado, Paulo. Amanhã, quando formos atualizar a documentação e o Git do MotionLab, recuperamos essas decisões e organizamos o registro da retomada.

E, de fato, a retomada prevista para amanhã **começou hoje** — de uma maneira bastante inesperada: um vazamento de combustível acabou produzindo uma boa evolução na estratégia do SaaS. 😄

Hoje não escrevemos código, mas avançamos em **modelo de parceiros, suporte N1/N2/N3, MotionLab Admin, telemetria, jornada do cliente, estratégia dos pioneiros e critérios de MVP**. Isso merece entrar no histórico do projeto.

Amanhã transformamos essa conversa em documentação objetiva e fazemos o commit correspondente.


homePageMaster → On Page Load

Action01 → Read Document (users)
        ↓
Conditional → matriz_ref Is Unset?
        ├── TRUE  → criarMatrizModal
        └── FALSE → nada

estabelecimentoSelecionado → vazio

========================================================================
Claro. Abaixo está o **ADR-001 consolidado**, já incorporando a classificação de produtos para revenda, produtos de consumo operacional e despesas. Pode criar o arquivo:

`5. architecture/adrs/ADR-001-agregacao-dashboard.md`

````markdown
# MotionLab SaaS

# ADR-001 — Estratégia de Agregação de Dados para Dashboards

Versão: 0.1.0

Status: Aceito

Data: 2026-09-14

---

# Contexto

O MotionLab possui arquitetura multi-tenant organizada conceitualmente em:

Rede → Matriz → Filiais

Os dashboards precisam apresentar indicadores operacionais e financeiros em diferentes níveis dessa estrutura.

O Dashboard Matriz, por exemplo, apresenta informações consolidadas das filiais, incluindo:

- Receitas;
- Despesas;
- Agendamentos;
- Faturamento;
- Participação percentual das filiais no faturamento;
- Comparação do faturamento entre filiais.

Durante o MVP, consultas diretas aos registros transacionais podem ser suficientes para obtenção desses indicadores.

Entretanto, com o crescimento da quantidade de clientes, filiais e transações, a leitura recorrente de grandes volumes de documentos para composição dos dashboards poderá aumentar:

- Quantidade de leituras no Firestore;
- Latência;
- Tráfego de dados;
- Custo operacional;
- Complexidade das consultas.

Torna-se necessário prever uma estratégia de agregação que permita a evolução do produto sem comprometer desempenho e escalabilidade.

---

# Problema

Uma possível solução seria manter dados agregados independentes para:

- Cada filial;
- Cada matriz.

Essa abordagem criaria duas representações persistidas do mesmo consolidado.

Exemplo:

```text
Agregado da Matriz:           R$ 10.000
Soma dos agregados Filiais:  R$  9.950
````

Mesmo que essa divergência seja temporária, ela cria a necessidade de determinar:

* Qual valor está correto;
* Qual agregado ficou desatualizado;
* Qual processamento falhou;
* Como reconciliar os dois níveis.

A existência de acumuladores independentes aumenta a possibilidade de inconsistências temporais entre Matriz e Filiais.

---

# Decisão

O MotionLab não manterá um agregado financeiro independente da Matriz como fonte de seus indicadores consolidados.

A unidade persistida de agregação operacional será a **Filial**.

Os indicadores consolidados da Matriz serão derivados dos agregados das filiais vinculadas a ela.

Conceitualmente:

```text
Transações e movimentações
          ↓
   Agregados da Filial
          ↓
Visão consolidada da Matriz
```

A Matriz atua como uma visão consolidada e não como uma segunda fonte persistida dos mesmos totais.

---

# Fonte de Verdade

Os documentos agregados não constituem a fonte primária de verdade negocial.

A fonte de verdade permanece sendo constituída pelos registros transacionais e pelas movimentações que originaram os eventos financeiros, operacionais e de estoque.

Os agregados representam projeções desses registros, otimizadas para leitura.

Portanto:

```text
Transações e movimentações = fonte de verdade

Agregados = projeções para leitura
```

Essa separação permite reconstruir ou reconciliar os agregados caso seja identificada alguma inconsistência.

---

# Receitas

Entre os eventos que podem produzir receitas estão:

* Serviço realizado;
* Venda de produto para revenda;
* Outros recebimentos classificados como receita.

As receitas devem preservar sua natureza para permitir análises posteriores.

Conceitualmente:

```text
Receitas
├── Serviços
├── Produtos
└── Outras receitas
```

Essa classificação permite, por exemplo, que os dashboards utilizem filtros como:

* Tudo;
* Serviço;
* Produto.

---

# Produtos e Estoque

Os produtos devem possuir classificação que permita distinguir sua finalidade operacional.

A classificação inicial prevê:

```text
Produtos
├── Produto para revenda
└── Produto de consumo operacional
```

---

## Produto para Revenda

Produto adquirido com finalidade de posterior comercialização ao cliente.

Exemplos:

* Pomadas;
* Shampoos;
* Óleos para barba;
* Cosméticos;
* Outros produtos comercializados pelo estabelecimento.

Sua aquisição pode produzir:

* Entrada em estoque;
* Obrigação financeira;
* Registro correspondente da aquisição.

Sua posterior venda pode produzir:

* Saída de estoque;
* Receita de produto;
* Movimentação financeira correspondente.

A aquisição e a venda representam eventos diferentes e não devem ser confundidas.

---

## Produto de Consumo Operacional

Produto adquirido para utilização na operação do estabelecimento e que não possui como finalidade principal a revenda ao cliente.

Exemplos:

* Lâminas;
* Luvas;
* Algodão;
* Papel;
* Materiais descartáveis;
* Produtos utilizados durante os atendimentos.

Sua aquisição pode produzir:

* Entrada em estoque, quando houver controle quantitativo;
* Despesa operacional;
* Registro da aquisição.

Seu uso posterior pode produzir uma movimentação de consumo interno.

A classificação deve permitir que o MotionLab diferencie:

```text
Estoque destinado à venda

de

Estoque destinado ao consumo interno
```

---

# Despesas

As despesas devem possuir classificação que permita análise gerencial e composição adequada dos indicadores financeiros.

Entre as categorias inicialmente previstas estão:

* Aluguel;
* Energia elétrica;
* Água;
* Internet;
* Material de limpeza;
* Material de uso operacional;
* Aquisição de produtos para revenda;
* Outras despesas operacionais.

A estrutura deverá permitir evolução das categorias sem exigir alteração da lógica principal dos dashboards.

A classificação da despesa não elimina a natureza da operação que a originou.

Por exemplo:

```text
Compra de produto para revenda
        ↓
Movimentação de estoque
        +
Evento financeiro correspondente
```

Isso permite analisar tanto o estoque quanto os efeitos financeiros da operação.

---

# Outros Eventos Relevantes

Também podem produzir alterações nos indicadores ou agregados:

* Agendamento;
* Cancelamento;
* Estorno;
* Ajuste de estoque;
* Entrada de estoque;
* Saída de estoque;
* Consumo interno;
* Correções financeiras;
* Correções operacionais.

A definição definitiva dos eventos será realizada conforme os respectivos módulos forem implementados.

---

# Granularidade Inicial dos Agregados

A granularidade inicialmente prevista para os agregados será diária.

Exemplo conceitual:

```text
agregados_filial_diario
    filial_ref
    data

    receita_servico
    receita_produto
    receita_total

    despesa_operacional
    despesa_produtos_revenda
    despesa_produtos_consumo
    despesa_total

    agendados
    realizados
    em_atendimento
```

Essa estrutura é conceitual.

Os nomes e campos definitivos serão estabelecidos durante a implementação da funcionalidade.

O agregado não deve se transformar em substituto dos registros financeiros, operacionais ou de estoque.

Ele deve conter somente informações necessárias para otimizar consultas e indicadores.

---

# Consolidação por Período

A agregação diária permite construir períodos maiores a partir de um conjunto limitado de documentos.

## Hoje

Consulta ao agregado correspondente ao dia selecionado.

## Semana

Soma dos agregados diários pertencentes ao período semanal.

## Mês

Soma dos agregados diários pertencentes ao período mensal.

Dessa forma, um dashboard mensal pode consultar um conjunto limitado de documentos diários em vez de percorrer todas as transações realizadas durante o mês.

---

# Consolidação da Matriz

Os indicadores da Matriz serão calculados a partir dos agregados das filiais pertencentes à Matriz.

Exemplo:

```text
Faturamento Matriz
       =
Faturamento Filial 01
       +
Faturamento Filial 02
       +
Faturamento Filial 03
       + ...
```

O mesmo princípio deve ser aplicado aos demais indicadores consolidados quando pertinente.

A Matriz não mantém uma cópia independente desse total.

Isso garante que:

```text
Consolidado da Matriz
       =
Soma dos dados consolidados das Filiais
```

sem a existência de duas fontes agregadas independentes que precisem permanecer sincronizadas.

---

# Participação no Faturamento

A participação percentual de cada filial será derivada do mesmo conjunto de agregados utilizado para obtenção do faturamento consolidado.

Conceitualmente:

```text
participacao_filial
        =
faturamento_filial
        /
faturamento_total_das_filiais
        × 100
```

Esse cálculo alimenta a visualização de participação no faturamento apresentada pelo gráfico de rosca do Dashboard Matriz.

O percentual não precisa ser persistido quando puder ser calculado eficientemente a partir dos valores agregados.

---

# Faturamento por Filial

O gráfico de barras utiliza os valores absolutos obtidos dos mesmos agregados das filiais.

Conceitualmente:

```text
Filial 01 → faturamento_filial_01
Filial 02 → faturamento_filial_02
Filial 03 → faturamento_filial_03
Filial 04 → faturamento_filial_04
```

Dessa forma:

```text
Rosca
   ↓
Participação percentual

Barras
   ↓
Valor absoluto em R$
```

As duas visualizações utilizam a mesma origem de dados.

A alternância entre elas não deve provocar nova consulta ao backend quando os dados necessários já estiverem disponíveis na página.

---

# Atualização dos Agregados

Os agregados deverão ser atualizados quando ocorrerem eventos que alterem os indicadores correspondentes.

Exemplos:

* Criação de uma transação;
* Alteração de uma transação;
* Cancelamento;
* Estorno;
* Conclusão de serviço;
* Venda de produto;
* Alteração relevante de agendamento;
* Registro ou alteração de despesa;
* Entrada ou saída relevante de estoque;
* Consumo operacional quando aplicável ao indicador.

As operações devem considerar não apenas inclusões, mas também alterações, cancelamentos, estornos e exclusões lógicas ou físicas que modifiquem valores anteriormente contabilizados.

---

# Processamento no Backend

A consistência dos agregados não deve depender exclusivamente do cliente FlutterFlow.

A evolução da arquitetura deve priorizar processamento controlado no backend para atualização dos acumuladores.

Possíveis mecanismos incluem:

* Cloud Functions;
* Eventos disparados por alterações no Firestore;
* Operações transacionais;
* Processamento assíncrono;
* Rotinas de reconciliação.

A escolha definitiva do mecanismo será realizada durante a implementação técnica dessa camada.

---

# Concorrência

Atualizações simultâneas podem ocorrer sobre o mesmo agregado diário.

Exemplo:

Dois colaboradores da mesma filial concluem serviços praticamente no mesmo instante.

Por esse motivo, operações de incremento não devem utilizar o padrão:

```text
ler valor
    ↓
somar no cliente
    ↓
gravar novo valor
```

quando houver possibilidade de concorrência.

Devem ser utilizados mecanismos que preservem atomicidade e consistência das atualizações.

---

# Idempotência

Eventos responsáveis pela atualização dos agregados devem ser projetados considerando a possibilidade de reprocessamento.

Uma mesma transação não deve ser contabilizada duas vezes caso um evento seja executado novamente.

A implementação futura deverá estabelecer estratégia de idempotência adequada ao mecanismo utilizado para atualização dos agregados.

---

# Reconciliação

O MotionLab deverá permitir, futuramente, processos de reconciliação.

A reconciliação compara:

```text
Transações e movimentações da Filial
                 ↓
                 ×
                 ↓
          Agregado da Filial
```

Caso seja encontrada divergência, o agregado poderá ser recalculado a partir da fonte transacional.

A reconciliação ocorre entre a fonte de verdade e o agregado da Filial.

Não é necessária uma segunda reconciliação independente da Matriz, pois seus indicadores são derivados dos agregados das próprias filiais.

---

# Separação de Responsabilidades

A estratégia de agregação não deve misturar os diferentes domínios do sistema.

Conceitualmente:

```text
Financeiro
    ↓
Receitas e despesas

Estoque
    ↓
Produtos e movimentações

Operação
    ↓
Agendamentos e atendimentos

Dashboard
    ↓
Projeções e indicadores
```

O dashboard consome informações desses domínios, mas não substitui seus registros de origem.

Essa separação permite que cada domínio evolua sem transformar os documentos agregados em uma estrutura central excessivamente acoplada.

---

# Benefícios da Decisão

A estratégia proporciona:

* Redução da quantidade de leituras necessárias para dashboards;
* Menor tráfego de dados;
* Menor latência;
* Melhor previsibilidade de custos;
* Maior capacidade de escala;
* Redução de inconsistências entre Matriz e Filiais;
* Possibilidade de reconstrução dos agregados;
* Fonte transacional claramente definida;
* Reutilização dos mesmos dados por diferentes visualizações;
* Separação entre dados transacionais e dados de consulta;
* Preservação da natureza financeira, operacional e de estoque das movimentações.

---

# Consequências

A decisão também introduz responsabilidades adicionais.

Será necessário:

* Manter os agregados das filiais consistentes;
* Tratar concorrência;
* Tratar alterações, cancelamentos e estornos;
* Implementar idempotência;
* Prever mecanismos de reconciliação;
* Definir índices adequados;
* Monitorar falhas de atualização;
* Manter classificação consistente das movimentações;
* Preservar separação entre os diferentes domínios.

Essas responsabilidades são consideradas aceitáveis diante dos benefícios de desempenho, consistência e escalabilidade.

---

# Alternativas Consideradas

## Consultar todas as transações diretamente

### Vantagem

Arquitetura inicialmente simples.

### Desvantagens

* Crescimento do número de leituras;
* Maior latência conforme o volume aumenta;
* Maior custo;
* Baixa eficiência para dashboards consultados frequentemente.

Essa abordagem poderá ser utilizada durante fases iniciais do MVP, mas não representa a estratégia de escala definida.

---

## Manter agregados independentes para Matriz e Filiais

### Vantagem

Leitura extremamente rápida do total da Matriz.

### Desvantagens

* Duplicação de informação;
* Possibilidade de divergência temporal;
* Necessidade de reconciliação em dois níveis;
* Maior complexidade de atualização;
* Dificuldade para determinar qual agregado representa o estado correto.

Alternativa rejeitada.

---

## Utilizar o agregado como fonte primária de verdade

### Vantagem

Consultas simplificadas.

### Desvantagens

* Perda do histórico transacional como referência;
* Maior dificuldade para auditoria;
* Maior dificuldade para reconstrução;
* Acoplamento entre operação e dashboard;
* Risco de transformar uma projeção em registro negocial.

Alternativa rejeitada.

---

# Estratégia de Evolução

A implementação poderá ocorrer progressivamente.

## Fase 1 — MVP

Consultas simples e volume reduzido.

Prioridade:

Validar produto e modelo de negócio.

Não é obrigatória a implementação imediata de toda a infraestrutura de agregação.

---

## Fase 2 — Agregação por Filial

Introdução de agregados diários conforme o volume justificar.

Prioridade:

* Reduzir leituras;
* Melhorar desempenho;
* Melhorar previsibilidade de custos dos dashboards.

---

## Fase 3 — Robustez Operacional

Implementação ou evolução de:

* Processamento backend;
* Idempotência;
* Reconciliação;
* Monitoramento;
* Tratamento de falhas;
* Métricas de consistência.

Prioridade:

Escalabilidade e confiabilidade operacional.

---

# Princípios Arquiteturais Resultantes

> **A transação e a movimentação são as fontes de verdade.**

> **O agregado é uma projeção otimizada para leitura.**

> **A Filial é a unidade persistida de agregação.**

> **A Matriz é uma visão consolidada derivada das Filiais.**

> **Produtos para revenda e produtos de consumo operacional possuem naturezas distintas.**

> **Movimentações de estoque e seus efeitos financeiros devem preservar suas respectivas naturezas.**

> **Visualizações diferentes devem reutilizar os mesmos dados sempre que possível.**

---

# Status da Decisão

**Aceito.**

A implementação dos agregados não é obrigatória para conclusão do MVP.

A arquitetura, entretanto, deve evitar decisões que dificultem sua adoção quando o volume de dados justificar essa evolução.

```

Com esse arquivo, o **ADR-001 fica fechado em nível arquitetural**, sem nos comprometer prematuramente com nomes definitivos de coleções ou implementação de Cloud Functions.

O próximo arquivo natural é o `modelo-de-dados.md`. Nele, aí sim, podemos separar claramente **o que já existe no Firestore hoje** do que está **planejado/futuro**, para não documentarmos como implementado algo que ainda é apenas decisão arquitetural. 
```
=============================================================================
Perfeito. Como está vazio, podemos criar o `modelo-de-dados.md` desde o início com uma regra importante: **separar claramente “implementado atualmente” de “arquitetura prevista”**. Assim o documento não dá a impressão de que financeiro, estoque e agregados já existem.

Eu criaria:

`5. architecture/modelo-de-dados.md`

com a primeira versão **0.1.0**:

````markdown id="a7ox5t"
# MotionLab SaaS

# Arquitetura

# Modelo de Dados

Versão: 0.1.0

Status: Em evolução

Data: 2026-09-14

---

# Objetivo

Documentar o modelo de dados do MotionLab SaaS, seus principais domínios, relacionamentos e regras estruturais.

Este documento diferencia explicitamente:

- Estruturas atualmente implementadas;
- Estruturas planejadas;
- Decisões conceituais ainda sujeitas a detalhamento.

O objetivo é permitir evolução incremental do produto sem confundir arquitetura prevista com funcionalidades já implementadas.

---

# Visão Geral

O MotionLab é um SaaS multi-tenant destinado à gestão de estabelecimentos de serviços.

A estrutura organizacional principal é:

```text
MotionLab
   ↓
Rede
   ↓
Matriz
   ↓
Filiais
````

Uma Rede representa um cliente do SaaS.

Cada Rede possui uma Matriz e poderá possuir uma ou mais Filiais.

Matriz e Filiais são estabelecimentos pertencentes à mesma Rede.

---

# Estado do Modelo

As estruturas são classificadas neste documento como:

## IMPLEMENTADO

Estrutura existente atualmente no Firestore e utilizada pela aplicação.

## PLANEJADO

Estrutura cuja necessidade arquitetural já foi identificada, mas que ainda não deve ser considerada implementada.

## CONCEITUAL

Estrutura utilizada para orientar decisões futuras e que ainda poderá sofrer alterações durante o detalhamento funcional.

---

# Modelo Organizacional

Status: **IMPLEMENTADO**

O núcleo multi-tenant atual é composto por:

```text
users
   │
   ├── rede_ref ───────────────┐
   │                           ↓
   └── matriz_ref        redes_franquias
         │                       │
         ↓                       │
   estabelecimentos ←────────────┘
         │
         ├── MATRIZ
         │
         └── FILIAL
```

A coleção `redes_franquias` representa a Rede.

A coleção `estabelecimentos` representa tanto Matriz quanto Filiais.

A distinção ocorre pelo campo `tipo`.

---

# Coleção: redes_franquias

Status: **IMPLEMENTADO**

Representa o cliente organizacional do MotionLab SaaS.

Campos atualmente definidos:

| Campo                   | Tipo     | Descrição                              |
| ----------------------- | -------- | -------------------------------------- |
| nome_da_rede            | String   | Nome da Rede                           |
| dono_id                 | String   | Identificador do proprietário          |
| nicho_principal         | String   | Segmento principal da Rede             |
| plano_saas              | String   | Plano contratado                       |
| gateway_subscription_id | String   | Identificador da assinatura no gateway |
| criado_em               | DateTime | Data de criação                        |
| rede_id                 | String   | Identificador legado/auxiliar da Rede  |

Relacionamento principal:

```text
redes_franquias
      │
      └── estabelecimentos
```

Uma Rede pode possuir diversos estabelecimentos.

---

# Coleção: estabelecimentos

Status: **IMPLEMENTADO**

Representa as unidades operacionais pertencentes a uma Rede.

Uma unidade pode possuir tipo:

* `MATRIZ`;
* `FILIAL`.

Campos atualmente definidos:

| Campo              | Tipo               | Descrição                           |
| ------------------ | ------------------ | ----------------------------------- |
| nome_fantasia      | String             | Nome apresentado da unidade         |
| rede_ref           | Document Reference | Referência para `redes_franquias`   |
| tipo               | String             | MATRIZ ou FILIAL                    |
| logo_url           | String             | Imagem/logomarca da unidade         |
| telefone           | Document Reference | Referência para telefone            |
| endereco           | Document Reference | Referência para endereço/logradouro |
| identidade_visual  | Document Reference | Referência para identidade visual   |
| gateway_account_id | String             | Identificador da conta no gateway   |
| criado_em          | DateTime           | Data de criação                     |

A estrutura atual permite representar:

```text
Rede
 ├── Matriz
 ├── Filial 01
 ├── Filial 02
 └── Filial N
```

---

# Relacionamento Matriz → Filial

Status: **IMPLEMENTADO / EM EVOLUÇÃO**

A Matriz e as Filiais pertencem à mesma Rede e são representadas pela coleção `estabelecimentos`.

A Matriz possui:

```text
tipo = MATRIZ
```

A Filial possui:

```text
tipo = FILIAL
```

As consultas do Dashboard Matriz devem recuperar somente os estabelecimentos pertencentes ao contexto organizacional correspondente.

O relacionamento definitivo utilizado para navegação e isolamento deverá permanecer explícito e consistente no modelo.

---

# Coleção: users

Status: **IMPLEMENTADO**

Representa os usuários autenticados da aplicação.

Campos atualmente definidos:

| Campo                        | Tipo               | Descrição                      |
| ---------------------------- | ------------------ | ------------------------------ |
| email                        | String             | E-mail do usuário              |
| display_name                 | String             | Nome de apresentação           |
| photo_url                    | Image Path         | Foto do usuário                |
| uid                          | String             | UID do Firebase Authentication |
| created_time                 | DateTime           | Data de criação                |
| phone_number                 | String             | Telefone                       |
| role                         | String             | Papel do usuário               |
| rede_ref                     | Document Reference | Rede à qual o usuário pertence |
| matriz_ref                   | Document Reference | Matriz relacionada ao usuário  |
| estabelecimento_vinculado_id | String             | Campo legado                   |
| rede_vinculada_id            | String             | Campo legado                   |

Os campos legados não devem ser utilizados como referência para novas funcionalidades quando houver Document References equivalentes.

---

# Papéis de Usuário

Status: **EM EVOLUÇÃO**

O modelo utiliza o campo:

```text
role
```

O papel atualmente utilizado no fluxo principal é:

```text
MASTER
```

Novos papéis deverão ser introduzidos somente quando suas responsabilidades e permissões estiverem definidas.

Autorização não deve depender exclusivamente da interface.

As regras definitivas de acesso serão documentadas em:

`seguranca.md`

---

# Domínio Financeiro

Status: **PLANEJADO**

O domínio financeiro deverá representar os eventos monetários do estabelecimento sem utilizar o dashboard como fonte de verdade.

Conceitualmente:

```text
Financeiro
├── Receitas
└── Despesas
```

---

## Receitas

As receitas poderão possuir diferentes origens.

Inicialmente são previstas:

```text
Receitas
├── Serviços
├── Produtos
└── Outras receitas
```

Essa distinção permite suportar filtros e análises como:

* Tudo;
* Serviço;
* Produto.

A estrutura definitiva das entidades financeiras será definida quando o módulo financeiro for implementado.

---

## Despesas

As despesas deverão possuir classificação gerencial.

Categorias inicialmente previstas incluem:

* Aluguel;
* Energia elétrica;
* Água;
* Internet;
* Material de limpeza;
* Material de uso operacional;
* Aquisição de produtos para revenda;
* Outras despesas operacionais.

As categorias devem ser extensíveis.

Não devem ser codificadas de forma que a inclusão futura de uma nova categoria exija alteração estrutural significativa da aplicação.

---

# Domínio de Produtos

Status: **PLANEJADO**

Produtos devem preservar sua finalidade.

A classificação conceitual inicial é:

```text
Produtos
├── Revenda
└── Consumo operacional
```

---

## Produto para Revenda

Produto adquirido com finalidade de comercialização ao cliente.

Exemplos:

* Pomada;
* Shampoo;
* Óleo para barba;
* Cosméticos.

A aquisição pode produzir entrada em estoque.

A venda pode produzir:

```text
Saída de estoque
       +
Receita de produto
```

---

## Produto de Consumo Operacional

Produto destinado ao funcionamento ou execução dos serviços do estabelecimento.

Exemplos:

* Lâminas;
* Luvas;
* Algodão;
* Materiais descartáveis.

Esses produtos podem possuir controle de estoque quando operacionalmente relevante.

Seu consumo não representa venda ao cliente.

---

# Domínio de Estoque

Status: **PLANEJADO**

O estoque deverá ser baseado em movimentações.

Conceitualmente:

```text
Produto
   ↓
Movimentações
   ├── Entrada
   ├── Saída por venda
   ├── Consumo interno
   ├── Ajuste positivo
   └── Ajuste negativo
```

O estoque atual de um produto deve ser explicável pelas movimentações que produziram seu saldo.

A modelagem definitiva será realizada durante a implementação do módulo de estoque.

---

# Separação entre Estoque e Financeiro

Uma movimentação física e uma movimentação financeira podem estar relacionadas, mas representam fatos diferentes.

Exemplo:

```text
Compra de produto para revenda
           │
           ├── Entrada no estoque
           │
           └── Evento financeiro
```

Outro exemplo:

```text
Venda de produto
           │
           ├── Saída do estoque
           │
           └── Receita
```

O modelo deve preservar essa separação.

Isso permite que estoque e financeiro sejam reconciliados e analisados independentemente.

---

# Domínio Operacional

Status: **PLANEJADO**

O domínio operacional deverá representar atividades como:

* Agendamentos;
* Atendimentos;
* Serviços realizados;
* Cancelamentos;
* Colaboradores;
* Relação entre profissional, serviço e estabelecimento.

Esse domínio será detalhado conforme a implementação das próximas funcionalidades.

---

# Agregados para Dashboard

Status: **PLANEJADO**

O MotionLab prevê a utilização futura de projeções agregadas para otimizar consultas dos dashboards.

A decisão arquitetural está registrada em:

`adrs/ADR-001-agregacao-dashboard.md`

A unidade persistida de agregação será a Filial.

Conceitualmente:

```text
Transações e movimentações
           ↓
    Agregado da Filial
           ↓
 Dashboard da Filial
           ↓
Consolidação da Matriz
```

A Matriz não possuirá um acumulador financeiro independente representando os mesmos totais das Filiais.

---

# Agregado Diário da Filial

Status: **CONCEITUAL**

Estrutura conceitual inicial:

```text
agregados_filial_diario
    filial_ref
    data

    receita_servico
    receita_produto
    receita_total

    despesa_operacional
    despesa_produtos_revenda
    despesa_produtos_consumo
    despesa_total

    agendados
    realizados
    em_atendimento
```

Essa estrutura ainda não representa uma coleção implementada.

Os campos definitivos serão definidos somente quando a estratégia de agregação for implementada.

---

# Fonte de Verdade

Os agregados não constituem fonte primária de verdade.

A regra arquitetural é:

```text
Transações e movimentações
        =
Fonte de verdade

Agregados
        =
Projeções para leitura
```

Os dados agregados devem poder ser reconstruídos a partir dos registros de origem.

---

# Identificadores e Referências

Novas relações entre documentos devem priorizar `Document Reference` quando essa representação for adequada ao relacionamento.

Campos String contendo IDs não devem ser criados apenas para duplicar uma referência já existente sem necessidade arquitetural claramente definida.

Campos legados poderão permanecer temporariamente durante migrações, mas não devem orientar novas implementações.

---

# Multi-Tenancy

Toda entidade operacional deve possuir contexto suficiente para determinar a qual tenant pertence.

O isolamento parte da Rede e dos estabelecimentos relacionados.

Conceitualmente:

```text
Rede
 ↓
Estabelecimento
 ↓
Dados operacionais
```

Nenhuma consulta deve depender exclusivamente de filtros visuais para garantir isolamento entre clientes.

As regras de segurança deverão reforçar esse isolamento no backend.

---

# Princípios do Modelo de Dados

O modelo do MotionLab deve seguir os seguintes princípios:

1. Preservar uma fonte de verdade claramente identificável.
2. Separar dados transacionais de projeções para consulta.
3. Evitar duplicação desnecessária de informação.
4. Utilizar referências explícitas entre entidades relacionadas.
5. Preservar isolamento multi-tenant.
6. Permitir evolução incremental.
7. Não implementar antecipadamente estruturas ainda não necessárias ao MVP.
8. Manter separação entre financeiro, estoque e operação.
9. Permitir reconstrução de dados derivados.
10. Considerar concorrência, idempotência e reconciliação em operações críticas.

---

# Evolução do Modelo

O modelo será expandido conforme os módulos forem implementados.

A evolução prevista inclui:

```text
Núcleo Organizacional
        ↓
Usuários e Permissões
        ↓
Agendamentos e Atendimentos
        ↓
Financeiro
        ↓
Produtos e Estoque
        ↓
Agregações e Analytics
```

Essa sequência representa uma direção arquitetural e não necessariamente uma ordem rígida de implementação.

---

# Documentos Relacionados

* `firestore.md`
* `seguranca.md`
* `adrs/ADR-001-agregacao-dashboard.md`
* `../3. design-system/10-dashboards.md`

---

# Status

O núcleo organizacional:

```text
Rede → Matriz → Filiais
```

está implementado e validado no MVP.

Os domínios:

* Financeiro;
* Produtos;
* Estoque;
* Operação;
* Agregações;

permanecem em evolução e deverão ser detalhados conforme sua implementação.

Este documento deve ser atualizado sempre que uma alteração estrutural relevante no modelo de dados for aprovada.

```

Há apenas um ponto que eu **não cristalizaria ainda**: nomes de coleções futuras como `produtos`, `despesas`, `movimentacoes_estoque` etc. Temos uma ideia bastante clara dos domínios, mas ainda não desenhamos seus fluxos. Por isso o documento descreve a responsabilidade sem transformar uma hipótese em estrutura definitiva.

Depois desse arquivo, eu iria para o **`firestore.md`**. Ali documentamos as decisões específicas de Firebase/Firestore: uso de `Document Reference`, estratégia de queries, índices, custo de leituras, agregações, transações/atomicidade e cuidados para não deixar o FlutterFlow assumir responsabilidades que devem ficar no backend. 
```
