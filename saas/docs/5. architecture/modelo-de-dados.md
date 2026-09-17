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
## Colaboradores, Serviços e Configurações Específicas

### Colaboradores

A entidade `colaboradores` representa as pessoas que executam serviços em um estabelecimento.

Um colaborador pode existir independentemente de possuir acesso ao MotionLab. Por esse motivo, sua associação com `users` é opcional.

Campos conceituais:

- `estabelecimento_ref`: referência ao estabelecimento;
- `user_ref`: referência opcional ao usuário do sistema;
- `nome`: nome do colaborador;
- `ativo`: indica se o colaborador está operacionalmente ativo;
- `servicos_ref`: lista de referências aos serviços que está habilitado a executar;
- campos de criação, atualização e auditoria.

A lista `servicos_ref` é mantida no colaborador para permitir consultas frequentes com baixo custo de leitura.

### Serviços

Cada serviço possui suas regras padrão, incluindo:

- preço;
- duração padrão em minutos;
- comissão padrão percentual;
- situação ativo/inativo;
- estabelecimento ao qual pertence;
- campos de criação, atualização e auditoria.

Esses valores representam a configuração padrão do serviço no estabelecimento.

### Configuração específica por colaborador e serviço

Quando determinado colaborador possuir condições diferentes do padrão de um serviço, poderá existir uma configuração específica na relação entre colaborador e serviço.

Entidade conceitual:

`colaborador_servico_config`

Campos:

- `colaborador_ref`;
- `servico_ref`;
- `ajuste_tempo_percentual`;
- `ajuste_comissao_percentual`;
- campos de criação, atualização e auditoria.

A configuração é tratada como exceção.

Na ausência de uma configuração específica, devem ser utilizadas a duração e a comissão padrão definidas no serviço.

Os ajustes de tempo e comissão são independentes.

O MotionLab executa as regras configuradas pelo gestor, mas não determina a política de remuneração ou a relação entre produtividade e comissão.

### Preservação histórica

Alterações posteriores nas configurações de serviços ou colaboradores não devem modificar fatos já ocorridos.

No registro do fato gerador deverão ser preservados os valores e regras efetivamente aplicados no momento da operação, permitindo auditoria e reconstrução histórica.       
servicos
├── preco
├── duracao_minutos
└── comissao_padrao_percentual

colaborador_servico_config
├── colaborador_ref
├── servico_ref
├── ajuste_tempo_percentual
└── ajuste_comissao_percentual  

## Disponibilidade e Força de Trabalho

### Disponibilidade do colaborador

A disponibilidade representa os períodos recorrentes em que o colaborador
normalmente pode receber agendamentos.

A disponibilidade não representa necessariamente um horário livre.

Um horário é considerado livre quando pertence à disponibilidade do colaborador
e não está ocupado por agendamento ou evento de força de trabalho.

Entidade conceitual:

`disponibilidade_colaborador`

Campos previstos:

- `colaborador_ref`: referência ao colaborador;
- `dia_semana`: dia da semana;
- `hora_inicio`: início do período;
- `hora_fim`: término do período;
- `ativo`: indica se o período está vigente;
- campos de criação, atualização e auditoria.

Cada período de disponibilidade será representado por um documento independente,
permitindo mais de um período no mesmo dia.

Exemplo:

- segunda-feira: 08:00 às 12:00;
- segunda-feira: 14:00 às 18:00.

O intervalo entre os períodos não compõe a disponibilidade.

### Eventos de força de trabalho

Ausências e outros eventos excepcionais não alteram a disponibilidade recorrente
do colaborador.

Essas ocorrências serão registradas separadamente como eventos de força de
trabalho.

Entidade conceitual:

`eventos_forca_trabalho`

Campos previstos:

- `colaborador_ref`;
- `tipo_evento_ref`;
- `inicio`;
- `fim`;
- `observacao`;
- campos de criação, atualização e auditoria.

Os eventos podem representar, entre outros:

- ausência;
- férias;
- atestado;
- treinamento;
- reunião;
- outros bloqueios da força de trabalho.

Os eventos devem permanecer registrados historicamente, permitindo auditoria
das ocorrências sem modificar a grade habitual do colaborador.

### Tipos de eventos de força de trabalho

O MotionLab possuirá tipos de eventos padronizados e permitirá que cada Matriz
cadastre tipos adicionais adequados à sua operação.

Entidade conceitual:

`tipos_evento_forca_trabalho`

Campos previstos:

- `codigo`;
- `nome`;
- `origem`: `MOTIONLAB` ou `MATRIZ`;
- `matriz_ref`: preenchido quando o tipo for específico da Matriz;
- `ativo`;
- campos de criação, atualização e auditoria.

Os tipos padrão pertencem ao MotionLab.

Tipos específicos podem ser acrescentados pela Matriz sem modificar os tipos
globais.

O cálculo da disponibilidade para agendamento não deve depender da leitura do
catálogo de tipos de eventos.

Conceitualmente:

Disponibilidade recorrente
- Eventos de força de trabalho
- Agendamentos existentes
= Horários livres para agendamento

---

## Comissão sobre produtos

Produtos destinados à revenda poderão possuir uma comissão padrão.

A comissão sobre produto será definida no próprio cadastro do produto.

Campo conceitual:

- `comissao_padrao_percentual`.

Para o MVP não haverá configuração de comissão diferenciada por
colaborador/produto.

Caso uma necessidade real seja identificada futuramente, o modelo poderá ser
evoluído para suportar exceções sem alterar a regra atual.

Essa decisão evita antecipar complexidade sem demanda comprovada.

---

## Collections legadas relacionadas a colaboradores e comissões

As collections atuais `profissional`, `prestadores` e `config_comissoes`
pertencem a versões anteriores do modelo.

Classificação atual:

- `profissional`: conceito aproveitado e evoluído para `colaboradores`;
- `prestadores`: legado;
- `config_comissoes`: legado a ser substituído pelo novo modelo.

Os conceitos existentes em `config_comissoes` serão tratados da seguinte forma:

- comissão de serviço: comissão padrão no serviço, com possibilidade de ajuste
  percentual na relação `colaborador_servico_config`;
- comissão de produto: comissão padrão no próprio produto;
- referências antigas a `barbearias` e `profissional` não serão mantidas no
  novo modelo.

As collections legadas não deverão ser removidas até que suas dependências no
FlutterFlow sejam identificadas e eliminadas.

Produto
├── preço_venda
└── comissao_padrao_percentual