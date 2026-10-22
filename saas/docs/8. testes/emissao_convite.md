Talleria — Evidência de Teste TE-02
Módulo: Credenciamento de colaboradores
Teste: TE-02 — Cadastro de colaborador e emissão de convite
Data de execução: 14/10/2026
Ambiente: Desenvolvimento — FlutterFlow / Firebase
Executor: Equipe de desenvolvimento Talleria
Situação: Pendente de correção e reexecução

1. Objetivo
Validar o processo de cadastro de um novo colaborador pela interface do Talleria, a persistência dos dados no Firestore e a emissão de convite de credenciamento pela Cloud Function emitirConviteColaborador.
O teste também verifica se inconsistências cadastrais impedem a emissão de convites.
2. Cenário de teste
Rede/Matriz: Matriz 01 0710
Estabelecimento: Filial 02 da matriz 01 0710
Colaborador: Clara
Perfil de acesso: COLABORADOR
Situação inicial: Colaborador ainda não credenciado.
Foi escolhido um novo colaborador para testar o processo desde a inclusão cadastral, evitando dependência de registros antigos.
3. Execução e evidências
EV-TE02-01 — Acesso à matriz
A aplicação apresentou a página principal da Matriz 01 0710, contendo a relação de filiais.
Resultado: Navegação disponível.
Evidência: Captura da página homePageMaster.
EV-TE02-02 — Acesso à filial
Foi selecionada a Filial 02 da matriz 01 0710.
A aplicação apresentou a relação de colaboradores existentes, incluindo Maria das Dores e Leonardo.
Resultado: Filial e relação de colaboradores exibidas.
Evidência: Captura da página homePageFilial.
EV-TE02-03 — Inclusão de colaborador
Foi realizado o cadastro de Clara.
Após a operação, o nome Clara passou a constar na relação de colaboradores da filial.
Resultado: Inclusão realizada e lista atualizada.
Evidência: Captura da relação de colaboradores com Clara.
EV-TE02-04 — Conferência do Firestore
Foi consultado o documento de Clara na coleção colaboradores.
Campos observados:
Campo
Valor observado
nome
Clara
email
dicasdaclara0702@gmail.com
ativo
true
perfil_acesso
COLABORADOR
estabelecimento_ref
Referência a documento de estabelecimentos
criado_em
14/10/2026 às 19:51:10 (UTC−3)
criado_por_ref
Referência a documento de users
atualizado_em
14/10/2026 às 19:51:10 (UTC−3)
atualizado_por_ref
Referência a documento de users
rede_ref
Ausente
user_ref
Ausente — esperado antes da ativação

Resultado: Cadastro persistido, porém incompleto para o processo de credenciamento.
Evidência: Captura do documento no Firebase Firestore.
EV-TE02-05 — Estado inicial do credenciamento
Na página de gestão de Clara, a aplicação apresentou:
Estado: Sem acesso
E-mail cadastrado
Botão Credenciar acesso
Resultado: Estado inicial apresentado corretamente.
Evidência: Captura da página de gestão de colaboradores.
EV-TE02-06 — Tentativa de emissão do convite
Foi acionado o botão Credenciar acesso.
A aplicação apresentou a mensagem:
Não foi possível emitir o convite. Verifique os dados cadastrais do colaborador.
Resultado: A interface informou falha na emissão.
Evidência: Captura da mensagem apresentada após a tentativa.
4. Análise da ocorrência
O documento do colaborador foi criado sem o campo rede_ref, necessário para validar o vínculo do colaborador com a rede e o isolamento entre clientes do Talleria.
A ausência desse campo é uma possível causa da rejeição pela Cloud Function emitirConviteColaborador.
Entretanto, a mensagem apresentada pela interface é genérica. Portanto, a confirmação da causa exige consulta ao erro registrado na execução da função.
A tentativa demonstrou que o fluxo de apresentação de falha da interface foi acionado.
5. Resultado do teste
Critério
Resultado
Navegação matriz → filial
Conforme
Inclusão do colaborador
Conforme
Atualização da lista
Conforme
Persistência dos dados
Parcialmente conforme
Integridade cadastral
Não conforme — ausência de rede_ref
Apresentação do estado Sem acesso
Conforme
Emissão de convite válido
Não concluída
Apresentação de mensagem de falha
Conforme
Criação de convite e controle_convites
Não verificada nesta execução

Resultado geral: PENDENTE DE CORREÇÃO E REEXECUÇÃO.
O TE-02 ainda não pode ser considerado aprovado, pois seu objetivo principal é comprovar a emissão de um convite válido.
6. Correção e continuidade
Verificar a ação Create Document da coleção colaboradores no FlutterFlow.
Corrigir a gravação de rede_ref com a referência da rede correspondente.
Verificar a inexistência de registros relacionados antes de excluir o cadastro de teste.
Recriar o colaborador pela interface.
Conferir novamente os campos e referências no Firestore.
Reexecutar emitirConviteColaborador.
Verificar os documentos convite e controle_convites e o recebimento do e-mail.
7. Conclusão
O TE-02 identificou uma inconsistência no cadastro de colaboradores: a ausência da referência à rede.
A ocorrência foi detectada antes da conclusão do credenciamento e será tratada na origem do cadastro, sem correção manual dos dados no Firestore.
A execução permanecerá registrada como evidência de teste não conforme, preservando o histórico da identificação e da futura correção.
Próxima atividade: Corrigir o cadastro e reexecutar o TE-02.

Observação sobre os anexos: As seis capturas fornecidas nesta conversa compõem o conjunto de evidências EV-TE02-01 a EV-TE02-06 e devem acompanhar este registro no Google Docs.

