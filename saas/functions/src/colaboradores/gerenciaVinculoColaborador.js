const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
// To avoid deployment errors, do not call admin.initializeApp() in your code

exports.gerenciarVinculoColaborador = functions.https.onCall(
    async (data, context) => {
        // 1. Validar autenticação
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'Usuário não autenticado.'
            );
        }

        // 2. Identificar o comando solicitado
        const comando = String(data.comando || '')
            .trim()
            .toUpperCase();

        // 3. Aceitar somente o comando CRIAR nesta versão
        if (comando !== 'CRIAR') {
            return {
                status: 'DADOS_INVALIDOS',
                mensagem: 'Comando não implementado.'
            };
        }


        // 4. Obter a identidade autenticada
        const db = admin.firestore();
        const uid = context.auth.uid;

        const usuarioRef = db.collection('users').doc(uid);
        const usuarioDoc = await usuarioRef.get();

        if (!usuarioDoc.exists) {
            return {
                status: 'PERMISSAO_NEGADA',
                mensagem: 'Usuário não cadastrado.'
            };
        }

        const usuario = usuarioDoc.data();

        // 5. Autorizar exclusivamente o MASTER
        if (usuario.role !== 'MASTER' || !usuario.rede_ref) {
            return {
                status: 'PERMISSAO_NEGADA',
                mensagem: 'Operação permitida somente ao MASTER.'
            };
        }

        // 6. Validar identificador do estabelecimento
        const estabelecimentoId =
            String(data.estabelecimentoId || '').trim();

        if (
            !estabelecimentoId ||
            estabelecimentoId.includes('/')
        ) {
            return {
                status: 'DADOS_INVALIDOS',
                mensagem: 'Estabelecimento inválido.'
            };
        }

        // 7. Consultar o estabelecimento
        const estabelecimentoRef = db
            .collection('estabelecimentos')
            .doc(estabelecimentoId);

        const estabelecimentoDoc = await estabelecimentoRef.get();

        if (!estabelecimentoDoc.exists) {
            return {
                status: 'DADOS_INVALIDOS',
                mensagem: 'Estabelecimento não encontrado.'
            };
        }

        const estabelecimento = estabelecimentoDoc.data();

        // 8. Validar se pertence à rede do MASTER
        if (
            !estabelecimento.rede_ref ||
            estabelecimento.rede_ref.path !== usuario.rede_ref.path
        ) {
            return {
                status: 'PERMISSAO_NEGADA',
                mensagem: 'Estabelecimento não pertence à rede.'
            };
        }


        // 9. Normalizar os dados recebidos
        const nome = String(data.nome || '').trim();

        const email = String(data.email || '')
            .trim()
            .toLowerCase();

        const perfilAcesso = String(data.perfilAcesso || '')
            .trim()
            .toUpperCase();

        // 10. Validar nome
        if (nome.length < 2 || nome.length > 150) {
            return {
                status: 'DADOS_INVALIDOS',
                mensagem: 'Nome deve conter entre 2 e 150 caracteres.'
            };
        }

        // 11. Validar e-mail
        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (
            !emailValido ||
            email.length > 254
        ) {
            return {
                status: 'DADOS_INVALIDOS',
                mensagem: 'E-mail inválido.'
            };
        }

        // 12. Validar perfil operacional
        const perfisPermitidos = [
            'COLABORADOR',
            'ATENDENTE'
        ];

        if (!perfisPermitidos.includes(perfilAcesso)) {
            return {
                status: 'DADOS_INVALIDOS',
                mensagem: 'Perfil de acesso inválido.'
            };
        }

        // Verificar identidade existente no Authentication
        let identidadeExistente = false;

        try {
            await admin.auth().getUserByEmail(email);
            identidadeExistente = true;
        } catch (error) {
            if (error.code !== 'auth/user-not-found') {
                console.error(
                    'Falha ao consultar identidade:',
                    error
                );

                return {
                    status: 'ERRO_OPERACIONAL',
                    mensagem: 'Não foi possível validar a identidade.'
                };
            }
        }


        // 13. Preparar referências
        const redeRef = usuario.rede_ref;
        const redeId = redeRef.id;

        const hashEmail = crypto
            .createHash('sha256')
            .update(email)
            .digest('hex');

        const vinculoAtivoId = `${redeId}_${hashEmail}`;

        const vinculoAtivoRef = db
            .collection('vinculos_ativos')
            .doc(vinculoAtivoId);

        const colaboradorRef = db
            .collection('colaboradores')
            .doc();

        // 14. Executar transação
        try {
            return await db.runTransaction(async (transaction) => {

                // Todas as leituras antes das gravações
                const usuarioAtualDoc =
                    await transaction.get(usuarioRef);

                const estabelecimentoAtualDoc =
                    await transaction.get(estabelecimentoRef);

                const vinculoAtualDoc =
                    await transaction.get(vinculoAtivoRef);

                // 15. Revalidar autorização
                if (!usuarioAtualDoc.exists) {
                    return {
                        status: 'PERMISSAO_NEGADA',
                        mensagem: 'Usuário não encontrado.'
                    };
                }

                const usuarioAtual = usuarioAtualDoc.data();

                if (
                    usuarioAtual.role !== 'MASTER' ||
                    !usuarioAtual.rede_ref ||
                    usuarioAtual.rede_ref.path !== redeRef.path
                ) {
                    return {
                        status: 'PERMISSAO_NEGADA',
                        mensagem: 'Usuário sem autorização.'
                    };
                }

                // 16. Revalidar estabelecimento
                if (!estabelecimentoAtualDoc.exists) {
                    return {
                        status: 'DADOS_INVALIDOS',
                        mensagem: 'Estabelecimento não encontrado.'
                    };
                }

                const estabelecimentoAtual =
                    estabelecimentoAtualDoc.data();

                if (
                    !estabelecimentoAtual.rede_ref ||
                    estabelecimentoAtual.rede_ref.path !== redeRef.path
                ) {
                    return {
                        status: 'PERMISSAO_NEGADA',
                        mensagem: 'Estabelecimento fora da rede.'
                    };
                }

                // Validar estabelecimento ativo
                if (estabelecimentoAtual.ativo !== true) {
                    return {
                        status: 'DADOS_INVALIDOS',
                        mensagem: 'Estabelecimento não está ativo.'
                    };
                }

                // Validar tipo do estabelecimento
                if (
                    !['MATRIZ', 'FILIAL'].includes(
                        estabelecimentoAtual.tipo
                    )
                ) {
                    return {
                        status: 'DADOS_INVALIDOS',
                        mensagem: 'Tipo de estabelecimento inválido.'
                    };
                }

                // 17. Verificar reserva de vínculo ativo
                if (vinculoAtualDoc.exists) {
                    return {
                        status: 'VINCULO_ATIVO_EXISTENTE',
                        mensagem:
                            'Este e-mail já possui vínculo ativo nesta rede.'
                    };
                }
                // Impedir associação automática de identidade existente
                if (identidadeExistente) {
                    return {
                        status: 'IDENTIDADE_EXISTENTE',
                        mensagem:
                            'Este e-mail já possui uma identidade cadastrada. ' +
                            'É necessário validar o reaproveitamento da conta.'
                    };
                }
                // 18. Preparar auditoria
                const agora =
                    admin.firestore.FieldValue.serverTimestamp();

                // 19. Criar colaborador
                transaction.create(colaboradorRef, {
                    nome: nome,
                    email: email,
                    perfil_acesso: perfilAcesso,
                    ativo: true,
                    rede_ref: redeRef,
                    estabelecimento_ref: estabelecimentoRef,
                    criado_em: agora,
                    criado_por_ref: usuarioRef,
                    atualizado_em: agora,
                    atualizado_por_ref: usuarioRef
                });

                // 20. Criar reserva de vínculo ativo
                transaction.create(vinculoAtivoRef, {
                    rede_ref: redeRef,
                    email_normalizado: email,
                    colaborador_ref: colaboradorRef,
                    atualizado_em: agora
                });

                return {
                    status: 'CRIADO',
                    mensagem: 'Colaborador criado com sucesso.',
                    colaboradorId: colaboradorRef.id
                };
            });

        } catch (error) {
            console.error(
                'Falha ao criar vínculo de colaborador:',
                error
            );

            return {
                status: 'ERRO_OPERACIONAL',
                mensagem: 'Não foi possível concluir o cadastro.'
            };
        }



    }
);