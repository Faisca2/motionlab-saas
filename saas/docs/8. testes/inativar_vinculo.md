# Talleria — Evidência de Teste TE-03

**Módulo:** Gestão de vínculos de colaboradores  
**Teste:** TE-03 — Inativação de vínculo de colaborador  
**Data de execução:** 22/10/2026  
**Ambiente:** Desenvolvimento — FlutterFlow / Firebase  
**Executor:** Equipe de desenvolvimento Talleria  
**Situação:** Execução realizada — consolidação de evidências pendente

---

## 1. Objetivo

Validar o processo de inativação de vínculo de colaborador pela interface do Talleria, utilizando o comando `INATIVAR` da Cloud Function `gerenciarVinculoColaborador`.

O teste também verifica o comportamento da função diante de tentativas repetidas de inativação e inconsistências cadastrais, especialmente quanto à identificação da rede, à correspondência da reserva do vínculo ativo e à preservação da integridade dos dados.

## 2. Cenário de teste

**Rede/Matriz:** Matriz 01 0710  
**Ambiente operacional:** Filiais vinculadas à matriz  
**Operação:** `INATIVAR`  
**Cloud Function:** `gerenciarVinculoColaborador`

Foram utilizados dois colaboradores com características distintas:

| Colaborador | Condição inicial relevante |
|---|---|
| Raimundo | Colaborador cadastrado pelo comando `CRIAR` da implementação atual |
| Leonardo | Colaborador cadastrado pelo fluxo anterior, com inconsistências identificadas nos dados relacionados ao vínculo |

A utilização desses registros permitiu avaliar tanto o caminho de sucesso quanto a resposta da função diante de dados inconsistentes.

## 3. Execução e evidências

### EV-TE03-01 — Disponibilização da operação de inativação

Na página `gestaoPageColaborador`, foi disponibilizada a opção **Inativar colaborador**, acompanhada de diálogo de confirmação.

A operação foi integrada à Cloud Function `gerenciarVinculoColaborador`, utilizando o comando `INATIVAR`.

**Resultado:** Operação disponibilizada na interface.

**Evidência:** Captura da página de gestão e do diálogo de confirmação — anexação pendente.

### EV-TE03-02 — Inativação válida de Raimundo

Foi executado o comando `INATIVAR` para Raimundo, cadastrado anteriormente pelo fluxo atual de criação de vínculo.

A operação retornou resultado de sucesso.

**Resultado:** Inativação concluída.

**Evidência:** Resultado observado durante os testes. Pendente consolidar captura da resposta e conferência documental dos registros alterados no Firestore.

### EV-TE03-03 — Repetição da inativação de Raimundo

Após a inativação, foi realizada nova tentativa de executar o mesmo comando para Raimundo.

A função identificou que o vínculo já estava inativo e recusou a repetição da operação.

**Resultado:** Tentativa repetida controlada corretamente.

**Evidência:** Resultado observado durante os testes. Pendente anexar captura da resposta.

### EV-TE03-04 — Tentativa de inativação de Leonardo

Foi executado o comando `INATIVAR` para Leonardo.

A função identificou inconsistências nos dados necessários à validação do vínculo e não concluiu a inativação.

Durante a investigação, foram observadas divergências envolvendo referências de rede e a identificação da reserva na coleção `vinculos_ativos`.

**Resultado:** Operação bloqueada diante de inconsistências.

**Evidência:** Mensagem apresentada pela aplicação e registros de diagnóstico da Cloud Function.

### EV-TE03-05 — Diagnóstico da reserva do vínculo ativo

Foi acrescentado temporariamente um registro de diagnóstico para verificar a identificação e a localização da reserva correspondente a Leonardo.

**Dados observados:**

| Campo | Valor observado |
|---|---|
| Colaborador | Leonardo |
| E-mail | `leo@gmail.com` |
| Referência esperada | `colaboradores/DykC8K7mRuw75ZyqZkzh` |
| Coleção da reserva | `vinculos_ativos` |
| `reservaEncontrada` | `false` |
| `colaboradorNaReserva` | `null` |

O identificador calculado pela função não correspondeu ao identificador existente para a reserva examinada.

Foi identificada uma diferença de caractere no prefixo associado ao identificador da rede, envolvendo `I` maiúsculo e `l` minúsculo.

A função retornou a mensagem:

> A reserva do vínculo ativo não corresponde ao colaborador.

**Resultado:** Reserva não localizada pelo identificador calculado; operação recusada.

**Evidência:** Log `DIAGNOSTICO_RESERVA` e consulta ao Firestore realizados durante a investigação. Pendente consolidar as capturas como anexos.

### EV-TE03-06 — Preservação do vínculo diante da inconsistência

Após a tentativa de inativação de Leonardo, foi observado que o colaborador permanecia ativo.

A função não prosseguiu com a inativação após detectar a inconsistência.

**Resultado:** Vínculo preservado no cenário observado.

**Evidência:** Consulta ao documento do colaborador no Firestore. Pendente anexar a captura correspondente.

## 4. Análise da ocorrência

A investigação identificou inconsistências nos dados associados ao colaborador Leonardo e à sua reserva de vínculo ativo.

Leonardo foi cadastrado por um fluxo anterior à implementação do comando `CRIAR`, durante uma etapa em que o processo de cadastro e credenciamento passou por diversos refatoramentos e alterações conceituais.

Embora a reserva tenha sido criada manualmente, parte de seus dados foi obtida por cópia de registros gerados pelo fluxo anterior.

Portanto, não é adequado atribuir a inconsistência exclusivamente à criação manual da reserva.

Também não há evidência suficiente para atribuir o problema à implementação atual do comando `CRIAR`.

**Decisão técnica:** não investigar retrospectivamente o fluxo legado, considerando sua substituição e as mudanças arquiteturais posteriores.

Os dados legados necessários aos testes deverão ser regularizados de maneira controlada, sem modificar as regras de integridade para acomodar registros inconsistentes.

O comportamento observado da Cloud Function foi adequado aos cenários executados: diante da ausência ou incompatibilidade da reserva esperada, a operação foi recusada.

## 5. Resultado do teste

| Critério | Resultado |
|---|---|
| Disponibilização da operação na interface | Conforme |
| Inativação válida de colaborador | Conforme — Raimundo |
| Controle de inativação repetida | Conforme |
| Verificação de pertencimento à rede | Rejeição observada diante de divergência |
| Identificação da reserva de vínculo ativo | Conforme no bloqueio de inconsistência |
| Inativação de Leonardo | Não concluída — dados inconsistentes |
| Preservação do vínculo após rejeição | Conforme no cenário observado |
| Conferência integral das alterações no Firestore | Evidência documental pendente |
| Cobertura de todas as contingências previstas | Não comprovada nesta execução |

**Resultado geral: EXECUÇÃO REALIZADA — CONSOLIDAÇÃO DE EVIDÊNCIAS PENDENTE.**

Os cenários executados forneceram evidências positivas do comportamento da operação `INATIVAR`.

A execução ainda não deve ser classificada como aprovação integral do comando, pois permanecem pendentes a consolidação dos anexos e a confirmação da cobertura das contingências previstas.

## 6. Correção e continuidade

1. Consolidar as capturas e os registros técnicos correspondentes às evidências EV-TE03-01 a EV-TE03-06.
2. Conferir e documentar os estados persistidos no Firestore após a inativação válida de Raimundo.
3. Verificar a existência de reserva com o identificador correto antes de qualquer regularização dos dados legados de Leonardo.
4. Regularizar os registros inconsistentes de forma controlada, preservando a integridade dos vínculos.
5. Reexecutar o cenário de Leonardo após a regularização, caso seja necessário para concluir a cobertura.
6. Revisar as contingências previstas para `INATIVAR` e identificar eventuais cenários não executados.
7. Remover os registros temporários de diagnóstico da Cloud Function após a conclusão da investigação.
8. Atualizar a documentação técnica e versionar a implementação validada, caso ainda esteja pendente.

## 7. Conclusão

O TE-03 demonstrou que a operação `INATIVAR` executou com sucesso um cenário válido e controlou corretamente uma tentativa repetida de inativação.

Os testes com Leonardo também permitiram observar o comportamento da função diante de inconsistências cadastrais e de reserva do vínculo ativo.

Nesses cenários, a operação foi recusada, preservando o vínculo do colaborador.

A ocorrência reforça a importância das validações de integridade e da centralização das operações de escrita no backend, conforme os princípios arquiteturais estabelecidos para o Talleria.

Os resultados observados são positivos, mas não representam, isoladamente, a validação de todas as contingências ou uma auditoria completa da implementação.

**Próxima atividade:** Consolidar as evidências pendentes, concluir as verificações necessárias de `INATIVAR` e posteriormente iniciar a revisão da jornada GERENTE.

---

**Observação sobre os anexos:** As capturas da interface, as consultas ao Firestore e os registros de execução da Cloud Function deverão compor o conjunto de evidências EV-TE03-01 a EV-TE03-06. Os resultados descritos foram observados durante a sessão de testes, mas os anexos ainda precisam ser organizados e vinculados a este documento.