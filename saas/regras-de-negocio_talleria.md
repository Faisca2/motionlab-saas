# Talleria — Regras de Negócio Consolidadas

> **Versão:** 0.2 (base de discussão)  
> **Data:** 17/10/2026  
> **Escopo:** Agendamento, Atendimento, Serviços, Produtos, Descontos, Abatimentos, Convites, Credenciamento e perfis.  
> **Natureza:** especificação de negócio, independente do estado de implementação.

## Política de governança das regras

- **DEFINIDA:** decisão de negócio acordada, mesmo que não implementada ou testada.
- **A DEFINIR:** comportamento, critério ou detalhe que ainda exige decisão de negócio.
- **Regra definida pode ser revista**, mas somente mediante justificativa explícita, análise de impactos nos demais domínios, compatibilidade com dados existentes, avaliação de segurança e registro da decisão no Git.
- Mudanças devem preservar o identificador da regra; registrar histórico e motivação. Evitar alterar silenciosamente regras já acordadas.
- **Implementação, testes e homologação não determinam o status da regra** e devem ser acompanhados em documentos ou tarefas separados.
- Não inferir permissões, fluxos ou cálculos que ainda não foram acordados.

## Controle de alterações

| Versão | Data | Alteração |
|---|---|---|
| 0.2 | 2026-10-17 | Consolidação orientada a negócio, com estados DEFINIDA / A DEFINIR e política de revisão criteriosa. |

---

## 1. Fundamentos e estrutura empresarial

### RN-G01 — Estrutura multi-tenant  [DEFINIDA]

A estrutura lógica é Rede → Matriz → Filiais. Os vínculos com rede e estabelecimento delimitam o contexto operacional; uma referência não é autorização por si só.

### RN-G02 — Separação entre previsão e fato  [DEFINIDA]

Agendamento registra o planejado; Atendimento registra o efetivamente executado. Divergências entre ambos são possíveis e devem ser preservadas.

### RN-G03 — Autorização no backend  [DEFINIDA]

Fluxos FlutterFlow orientam a experiência, mas Firestore Rules e Cloud Functions devem validar escopo, perfil e operações. Não confiar somente na interface.

## 2. Agendamento — Seção 7

### RN-AG01 — Natureza do agendamento  [DEFINIDA]

Representa a previsão do atendimento, com data/hora inicial, cliente, estabelecimento, serviços previstos, estado e dados de auditoria.

### RN-AG02 — Serviços e profissionais por item  [DEFINIDA]

O agendamento pode conter múltiplos itens de serviço. Cada item associa serviço, colaborador_ref e intervalo/duração prevista; não pressupor um único profissional para todo o agendamento.

### RN-AG03 — Duração e disponibilidade  [DEFINIDA]

O tempo previsto decorre das durações dos serviços e das regras aplicáveis ao profissional. A compatibilidade dos intervalos e a disponibilidade devem ser consideradas.

### RN-AG04 — Ciência do colaborador  [DEFINIDA]

Foram definidos os estados dos itens AGUARDANDO, CIENTE e CANCELADO, com registro ciente_em. Itens ativos aguardando ciência mantêm o agendamento AGUARDANDO; todos os itens ativos cientes permitem AGENDADO; confirmação do cliente conduz a CONFIRMADO. Itens cancelados não exigem ciência.

### RN-AG05 — Demais estados  [A DEFINIR]

Foram citados estados como ATENDIDO e NAO_COMPARECE; a enumeração definitiva e as transições completas exigem conferência com o modelo e implementação atuais.

### RN-AG06 — Origem do atendimento  [DEFINIDA]

Um agendamento pode originar atendimento, mas a execução real não deve ser forçada a coincidir integralmente com a previsão.

## 3. Atendimento — Seção 8

### RN-AT01 — Fato operacional  [DEFINIDA]

O atendimento registra o ocorrido, com rede_ref, estabelecimento_ref, cliente_ref, agendamento_ref opcional, itens, valores, estados e auditoria.

### RN-AT02 — Atendimento sem agendamento  [DEFINIDA]

Pode existir atendimento sem agendamento prévio. A associação a agendamento, quando presente, deve permitir rastreabilidade.

### RN-AT03 — Profissional por serviço  [DEFINIDA]

Cada ItemServicoAtendimentoStruct possui colaborador_ref. Vários profissionais podem atuar no mesmo atendimento por itens diferentes, inclusive em paralelo.

### RN-AT04 — Serviços e produtos executados  [DEFINIDA]

Itens de serviço e itens de produto são estruturas distintas (ItemServicoAtendimentoStruct e ItemProdutoAtendimentoStruct). Quantidades e valores efetivos pertencem ao atendimento.

### RN-AT05 — Estados de atendimento e itens  [DEFINIDA]

Foram discutidos estados globais ABERTO, EM_ATENDIMENTO, REALIZADO e CANCELADO; para itens, PENDENTE, EM_ATENDIMENTO, CONCLUIDO e CANCELADO. A compatibilidade com o modelo de dados deverá ser verificada antes de sua implementação.

### RN-AT06 — Eventos e histórico  [DEFINIDA]

Registrar os marcos temporais pertinentes, como iniciado_em e finalizado_em, e manter histórico/auditoria das mudanças relevantes.

### RN-AT07 — Cálculo financeiro  [DEFINIDA]

valor_total = valor_servicos + valor_produtos − desconto_itens − abatimento. Os descontos e abatimentos não podem ser deduzidos duas vezes.

## 4. Serviços

### RN-SV01 — Catálogo de serviços  [DEFINIDA]

Serviços possuem duração padrão, podendo haver habilitação por colaborador e regras específicas de execução.

### RN-SV02 — Habilitação e duração  [DEFINIDA]

O serviço oferecido e o profissional habilitado são definidos no contexto do estabelecimento; a duração planejada considera as regras aplicáveis ao colaborador.

### RN-SV03 — Comissões  [A DEFINIR]

Há previsão de comissão padrão por serviço e de regras por profissional; cálculo, exceções e momento de consolidação exigem especificação própria.

### RN-SV04 — Granularidade  [DEFINIDA]

Combinações como manicure/pedicure ou atendimento por dois profissionais podem ser representadas por itens de serviço distintos, evitando modelar um único colaborador para o atendimento inteiro.

## 5. Produtos

### RN-PR01 — Categorias de uso  [DEFINIDA]

Produtos podem ser de consumo operacional ou revenda, com tratamento compatível com estoque e faturamento.

### RN-PR02 — Itens de produto no atendimento  [DEFINIDA]

Produtos efetivamente cobrados integram itens_produto e valor_produtos; consumo interno não deve ser automaticamente confundido com venda ao cliente.

### RN-PR03 — Estoque e movimentações  [A DEFINIR]

Controle de estoque e suas movimentações estão previstos, mas regras de baixa, devolução, reservas, custos e impactos contábeis ainda dependem de especificação.

### RN-PR04 — Comissão sobre produto  [A DEFINIR]

Foi prevista comissão padrão por produto; elegibilidade, base de cálculo e apuração ainda precisam de validação.

## 6. Descontos e abatimentos

### RN-DS01 — Desconto por item  [DEFINIDA]

Descontos aplicados a itens são agregados em desconto_itens e reduzidos uma única vez do total do atendimento.

### RN-DS02 — Abatimento global  [DEFINIDA]

abatimento representa redução adicional do valor total, distinta da soma dos descontos dos itens; não deve replicar valor já descontado.

### RN-DS03 — Consistência do cálculo  [DEFINIDA]

A soma de serviços e produtos e as deduções devem preservar rastreabilidade e evitar dupla contagem.

### RN-DS04 — Política de concessão  [A DEFINIR]

Limites, percentuais, motivos obrigatórios, permissões por perfil, arredondamento, combinação de descontos e impacto sobre comissões ainda não foram fechados.

## 7. Convites

### RN-CV01 — Vinculação  [DEFINIDA]

Convite é associado ao colaborador, à rede e aos dados necessários para validar o acesso. O e-mail informado no credenciamento é o login.

### RN-CV02 — Expiração e uso  [DEFINIDA]

Convites possuem expira_em e controle de uso. Foi definida a função de expiração de três dias para o fluxo inicial; o convite não deve ser reutilizado após ativação.

### RN-CV03 — Emissão  [DEFINIDA]

A emissão por usuário autorizado envia mensagem com token e link de ativação. O fluxo atual utiliza Cloud Function emitirConviteColaborador e serviço de envio de e-mail.

### RN-CV04 — Validação  [DEFINIDA]

A função validarConviteColaborador confere token/condições e fornece os dados necessários à tela de aceite, sem autenticação prévia do convidado.

### RN-CV05 — Ativação  [DEFINIDA]

A função aceitarConviteColaborador valida token e senha, cria a identidade Firebase Auth e o registro users, associa os vínculos e finaliza o controle do convite com proteção transacional.

### RN-CV06 — Evidência de fluxo completo  [DEFINIDA]

O fluxo de negócio compreende emissão do convite, validação do token, aceite, criação da identidade, vinculação do usuário e login. O tratamento de exceções está sujeito às regras específicas de convite.

### RN-CV07 — Estados e segurança  [A DEFINIR]

Foram utilizados controle_convites e estados como DISPONIVEL, PROCESSANDO e ATIVADO; o tratamento de reenvio, concorrência, falhas parciais e recuperação exige testes adicionais.

## 8. Credenciamento e perfis

### RN-CR01 — MASTER — cadastro voluntário  [DEFINIDA]

O link “Crie sua rede” inicia cadastroPageMaster. A conta é criada com users.role = MASTER fixo. Criar rede/matriz é ato voluntário, não consequência automática de matriz_ref ausente.

### RN-CR02 — MASTER — destino  [DEFINIDA]

Login MASTER → homePageMaster. A ausência de matriz deve oferecer ação explícita de criação, sem abrir automaticamente criarMatrizModal.

### RN-CR03 — GERENTE — natureza  [DEFINIDA]

GERENTE é colaborador com poderes adicionais de gestão; uma única identidade mantém role = GERENTE. O destino inicial é homePageFilial, com atalho para homePageColaborador.

### RN-CR04 — GERENTE — filial  [DEFINIDA]

No MVP, homologar gerência de uma filial. O vínculo com filial gerenciada deve ser validado; matriz_ref não é sinônimo de filial. Futuramente, poderá selecionar outras filiais autorizadas sem mudar sua filial de atuação.

### RN-CR05 — COLABORADOR — destino  [DEFINIDA]

Login COLABORADOR → homePageColaborador. gestaoPageColaborador é página de consulta/gestão por responsável autorizado, não a home pessoal.

### RN-CR06 — ATENDENTE — destino  [A DEFINIR]

Login ATENDENTE → homePageAtendente. Funcionalidades e permissões específicas ainda serão detalhadas; não conceder acesso administrativo por ausência da página.

### RN-CR07 — CLIENTE — destino  [A DEFINIR]

Login CLIENTE → homePageCliente. Fluxo de cadastro/credenciamento e permissões de cliente ainda precisam ser especificados.

### RN-CR08 — Login por perfil  [DEFINIDA]

Após Auth Log In, ler users.role e navegar segundo o perfil. Perfil ausente ou desconhecido: encerrar sessão e retornar ao login.

### RN-CR09 — Proteção das páginas  [A DEFINIR]

A proteção deve impedir acesso de perfil não autorizado às páginas, documentos e operações, inclusive por URL direta. Os critérios de autorização detalhados serão especificados e revisados.


## Regra de Negócio — Atribuição e Gestão de Gerentes

**Módulo:** Gestão de Colaboradores e Estabelecimentos  
**Status:** Definida — implementação pendente  
**Responsável pela atribuição:** MASTER

### 1. Objetivo

Permitir que um colaborador do Talleria receba autorização para gerenciar uma ou mais filiais da mesma rede, independentemente do estabelecimento ao qual esteja vinculado profissionalmente.

### 2. Princípio fundamental

O vínculo operacional do colaborador com um estabelecimento é independente de suas responsabilidades administrativas.

Um colaborador poderá pertencer à Filial A e exercer a gerência das filiais B e C, sem necessidade de transferência de seu vínculo de origem.

A atribuição de gerência não elimina sua condição de colaborador.

### 3. Regras de atribuição

**RG-01 — Responsabilidade pela atribuição**

Somente um usuário com perfil MASTER poderá atribuir ou revogar a gerência de uma filial.

A operação será realizada no contexto da filial, por meio da gestão de colaboradores.

**RG-02 — Colaborador já credenciado**

Quando o colaborador já possuir credenciais de acesso ao Talleria, a atribuição de gerência ocorrerá sem necessidade de novo convite, senha ou conta de autenticação.

O perfil de acesso deverá refletir a condição de GERENTE.

** RG-03 — Colaborador sem credenciais**

Quando o colaborador estiver cadastrado, mas ainda não possuir credenciais de acesso, será possível atribuir-lhe a gerência e utilizar o processo existente de convite para ativação.

A autorização administrativa somente poderá ser utilizada após a ativação das credenciais.

** RG-04 — Novo colaborador**

Quando o profissional ainda não estiver cadastrado, o MASTER poderá cadastrá-lo, atribuir a responsabilidade de gerência e iniciar o processo de convite.

**RG-05 — Múltiplas gerências**

Um mesmo colaborador poderá gerenciar simultaneamente uma ou mais filiais da mesma rede.

Uma filial também poderá possuir mais de um gerente autorizado.

**RG-06 — Independência do vínculo operacional**

A atribuição ou revogação de gerência não alterará automaticamente o estabelecimento de origem do colaborador.

O vínculo operacional e as autorizações administrativas deverão ser mantidos de forma independente.

**RG-07 — Seleção do estabelecimento administrado**

Ao acessar a `homePageFilial`, o GERENTE poderá selecionar, por meio de uma combo, qualquer filial para a qual possua autorização administrativa ativa.

A combo apresentará exclusivamente os estabelecimentos autorizados ao gerente autenticado.

**RG-08 — Acesso inicial**

Após a autenticação, o usuário com perfil GERENTE será direcionado à `homePageFilial`.

O estabelecimento inicialmente apresentado deverá pertencer ao conjunto de filiais que o gerente está autorizado a administrar, independentemente de sua filial de origem.

**RG-09 — Controle de autorização**

O perfil GERENTE, isoladamente, não concede acesso administrativo a todas as filiais da rede.

Cada operação administrativa deverá respeitar as autorizações ativas do colaborador para o estabelecimento selecionado.

**RG-10 — Revogação de gerência**

O MASTER poderá revogar a autorização de gerência de uma filial sem excluir o cadastro do colaborador nem suas credenciais de acesso.

Quando todas as


## Matriz de direcionamento após login

| Perfil | Página inicial | Condição de negócio |
|---|---|---|
| MASTER | `homePageMaster` | Criação de rede voluntária. |
| GERENTE | `homePageFilial` | Filial autorizada; acesso à área pessoal. |
| COLABORADOR | `homePageColaborador` | Sem poderes de gerência implícitos. |
| ATENDENTE | `homePageAtendente` | Funcionalidades específicas a definir. |
| CLIENTE | `homePageCliente` | Credenciamento e permissões a definir. |
| Ausente/desconhecido | Logout e retorno ao login | Negar acesso. |

## Pontos a definir ou aprofundar

1. Transições completas dos estados de agendamento e atendimento.
2. Política de comissões de serviços e produtos.
3. Estoque: baixa, consumo, revenda, devolução e ajustes.
4. Descontos e abatimentos: limites, permissões, arredondamento, justificativas e reflexos em comissões.
5. Convites: reenvio, recuperação de falhas, concorrência e demais exceções.
6. GERENTE: origem do vínculo com filial e evolução futura para múltiplas gerências.
7. ATENDENTE e CLIENTE: cadastro, credenciamento, funcionalidades e permissões.
8. Matriz de autorização de páginas, documentos e operações para cada perfil.

## Rastreabilidade e revisão

Este documento reúne decisões recuperadas das conversas e da consolidação anterior. **Deve ser confrontado com `modelo-de-dados.md` e demais arquivos do repositório** antes de se tornar referência normativa definitiva. Divergências não devem ser resolvidas silenciosamente: registrar a questão, os impactos e a decisão tomada.

### Procedimento para reavaliar uma regra DEFINIDA

1. Identificar a regra pelo código e descrever o motivo da revisão.
2. Examinar os efeitos sobre dados, agendamento, atendimento, finanças, perfis, segurança e experiência do usuário, conforme aplicável.
3. Comparar a proposta com a decisão anterior e justificar ganhos e riscos.
4. Formalizar a nova decisão, atualizar a regra e registrar a alteração em commit.
5. Tratar migração de dados e testes como tarefas técnicas separadas, quando necessários.
