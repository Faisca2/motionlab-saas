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

        // 3. Validar os comandos disponíveis
        const comandosPermitidos = [
            'CRIAR',
            'INATIVAR'
        ];

        if (!comandosPermitidos.includes(comando)) {
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
        // Encaminhar a operação de inativação
        if (comando === 'INATIVAR') {
            const colaboradorId = String(data.colaboradorId || '').trim();

            if (!colaboradorId || colaboradorId.includes('/')) {
                return {
                    status: 'DADOS_INVALIDOS',
                    mensagem: 'Identificador do colaborador inválido.'
                };
            }

            // Consultar o colaborador
            const colaboradorRef = db
                .collection('colaboradores')
                .doc(colaboradorId);

            const colaboradorDoc = await colaboradorRef.get();

            // Verificar se o colaborador existe
            if (!colaboradorDoc.exists) {
                return {
                    status: 'DADOS_INVALIDOS',
                    mensagem: 'Colaborador não encontrado.'
                };
            }

            const colaborador = colaboradorDoc.data();

            // Verificar se pertence à rede do MASTER
            if (
                !colaborador.rede_ref ||
                colaborador.rede_ref.path !== usuario.rede_ref.path
            ) {
                return {
                    status: 'PERMISSAO_NEGADA',
                    mensagem: 'Colaborador não pertence à sua rede.'
                };
            }

            // Verificar se o vínculo está ativo
            if (colaborador.ativo !== true) {
                return {
                    status: 'VINCULO_INATIVO',
                    mensagem: 'Este colaborador já está inativo.'
                };
            }
            // Normalizar o e-mail do colaborador
            const emailNormalizado = String(colaborador.email || '')
                .trim()
                .toLowerCase();

            // Calcular o identificador da reserva
            const hashEmail = crypto
                .createHash('sha256')
                .update(emailNormalizado)
                .digest('hex');

            const vinculoAtivoId =
                `${usuario.rede_ref.id}_${hashEmail}`;

            const vinculoAtivoRef = db
                .collection('vinculos_ativos')
                .doc(vinculoAtivoId);

            // Consultar a reserva
            const vinculoAtivoDoc = await vinculoAtivoRef.get();

            // Confirmar que a reserva pertence ao colaborador
            if (
                !vinculoAtivoDoc.exists ||
                !vinculoAtivoDoc.data().colaborador_ref ||
                vinculoAtivoDoc.data().colaborador_ref.path !== colaboradorRef.path
            ) {
                return {
                    status: 'INCONSISTENCIA_VINCULO',
                    mensagem:
                        'A reserva do vínculo ativo não corresponde ao colaborador.'
                };
            }
            // Preparar a transação de inativação
            try {
                return await db.runTransaction(async (transaction) => {

                    // 1. Ler os documentos envolvidos na operação
                    const usuarioAtualDoc =
                        await transaction.get(usuarioRef);

                    const colaboradorAtualDoc =
                        await transaction.get(colaboradorRef);

                    const vinculoAtualDoc =
                        await transaction.get(vinculoAtivoRef);
                    // 2. Revalidar a autorização do MASTER
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
                        usuarioAtual.rede_ref.path !== usuario.rede_ref.path
                    ) {
                        return {
                            status: 'PERMISSAO_NEGADA',
                            mensagem: 'Usuário sem autorização para inativar.'
                        };
                    }
                    // 3. Revalidar o colaborador
                    if (!colaboradorAtualDoc.exists) {
                        return {
                            status: 'DADOS_INVALIDOS',
                            mensagem: 'Colaborador não encontrado.'
                        };
                    }

                    const colaboradorAtual = colaboradorAtualDoc.data();

                    // Confirmar que pertence à rede do MASTER
                    if (
                        !colaboradorAtual.rede_ref ||
                        colaboradorAtual.rede_ref.path !== usuarioAtual.rede_ref.path
                    ) {
                        return {
                            status: 'PERMISSAO_NEGADA',
                            mensagem: 'Colaborador não pertence à sua rede.'
                        };
                    }

                    // Confirmar que o vínculo permanece ativo
                    if (colaboradorAtual.ativo !== true) {
                        return {
                            status: 'VINCULO_INATIVO',
                            mensagem: 'Este colaborador já está inativo.'
                        };
                    }

                    // Confirmar que o e-mail não mudou durante a operação
                    if (
                        String(colaboradorAtual.email || '').trim().toLowerCase()
                        !== emailNormalizado
                    ) {
                        return {
                            status: 'INCONSISTENCIA_VINCULO',
                            mensagem: 'O e-mail do vínculo foi alterado.'
                        };
                    }
                    // 4. Revalidar a reserva do vínculo ativo
                    if (!vinculoAtualDoc.exists) {
                        return {
                            status: 'INCONSISTENCIA_VINCULO',
                            mensagem: 'Reserva do vínculo ativo não encontrada.'
                        };
                    }

                    const vinculoAtual = vinculoAtualDoc.data();

                    if (
                        !vinculoAtual.colaborador_ref ||
                        vinculoAtual.colaborador_ref.path !== colaboradorRef.path ||
                        !vinculoAtual.rede_ref ||
                        vinculoAtual.rede_ref.path !== usuarioAtual.rede_ref.path ||
                        vinculoAtual.email_normalizado !== emailNormalizado
                    ) {
                        return {
                            status: 'INCONSISTENCIA_VINCULO',
                            mensagem: 'A reserva não corresponde ao vínculo do colaborador.'
                        };
                    }
                    // 5. Registrar a inativação
                    const agora =
                        admin.firestore.FieldValue.serverTimestamp();

                    transaction.update(colaboradorRef, {
                        ativo: false,
                        atualizado_em: agora,
                        atualizado_por_ref: usuarioRef
                    });

                    // 6. Liberar a reserva do vínculo ativo
                    transaction.delete(vinculoAtivoRef);

                    // 7. Retornar o resultado
                    return {
                        status: 'INATIVADO',
                        mensagem: 'Colaborador inativado com sucesso.',
                        colaboradorId: colaboradorRef.id
                    };
                });

            } catch (error) {
                console.error('Falha ao inativar colaborador:', error);

                return {
                    status: 'ERRO_OPERACIONAL',
                    mensagem: 'Não foi possível inativar o colaborador.'
                };
            }
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