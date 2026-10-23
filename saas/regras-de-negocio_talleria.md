# Talleria — Regras de Negócio Consolidadas

> **Versão:** 0.5 (consolidação da jornada GERENTE)  

> **Data:** 23/10/2026  

> **Escopo:** Agendamento, Atendimento, Serviços, Produtos, Descontos, Abatimentos, Convites, Credenciamento, Gerências e Vínculos operacionais.  

> **Natureza:** especificação de negócio, independente do estado de implementação.

## Índice navegável

- [Política de governança das regras](#governanca)
- [Controle de alterações](#alteracoes)
- [1. Fundamentos e estrutura empresarial](#fundamentos)
- [2. Agendamento](#agendamento)
- [3. Atendimento](#atendimento)
- [4. Serviços](#servicos)
- [5. Produtos](#produtos)
- [6. Descontos e abatimentos](#descontos)
- [7. Convites](#convites)
- [8. Credenciamento e perfis](#credenciamento)
- [9. Atribuição e gestão de gerentes](#gerentes)
- [10. Vínculos operacionais](#vinculos)
- [11. Matriz de direcionamento após login](#matriz-direcionamento)
- [12. Pontos a definir ou aprofundar](#pendencias)
- [13. Rastreabilidade e revisão](#rastreabilidade)

<a id="governanca"></a>

## Política de governança das regras

- **DEFINIDA:** decisão de negócio acordada, mesmo que não implementada ou testada.

- **A DEFINIR:** comportamento, critério ou detalhe que ainda exige decisão de negócio.

- **Regra definida pode ser revista**, mas somente mediante justificativa explícita, análise de impactos nos demais domínios, compatibilidade com dados existentes, avaliação de segurança e registro da decisão no Git.

- Mudanças devem preservar o identificador da regra; registrar histórico e motivação. Evitar alterar silenciosamente regras já acordadas.

- **Implementação, testes e homologação não determinam o status da regra** e devem ser acompanhados em documentos ou tarefas separados.

- Não inferir permissões, fluxos ou cálculos que ainda não foram acordados.

<a id="alteracoes"></a>

## Controle de alterações

| Versão | Data | Alteração |
|---|---|---|
| 0.2 | 2026-10-17 | Consolidação orientada a negócio, com estados DEFINIDA / A DEFINIR e política de revisão criteriosa. |
| 0.3 | 2026-10-18 | Revisão das regras de GERENTE (RG-01 a RG-18), autorização independente de lotação, revogação e auditoria. |
| 0.4 | 2026-10-19 | Vínculo ativo único por identidade/rede; comandos CRIAR, INATIVAR e SUBSTITUIR; confirmações, concorrência e escopo pós-MVP. |
| 0.5 | 2026-10-23 | Consolidação linear da jornada GERENTE: RG-01 a RG-28; convites, roteamento, competências, afastamentos; RG-12 pós-MVP; índice navegável; retirada de bloco DEF duplicado. |

---

<a id="fundamentos"></a>

## 1. Fundamentos e estrutura empresarial

### RN-G01 — Estrutura multi-tenant  [DEFINIDA]

A estrutura lógica é Rede → Matriz → Filiais. Os vínculos com rede e estabelecimento delimitam o contexto operacional; uma referência não é autorização por si só.

### RN-G02 — Separação entre previsão e fato  [DEFINIDA]

Agendamento registra o planejado; Atendimento registra o efetivamente executado. Divergências entre ambos são possíveis e devem ser preservadas.

### RN-G03 — Autorização no backend  [DEFINIDA]

Fluxos FlutterFlow orientam a experiência, mas Firestore Rules e Cloud Functions devem validar escopo, perfil e operações. Não confiar somente na interface.

<a id="agendamento"></a>

## 2. Agendamento — Seção 7

### RN-AG01 — Natureza do agendamento  [DEFINIDA]

Representa a previsão do atendimento, com data/hora inicial, cliente, estabelecimento, serviços previstos, estado e dados de auditoria.

### RN-AG02 — Serviços e profissionais por item  [DEFINIDA]

O agendamento pode conter múltiplos itens de serviço. Cada item associa serviço, colaborador_ref e intervalo/duração prevista; não pressupor um único profissional para todo o agendamento.

### RN-AG03 — Duração e disponibilidade  [DEFINIDA]

O tempo previsto decorre das durações dos serviços e das regras aplicáveis ao profissional. A compatibilidade dos intervalos e a disponibilidade devem ser consideradas.

### RN-AG04 — Ciência do colaborador  [DEFINIDA]

Foram definidos os estados dos itens AGUARDANDO, CIENTE e CANCELADO, com registro ciente_em. Itens ativos aguardando ciência mantêm o agendamento AGUARDANDO; todos os itens ativos cientes permitem AGENDADO; confirmação do cliente conduz a CONFIRMADO. Itens cancelados não exigem ciência.

### RN-AG05 — Demais estados  [A DEFINIR]

Foram citados estados como ATENDIDO e NAO_COMPARECE; a enumeração definitiva e as transições completas exigem conferência com o modelo e implementação atuais.

### RN-AG06 — Origem do atendimento  [DEFINIDA]

Um agendamento pode originar atendimento, mas a execução real não deve ser forçada a coincidir integralmente com a previsão.

<a id="atendimento"></a>

## 3. Atendimento — Seção 8

### RN-AT01 — Fato operacional  [DEFINIDA]

O atendimento registra o ocorrido, com rede_ref, estabelecimento_ref, cliente_ref, agendamento_ref opcional, itens, valores, estados e auditoria.

### RN-AT02 — Atendimento sem agendamento  [DEFINIDA]

Pode existir atendimento sem agendamento prévio. A associação a agendamento, quando presente, deve permitir rastreabilidade.

### RN-AT03 — Profissional por serviço  [DEFINIDA]

Cada ItemServicoAtendimentoStruct possui colaborador_ref. Vários profissionais podem atuar no mesmo atendimento por itens diferentes, inclusive em paralelo.

### RN-AT04 — Serviços e produtos executados  [DEFINIDA]

Itens de serviço e itens de produto são estruturas distintas (ItemServicoAtendimentoStruct e ItemProdutoAtendimentoStruct). Quantidades e valores efetivos pertencem ao atendimento.

### RN-AT05 — Estados de atendimento e itens  [DEFINIDA]

Foram discutidos estados globais ABERTO, EM_ATENDIMENTO, REALIZADO e CANCELADO; para itens, PENDENTE, EM_ATENDIMENTO, CONCLUIDO e CANCELADO. A compatibilidade com o modelo de dados deverá ser verificada antes de sua implementação.

### RN-AT06 — Eventos e histórico  [DEFINIDA]

Registrar os marcos temporais pertinentes, como iniciado_em e finalizado_em, e manter histórico/auditoria das mudanças relevantes.

### RN-AT07 — Cálculo financeiro  [DEFINIDA]

valor_total = valor_servicos + valor_produtos − desconto_itens − abatimento. Os descontos e abatimentos não podem ser deduzidos duas vezes.

<a id="servicos"></a>

## 4. Serviços

### RN-SV01 — Catálogo de serviços  [DEFINIDA]

Serviços possuem duração padrão, podendo haver habilitação por colaborador e regras específicas de execução.

### RN-SV02 — Habilitação e duração  [DEFINIDA]

O serviço oferecido e o profissional habilitado são definidos no contexto do estabelecimento; a duração planejada considera as regras aplicáveis ao colaborador.

### RN-SV03 — Comissões  [A DEFINIR]

Há previsão de comissão padrão por serviço e de regras por profissional; cálculo, exceções e momento de consolidação exigem especificação própria.

### RN-SV04 — Granularidade  [DEFINIDA]

Combinações como manicure/pedicure ou atendimento por dois profissionais podem ser representadas por itens de serviço distintos, evitando modelar um único colaborador para o atendimento inteiro.

<a id="produtos"></a>

## 5. Produtos

### RN-PR01 — Categorias de uso  [DEFINIDA]

Produtos podem ser de consumo operacional ou revenda, com tratamento compatível com estoque e faturamento.

### RN-PR02 — Itens de produto no atendimento  [DEFINIDA]

Produtos efetivamente cobrados integram itens_produto e valor_produtos; consumo interno não deve ser automaticamente confundido com venda ao cliente.

### RN-PR03 — Estoque e movimentações  [A DEFINIR]

Controle de estoque e suas movimentações estão previstos, mas regras de baixa, devolução, reservas, custos e impactos contábeis ainda dependem de especificação.

### RN-PR04 — Comissão sobre produto  [A DEFINIR]

Foi prevista comissão padrão por produto; elegibilidade, base de cálculo e apuração ainda precisam de validação.

<a id="descontos"></a>

## 6. Descontos e abatimentos

### RN-DS01 — Desconto por item  [DEFINIDA]

Descontos aplicados a itens são agregados em desconto_itens e reduzidos uma única vez do total do atendimento.

### RN-DS02 — Abatimento global  [DEFINIDA]

abatimento representa redução adicional do valor total, distinta da soma dos descontos dos itens; não deve replicar valor já descontado.

### RN-DS03 — Consistência do cálculo  [DEFINIDA]

A soma de serviços e produtos e as deduções devem preservar rastreabilidade e evitar dupla contagem.

### RN-DS04 — Política de concessão  [A DEFINIR]

Limites, percentuais, motivos obrigatórios, permissões por perfil, arredondamento, combinação de descontos e impacto sobre comissões ainda não foram fechados.

<a id="convites"></a>

## 7. Convites

### RN-CV01 — Vinculação  [DEFINIDA]

Convite é associado ao colaborador, à rede e aos dados necessários para validar o acesso. O e-mail informado no credenciamento é o login.

### RN-CV02 — Expiração e uso  [DEFINIDA]

Convites possuem expira_em e controle de uso. Foi definida a função de expiração de três dias para o fluxo inicial; o convite não deve ser reutilizado após ativação.

### RN-CV03 — Emissão  [DEFINIDA]

A emissão por usuário autorizado envia mensagem com token e link de ativação. O fluxo atual utiliza Cloud Function emitirConviteColaborador e serviço de envio de e-mail.

### RN-CV04 — Validação  [DEFINIDA]

A função validarConviteColaborador confere token/condições e fornece os dados necessários à tela de aceite, sem autenticação prévia do convidado.

### RN-CV05 — Ativação  [DEFINIDA]

A função aceitarConviteColaborador valida token e senha, cria a identidade Firebase Auth e o registro users, associa os vínculos e finaliza o controle do convite com proteção transacional.

### RN-CV06 — Evidência de fluxo completo  [DEFINIDA]

O fluxo de negócio compreende emissão do convite, validação do token, aceite, criação da identidade, vinculação do usuário e login. O tratamento de exceções está sujeito às regras específicas de convite.

### RN-CV07 — Estados e segurança  [A DEFINIR]

Foram utilizados controle_convites e estados como DISPONIVEL, PROCESSANDO e ATIVADO; o tratamento de reenvio, concorrência, falhas parciais e recuperação exige testes adicionais.

<a id="credenciamento"></a>

## 8. Credenciamento e perfis

### RN-CR01 — MASTER — cadastro voluntário  [DEFINIDA]

O link “Crie sua rede” inicia cadastroPageMaster. A conta é criada com users.role = MASTER fixo. Criar rede/matriz é ato voluntário, não consequência automática de matriz_ref ausente.

### RN-CR02 — MASTER — destino  [DEFINIDA]

Login MASTER → homePageMaster. A ausência de matriz deve oferecer ação explícita de criação, sem abrir automaticamente criarMatrizModal.

### RN-CR03 — GERENTE — natureza  [DEFINIDA]

GERENTE é colaborador com poderes adicionais de gestão; uma única identidade mantém role = GERENTE. O destino inicial é homePageFilial quando houver gerência em exercício, com atalho para homePageColaborador. Se todas estiverem afastadas, usar homePageColaborador sem conceder gestão. Ver RG-08 e RG-24.

### RN-CR04 — GERENTE — filial  [DEFINIDA]

A gerência é atribuída por filial, independentemente da lotação. O usuário poderá selecionar as filiais para as quais possua autorização válida; matriz_ref e estabelecimento de origem não concedem gerência. Ver RG-05, RG-07, RG-08 e RG-09.

### RN-CR05 — COLABORADOR — destino  [DEFINIDA]

Login COLABORADOR → homePageColaborador. gestaoPageColaborador é página de consulta/gestão por responsável autorizado, não a home pessoal.

### RN-CR06 — ATENDENTE — destino  [A DEFINIR]

Login ATENDENTE → homePageAtendente. Funcionalidades e permissões específicas ainda serão detalhadas; não conceder acesso administrativo por ausência da página.

### RN-CR07 — CLIENTE — destino  [A DEFINIR]

Login CLIENTE → homePageCliente. Fluxo de cadastro/credenciamento e permissões de cliente ainda precisam ser especificados.

### RN-CR08 — Login por perfil  [DEFINIDA]

Após Auth Log In, ler users.role e validar as autorizações efetivas antes de navegar. Para GERENTE afastado de todas as filiais, seguir RG-08/RG-24. Perfil ausente ou desconhecido: encerrar sessão e retornar ao login.

### RN-CR09 — Proteção das páginas  [A DEFINIR]

A proteção deve impedir acesso de perfil não autorizado às páginas, documentos e operações, inclusive por URL direta. Os critérios de autorização detalhados serão especificados e revisados.

**

---

<a id="gerentes"></a>

## 9. Atribuição e gestão de gerentes — [DEFINIDA]

**Natureza:** regras de negócio aprovadas, independentes da implementação. **Autoridade de concessão e revogação:** MASTER da rede. A autorização administrativa é distinta da identidade, do vínculo operacional e do credenciamento.

### 9.1. Natureza, atribuição e credenciamento

#### RG-01 — Atribuição exclusiva pelo MASTER [DEFINIDA]
Somente o MASTER pode conceder ou revogar gerência, no contexto de uma filial de sua rede. O colaborador elegível pode ter lotação operacional em outra filial da mesma rede. Um GERENTE não concede nem revoga gerências.

#### RG-02 — Colaborador já credenciado [DEFINIDA]
GERENTE é um colaborador com atribuições administrativas, não uma segunda identidade nem um segundo vínculo operacional. Pode também prestar serviços. A primeira concessão a usuário credenciado atualiza `users.role` para `GERENTE`, preservando conta, senha e vínculo; concessões posteriores mantêm o perfil. A atribuição é registrada em `gerencias` e auditada em `historico_gerencias`.

#### RG-03 — Colaborador sem credenciais [DEFINIDA — REVISADA EM 2026-10-23]
A gerência pode ser concedida antes da ativação da conta. O credenciamento por convite de GERENTE não confere acesso antes do aceite. O backend determina o perfil e as filiais efetivamente autorizadas no aceite, nunca por `role` informado na página pública. O convite pode ser reenviado sem recriar a atribuição; falha de envio não deve deixar concessão ou credenciamento inconsistentes. A revogação integral invalida convite pendente de GERENTE (RG-20); revogação parcial preserva o convite apenas se subsistir gerência vigente (RG-21).

#### RG-04 — Novo colaborador [DEFINIDA]
O MASTER pode cadastrar colaborador elegível, conceder sua primeira gerência e iniciar o convite correspondente. `CRIAR` cria o vínculo operacional; concessão administrativa e emissão de convite são operações de negócio distintas, cada uma com seu caminho autorizado de persistência.

### 9.2. Exercício e autorização por filial

#### RG-05 — Múltiplas gerências [DEFINIDA]
Uma identidade pode possuir várias gerências na mesma rede; uma filial pode ter mais de um GERENTE. Cada atribuição administrativa é específica de uma filial.

#### RG-06 — Independência da lotação [DEFINIDA]
A concessão, revogação ou suspensão administrativa não altera automaticamente `colaboradores.estabelecimento_ref`. A lotação operacional não concede poderes de gestão. O GERENTE presta serviços em seu estabelecimento operacional e pode administrar outras filiais autorizadas.

#### RG-07 — Seleção de filiais [DEFINIDA — REVISADA EM 2026-10-23]
A seleção em `homePageFilial` exibe apenas filiais com autorização administrativa efetiva. Se houver mais de uma, prioriza a última filial acessada, desde que permaneça autorizada; caso contrário, seleciona outra filial por critério determinístico a especificar na modelagem. A troca de filial não exige novo login.

#### RG-08 — Acesso inicial [DEFINIDA — REVISADA EM 2026-10-23]
O `authRouterPage` direciona GERENTE com pelo menos uma atribuição em exercício à `homePageFilial` de filial autorizada, independentemente de sua lotação. A área administrativa oferece acesso à `homePageColaborador` e retorno. Se todas as atribuições estiverem suspensas por afastamento, mas houver vínculo operacional ativo, o destino é `homePageColaborador`, embora `users.role` permaneça `GERENTE`. Sem autorização efetiva, nunca abrir uma filial administrativa apenas pelo perfil.

#### RG-09 — Autorização efetiva [DEFINIDA]
`users.role = GERENTE` identifica o perfil, mas não autoriza operações isoladamente. Toda operação administrativa exige autorização vigente e em exercício para a filial selecionada, rede coincidente, filial e colaborador elegíveis e ativos, vínculo operacional válido e conta habilitada. A verificação ocorre no backend, inclusive em sessão já aberta e considerando afastamentos programados.

### 9.3. Revogação, elegibilidade e consistência

#### RG-10 — Revogação [DEFINIDA — REVISADA EM 2026-10-23]
O MASTER pode revogar uma gerência por filial, com efeito imediato sobre novas operações; as demais gerências e o vínculo operacional são preservados. Revogada a última gerência, `users.role` passa a `COLABORADOR` quando houver identidade e vínculo operacional ativos, com consistência transacional, e `authRouterPage` direciona à área pessoal. A revogação não exclui credenciais.

#### RG-11 — Elegibilidade e inativação do colaborador [DEFINIDA]
Não conceder gerência a vínculo operacional inativo. A inativação operacional autorizada encerra todas as gerências do colaborador, preserva histórico e impede restauração automática em eventual novo vínculo. GERENTE não pode inativar outro colaborador com qualquer gerência vigente nem inativar a si próprio; tais operações competem exclusivamente ao MASTER.

#### RG-12 — Transferência entre filiais com preservação de gerências [DEFINIDA — PÓS-MVP; REVISADA EM 2026-10-23]
A futura jornada de transferência assistida de colaborador entre filiais da mesma rede poderá preservar atribuições administrativas de GERENTE, mantendo identidade, integridade das autorizações e histórico. **Não faz parte do MVP de dezembro de 2026.** Não confundir com a substituição simples `SUBSTITUIR` (RV-06), que encerra gerências antigas e não as herda automaticamente. A seleção e preservação de gerências na transferência assistida exigem refinamento e modelagem pós-MVP.

#### RG-13 — Inativação de filial [DEFINIDA]
A desativação de filial encerra suas gerências sem afetar as de outras filiais. A reativação não restaura concessões encerradas: exige nova concessão pelo MASTER.

#### RG-14 — Duplicidade [DEFINIDA]
Impedir duas concessões vigentes para o mesmo colaborador e filial, inclusive sob concorrência. Retornar a mensagem funcional “Este colaborador já possui gerência ativa nesta filial.” sem modificar os registros existentes.

#### RG-15 — Reatribuição e histórico [DEFINIDA]
Após revogação ou encerramento, o MASTER pode conceder novamente a gerência, abrindo novo período e preservando os anteriores, com responsáveis, datas e motivos.

#### RG-16 — Bloqueio temporário de acesso [DEFINIDA]
O bloqueio temporário da conta suspende o exercício de todas as gerências sem necessariamente encerrá-las. Após desbloqueio, apenas gerências ainda válidas e não afastadas poderão ser exercidas. Bloqueio de conta e afastamento administrativo são eventos distintos.

#### RG-17 — Auditoria e isolamento [DEFINIDA]
Registrar concessões, revogações, encerramentos, afastamentos e retornos com motivo, datas e responsáveis em `historico_gerencias`. Nenhuma autorização atravessa redes; histórico não é apagado por revogação.

#### RG-18 — Consistência entre credenciamento e gerência [DEFINIDA]
O backend coordena concessões, revogações, aceite de convites e atualização de `users.role`, inclusive sob concorrência. Divergência temporária no perfil jamais autoriza operações sem gerência efetiva. Cada operação utiliza via única autorizada de persistência, com validação transacional e auditoria.

### 9.4. Competências de gestão operacional e convites

#### RG-19 — Gestão operacional pelo GERENTE [DEFINIDA — 2026-10-23]
Nas filiais em que esteja efetivamente em exercício, o GERENTE pode solicitar `CRIAR`, `INATIVAR` e administrar colaboradores operacionais, independentemente de sua lotação, respeitadas as restrições de RG-11 e as validações do backend. Não pode conceder nem revogar gerências.

#### RG-20 — Revogação integral com convite pendente [DEFINIDA — 2026-10-23]
Se todas as gerências forem revogadas antes do aceite do convite de GERENTE, o convite pendente perde validade e qualquer aceite posterior deve ser recusado. Eventual credenciamento como COLABORADOR exige novo convite.

#### RG-21 — Revogação parcial com convite pendente [DEFINIDA — 2026-10-23]
Se ao menos uma gerência válida permanecer após revogação parcial, o convite de GERENTE pode permanecer válido. No aceite, o acesso abrange somente filiais efetivamente autorizadas.

#### RG-22 — Competência para credenciar colaboradores [DEFINIDA — 2026-10-23]
O GERENTE em exercício responde pelo credenciamento de colaboradores comuns das filiais que administra. O MASTER credencia GERENTES e só credencia colaboradores comuns de forma excepcional, quando a filial não possuir GERENTE responsável ou nenhum dos GERENTES responsáveis estiver em exercício. Havendo pelo menos um GERENTE em exercício, cabe a ele o credenciamento comum. A verificação da exceção é feita pelo backend.

#### RG-23 — Autoridade administrativa do MASTER [DEFINIDA — 2026-10-23]
O MASTER pode administrar estabelecimentos de sua rede sem documento `gerencias`, mantendo `users.role = MASTER`. A competência excepcional de credenciamento de colaboradores comuns continua sujeita à RG-22.

### 9.5. Afastamento administrativo

#### RG-24 — Afastamento temporário [DEFINIDA — 2026-10-23]
Afastamento suspende poderes administrativos da atribuição afetada sem revogá-la e sem inativar vínculo operacional. `users.role` permanece `GERENTE`. Na ausência de qualquer filial em exercício, o usuário com vínculo operacional ativo acessa somente `homePageColaborador`.

#### RG-25 — Afastamento individual por filial [DEFINIDA — 2026-10-23]
Afastamento pode atingir uma ou mais filiais individualmente. Gerências não afastadas continuam disponíveis, desde que cumpram as demais condições de autorização.

#### RG-26 — Autoridade para afastar e retornar [DEFINIDA — 2026-10-23]
Somente o MASTER pode registrar início e término do afastamento administrativo, com auditoria em `historico_gerencias`.

#### RG-27 — Retorno condicionado à confirmação [DEFINIDA — 2026-10-23]
A data prevista de término do afastamento não restabelece poderes automaticamente. O retorno exige confirmação expressa do MASTER.

#### RG-28 — Início programado de afastamento [DEFINIDA — 2026-10-23]
O MASTER pode agendar afastamento para data e hora futuras. A partir do instante programado, o backend deve negar automaticamente novas operações administrativas da atribuição afetada, mesmo em sessão aberta, independentemente de rotina agendada ou nova navegação. O retorno permanece sujeito à RG-27.

**Nota de modelagem:** `gerencias` representa atribuições administrativas; `historico_gerencias` preserva períodos e eventos. Estruturas, campos, regras de concorrência e transações devem ser confrontados com `modelo-de-dados.md` na etapa REFINAR/MODELAR. As regras acima não comprovam implementação.

---

<a id="vinculos"></a>

## 10. Vínculos operacionais — revisão aprovada em 2026-10-19
**Estado: DEFINIDA — implementação parcial a verificar.** Esta seção complementa as regras de vínculos operacionais e prevalece sobre textos anteriores que admitam múltiplos vínculos simultaneamente ativos para a mesma identidade na rede. A RG-12 trata exclusivamente da transferência assistida pós-MVP. Não altera registros existentes sem migração planejada.

**RV-01 — Identidade e períodos [DEFINIDA].** `users` representa identidade/autenticação; cada documento `colaboradores` representa um período de vínculo operacional com um estabelecimento. Vínculos antigos são preservados e inativados, nunca reaproveitados para representar um novo período. A mesma pessoa pode ter vários períodos históricos, porém **no máximo um vínculo operacional ativo por rede**. Antes de existir `users`, a identidade é reconhecida pelo e-mail normalizado dentro da rede.

**RV-02 — Reserva de unicidade [DEFINIDA].** A coleção técnica `vinculos_ativos` possui um documento por identidade/rede com vínculo ativo; sua existência reserva o vínculo, sem campo `status`. Criação, substituição e liberação da reserva são operações atômicas junto às alterações de `colaboradores`. Operações concorrentes não podem produzir dois vínculos ativos. A chave determinística será baseada em rede e e-mail normalizado, com codificação estável segura; algoritmo final e migração serão verificados antes da implementação.

**RV-03 — Via única de persistência [DEFINIDA].** Cada operação de negócio possui um único caminho autorizado de persistência no backend. As interfaces FlutterFlow solicitam comandos, não escrevem diretamente nas coleções protegidas. Exceções exigem justificativa, documentação e aprovação explícitas. A arquitetura pode ter múltiplas funções/handlers, mas nunca caminhos concorrentes de escrita para a mesma operação.

**RV-04 — CRIAR [DEFINIDA].** Cria exclusivamente vínculo operacional, sem emitir convite e sem criar credenciais. Valida autenticação/autorização, rede, estabelecimento, dados e identidade; reaproveita `users` existente quando aplicável. Se houver vínculo ativo, retorna `VINCULO_ATIVO_EXISTENTE` sem alterar dados. Cria `colaboradores` e `vinculos_ativos` na mesma transação. Convites e credenciais são jornadas independentes.

**RV-05 — INATIVAR [DEFINIDA].** Antes de confirmar, a interface mostra as gerências ativas e filiais afetadas. O responsável autorizado confirma expressamente. Em operação transacional, inativa o vínculo, encerra todas as gerências ligadas ao `colaborador_ref` (histórico `ENCERRADA`, motivo `INATIVACAO_COLABORADOR`), remove autorizações vigentes, libera `vinculos_ativos` e ajusta `users.role` quando cabível. A conta autenticada é preservada. Falha em qualquer alteração impede conclusão parcial.

**RV-06 — SUBSTITUIR simples [DEFINIDA — MVP previsto; implementação a verificar].** Quando um cadastro na Filial B encontra vínculo ativo na Filial A, a interface apresenta origem, destino, efeitos sobre gerências e histórico; o MASTER confirma expressamente. A operação revalida autorização e estado atual, inativa o vínculo anterior, encerra suas gerências, cria **novo** documento de vínculo ativo no destino e aponta a reserva `vinculos_ativos` ao novo documento, preservando identidade/credenciais. Não herda gerências automaticamente. Se os dados relevantes mudaram desde a confirmação, interrompe sem gravar e retorna `SITUACAO_ALTERADA`; o MASTER deve revisar informações atualizadas. Se forem encontrados múltiplos vínculos ativos legados, reportar inconsistência e não corrigi-los silenciosamente.

**RV-07 — Contrato de resposta [DEFINIDA].** Códigos funcionais: `CRIADO`, `VINCULO_ATIVO_EXISTENTE`, `PERMISSAO_NEGADA`, `DADOS_INVALIDOS`, `ERRO_OPERACIONAL`, `SITUACAO_ALTERADA`; retornos adicionais específicos de inativação/substituição poderão ser refinados na implementação sem mudar regras de negócio. Os códigos não são campos de estado de `colaboradores`.

**RV-08 — Transferência assistida [DEFINIDA — PÓS-MVP].** Uma jornada completa de transferência assistida entre filiais poderá permitir ao MASTER preservar atribuições de gerência, conforme RG-12, com decisões específicas a refinar no pós-MVP. **Não implementar** essa seleção, suas telas ou estruturas específicas no MVP de dezembro/2026. A substituição simples do MVP encerra as gerências antigas. A substituição simples RV-06 não preserva gerências; a RG-12 permanece válida para a jornada assistida pós-MVP.

**RV-09 — Revisão futura do MASTER [PENDENTE — FORA DO FOCO ATUAL].** Revisar a jornada inicial de credenciamento do MASTER e criação da rede/matriz à luz da via única de persistência, autorização, idempotência, atomicidade e recuperação de falhas. Não alterar a jornada atual nesta fase.

**RV-10 — Segurança e concorrência [DEFINIDA].** O backend obtém a identidade do solicitante do contexto autenticado, verifica autoridade e isolamento de rede, lê e valida os documentos necessários antes das gravações da transação e rejeita conflitos. Firestore Rules impedem gravações diretas não autorizadas. A confirmação da interface não substitui validação transacional.

**Nota de consistência:** a manutenção de `users.role` e o aceite de convite deverão ser compatibilizados com gerências vigentes; `users.role` sozinho não confere autoridade administrativa. Os fluxos de autenticação existentes deverão ser preservados até a substituição testada.

---

<a id="matriz-direcionamento"></a>

## 11. Matriz de direcionamento após login

| Perfil | Página inicial | Condição de negócio |
|---|---|---|
| MASTER | \\`homePageMaster\\` | Criação de rede voluntária. |
| GERENTE | \\`homePageFilial\\` | Filial autorizada; acesso à área pessoal. |
| COLABORADOR | \\`homePageColaborador\\` | Sem poderes de gerência implícitos. |
| ATENDENTE | \\`homePageAtendente\\` | Funcionalidades específicas a definir. |
| CLIENTE | \\`homePageCliente\\` | Credenciamento e permissões a definir. |
| Ausente/desconhecido | Logout e retorno ao login | Negar acesso. |

<a id="pendencias"></a>

## 12. Pontos a definir ou aprofundar

1\\. Transições completas dos estados de agendamento e atendimento.

2\\. Política de comissões de serviços e produtos.

3\\. Estoque: baixa, consumo, revenda, devolução e ajustes.

4\\. Descontos e abatimentos: limites, permissões, arredondamento, justificativas e reflexos em comissões.

5\\. Convites: reenvio, recuperação de falhas, concorrência e demais exceções.

6\\. GERENTE: implementação e testes das autorizações por filial, sincronização de perfil, revogação e elegibilidade; múltiplas gerências já estão definidas.

7\\. ATENDENTE e CLIENTE: cadastro, credenciamento, funcionalidades e permissões.

8\\. Matriz de autorização de páginas, documentos e operações para cada perfil.

<a id="rastreabilidade"></a>

## 13. Rastreabilidade e revisão

Este documento reúne decisões recuperadas das conversas e da consolidação anterior. **Deve ser confrontado com \\`modelo-de-dados.md\\` e demais arquivos do repositório** antes de se tornar referência normativa definitiva. Divergências não devem ser resolvidas silenciosamente: registrar a questão, os impactos e a decisão tomada.

**
### Registro de conciliação — 23/10/2026

- **RG-03:** o aceite de convite de GERENTE depende de atribuições vigentes; revogação total invalida o convite (RG-20), parcial preserva apenas com gerência remanescente (RG-21).
- **RG-08 e RN-CR08:** `users.role` não substitui autorização efetiva; afastamento total direciona à área pessoal, preservando perfil GERENTE.
- **RG-12:** preservada como **DEFINIDA — PÓS-MVP** para transferência assistida com possível preservação de gerências. `SUBSTITUIR` simples (RV-06) é diferente e encerra as gerências antigas.
- **RV-06/RV-08:** a substituição simples está prevista no MVP; transferência assistida com preservação de gerências está fora do MVP. Nenhuma implementação adicional é autorizada por esta consolidação.
- **DEF-01 a DEF-24:** definições de 23/10/2026 incorporadas nas regras RG e RN-CR pertinentes; o bloco independente foi retirado para evitar dupla fonte normativa.

### Procedimento para reavaliar uma regra DEFINIDA

1\\. Identificar a regra pelo código e descrever o motivo da revisão.

2\\. Examinar os efeitos sobre dados, agendamento, atendimento, finanças, perfis, segurança e experiência do usuário, conforme aplicável.

3\\. Comparar a proposta com a decisão anterior e justificar ganhos e riscos.

4\\. Formalizar a nova decisão, atualizar a regra e registrar a alteração em commit.

5\\. Tratar migração de dados e testes como tarefas técnicas separadas, quando necessários.

---
