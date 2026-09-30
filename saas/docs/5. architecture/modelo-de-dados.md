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

> Representar aquilo que está previsto para acontecer, preservando o compromisso do Cliente e a ocupação planejada das agendas dos Colaboradores envolvidos.

Estrutura atual:

```text
agendamentos
├── data_hora            DateTime
├── status               String
├── estabelecimento_ref  Doc Ref → estabelecimentos
├── cliente_ref          Doc Ref → clientes
├── itens_servico        List<ItemServicoAgendamentoStruct>
├── criado_em            DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_em        DateTime
└── atualizado_por_ref   Doc Ref → users
```

`data_hora` representa a data e hora de início do compromisso do Cliente.

O Agendamento representa o compromisso do Cliente como um todo.

Os itens de Serviço representam a ocupação planejada das agendas dos Colaboradores envolvidos.

Assim, um mesmo Agendamento poderá possuir Serviços sequenciais ou simultâneos e envolver diferentes Colaboradores.

Exemplo:

```text
Agendamento
data_hora = 14:00

├── Corte
│   ├── colaborador_ref = Colaborador A
│   ├── inicio_previsto = 14:00
│   └── fim_previsto    = 14:30
│
├── Barba
│   ├── colaborador_ref = Colaborador A
│   ├── inicio_previsto = 14:30
│   └── fim_previsto    = 14:50
│
└── Manicure
    ├── colaborador_ref = Colaborador B
    ├── inicio_previsto = 14:00
    └── fim_previsto    = 14:30
```

### Status do Agendamento

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
→ existem Serviços ativos aguardando ciência dos respectivos Colaboradores

AGENDADO
→ todos os Serviços ativos possuem ciência dos respectivos Colaboradores

CONFIRMADO
→ Cliente confirmou o compromisso

ATENDIDO
→ compromisso previsto foi cumprido

NAO_COMPARECEU
→ Cliente não compareceu

CANCELADO
→ Agendamento cancelado
```

A transição operacional principal é:

```text
Agendamento criado
        ↓
AGUARDANDO
        ↓
todos os itens ativos = CIENTE
        ↓
AGENDADO
        ↓
Cliente confirma
        ↓
CONFIRMADO
```

Itens cancelados não participam da condição para mudança de `AGUARDANDO` para `AGENDADO`.

`ATENDIDO` no Agendamento não substitui `REALIZADO` no Atendimento.

O primeiro representa o cumprimento do compromisso previsto.

O segundo representa a conclusão do fato operacional.

---

## 7.2 ItemServicoAgendamentoStruct

Responsabilidade:

> Representar cada Serviço previsto no Agendamento, identificando o Serviço, o Colaborador reservado, o intervalo planejado de ocupação da Agenda e a ciência do Colaborador responsável.

Estrutura:

```text
ItemServicoAgendamentoStruct
├── servico_ref        Doc Ref → servicos
├── colaborador_ref    Doc Ref → colaboradores
├── duracao_prevista   Integer
├── inicio_previsto    DateTime
├── fim_previsto       DateTime
├── status             String
└── ciente_em          DateTime
```

### Serviço e Colaborador

`servico_ref` identifica o Serviço previsto.

`colaborador_ref` identifica o Colaborador cuja Agenda será ocupada para a realização daquele Serviço.

O Colaborador pertence ao item de Serviço e não ao Agendamento como um todo.

Essa modelagem permite que um único Agendamento possua vários Serviços atribuídos a diferentes Colaboradores.

### Controle temporal

```text
duracao_prevista
→ duração planejada do Serviço em minutos

inicio_previsto
→ momento previsto para início do Serviço

fim_previsto
→ momento previsto para conclusão do Serviço
```

`inicio_previsto` e `fim_previsto` determinam a ocupação planejada da Agenda do Colaborador.

A relação temporal é:

```text
agendamento.data_hora
→ início do compromisso do Cliente

item.inicio_previsto
→ início da ocupação planejada do Colaborador

item.fim_previsto
→ término da ocupação planejada do Colaborador
```

`duracao_prevista` preserva a duração considerada no momento do Agendamento.

Alterações posteriores na duração padrão cadastrada para o Serviço não devem modificar automaticamente Agendamentos existentes.

### Ciência do Colaborador e status do item

Valores controlados de `status`:

```text
AGUARDANDO
CIENTE
CANCELADO
```

Semântica:

```text
AGUARDANDO
→ Serviço reservado na Agenda do Colaborador,
  aguardando sua ciência

CIENTE
→ Colaborador tomou ciência do compromisso

CANCELADO
→ Serviço cancelado, permanecendo registrado
  para preservação do histórico
```

Quando ocorrer:

```text
AGUARDANDO
    ↓
CIENTE
```

deve ser registrado:

```text
ciente_em = momento efetivo da ciência do Colaborador
```

`ciente_em` é um fato histórico.

Não deve ser recalculado posteriormente.

A ciência é controlada individualmente porque um mesmo Agendamento poderá envolver diferentes Colaboradores.

Exemplo:

```text
Agendamento do Cliente

├── Corte
│   ├── colaborador_ref = Colaborador A
│   └── status = CIENTE
│
├── Manicure
│   ├── colaborador_ref = Colaborador B
│   └── status = AGUARDANDO
│
└── Pedicure
    ├── colaborador_ref = Colaborador C
    └── status = CIENTE
```

Nesse momento:

```text
agendamento.status = AGUARDANDO
```

Quando todos os itens ativos estiverem:

```text
status = CIENTE
```

o Agendamento poderá assumir:

```text
agendamento.status = AGENDADO
```

Itens com `status = CANCELADO` não participam dessa condição.

Assim:

```text
ItemServicoAgendamentoStruct.status
→ situação do Serviço em relação à Agenda do Colaborador

agendamentos.status
→ situação global do compromisso do Cliente
```

### Relação com o Atendimento

O Agendamento representa o previsto.

O Atendimento representa aquilo que efetivamente aconteceu.

Não existe obrigação de correspondência integral entre os itens do Agendamento e os itens do Atendimento.

Um Serviço poderá:

- ser previsto e realizado pelo mesmo Colaborador;
- ser realizado por outro Colaborador;
- ser cancelado antes do Atendimento;
- não ser realizado;
- ser incluído somente durante o Atendimento.

Portanto:

```text
ItemServicoAgendamentoStruct
→ planejamento, reserva de Agenda e ciência do Colaborador

ItemServicoAtendimentoStruct
→ fato operacional efetivamente ocorrido
```

O Agendamento deve permanecer como registro histórico daquilo que estava previsto, sem ser reescrito para reproduzir aquilo que posteriormente aconteceu no Atendimento.

---

# 8. Atendimento

## 8.1 atendimentos

Responsabilidade:

> Registra o fato operacional do Atendimento efetivamente realizado ou em realização, preservando os Serviços, Produtos, valores, Colaboradores e regras aplicados naquele momento.

Estrutura atual:

```text
atendimentos
├── rede_ref              Doc Ref → redes_franquias
├── estabelecimento_ref   Doc Ref → estabelecimentos
├── cliente_ref           Doc Ref → clientes
├── agendamento_ref       Doc Ref → agendamentos (opcional)
├── itens_servico         List<ItemServicoAtendimentoStruct>
├── itens_produto         List<ItemProdutoAtendimentoStruct>
├── valor_servicos        Double
├── valor_produtos        Double
├── desconto_itens        Double
├── abatimento            Double
├── valor_total           Double
├── iniciado_em           DateTime
├── finalizado_em         DateTime
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
   finalizado_em = momento efetivo da conclusão
```

`iniciado_em` e `finalizado_em` são fatos históricos.

Não devem ser recalculados posteriormente.

O `status` do Atendimento representa o estado global do Atendimento.

Os Serviços que compõem o Atendimento possuem controle individual de execução por meio de `ItemServicoAtendimentoStruct`.

### Relação temporal

```text
agendamento.data_hora
→ início previsto do compromisso do Cliente

agendamento.itens_servico[].inicio_previsto
→ início previsto de cada Serviço

agendamento.itens_servico[].fim_previsto
→ conclusão prevista de cada Serviço

atendimento.iniciado_em
→ início efetivo do Atendimento

atendimento.finalizado_em
→ conclusão efetiva do Atendimento

atendimento.itens_servico[].inicio_real
→ início efetivo de cada Serviço

atendimento.itens_servico[].fim_real
→ conclusão efetiva de cada Serviço
```

Essa separação permitirá futuramente calcular indicadores como atraso, duração real, diferença entre duração prevista e realizada e utilização da capacidade.

Esses indicadores não precisam ser persistidos nesta baseline.

`agendamento_ref` é opcional porque um Atendimento poderá ocorrer sem Agendamento prévio.

### Relação entre Agendamento e Atendimento

O Agendamento representa aquilo que foi previsto.

O Atendimento representa aquilo que efetivamente aconteceu.

O Atendimento não constitui uma cópia obrigatória do Agendamento.

Durante o Atendimento poderão ocorrer situações como:

- inclusão de Serviço não previsto;
- retirada de Serviço anteriormente agendado;
- alteração do Colaborador executor;
- alteração das condições comerciais;
- Atendimento sem Agendamento prévio.

O Agendamento original deve preservar o planejamento realizado, enquanto o Atendimento preserva o fato operacional ocorrido.

### Colaborador por Serviço

O Colaborador está associado ao item de Serviço e não ao Atendimento como um todo.

Um mesmo Atendimento poderá possuir Serviços executados por Colaboradores diferentes, inclusive simultaneamente.

O Colaborador previsto para determinado Serviço no Agendamento e o Colaborador que efetivamente executou esse Serviço no Atendimento podem ser diferentes.

Exemplo:

```text
agendamento.itens_servico[n].colaborador_ref
→ Colaborador A

atendimento.itens_servico[n].colaborador_ref
→ Colaborador B
```

O Agendamento preserva o Colaborador previsto.

O Atendimento preserva o Colaborador que efetivamente executou o Serviço.

Não é necessário manter `colaborador_ref` no nível do Atendimento nem criar `colaborador_original_ref`.


---

## 8.2 ItemServicoAtendimentoStruct

Responsabilidade:

> Preserva o fato operacional e comercial de cada Serviço que compõe o Atendimento.

Estrutura:

```text
ItemServicoAtendimentoStruct
├── servico_ref                    Doc Ref → servicos
├── nome                           String
├── preco_tabela                   Double
├── preco_aplicado                 Double
├── duracao_prevista               Integer
├── comissao_padrao_percentual     Double
├── comissao_aplicada_percentual   Double
├── desconto_valor                 Double
├── colaborador_ref                Doc Ref → colaboradores
├── status                         String
├── inicio_real                    DateTime
└── fim_real                       DateTime
```

A estrutura preserva um snapshot das condições efetivamente utilizadas no Atendimento.

Alterações posteriores no cadastro do Serviço, em seu preço, duração padrão ou regras de comissão não modificam o fato histórico.

### Colaborador executor

`colaborador_ref` identifica o Colaborador que efetivamente executou aquele Serviço.

A associação do Colaborador ao item permite que um mesmo Atendimento possua diferentes Serviços executados por diferentes profissionais.

Também permite representar Serviços executados simultaneamente.

### Status do item

Valores controlados inicialmente:

```text
PENDENTE
EM_ATENDIMENTO
CONCLUIDO
CANCELADO
```

O `status` do item representa exclusivamente a situação daquele Serviço dentro do Atendimento.

Ele não substitui o `status` global existente em `atendimentos`.

Exemplo:

```text
atendimento.status = EM_ATENDIMENTO

itens_servico[0].status = CONCLUIDO
itens_servico[1].status = EM_ATENDIMENTO
itens_servico[2].status = PENDENTE
```

### Controle temporal do Serviço

```text
inicio_real
→ momento efetivo em que o Serviço começou

fim_real
→ momento efetivo em que o Serviço terminou
```

Esses campos são fatos históricos e não devem ser recalculados posteriormente.

A duração real do Serviço não precisa ser persistida nesta baseline.

Pode ser derivada por:

```text
duracao_real = fim_real - inicio_real
```

### Preço aplicado

Para cada item:

```text
preco_aplicado = preco_tabela - desconto_valor
```

Onde:

```text
preco_tabela
→ preço do Serviço utilizado como referência no Atendimento

desconto_valor
→ desconto concedido especificamente naquele item

preco_aplicado
→ valor líquido efetivamente aplicado ao Serviço
```

`preco_aplicado` pertence ao item de Serviço e não deve ser utilizado como base para recalcular `valor_servicos` no Atendimento.


---

## 8.3 ItemProdutoAtendimentoStruct

Responsabilidade:

> Preserva o fato comercial de cada Produto incluído no Atendimento.

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

A estrutura preserva um snapshot das condições do Produto utilizadas naquele Atendimento.

Alterações posteriores no cadastro do Produto não modificam o fato histórico registrado.

O custo do Produto não é preservado nesta estrutura na baseline atual.


---

## 8.4 Composição de valores

Os valores consolidados do Atendimento preservam separadamente os valores brutos, descontos concedidos e abatimentos aplicados ao Atendimento.

### Serviços

Para cada item de Serviço:

```text
preco_aplicado = preco_tabela - desconto_valor
```

No Atendimento:

```text
valor_servicos = Σ preco_tabela dos Serviços
```

Portanto, `valor_servicos` representa o valor bruto dos Serviços antes dos descontos individuais.

### Desconto dos itens

```text
desconto_itens = Σ desconto_valor dos itens
```

`desconto_itens` representa a consolidação dos descontos concedidos individualmente nos itens do Atendimento.

A implementação não deverá utilizar `preco_aplicado` para formar `valor_servicos` e posteriormente subtrair novamente `desconto_itens`, pois isso contabilizaria o mesmo desconto duas vezes.

### Abatimento

`abatimento` representa redução aplicada ao Atendimento como um todo e não a um item específico.

Ele deve permanecer separado dos descontos individuais para preservar a origem da redução concedida.

### Valor total

A composição conceitual é:

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

Assim:

```text
valor_total =
    valor_servicos
  + valor_produtos
  - desconto_itens
  - abatimento
```

Essa composição mantém separados:

```text
valor bruto dos Serviços
valor bruto dos Produtos
descontos aplicados aos itens
abatimento aplicado ao Atendimento
valor final do Atendimento
```

Essa separação deverá ser preservada para permitir rastreabilidade financeira e evitar dupla contabilização de descontos.
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

Observação: 
Evolução futura — catálogo da Rede
A baseline do MVP mantém Produtos vinculados diretamente ao Estabelecimento.
Uma evolução futura poderá separar o catálogo de Produtos da Rede da configuração e do estoque mantidos por cada Estabelecimento, permitindo padronização do portfólio, definição de faixas de preço, gestão centralizada de compras e distribuição às Filiais.
Nesse cenário, a Rede poderá determinar os Produtos utilizados ou comercializados, mantendo autonomia controlada dos Estabelecimentos dentro das políticas definidas. Filiais poderão também sugerir novos Produtos, com justificativa e posterior análise pela gestão da Rede.
Essa evolução deverá ser orientada pelas respectivas jornadas e não integra a baseline atual.


---

## 9.2 movimentacao_estoque

Responsabilidade:

> Registra os fatos que provocam entrada ou saída de Produtos no estoque do Estabelecimento.

produtos.quantidade_atual representa o saldo corrente do Produto no Estabelecimento, enquanto movimentacao_estoque preserva os fatos que alteraram esse saldo.
Alterações normais de quantidade_atual não deverão ocorrer diretamente. Toda entrada ou saída deverá produzir a respectiva movimentação de estoque e atualizar o saldo de forma consistente.
A implementação da jornada deverá garantir que o registro da movimentação e a atualização do saldo constituam uma única operação lógica, evitando divergências entre o saldo atual e seu histórico.

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

Toda alteração do saldo de estoque deverá ser representada por uma movimentação que permita identificar sua natureza e o motivo que a originou.
Entradas e saídas deverão possuir justificativa compatível com o fato ocorrido, permitindo reconstruir historicamente por que determinada quantidade foi acrescentada ou retirada do estoque.
justificativa registra o motivo que fundamenta a movimentação, enquanto observacao poderá registrar informações complementares sobre a ocorrência.
A autorização para realização de determinadas movimentações deverá respeitar a alçada definida para a jornada. A auditoria deverá preservar o usuário responsável pelo registro.
Os valores de tipo_movimento deverão representar naturezas relevantes da movimentação sem pretender antecipar todas as causas possíveis. Novos tipos poderão ser incorporados quando as jornadas demonstrarem necessidade concreta.

Evolução futura — múltiplos estoques e transferências
A baseline atual não contempla transferências de Produtos entre Estabelecimentos ou diferentes locais de estoque.
Quando forem implementados estoque central, estoque do Estabelecimento, estoque sob responsabilidade do Colaborador ou outras localizações, as transferências deverão ser tratadas como fatos próprios, preservando origem, destino, quantidade, responsabilidade e rastreabilidade da operação.
Transferências não deverão ser representadas artificialmente como ajustes independentes de entrada e saída.
As estruturas e os tipos de movimentação necessários serão definidos quando essa jornada for implementada.

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

`movimentado_em` representa o momento em que o fato financeiro efetivamente ocorreu. No contexto de um Atendimento, a liquidação representa o momento em que a obrigação do Cliente é satisfeita pelo meio de pagamento aceito. Quando houver intermediador, como em uma operação com cartão, isso não significa necessariamente que o valor já tenha sido creditado ao Estabelecimento.

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

Toda movimentação de numerário que altere o saldo físico do caixa sem decorrer diretamente de um pagamento ou recebimento deverá possuir registro próprio que justifique sua origem, destino, valor e responsabilidade, permitindo a apuração objetiva de diferenças no fechamento.

O fechamento da operação não se limita à conferência do numerário existente no caixa físico.
O fechamento deverá confrontar os Atendimentos realizados com os respectivos meios de pagamento realizados e suas evidências, permitindo verificar a consistência da operação do período.
Uma transação realizada por cartão poderá estar corretamente registrada no fechamento mesmo que o valor ainda não tenha sido efetivamente creditado ao Estabelecimento. Nesse caso, a existência de um recebível futuro não representa diferença de caixa.
O controle posterior de recebíveis, incluindo conciliação, antecipação, taxas e divergências de crédito, não faz parte do escopo atual do MotionLab.

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

## 10.6 Estorno e devoluções — EVOLUÇÃO FUTURA

Estorno e devolução constituem uma jornada necessária do MotionLab, porém não integram a baseline atual.
A jornada deverá preservar o fato original e registrar os efeitos efetivamente produzidos, que poderão envolver aspectos financeiros, estoque, taxas, comissões e outros fatos operacionais.
A modelagem deverá considerar que nem todos os efeitos da operação original são necessariamente reversíveis. A possibilidade de recuperação de taxas, por exemplo, poderá depender do momento e das condições em que o estorno ocorrer.
As estruturas necessárias serão definidas quando essa jornada for implementada, evitando antecipar sua complexidade dentro de fluxo_caixa.

---

# 11. SaaS e Assinaturas

As estruturas desta seção tratam exclusivamente da relação comercial entre a MotionLab e a Rede contratante do SaaS.

Neste documento, o termo `Cliente` é reservado à pessoa atendida pelos Estabelecimentos da Rede. A organização que contrata o SaaS MotionLab é denominada `Rede` ou `Rede contratante`.

Planos, mensalidades ou contratos recorrentes entre os Estabelecimentos e seus Clientes não fazem parte do escopo atual.

## 11.1 planos_assinatura

Responsabilidade:

> Define os planos comerciais do SaaS disponibilizados pela MotionLab para contratação pelas Redes.

Estrutura atual:

text
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


`ativo = false` significa que o plano não está disponível para novas contratações.

Isso não implica cancelamento automático das assinaturas existentes.

A baseline não antecipa estruturas de limites comerciais enquanto não houver política concreta que as exija.

---

## 11.2 assinaturas_saas

Responsabilidade:

> Registra a contratação de um plano do SaaS MotionLab por uma Rede e acompanha a situação dessa assinatura.

Estrutura atual:

text
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


Valores atualmente definidos de `status`:

text
ATIVO
INATIVO
EM_ANALISE
EM_RENOVACAO


A Assinatura pertence à Rede.

Não pertence individualmente à Matriz ou a uma Filial.

Separação:

text
planos_assinatura
→ aquilo que a MotionLab oferece

assinaturas_saas
→ aquilo que determinada Rede contratou


A vigência financeira da assinatura e a renovação futura representam conceitos distintos.

O cancelamento de uma renovação não deverá retirar antecipadamente o direito de utilização correspondente a um período cuja vigência financeira ainda esteja válida.

Conceitualmente:

text
Período contratado com vigência válida
        ↓
cancelamento da renovação futura
        ↓
não haverá nova renovação
        ↓
direito de utilização permanece
até o encerramento da vigência contratada


A implementação da jornada de assinatura deverá determinar se será necessário representar explicitamente a data final de vigência, sem antecipar nesta baseline novos campos antes da definição do respectivo fluxo financeiro.

Estados específicos de pagamento ou do gateway somente deverão ser acrescentados quando o fluxo correspondente for definido.

## 11.3 Tolerância e restrição progressiva de acesso — CONCEITUAL

A MotionLab poderá adotar um período de tolerância quando houver pendência financeira da Rede contratante.

A tolerância não precisa representar acesso integral ao produto.

Conceitualmente, a política poderá possuir três situações de acesso:

text
VIGÊNCIA NORMAL
→ situação financeira regular
→ acesso integral às funcionalidades contratadas

TOLERÂNCIA PARCIAL
→ existe pendência financeira
→ período de tolerância ainda não terminou
→ funcionalidades essenciais à continuidade operacional permanecem disponíveis
→ funcionalidades administrativas não essenciais poderão ser restringidas

SUSPENSÃO
→ período de tolerância encerrado sem regularização
→ operação normal do SaaS é suspensa
→ permanece acesso suficiente para identificação
   da situação e regularização da assinatura


Durante a tolerância parcial, a política deverá priorizar a continuidade das operações que possam afetar diretamente o funcionamento do Estabelecimento e seus Clientes.

Exemplos conceituais:

text
Agendamentos
→ permanecem disponíveis

Atendimentos
→ permanecem disponíveis

Dashboards
→ poderão ser temporariamente restringidos


A relação definitiva de funcionalidades disponíveis em cada situação deverá ser definida na implementação da jornada correspondente.

A situação comercial da assinatura não deverá armazenar diretamente uma relação de páginas ou componentes de interface bloqueados.

A separação conceitual será:

text
Situação financeira / vigência da assinatura
        ↓
Política de acesso da MotionLab
        ↓
Nível de acesso permitido
        ↓
Funcionalidades autorizadas


Dessa forma, alterações futuras na interface não exigem que a estrutura da assinatura conheça páginas, componentes ou elementos específicos do aplicativo.

A suspensão da operação do SaaS não deverá necessariamente impedir a autenticação da Rede contratante.

Deverá permanecer um nível de acesso suficiente para que o responsável possa compreender a situação da assinatura e realizar ou iniciar sua regularização.

O prazo de tolerância, as condições para entrada em tolerância parcial, as funcionalidades restringidas e as condições de suspensão e restabelecimento serão definidos como política comercial da MotionLab durante a implementação da jornada de assinatura e cobrança.

Essas regras pertencem à relação:

text
MotionLab
        ↓ fornece o SaaS
Rede contratante
        ↓ possui
Matriz e Filiais


Elas não representam políticas financeiras entre os Estabelecimentos e seus Clientes.

---

# 12. Convites e acesso

## 12.1 convite

Responsabilidade:

Permitir a criação controlada de vínculos de usuários com o MotionLab, preservando a função e o Estabelecimento para os quais o convite foi emitido.

Estrutura atual:

text
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


`role` deverá utilizar o mesmo domínio controlado de `users.role`.

Todo convite deverá estar associado a uma Rede e a um Estabelecimento pertencente a essa Rede.

Conceitualmente:

text
convite.rede_ref
→ obrigatório

convite.estabelecimento_ref
→ obrigatório

convite.estabelecimento_ref.rede_ref
→ deve corresponder a convite.rede_ref


O convite preserva:

- quem o criou;
- para qual Rede foi criado;
- para qual Estabelecimento foi criado;
- qual função será atribuída;
- quando expira;
- se já foi utilizado;
- quem o utilizou;
- quando foi utilizado.

A autorização para criação de convites deverá considerar conjuntamente:

text
quem está criando o convite
+
sua função
+
seu escopo de atuação
+
Estabelecimento de destino
+
função que será atribuída


A informação enviada pela interface não será suficiente, isoladamente, para conceder autoridade sobre outro Estabelecimento ou outra Rede.

Conceitualmente, para o MVP, a hierarquia de convites será:

text
Master/dono da Rede
├── pode convidar Gerente da Matriz
├── pode convidar Gerente das Filiais da própria Rede
└── pode convidar Colaboradores dos Estabelecimentos da própria Rede

Gerente da Matriz
├── pode convidar Gerente das Filiais vinculadas à sua Matriz
└── pode convidar Colaborador da própria Matriz

Gerente da Filial
└── pode convidar Colaborador da própria Filial


A delegação da operação aos Gerentes não retira, por si só, a autoridade administrativa do Master/dono sobre os Estabelecimentos pertencentes à sua Rede.

Essa decisão atende à realidade inicialmente prevista para o MotionLab, na qual o proprietário poderá participar diretamente da administração do negócio mesmo após delegar responsabilidades operacionais.

Caso necessidades futuras de organizações maiores exijam segregação de funções ou permissões mais granulares, o modelo de autorização poderá evoluir sem que essa complexidade seja antecipada no MVP.

O fato de um usuário poder criar convites não significa que possa atribuir qualquer função ou selecionar livremente qualquer Estabelecimento.

A jornada deverá validar a relação entre o usuário responsável pelo convite, sua autoridade, o Estabelecimento de destino e a função que será concedida.

A Matriz poderá criar o vínculo gerencial das Filiais pertencentes à sua estrutura, sem que isso signifique que o usuário responsável pelo convite pertença operacionalmente à Filial de destino.

Exemplo conceitual:

text
Gerente da Matriz
        ↓
cria convite
        ↓
Gerente da Filial
        ↓
estabelecimento_ref = Filial de destino
        ↓
rede_ref = mesma Rede da Matriz


Da mesma forma:

text
Gerente da Filial
        ↓
cria convite
        ↓
Colaborador
        ↓
estabelecimento_ref = própria Filial
        ↓
rede_ref = mesma Rede


Os valores técnicos definitivos das funções não são antecipados nesta seção.

A jornada de convite e cadastro deverá consolidar o domínio controlado compartilhado entre `convite.role` e `users.role`, bem como implementar e testar as respectivas regras de autorização e isolamento multi-tenant.
---

# 13. Disponibilidade e força de trabalho — CONCEITUAL

As estruturas desta seção foram definidas conceitualmente, mas ainda não fazem parte das 15 Collections materializadas.

## 13.1 disponibilidade_colaborador

Disponibilidade representa os períodos recorrentes em que o Colaborador normalmente pode receber Agendamentos.

Disponibilidade não significa necessariamente horário livre.

Estrutura conceitual:

text
disponibilidade_colaborador
├── colaborador_ref
├── dia_semana
├── hora_inicio
├── hora_fim
├── ativo
└── auditoria


Cada período poderá ser representado independentemente.

Exemplo:

text
segunda-feira
08:00 → 12:00

segunda-feira
14:00 → 18:00

### Relação entre disponibilidade e Agenda

A disponibilidade recorrente representa os períodos em que o Colaborador normalmente pode receber Agendamentos.

Ela não representa, isoladamente, os horários efetivamente livres.

A apuração da disponibilidade operacional deverá considerar conjuntamente:

```text
disponibilidade recorrente do Colaborador

-

eventos de força de trabalho que impeçam sua atuação

-

intervalos ocupados por itens de Serviços de Agendamentos ativos


---

## 13.2 eventos_forca_trabalho

Ausências e outros eventos excepcionais não devem modificar a disponibilidade recorrente.

Estrutura conceitual:

text
eventos_forca_trabalho
├── colaborador_ref
├── tipo_evento_ref
├── inicio
├── fim
├── observacao
└── auditoria


Os eventos permanecem historicamente registrados.



## 13.3 tipos_evento_forca_trabalho

Os tipos de evento de força de trabalho classificam ocorrências excepcionais capazes de alterar a disponibilidade habitual do Colaborador sem modificar sua configuração recorrente.

Estrutura conceitual:

text
tipos_evento_forca_trabalho
├── codigo
├── nome
├── origem
├── matriz_ref
├── ativo
└── auditoria


Valores conceituais de `origem`:

text
MOTIONLAB
MATRIZ


Tipos globais pertencem ao MotionLab.

Tipos específicos poderão ser definidos pela Matriz.

Os eventos de força de trabalho poderão reduzir ou ampliar excepcionalmente a disponibilidade do Colaborador, conforme o tipo de evento e o período registrado.

Exemplos conceituais:

text
Ausência
→ reduz a disponibilidade

Disponibilidade extraordinária
→ amplia a disponibilidade


Esses eventos não alteram a disponibilidade recorrente do Colaborador, preservando separadamente a regra habitual e suas exceções.

Conceitualmente:

text
Disponibilidade recorrente
+
Ajustes decorrentes dos eventos de força de trabalho
-
Agendamentos existentes
=
Horários livres


Horários livres não precisam ser previamente persistidos como documentos.

A relação entre `origem` e `matriz_ref` deverá obedecer às seguintes regras:

text
origem = MOTIONLAB
→ matriz_ref vazio
→ tipo de evento disponível globalmente no MotionLab

origem = MATRIZ
→ matriz_ref obrigatório
→ matriz_ref deve apontar para um Estabelecimento do tipo MATRIZ
→ tipo de evento disponível para a Matriz responsável e suas respectivas Filiais


Tipos específicos definidos por uma Matriz não deverão ser disponibilizados para Estabelecimentos pertencentes a outra Rede ou vinculados a outra Matriz.

A forma pela qual cada tipo de evento reduz ou amplia a disponibilidade deverá ser definida quando essa estrutura for materializada, de acordo com as necessidades da respectiva jornada.

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
### Origem dos indicadores operacionais

Os indicadores agregados deverão preservar a granularidade do fato de negócio que representam.

Assim:

```text
agendados
→ quantidade de Agendamentos considerados no período,
  conforme os estados definidos para o indicador

realizados
→ quantidade de Atendimentos concluídos no período

em_atendimento
→ quantidade de Atendimentos que se encontram em execução

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

text
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
 

## 18.1 Qualidade, homologação e regressão

A conclusão individual de uma jornada não significa, isoladamente, que o MVP esteja apto para produção.

Cada jornada deverá ser concluída segundo os critérios definidos neste documento, incluindo funcionalidade, persistência, autorização e isolamento multi-tenant testado.

Ao final da implementação das jornadas previstas para o MVP, o MotionLab deverá passar por uma homologação integrada antes de sua liberação para produção.

Essa homologação deverá validar o produto em seu conjunto, considerando:

- os fluxos e regras negociais;
- a integração entre as jornadas;
- a consistência dos dados;
- a autorização e o isolamento multi-tenant;
- a segurança interna;
- a segurança externa;
- os cenários que exijam validação complementar além dos testes já executados durante a implementação.

O objetivo é que a qualidade seja construída progressivamente durante o desenvolvimento, permitindo que a homologação final do MVP seja mais eficiente e concentrada na validação integrada do produto.

### 18.1.1 Incrementos corretivos e evolutivos

Após a estabilização do produto, cada incremento, seja corretivo ou evolutivo, deverá possuir critérios de aceitação e os cenários de teste necessários à sua validação.

Os cenários relacionados ao incremento constituem o escopo de sua homologação.

Os cenários de funcionalidades anteriormente homologadas não precisam ser novamente homologados a cada incremento. Eles passam a compor a suíte de regressão e deverão ser executados para verificar que a alteração não provocou danos colaterais no comportamento já estabilizado do produto.

Conceitualmente:

text
Incremento corretivo ou evolutivo
        ↓
Definição dos critérios de aceitação
        ↓
Definição e execução dos cenários do incremento
        ↓
Homologação do incremento
        +
Execução da suíte de regressão
        ↓
Validação de ausência de danos colaterais
        ↓
Incremento apto para liberação