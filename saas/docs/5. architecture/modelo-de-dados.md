# MotionLab SaaS

# Arquitetura

# Modelo de Dados

Versão: 0.2.0

Status: Baseline do MVP em evolução

Data: 2026-09-25

---

# 1. Objetivo

Documentar o modelo de dados do MotionLab SaaS, seus principais domínios, relacionamentos e regras estruturais.

Esta versão consolida a baseline resultante do segundo ciclo de revisão e higienização das Collections atualmente existentes no MotionLab.

A baseline não representa um modelo de dados congelado.

A implementação das jornadas poderá identificar novos fatos de negócio, campos, relacionamentos ou Collections necessários à evolução do produto.

Este documento diferencia explicitamente:

- estruturas atualmente implementadas;
- estruturas planejadas;
- decisões conceituais ainda sujeitas a detalhamento.

O princípio adotado para a evolução do modelo é:

> Primeiro compreender o fato de negócio e a informação necessária; depois decidir como persistir.

O objetivo é permitir a evolução incremental do produto sem confundir a arquitetura atualmente implementada com estruturas planejadas ou funcionalidades ainda não construídas.

---

# 2. Princípios do modelo

O modelo de dados do MotionLab é orientado por alguns princípios gerais.

## 2.1 Separação dos fatos de negócio

Fatos de naturezas diferentes não devem ser comprimidos em uma única estrutura apenas para evitar a evolução do modelo.

Exemplos:

- Agendamento representa aquilo que está previsto para acontecer;
- Atendimento representa aquilo que efetivamente aconteceu ou está acontecendo;
- Produto representa cadastro, parâmetros atuais e saldo atual;
- Movimentação de estoque representa os fatos que alteram esse saldo;
- Atendimento representa a origem operacional das receitas de serviços e produtos;
- Fluxo de caixa representa fatos financeiros;
- Plano de assinatura representa aquilo que a MotionLab comercializa;
- Assinatura SaaS representa aquilo que uma Rede contratou.

Esse princípio permite que cada domínio evolua sem transformar uma única Collection em fonte de verdade para fatos de naturezas diferentes.

## 2.2 Preservação histórica

Alterações posteriores em cadastros ou configurações não devem modificar fatos já ocorridos.

Sempre que necessário, o fato gerador deverá preservar os valores e regras efetivamente aplicados no momento da operação.

Exemplos:

- preço aplicado;
- comissão aplicada;
- duração prevista;
- desconto concedido;
- produto efetivamente vendido.

## 2.3 Auditoria

Sempre que aplicável, as Collections operacionais utilizam os campos:

```text
criado_em          DateTime
criado_por_ref     Doc Ref → users
atualizado_em      DateTime
atualizado_por_ref Doc Ref → users
```

Datas de auditoria não substituem datas dos fatos de negócio.

Exemplo:

```text
movimentado_em → momento da movimentação
criado_em       → momento em que o registro foi criado no sistema
```

## 2.4 Desativação lógica

Entidades com histórico relevante devem preferencialmente utilizar desativação lógica por meio de `ativo`, evitando a exclusão de registros necessários à reconstrução histórica.

## 2.5 Evolução orientada pelas jornadas

A baseline atual não pretende antecipar todos os fatos de negócio futuros.

Novas Collections ou campos serão acrescentados quando as jornadas demonstrarem necessidade concreta.

> Não criar complexidade antecipadamente, mas também não comprimir fatos de negócio diferentes em uma única estrutura apenas para evitar a evolução do modelo.

---

# 3. Visão Geral

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
```

A Rede representa o cliente do SaaS MotionLab.

Matriz e Filiais representam os Estabelecimentos operacionais pertencentes à Rede.

A baseline atual possui 15 Collections:

```text
users
servicos
agendamentos
planos_assinatura
assinaturas_saas
produtos
movimentacao_estoque
fluxo_caixa
convite
redes_franquias
estabelecimentos
colaboradores
clientes
categorias_financeiras
atendimentos
```

A existência de uma Collection nesta baseline não significa que todas as jornadas relacionadas a ela já estejam implementadas.

---

# 4. Estrutura organizacional

## 4.1 redes_franquias

Responsabilidade:

Representar o cliente organizacional do SaaS MotionLab, agrupando Matriz e Filiais pertencentes à mesma Rede.

Estrutura atual:

```text
redes_franquias
├── nome_da_rede        String
├── nicho_principal     String
├── dono_ref            Doc Ref → users
├── criado_em           DateTime
├── criado_por_ref      Doc Ref → users
├── atualizado_em       DateTime
└── atualizado_por_ref  Doc Ref → users
```

A Rede constitui uma das principais fronteiras de isolamento multi-tenant do sistema.

---

## 4.2 estabelecimentos

Responsabilidade:

> Registra as unidades operacionais pertencentes a uma Rede, identificando sua estrutura como Matriz ou Filial e mantendo seus dados cadastrais e de apresentação.

Estrutura atual:

```text
estabelecimentos
├── nome_fantasia              String
├── logo_url                   String
├── gateway_account_id         String
├── rede_ref                   Doc Ref → redes_franquias
├── matriz_ref                 Doc Ref → estabelecimentos
├── tipo                       String
├── telefones                  List<TelefoneStruct>
├── endereco_dados             EnderecoStruct
├── identidade_visual_dados    IdentidadeVisualStruct
├── ativo                      Boolean
├── criado_em                  DateTime
├── criado_por_ref             Doc Ref → users
├── atualizado_em              DateTime
└── atualizado_por_ref         Doc Ref → users
```

Valores controlados de `tipo`:

```text
MATRIZ
FILIAL
```

Regras:

```text
tipo = MATRIZ
→ matriz_ref vazio

tipo = FILIAL
→ matriz_ref aponta para um estabelecimento do tipo MATRIZ
```

Uma Filial somente poderá apontar para uma Matriz pertencente à mesma Rede.

São inválidas relações:

```text
FILIAL → FILIAL
FILIAL → MATRIZ de outra Rede
MATRIZ → ela própria
```

### TelefoneStruct

```text
TelefoneStruct
├── pais
├── ddd
├── numero
├── tipo
└── principal
```

### EnderecoStruct

```text
EnderecoStruct
├── codigo_postal
├── logradouro
├── numero
├── complemento
├── bairro
├── cidade
└── unidade_federacao
```

### IdentidadeVisualStruct

```text
IdentidadeVisualStruct
├── cor_primaria
└── cor_secundaria
```

Telefone, endereço e identidade visual são mantidos como estruturas incorporadas ao Estabelecimento para evitar leituras adicionais de pequenas estruturas fortemente relacionadas à unidade.

---

## 4.3 users

Responsabilidade:

Representar os usuários autenticados que possuem acesso ao MotionLab.

Estrutura atual:

```text
users
├── email
├── display_name
├── photo_url
├── uid
├── created_time
├── phone_number
├── role
├── rede_ref      Doc Ref → redes_franquias
└── matriz_ref    Doc Ref → estabelecimentos
```

`users` representa acesso ao sistema e não deve ser confundido com `colaboradores`.

Uma pessoa pode existir operacionalmente como Colaborador sem possuir usuário de acesso ao MotionLab.

`role` será utilizado para autorização e deverá compartilhar o mesmo domínio controlado utilizado em `convite.role`.

---

# 5. Colaboradores e Serviços

## 5.1 colaboradores

Responsabilidade:

Representar as pessoas que executam Serviços em um Estabelecimento.

Estrutura atual:

```text
colaboradores
├── estabelecimento_ref  Doc Ref → estabelecimentos
├── user_ref             Doc Ref → users (opcional)
├── nome                 String
├── ativo                Boolean
├── servicos_ref         List<Doc Ref → servicos>
├── criado_em            DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_em        DateTime
└── atualizado_por_ref   Doc Ref → users
```

Um Colaborador pode existir independentemente de possuir acesso ao MotionLab.

Por esse motivo, `user_ref` é opcional.

`servicos_ref` representa os Serviços que o Colaborador está habilitado a executar no Estabelecimento.

A lista é mantida no próprio Colaborador para permitir consultas frequentes com baixo custo de leitura.

Na baseline atual do MVP, um documento de Colaborador pertence a um único Estabelecimento.

Caso uma mesma pessoa exerça atividades em mais de um Estabelecimento, o modelo atual admite um registro operacional de Colaborador para cada unidade.

Não será antecipado um modelo de compartilhamento de Colaboradores entre Estabelecimentos sem necessidade concreta demonstrada pelas jornadas ou pelos clientes.

---

## 5.2 servicos

Responsabilidade:

Representar os Serviços comercializados e executados por um Estabelecimento.

Estrutura atual:

```text
servicos
├── nome                         String
├── preco                        Double
├── duracao                      Integer
├── ativo                        Boolean
├── estabelecimento_ref          Doc Ref → estabelecimentos
├── comissao_padrao_percentual   Double
├── criado_em                    DateTime
├── criado_por_ref               Doc Ref → users
├── atualizado_em                DateTime
└── atualizado_por_ref           Doc Ref → users
```

`duracao` representa a duração padrão do Serviço.

`preco` representa o preço atualmente configurado.

`comissao_padrao_percentual` representa a regra padrão de comissão aplicável ao Serviço.

Esses valores são configurações atuais.

Quando um Serviço for efetivamente realizado, os valores utilizados deverão ser preservados no fato histórico correspondente.

---

## 5.3 colaborador_servico_config — CONCEITUAL

Quando determinado Colaborador possuir condições diferentes do padrão de um Serviço, poderá existir uma configuração específica entre Colaborador e Serviço.

Estrutura conceitual:

```text
colaborador_servico_config
├── colaborador_ref
├── servico_ref
├── ajuste_tempo_percentual
├── ajuste_comissao_percentual
└── auditoria
```

A configuração representa uma exceção.

Na ausência de configuração específica, serão utilizadas a duração e a comissão padrão definidas no Serviço.

Tempo e comissão são independentes.

O ajuste de comissão representa percentual aplicado sobre a comissão padrão.

Exemplo conceitual:

```text
comissão padrão = 40%
ajuste           = +10%

comissão efetiva = 44%
```

Esta estrutura ainda não faz parte das 15 Collections atualmente materializadas.

---

# 6. Clientes

## 6.1 clientes

Responsabilidade:

Representar os clientes atendidos pelos Estabelecimentos pertencentes a uma Rede.

Estrutura atual:

```text
clientes
├── user_ref           Doc Ref → users (opcional)
├── nome               String
├── telefone           String
├── email              String
├── ativo              Boolean
├── rede_ref           Doc Ref → redes_franquias
├── criado_em          DateTime
├── criado_por_ref     Doc Ref → users
├── atualizado_em      DateTime
└── atualizado_por_ref Doc Ref → users
```

O Cliente pertence à Rede, e não a um Estabelecimento específico.

Isso permite que o mesmo Cliente seja reconhecido pela Matriz e pelas Filiais pertencentes à Rede.

O Atendimento determina em qual Estabelecimento ocorreu a relação operacional e econômica.

`user_ref` é opcional e será utilizado quando o Cliente possuir acesso autenticado ao MotionLab.

`ativo = false` preserva o histórico do Cliente e impede novas operações quando aplicável.

---

# 7. Agenda

## 7.1 agendamentos

Responsabilidade:

Representar aquilo que está previsto para acontecer.

Estrutura atual:

```text
agendamentos
├── data_hora            DateTime
├── status               String
├── estabelecimento_ref  Doc Ref → estabelecimentos
├── servicos_ref         List<Doc Ref → servicos>
├── colaborador_ref      Doc Ref → colaboradores
├── cliente_ref          Doc Ref → clientes
├── criado_em            DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_em        DateTime
└── atualizado_por_ref   Doc Ref → users
```

`data_hora` representa a previsão de início do Atendimento.

O término previsto não é persistido nesta baseline.

Ele poderá ser calculado a partir da duração dos Serviços agendados, considerando as regras aplicáveis ao Colaborador.

Valores controlados de `status`:

```text
AGUARDANDO
AGENDADO
CONFIRMADO
ATENDIDO
NAO_COMPARECEU
CANCELADO
```

Semântica:

```text
AGUARDANDO
→ novo agendamento aguardando ciência/aceite operacional do Colaborador

AGENDADO
→ Colaborador tomou ciência do compromisso

CONFIRMADO
→ Cliente confirmou o compromisso

ATENDIDO
→ compromisso do Agendamento foi cumprido

NAO_COMPARECEU
→ Cliente não compareceu

CANCELADO
→ Agendamento cancelado
```

`ATENDIDO` no Agendamento não substitui `REALIZADO` no Atendimento.

O primeiro representa o cumprimento do compromisso previsto.

O segundo representa a conclusão do fato operacional.

---

# 8. Atendimento

## 8.1 atendimentos

Responsabilidade:

> Registra o fato operacional do Atendimento efetivamente realizado ou em realização, preservando os Serviços, Produtos, valores e regras aplicados naquele momento.

Estrutura atual:

```text
atendimentos
├── rede_ref              Doc Ref → redes_franquias
├── estabelecimento_ref   Doc Ref → estabelecimentos
├── cliente_ref           Doc Ref → clientes
├── colaborador_ref       Doc Ref → colaboradores
├── agendamento_ref       Doc Ref → agendamentos (opcional)
├── itens_servico         List<ItemServicoAtendimentoStruct>
├── itens_produto         List<ItemProdutoAtendimentoStruct>
├── valor_servicos        Double
├── valor_produtos        Double
├── desconto_itens        Double
├── abatimento            Double
├── valor_total           Double
├── iniciado_em           DateTime
├── realizado_em          DateTime
├── status                String
├── criado_em             DateTime
├── criado_por_ref        Doc Ref → users
├── atualizado_em         DateTime
└── atualizado_por_ref    Doc Ref → users
```

Valores controlados de `status`:

```text
ABERTO
EM_ATENDIMENTO
REALIZADO
CANCELADO
```

Transições principais:

```text
ABERTO
   ↓
EM_ATENDIMENTO
   iniciado_em = momento efetivo do início
   ↓
REALIZADO
   realizado_em = momento efetivo da conclusão
```

`iniciado_em` e `realizado_em` são fatos históricos.

Não devem ser recalculados posteriormente.

Relação temporal:

```text
agendamento.data_hora
→ início previsto

atendimento.iniciado_em
→ início efetivo

atendimento.realizado_em
→ conclusão efetiva
```

Essa separação permitirá futuramente calcular indicadores como atraso, duração real, diferença entre duração prevista e realizada e utilização da capacidade.

Esses indicadores não precisam ser persistidos nesta baseline.

`agendamento_ref` é opcional porque um Atendimento poderá ocorrer sem Agendamento prévio.

### Mudança de Colaborador entre Agendamento e Atendimento

O Colaborador previsto e o Colaborador que efetivamente realizou o Atendimento podem ser diferentes.

Exemplo:

```text
agendamentos.colaborador_ref = Colaborador A
atendimentos.colaborador_ref = Colaborador B
```

O Agendamento preserva aquilo que estava previsto.

O Atendimento preserva aquilo que efetivamente aconteceu.

Não é necessário criar `colaborador_original_ref` no Atendimento.

---

## 8.2 ItemServicoAtendimentoStruct

Estrutura:

```text
ItemServicoAtendimentoStruct
├── servico_ref
├── nome
├── preco_tabela
├── preco_aplicado
├── duracao_prevista
├── comissao_padrao_percentual
├── comissao_aplicada_percentual
└── desconto_valor
```

A estrutura preserva um snapshot das condições efetivamente utilizadas no Atendimento.

Alterações posteriores no cadastro de Serviço não modificam o fato histórico.

---

## 8.3 ItemProdutoAtendimentoStruct

Estrutura:

```text
ItemProdutoAtendimentoStruct
├── produto_ref
├── nome
├── codigo_barras
├── tipo
├── preco_tabela
├── preco_aplicado
├── quantidade
├── comissao_padrao_percentual
├── comissao_aplicada_percentual
└── desconto_valor
```

O custo do Produto não é preservado nesta estrutura na baseline atual.

---

## 8.4 Composição de valores

Conceitualmente:

```text
valor_servicos
+
valor_produtos
-
desconto_itens
-
abatimento
=
valor_total
```

A implementação deverá garantir que descontos não sejam contabilizados duas vezes caso os valores dos itens já sejam calculados líquidos.

---

# 9. Produtos e Estoque

## 9.1 produtos

Responsabilidade:

> Registra os Produtos controlados pelo Estabelecimento, destinados à revenda ou ao consumo operacional.

Estrutura atual:

```text
produtos
├── nome                         String
├── codigo_barras                String
├── tipo                         String
├── preco_custo                  Double
├── preco_venda                  Double
├── quantidade_atual             Integer
├── quantidade_minima            Integer
├── estabelecimento_ref          Doc Ref → estabelecimentos
├── comissao_padrao_percentual   Double
├── ativo                        Boolean
├── criado_em                    DateTime
├── criado_por_ref               Doc Ref → users
├── atualizado_em                DateTime
└── atualizado_por_ref           Doc Ref → users
```

Valores controlados de `tipo`:

```text
REVENDA
CONSUMO_OPERACIONAL
```

`codigo_barras` utiliza String para preservar sua representação, inclusive zeros à esquerda.

`preco_custo` e `preco_venda` representam valores atuais de referência.

`quantidade_atual` representa o saldo atual do estoque.

As alterações normais de saldo devem ocorrer por fatos registrados em `movimentacao_estoque`.

`quantidade_minima` representa referência operacional para reposição.

Produtos pertencem a um Estabelecimento.

Para Produtos de revenda, `comissao_padrao_percentual` poderá definir a comissão padrão.

Na baseline do MVP não existe configuração diferenciada de comissão por Colaborador/Produto.

---

## 9.2 movimentacao_estoque

Responsabilidade:

> Registra os fatos que provocam entrada ou saída de Produtos no estoque do Estabelecimento.

Estrutura atual:

```text
movimentacao_estoque
├── tipo_movimento       String
├── quantidade           Integer
├── movimentado_em       DateTime
├── estabelecimento_ref  Doc Ref → estabelecimentos
├── produto_ref          Doc Ref → produtos
├── atendimento_ref      Doc Ref → atendimentos (opcional)
├── criado_em            DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_em        DateTime
└── atualizado_por_ref   Doc Ref → users
```

Valores controlados de `tipo_movimento`:

```text
ENTRADA_COMPRA
SAIDA_VENDA
SAIDA_CONSUMO
AJUSTE_ENTRADA
AJUSTE_SAIDA
```

A relação conceitual é:

```text
produtos.quantidade_atual
→ saldo atual

movimentacao_estoque
→ fatos que alteraram o saldo
```

`movimentado_em` registra quando o fato de estoque ocorreu.

`atendimento_ref` é opcional e permite rastrear uma saída de estoque causada por uma venda realizada em Atendimento.

A existência de `ENTRADA_COMPRA` não significa que o processo completo de compra esteja modelado nesta Collection.

A jornada de compras poderá exigir futuramente fatos próprios de compra, recebimento, obrigação e pagamento.

---

# 10. Financeiro

## 10.1 categorias_financeiras

Responsabilidade:

> Registra as categorias utilizadas para identificar a motivação econômica ou operacional que originou uma entrada ou saída financeira.

Estrutura atual:

```text
categorias_financeiras
├── nome                  String
├── tipo                  String
├── origem                String
├── ativo                 Boolean
├── estabelecimento_ref   Doc Ref → estabelecimentos
├── descricao_padrao      String
├── criado_em             DateTime
├── criado_por_ref        Doc Ref → users
├── atualizado_em         DateTime
└── atualizado_por_ref    Doc Ref → users
```

Valores controlados de `tipo`:

```text
ENTRADA
SAIDA
```

Valores controlados de `origem`:

```text
MOTIONLAB
ESTABELECIMENTO
```

Regras:

```text
origem = MOTIONLAB
→ estabelecimento_ref vazio

origem = ESTABELECIMENTO
→ estabelecimento_ref obrigatório
```

A categoria utilizada em uma movimentação deverá possuir `tipo` compatível com `fluxo_caixa.tipo`.

Uma categoria inativa não deverá ser utilizada em novas movimentações, mas referências históricas permanecem válidas.

`descricao_padrao` funciona como sugestão.

Quando utilizada para criar uma movimentação, a descrição poderá ser copiada para o fato financeiro, preservando seu conteúdo histórico mesmo que a categoria seja alterada posteriormente.

---

## 10.2 fluxo_caixa

Responsabilidade:

Representar fatos financeiros de entrada e saída relacionados à operação do Estabelecimento.

Estrutura atual:

```text
fluxo_caixa
├── tipo                 String
├── natureza             String
├── valor                Double
├── descricao            String
├── meio_movimentacao    String
├── movimentado_em       DateTime
├── rede_ref             Doc Ref → redes_franquias
├── estabelecimento_ref  Doc Ref → estabelecimentos
├── colaborador_ref      Doc Ref → colaboradores (opcional)
├── categoria_ref        Doc Ref → categorias_financeiras
├── atendimento_ref      Doc Ref → atendimentos (opcional)
├── criado_em            DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_em        DateTime
└── atualizado_por_ref   Doc Ref → users
```

Valores controlados de `natureza`:

```text
LIQUIDACAO
PAGAMENTO
```

Relação:

```text
LIQUIDACAO → ENTRADA
PAGAMENTO  → SAIDA
```

Valores controlados de `tipo`:

```text
ENTRADA
SAIDA
```

Regra:

> `natureza` determina `tipo`. `tipo` nunca determina `natureza`.

`valor` representa o valor da movimentação financeira e é armazenado como magnitude positiva.

`descricao` representa informação complementar sobre a ocorrência específica.

Valores atualmente previstos para `meio_movimentacao`:

```text
PIX
CARTAO_DEBITO
CARTAO_CREDITO
CONVENIO
DINHEIRO
VALE
```

`movimentado_em` representa o momento em que o fato financeiro efetivamente ocorreu.

`colaborador_ref` identifica, quando aplicável, o Colaborador economicamente relacionado à movimentação.

Ele não representa o usuário que registrou a operação.

`atendimento_ref` é opcional e deve ser utilizado quando a movimentação financeira deriva de um Atendimento.

Não existe `agendamento_ref` no fluxo de caixa.

Quando necessário, a relação poderá ser obtida por:

```text
fluxo_caixa
→ atendimento
→ agendamento
```

`rede_ref` e `estabelecimento_ref` são mantidos intencionalmente para facilitar isolamento multi-tenant, consultas e auditoria.

---

## 10.3 Operacional x financeiro

Faturamento operacional não deve ser calculado simplesmente pela soma indiscriminada de `fluxo_caixa`.

O fato operacional está registrado em `atendimentos`.

O fato financeiro está registrado em `fluxo_caixa`.

Exemplo:

```text
Atendimento realizado
→ fato operacional

Liquidação
→ fato financeiro
```

Essa separação evita dupla contabilização quando mais de um evento financeiro estiver relacionado ao mesmo fato operacional.

---

## 10.4 Caixa físico — CONCEITUAL

Caixa físico não deve ser confundido com fluxo financeiro.

Conceitualmente:

```text
FLUXO_CAIXA
→ fatos financeiros do Estabelecimento

CAIXA_FISICO
→ local físico onde valores em dinheiro são mantidos

SESSAO_CAIXA
→ período de abertura e fechamento de determinado caixa
```

Abertura de caixa não representa receita.

Sangria não representa necessariamente despesa.

Essas estruturas ainda não fazem parte da baseline materializada.

---

## 10.5 Compra, obrigação e pagamento — EVOLUÇÃO FUTURA

Durante a revisão do modelo foi identificado que comprar, receber mercadoria e pagar são fatos distintos.

Exemplo:

```text
dia 10
→ compra / recebimento do produto

dia 20
→ pagamento da obrigação
```

A baseline atual não pretende comprimir esses fatos em `movimentacao_estoque` ou `fluxo_caixa`.

As jornadas correspondentes deverão determinar futuramente as estruturas necessárias.

---

# 11. SaaS e Assinaturas

## 11.1 planos_assinatura

Responsabilidade:

> Define os planos comerciais do SaaS disponibilizados pela MotionLab para contratação pelas Redes.

Estrutura atual:

```text
planos_assinatura
├── nome                String
├── descricao           String
├── preco_mensal        Double
├── gateway_plan_id     String
├── ativo               Boolean
├── criado_em           DateTime
├── criado_por_ref      Doc Ref → users
├── atualizado_em       DateTime
└── atualizado_por_ref  Doc Ref → users
```

`ativo = false` significa que o plano não está disponível para novas contratações.

Isso não implica cancelamento automático das assinaturas existentes.

A baseline não antecipa estruturas de limites comerciais enquanto não houver política concreta que as exija.

---

## 11.2 assinaturas_saas

Responsabilidade:

> Registra a contratação de um plano do SaaS MotionLab por uma Rede e acompanha a situação dessa assinatura.

Estrutura atual:

```text
assinaturas_saas
├── plano_ref                Doc Ref → planos_assinatura
├── status                   String
├── proximo_vencimento       DateTime
├── rede_ref                 Doc Ref → redes_franquias
├── gateway_subscription_id  String
├── inicio_em                DateTime
├── criado_em                DateTime
├── criado_por_ref           Doc Ref → users
├── atualizado_em            DateTime
└── atualizado_por_ref       Doc Ref → users
```

Valores atualmente definidos de `status`:

```text
ATIVO
INATIVO
EM_ANALISE
EM_RENOVACAO
```

A Assinatura pertence à Rede.

Não pertence individualmente à Matriz ou a uma Filial.

Separação:

```text
planos_assinatura
→ aquilo que a MotionLab oferece

assinaturas_saas
→ aquilo que determinada Rede contratou
```

Estados específicos de pagamento ou gateway somente deverão ser acrescentados quando o fluxo correspondente for definido.

---

# 12. Convites e acesso

## 12.1 convite

Responsabilidade:

Permitir a criação controlada de vínculos de usuários com o MotionLab, preservando o escopo para o qual o convite foi emitido.

Estrutura atual:

```text
convite
├── codigo               String
├── role                 String
├── usado                Boolean
├── criado_em            DateTime
├── rede_ref              Doc Ref → redes_franquias
├── estabelecimento_ref   Doc Ref → estabelecimentos
├── expira_em             DateTime
├── usado_por_ref         Doc Ref → users
├── usado_em              DateTime
└── criado_por_ref        Doc Ref → users
```

`role` deverá utilizar o mesmo domínio controlado de `users.role`.

O convite preserva:

- quem o criou;
- para qual Rede foi criado;
- para qual Estabelecimento foi criado quando aplicável;
- quando expira;
- se já foi utilizado;
- quem o utilizou;
- quando foi utilizado.

A jornada de convite e cadastro deverá determinar as regras definitivas de acesso e validação.

---

# 13. Disponibilidade e força de trabalho — CONCEITUAL

As estruturas desta seção foram definidas conceitualmente, mas ainda não fazem parte das 15 Collections materializadas.

## 13.1 disponibilidade_colaborador

Disponibilidade representa os períodos recorrentes em que o Colaborador normalmente pode receber Agendamentos.

Disponibilidade não significa necessariamente horário livre.

Estrutura conceitual:

```text
disponibilidade_colaborador
├── colaborador_ref
├── dia_semana
├── hora_inicio
├── hora_fim
├── ativo
└── auditoria
```

Cada período poderá ser representado independentemente.

Exemplo:

```text
segunda-feira
08:00 → 12:00

segunda-feira
14:00 → 18:00
```

---

## 13.2 eventos_forca_trabalho

Ausências e outros eventos excepcionais não devem modificar a disponibilidade recorrente.

Estrutura conceitual:

```text
eventos_forca_trabalho
├── colaborador_ref
├── tipo_evento_ref
├── inicio
├── fim
├── observacao
└── auditoria
```

Os eventos permanecem historicamente registrados.

---

## 13.3 tipos_evento_forca_trabalho

Estrutura conceitual:

```text
tipos_evento_forca_trabalho
├── codigo
├── nome
├── origem
├── matriz_ref
├── ativo
└── auditoria
```

Valores conceituais de `origem`:

```text
MOTIONLAB
MATRIZ
```

Tipos globais pertencem ao MotionLab.

Tipos específicos poderão ser definidos pela Matriz.

Conceitualmente:

```text
Disponibilidade recorrente
-
Eventos de força de trabalho
-
Agendamentos existentes
=
Horários livres
```

Horários livres não precisam ser previamente persistidos como documentos.

---

# 14. Dashboards e agregação

Transações e movimentações permanecem como fontes de verdade.

Agregados são projeções otimizadas para leitura.

Princípios:

> A transação e a movimentação são as fontes de verdade.

> O agregado é uma projeção otimizada para leitura.

> A Filial é a unidade persistida de agregação.

> A Matriz é uma visão consolidada derivada das Filiais.

> Visualizações diferentes devem reutilizar os mesmos dados sempre que possível.

A estrutura conceitual de agregado diário por Filial é:

```text
agregados_filial_diario
├── filial_ref
├── data
├── receita_servico
├── receita_produto
├── receita_total
├── despesa_operacional
├── despesa_produtos_revenda
├── despesa_produtos_consumo
├── despesa_total
├── agendados
├── realizados
└── em_atendimento
```

Períodos maiores, como semana e mês, poderão ser obtidos pela composição dos agregados diários.

A Matriz não deverá manter uma segunda verdade financeira independente das Filiais.

Esta decisão está detalhada no ADR correspondente à estratégia de agregação dos dashboards.

A estrutura `agregados_filial_diario` permanece conceitual até sua implementação.

---

# 15. Segurança e isolamento multi-tenant

Segurança faz parte da definição de conclusão das jornadas do MotionLab.

Princípio:

> Autenticação responde quem é o usuário. Autorização determina o que esse usuário pode fazer e sobre quais dados.

Também é estabelecido:

> Nenhuma informação enviada pelo cliente deve, sozinha, conceder acesso a outro tenant.

As relações existentes no modelo, especialmente:

```text
users.role
users.rede_ref
users.matriz_ref
rede_ref
estabelecimento_ref
```

servirão de base para implementação das regras de autorização.

A interface não constitui mecanismo suficiente de segurança.

Ocultar páginas, botões ou ações no FlutterFlow não substitui Firestore Security Rules.

A segurança deverá ser validada progressivamente conforme cada jornada for implementada.

Critério:

```text
Funcionalidade
+
Persistência
+
Autorização
+
Isolamento multi-tenant testado
=
Jornada concluída
```

As regras atuais de desenvolvimento poderão permanecer temporariamente permissivas enquanto os fluxos correspondentes ainda estiverem sendo construídos.

Entretanto, dados privados não deverão chegar à produção com permissões públicas incompatíveis com seu domínio.

---

# 16. Collections legadas

As Collections abaixo pertencem a gerações anteriores do modelo e não integram a baseline atual das 15 Collections:

```text
barbearias
role
profissional
profissional/horarios_disponiveis
assinaturas_clientes
produtos_estoque
config_comissoes
estabelecimento_id
estabelecimento_id/telefone
estabelecimento_id/logradouro
estabelecimento_id/identidade_visual
prestadores
itens_servicos
reservas_atendimentos
estabelecimento
```

Evolução estrutural principal:

```text
barbearias
   ↓
estabelecimento_id
   ↓
estabelecimento
   ↓
estabelecimentos
```

Outras substituições conceituais:

```text
profissional / prestadores
→ colaboradores

assinaturas_clientes
→ assinaturas_saas

produtos_estoque
→ produtos + movimentacao_estoque

config_comissoes
→ regras padrão em Serviços/Produtos
   + configuração específica futura quando necessária

reservas_atendimentos
→ agendamentos + atendimentos
```

Uma estrutura legada somente deverá ser removida fisicamente após confirmação de que não existem dependências necessárias em páginas, componentes, queries, actions ou dados que precisem ser migrados.

---

# 17. Baseline atual

Após o segundo ciclo de revisão e higienização, a baseline atualmente existente é composta por:

```text
1.  users
2.  servicos
3.  agendamentos
4.  planos_assinatura
5.  assinaturas_saas
6.  produtos
7.  movimentacao_estoque
8.  fluxo_caixa
9.  convite
10. redes_franquias
11. estabelecimentos
12. colaboradores
13. clientes
14. categorias_financeiras
15. atendimentos
```

Esta baseline representa o ponto de partida para implementação das próximas jornadas.

Ela não representa encerramento definitivo do modelo.

Estruturas já identificadas conceitualmente poderão ser incorporadas quando suas jornadas forem implementadas.

Entre elas:

```text
colaborador_servico_config
disponibilidade_colaborador
eventos_forca_trabalho
tipos_evento_forca_trabalho
agregados_filial_diario
caixa físico / sessão de caixa
compras / recebimentos / obrigações / pagamentos
```

A criação dessas estruturas deverá ocorrer a partir da compreensão do respectivo fato de negócio e não apenas por antecipação técnica.

---

# 18. Próxima etapa

Com a baseline consolidada, a evolução do modelo passa a acompanhar a implementação das jornadas do MotionLab.

Para cada jornada:

```text
Compreender o fato de negócio
        ↓
Identificar as informações necessárias
        ↓
Verificar se a baseline já suporta o fluxo
        ↓
Evoluir o modelo somente quando necessário
        ↓
Implementar
        ↓
Validar persistência
        ↓
Implementar autorização
        ↓
Testar isolamento multi-tenant
        ↓
Jornada concluída
```

Dessa forma, o modelo de dados permanece evolutivo sem perder coerência arquitetural nem antecipar complexidade sem necessidade concreta.