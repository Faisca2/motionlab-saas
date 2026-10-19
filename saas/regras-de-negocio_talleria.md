**# Talleria — Regras de Negócio Consolidadas**



\> **\*\*Versão:\*\*** 0.3 (revisão de gerência)  

\> **\*\*Data:\*\*** 17/10/2026  

\> **\*\*Escopo:\*\*** Agendamento, Atendimento, Serviços, Produtos, Descontos, Abatimentos, Convites, Credenciamento e perfis.  

\> **\*\*Natureza:\*\*** especificação de negócio, independente do estado de implementação.



**## Política de governança das regras**



\- **\*\*DEFINIDA:\*\*** decisão de negócio acordada, mesmo que não implementada ou testada.

\- **\*\*A DEFINIR:\*\*** comportamento, critério ou detalhe que ainda exige decisão de negócio.

\- **\*\*Regra definida pode ser revista\*\***, mas somente mediante justificativa explícita, análise de impactos nos demais domínios, compatibilidade com dados existentes, avaliação de segurança e registro da decisão no Git.

\- Mudanças devem preservar o identificador da regra; registrar histórico e motivação. Evitar alterar silenciosamente regras já acordadas.

\- **\*\*Implementação, testes e homologação não determinam o status da regra\*\*** e devem ser acompanhados em documentos ou tarefas separados.

\- Não inferir permissões, fluxos ou cálculos que ainda não foram acordados.



**## Controle de alterações**



\| Versão | Data | Alteração |

\|---|---|---|

\| 0.2 | 2026-10-17 | Consolidação orientada a negócio, com estados DEFINIDA / A DEFINIR e política de revisão criteriosa. |
| 0.3 | 2026-10-18 | Revisão das regras de GERENTE (RG-01 a RG-18), autorização independente de lotação, revogação e auditoria. |
| 0.4 | 2026-10-19 | Vínculo ativo único por identidade/rede; comandos CRIAR, INATIVAR e SUBSTITUIR; confirmações, concorrência e escopo pós-MVP. |



**---**



**## 1. Fundamentos e estrutura empresarial**



**### RN-G01 — Estrutura multi-tenant  [DEFINIDA]**



A estrutura lógica é Rede → Matriz → Filiais. Os vínculos com rede e estabelecimento delimitam o contexto operacional; uma referência não é autorização por si só.



**### RN-G02 — Separação entre previsão e fato  [DEFINIDA]**



Agendamento registra o planejado; Atendimento registra o efetivamente executado. Divergências entre ambos são possíveis e devem ser preservadas.



**### RN-G03 — Autorização no backend  [DEFINIDA]**



Fluxos FlutterFlow orientam a experiência, mas Firestore Rules e Cloud Functions devem validar escopo, perfil e operações. Não confiar somente na interface.



**## 2. Agendamento — Seção 7**



**### RN-AG01 — Natureza do agendamento  [DEFINIDA]**



Representa a previsão do atendimento, com data/hora inicial, cliente, estabelecimento, serviços previstos, estado e dados de auditoria.



**### RN-AG02 — Serviços e profissionais por item  [DEFINIDA]**



O agendamento pode conter múltiplos itens de serviço. Cada item associa serviço, colaborador_ref e intervalo/duração prevista; não pressupor um único profissional para todo o agendamento.



**### RN-AG03 — Duração e disponibilidade  [DEFINIDA]**



O tempo previsto decorre das durações dos serviços e das regras aplicáveis ao profissional. A compatibilidade dos intervalos e a disponibilidade devem ser consideradas.



**### RN-AG04 — Ciência do colaborador  [DEFINIDA]**



Foram definidos os estados dos itens AGUARDANDO, CIENTE e CANCELADO, com registro ciente_em. Itens ativos aguardando ciência mantêm o agendamento AGUARDANDO; todos os itens ativos cientes permitem AGENDADO; confirmação do cliente conduz a CONFIRMADO. Itens cancelados não exigem ciência.



**### RN-AG05 — Demais estados  [A DEFINIR]**



Foram citados estados como ATENDIDO e NAO_COMPARECE; a enumeração definitiva e as transições completas exigem conferência com o modelo e implementação atuais.



**### RN-AG06 — Origem do atendimento  [DEFINIDA]**



Um agendamento pode originar atendimento, mas a execução real não deve ser forçada a coincidir integralmente com a previsão.



**## 3. Atendimento — Seção 8**



**### RN-AT01 — Fato operacional  [DEFINIDA]**



O atendimento registra o ocorrido, com rede_ref, estabelecimento_ref, cliente_ref, agendamento_ref opcional, itens, valores, estados e auditoria.



**### RN-AT02 — Atendimento sem agendamento  [DEFINIDA]**



Pode existir atendimento sem agendamento prévio. A associação a agendamento, quando presente, deve permitir rastreabilidade.



**### RN-AT03 — Profissional por serviço  [DEFINIDA]**



Cada ItemServicoAtendimentoStruct possui colaborador_ref. Vários profissionais podem atuar no mesmo atendimento por itens diferentes, inclusive em paralelo.



**### RN-AT04 — Serviços e produtos executados  [DEFINIDA]**



Itens de serviço e itens de produto são estruturas distintas (ItemServicoAtendimentoStruct e ItemProdutoAtendimentoStruct). Quantidades e valores efetivos pertencem ao atendimento.



**### RN-AT05 — Estados de atendimento e itens  [DEFINIDA]**



Foram discutidos estados globais ABERTO, EM_ATENDIMENTO, REALIZADO e CANCELADO; para itens, PENDENTE, EM_ATENDIMENTO, CONCLUIDO e CANCELADO. A compatibilidade com o modelo de dados deverá ser verificada antes de sua implementação.



**### RN-AT06 — Eventos e histórico  [DEFINIDA]**



Registrar os marcos temporais pertinentes, como iniciado_em e finalizado_em, e manter histórico/auditoria das mudanças relevantes.



**### RN-AT07 — Cálculo financeiro  [DEFINIDA]**



valor_total = valor_servicos + valor_produtos − desconto_itens − abatimento. Os descontos e abatimentos não podem ser deduzidos duas vezes.



**## 4. Serviços**



**### RN-SV01 — Catálogo de serviços  [DEFINIDA]**



Serviços possuem duração padrão, podendo haver habilitação por colaborador e regras específicas de execução.



**### RN-SV02 — Habilitação e duração  [DEFINIDA]**



O serviço oferecido e o profissional habilitado são definidos no contexto do estabelecimento; a duração planejada considera as regras aplicáveis ao colaborador.



**### RN-SV03 — Comissões  [A DEFINIR]**



Há previsão de comissão padrão por serviço e de regras por profissional; cálculo, exceções e momento de consolidação exigem especificação própria.



**### RN-SV04 — Granularidade  [DEFINIDA]**



Combinações como manicure/pedicure ou atendimento por dois profissionais podem ser representadas por itens de serviço distintos, evitando modelar um único colaborador para o atendimento inteiro.



**## 5. Produtos**



**### RN-PR01 — Categorias de uso  [DEFINIDA]**



Produtos podem ser de consumo operacional ou revenda, com tratamento compatível com estoque e faturamento.



**### RN-PR02 — Itens de produto no atendimento  [DEFINIDA]**



Produtos efetivamente cobrados integram itens_produto e valor_produtos; consumo interno não deve ser automaticamente confundido com venda ao cliente.



**### RN-PR03 — Estoque e movimentações  [A DEFINIR]**



Controle de estoque e suas movimentações estão previstos, mas regras de baixa, devolução, reservas, custos e impactos contábeis ainda dependem de especificação.



**### RN-PR04 — Comissão sobre produto  [A DEFINIR]**



Foi prevista comissão padrão por produto; elegibilidade, base de cálculo e apuração ainda precisam de validação.



**## 6. Descontos e abatimentos**



**### RN-DS01 — Desconto por item  [DEFINIDA]**



Descontos aplicados a itens são agregados em desconto_itens e reduzidos uma única vez do total do atendimento.



**### RN-DS02 — Abatimento global  [DEFINIDA]**



abatimento representa redução adicional do valor total, distinta da soma dos descontos dos itens; não deve replicar valor já descontado.



**### RN-DS03 — Consistência do cálculo  [DEFINIDA]**



A soma de serviços e produtos e as deduções devem preservar rastreabilidade e evitar dupla contagem.



**### RN-DS04 — Política de concessão  [A DEFINIR]**



Limites, percentuais, motivos obrigatórios, permissões por perfil, arredondamento, combinação de descontos e impacto sobre comissões ainda não foram fechados.



**## 7. Convites**



**### RN-CV01 — Vinculação  [DEFINIDA]**



Convite é associado ao colaborador, à rede e aos dados necessários para validar o acesso. O e-mail informado no credenciamento é o login.



**### RN-CV02 — Expiração e uso  [DEFINIDA]**



Convites possuem expira_em e controle de uso. Foi definida a função de expiração de três dias para o fluxo inicial; o convite não deve ser reutilizado após ativação.



**### RN-CV03 — Emissão  [DEFINIDA]**



A emissão por usuário autorizado envia mensagem com token e link de ativação. O fluxo atual utiliza Cloud Function emitirConviteColaborador e serviço de envio de e-mail.



**### RN-CV04 — Validação  [DEFINIDA]**



A função validarConviteColaborador confere token/condições e fornece os dados necessários à tela de aceite, sem autenticação prévia do convidado.



**### RN-CV05 — Ativação  [DEFINIDA]**



A função aceitarConviteColaborador valida token e senha, cria a identidade Firebase Auth e o registro users, associa os vínculos e finaliza o controle do convite com proteção transacional.



**### RN-CV06 — Evidência de fluxo completo  [DEFINIDA]**



O fluxo de negócio compreende emissão do convite, validação do token, aceite, criação da identidade, vinculação do usuário e login. O tratamento de exceções está sujeito às regras específicas de convite.



**### RN-CV07 — Estados e segurança  [A DEFINIR]**



Foram utilizados controle_convites e estados como DISPONIVEL, PROCESSANDO e ATIVADO; o tratamento de reenvio, concorrência, falhas parciais e recuperação exige testes adicionais.



**## 8. Credenciamento e perfis**



**### RN-CR01 — MASTER — cadastro voluntário  [DEFINIDA]**



O link “Crie sua rede” inicia cadastroPageMaster. A conta é criada com users.role = MASTER fixo. Criar rede/matriz é ato voluntário, não consequência automática de matriz_ref ausente.



**### RN-CR02 — MASTER — destino  [DEFINIDA]**



Login MASTER → homePageMaster. A ausência de matriz deve oferecer ação explícita de criação, sem abrir automaticamente criarMatrizModal.



**### RN-CR03 — GERENTE — natureza  [DEFINIDA]**



GERENTE é colaborador com poderes adicionais de gestão; uma única identidade mantém role = GERENTE. O destino inicial é homePageFilial, com atalho para homePageColaborador.



**### RN-CR04 — GERENTE — filial  [DEFINIDA]**



A gerência é atribuída por filial, independentemente da lotação. O usuário poderá selecionar as filiais para as quais possua autorização válida; matriz_ref e estabelecimento de origem não concedem gerência. Ver RG-05, RG-07, RG-08 e RG-09.



**### RN-CR05 — COLABORADOR — destino  [DEFINIDA]**



Login COLABORADOR → homePageColaborador. gestaoPageColaborador é página de consulta/gestão por responsável autorizado, não a home pessoal.



**### RN-CR06 — ATENDENTE — destino  [A DEFINIR]**



Login ATENDENTE → homePageAtendente. Funcionalidades e permissões específicas ainda serão detalhadas; não conceder acesso administrativo por ausência da página.



**### RN-CR07 — CLIENTE — destino  [A DEFINIR]**



Login CLIENTE → homePageCliente. Fluxo de cadastro/credenciamento e permissões de cliente ainda precisam ser especificados.



**### RN-CR08 — Login por perfil  [DEFINIDA]**



Após Auth Log In, ler users.role e navegar segundo o perfil. Perfil ausente ou desconhecido: encerrar sessão e retornar ao login.



**### RN-CR09 — Proteção das páginas  [A DEFINIR]**



A proteção deve impedir acesso de perfil não autorizado às páginas, documentos e operações, inclusive por URL direta. Os critérios de autorização detalhados serão especificados e revisados.





**## 9. Atribuição e Gestão de Gerentes — [DEFINIDA]**

**Natureza:** regras funcionais; implementação pendente. **Autoridade:** MASTER da rede.

**RG-01 — Atribuição exclusiva pelo MASTER [DEFINIDA]**

Somente o MASTER pode conceder ou revogar a gerência. A operação é realizada no contexto da filial, a partir da homePageFilial, selecionando um colaborador elegível da mesma rede, independentemente de sua lotação.

**RG-02 — Colaborador já credenciado [DEFINIDA]**

A primeira concessão de gerência a colaborador com acesso ao Talleria atualiza seu perfil para GERENTE sem novo convite, senha ou conta. Concessões adicionais preservam o perfil.

**RG-03 — Colaborador sem credenciais [DEFINIDA]**

Pode receber gerência antes da ativação. O convite existente permite criar credenciais; o perfil é determinado pelo backend no momento do aceite, considerando autorizações válidas e elegibilidade, e nunca por role informado pela página pública.

**RG-04 — Novo colaborador [DEFINIDA]**

O MASTER pode cadastrar o colaborador, conceder gerência e emitir o convite, respeitando os requisitos de elegibilidade.

**RG-05 — Múltiplas gerências [DEFINIDA]**

Um colaborador pode gerenciar várias filiais da mesma rede; uma filial pode possuir vários gerentes.

**RG-06 — Independência da lotação [DEFINIDA]**

Concessão e revogação não modificam automaticamente colaboradores.estabelecimento_ref. A lotação operacional não implica autorização administrativa.

**RG-07 — Seleção de filiais [DEFINIDA]**

A combo da homePageFilial exibirá apenas as filiais para as quais o gerente autenticado possua autorização vigente e elegibilidade válida.

**RG-08 — Acesso inicial [DEFINIDA]**

GERENTE é direcionado à homePageFilial; o estabelecimento inicial deve ser autorizado e não necessariamente sua lotação de origem. A adequação do roteamento atual será tratada na implementação.

**RG-09 — Autorização efetiva [DEFINIDA]**

users.role = GERENTE identifica o perfil, mas não autoriza operações isoladamente. Toda operação administrativa requer autorização vigente para o colaborador autenticado e estabelecimento selecionado, rede coincidente, colaborador e filial ativos, vínculo operacional válido e conta habilitada. A verificação ocorre no backend, independentemente da interface.

**RG-10 — Revogação [DEFINIDA]**

O MASTER pode revogar gerência de uma filial sem excluir o colaborador nem suas credenciais. A revogação impede imediatamente novas operações administrativas naquela filial, inclusive durante sessão aberta. Outras gerências válidas permanecem utilizáveis. Após revogação da última, o perfil volta a COLABORADOR quando cabível.

**RG-11 — Elegibilidade e inativação do colaborador [DEFINIDA]**

Não permitir concessão a colaborador inativo. A inativação de colaborador com gerências encerra as autorizações afetadas, preserva o histórico e impede reativação automática das permissões quando o colaborador voltar a ficar ativo.

**RG-12 — Vínculo operacional e transferência [DEFINIDA]**

O exercício da gerência exige ao menos um vínculo operacional ativo na rede. Transferência entre filiais da mesma rede, com continuidade desse vínculo, preserva gerências; desligamento ou perda do último vínculo encerra gerências, sem restauração automática em novo vínculo.

**RG-13 — Inativação de filial [DEFINIDA]**

A desativação da filial encerra as gerências dessa unidade sem afetar autorizações de outras filiais. A reativação não restaura as concessões encerradas: exige nova concessão do MASTER.

**RG-14 — Duplicidade [DEFINIDA]**

Impedir duas concessões vigentes para o mesmo colaborador e filial, inclusive em operações concorrentes. Exibir: “Este colaborador já possui gerência ativa nesta filial.” Não modificar registros existentes nesse caso.

**RG-15 — Reatribuição e histórico [DEFINIDA]**

Após revogação ou encerramento, o MASTER pode conceder novamente a gerência, gerando novo período e preservando integralmente os períodos anteriores e seus responsáveis.

**RG-16 — Bloqueio temporário de acesso [DEFINIDA]**

Bloqueio temporário da conta suspende o exercício de todas as gerências sem necessariamente encerrá-las. Após desbloqueio, podem voltar a ser exercidas apenas as gerências que ainda forem válidas.

**RG-17 — Auditoria e isolamento [DEFINIDA]**

Registrar cada concessão, revogação ou encerramento, seu motivo, datas e responsáveis. Nenhuma autorização pode atravessar redes; o histórico não deve ser apagado pela revogação.

**RG-18 — Consistência entre credenciamento e gerência [DEFINIDA]**

O backend deve coordenar aceite de convite, concessões e revogações concorrentes. users.role deve convergir para as gerências válidas; divergência temporária no perfil jamais deve conceder privilégios sem autorização efetiva.

**Nota de modelagem:** coleções gerencias (autorizações vigentes) e historico_gerencias (períodos de concessão). Estrutura, campos e transações pertencem ao documento modelo-de-dados.md.

---

**## Matriz de direcionamento após login**



\| Perfil | Página inicial | Condição de negócio |

\|---|---|---|

\| MASTER | \`homePageMaster\` | Criação de rede voluntária. |

\| GERENTE | \`homePageFilial\` | Filial autorizada; acesso à área pessoal. |

\| COLABORADOR | \`homePageColaborador\` | Sem poderes de gerência implícitos. |

\| ATENDENTE | \`homePageAtendente\` | Funcionalidades específicas a definir. |

\| CLIENTE | \`homePageCliente\` | Credenciamento e permissões a definir. |

\| Ausente/desconhecido | Logout e retorno ao login | Negar acesso. |



**## Pontos a definir ou aprofundar**



1\. Transições completas dos estados de agendamento e atendimento.

2\. Política de comissões de serviços e produtos.

3\. Estoque: baixa, consumo, revenda, devolução e ajustes.

4\. Descontos e abatimentos: limites, permissões, arredondamento, justificativas e reflexos em comissões.

5\. Convites: reenvio, recuperação de falhas, concorrência e demais exceções.

6\. GERENTE: implementação e testes das autorizações por filial, sincronização de perfil, revogação e elegibilidade; múltiplas gerências já estão definidas.

7\. ATENDENTE e CLIENTE: cadastro, credenciamento, funcionalidades e permissões.

8\. Matriz de autorização de páginas, documentos e operações para cada perfil.



**## Rastreabilidade e revisão**



Este documento reúne decisões recuperadas das conversas e da consolidação anterior. **\*\*Deve ser confrontado com \`modelo-de-dados.md\` e demais arquivos do repositório\*\*** antes de se tornar referência normativa definitiva. Divergências não devem ser resolvidas silenciosamente: registrar a questão, os impactos e a decisão tomada.



**### Procedimento para reavaliar uma regra DEFINIDA**



1\. Identificar a regra pelo código e descrever o motivo da revisão.

2\. Examinar os efeitos sobre dados, agendamento, atendimento, finanças, perfis, segurança e experiência do usuário, conforme aplicável.

3\. Comparar a proposta com a decisão anterior e justificar ganhos e riscos.

4\. Formalizar a nova decisão, atualizar a regra e registrar a alteração em commit.

5\. Tratar migração de dados e testes como tarefas técnicas separadas, quando necessários.


---

## 19. Vínculos operacionais — revisão aprovada em 2026-10-19

**Estado: DEFINIDA — NÃO IMPLEMENTADA.** Esta seção complementa e, onde houver divergência, prevalece sobre RG-11 e RG-12 e sobre qualquer texto anterior que admita múltiplos vínculos operacionais simultaneamente ativos para a mesma identidade na mesma rede. Não altera registros existentes sem migração planejada.

**RV-01 — Identidade e períodos [DEFINIDA].** `users` representa identidade/autenticação; cada documento `colaboradores` representa um período de vínculo operacional com um estabelecimento. Vínculos antigos são preservados e inativados, nunca reaproveitados para representar um novo período. A mesma pessoa pode ter vários períodos históricos, porém **no máximo um vínculo operacional ativo por rede**. Antes de existir `users`, a identidade é reconhecida pelo e-mail normalizado dentro da rede.

**RV-02 — Reserva de unicidade [DEFINIDA].** A coleção técnica `vinculos_ativos` possui um documento por identidade/rede com vínculo ativo; sua existência reserva o vínculo, sem campo `status`. Criação, substituição e liberação da reserva são operações atômicas junto às alterações de `colaboradores`. Operações concorrentes não podem produzir dois vínculos ativos. A chave determinística será baseada em rede e e-mail normalizado, com codificação estável segura; algoritmo final e migração serão verificados antes da implementação.

**RV-03 — Via única de persistência [DEFINIDA].** Cada operação de negócio possui um único caminho autorizado de persistência no backend. As interfaces FlutterFlow solicitam comandos, não escrevem diretamente nas coleções protegidas. Exceções exigem justificativa, documentação e aprovação explícitas. A arquitetura pode ter múltiplas funções/handlers, mas nunca caminhos concorrentes de escrita para a mesma operação.

**RV-04 — CRIAR [DEFINIDA].** Cria exclusivamente vínculo operacional, sem emitir convite e sem criar credenciais. Valida autenticação/autorização, rede, estabelecimento, dados e identidade; reaproveita `users` existente quando aplicável. Se houver vínculo ativo, retorna `VINCULO_ATIVO_EXISTENTE` sem alterar dados. Cria `colaboradores` e `vinculos_ativos` na mesma transação. Convites e credenciais são jornadas independentes.

**RV-05 — INATIVAR [DEFINIDA].** Antes de confirmar, a interface mostra as gerências ativas e filiais afetadas. O responsável autorizado confirma expressamente. Em operação transacional, inativa o vínculo, encerra todas as gerências ligadas ao `colaborador_ref` (histórico `ENCERRADA`, motivo `INATIVACAO_COLABORADOR`), remove autorizações vigentes, libera `vinculos_ativos` e ajusta `users.role` quando cabível. A conta autenticada é preservada. Falha em qualquer alteração impede conclusão parcial.

**RV-06 — SUBSTITUIR [DEFINIDA — MVP].** Quando um cadastro na Filial B encontra vínculo ativo na Filial A, a interface apresenta origem, destino, efeitos sobre gerências e histórico; o MASTER confirma expressamente. A operação revalida autorização e estado atual, inativa o vínculo anterior, encerra suas gerências, cria **novo** documento de vínculo ativo no destino e aponta a reserva `vinculos_ativos` ao novo documento, preservando identidade/credenciais. Não herda gerências automaticamente. Se os dados relevantes mudaram desde a confirmação, interrompe sem gravar e retorna `SITUACAO_ALTERADA`; o MASTER deve revisar informações atualizadas. Se forem encontrados múltiplos vínculos ativos legados, reportar inconsistência e não corrigi-los silenciosamente.

**RV-07 — Contrato de resposta [DEFINIDA].** Códigos funcionais: `CRIADO`, `VINCULO_ATIVO_EXISTENTE`, `PERMISSAO_NEGADA`, `DADOS_INVALIDOS`, `ERRO_OPERACIONAL`, `SITUACAO_ALTERADA`; retornos adicionais específicos de inativação/substituição poderão ser refinados na implementação sem mudar regras de negócio. Os códigos não são campos de estado de `colaboradores`.

**RV-08 — Escopo pós-MVP [DEFINIDA — PÓS-MVP].** Uma jornada completa de transferência assistida entre filiais poderá permitir ao MASTER decidir individualmente quais gerências preservar ou encerrar. **Não implementar** essa seleção, suas telas ou estruturas específicas no MVP de dezembro/2026. A substituição simples do MVP encerra as gerências antigas. Esta decisão substitui a previsão anterior de preservação automática em RG-12.

**RV-09 — Revisão futura do MASTER [PENDENTE — FORA DO FOCO ATUAL].** Revisar a jornada inicial de credenciamento do MASTER e criação da rede/matriz à luz da via única de persistência, autorização, idempotência, atomicidade e recuperação de falhas. Não alterar a jornada atual nesta fase.

**RV-10 — Segurança e concorrência [DEFINIDA].** O backend obtém a identidade do solicitante do contexto autenticado, verifica autoridade e isolamento de rede, lê e valida os documentos necessários antes das gravações da transação e rejeita conflitos. Firestore Rules impedem gravações diretas não autorizadas. A confirmação da interface não substitui validação transacional.

**Nota de consistência:** a manutenção de `users.role` e o aceite de convite deverão ser compatibilizados com gerências vigentes; `users.role` sozinho não confere autoridade administrativa. Os fluxos de autenticação existentes deverão ser preservados até a substituição testada.
