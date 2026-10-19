const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

// Firebase Admin inicializado pelo projeto FlutterFlow.

const PRAZO_RESERVA_MS = 5 * 60 * 1000;

const erro = (codigo, mensagem) =>
    new functions.https.HttpsError(codigo, mensagem);

const refColecao = (ref, colecao) =>
    !!ref && !!ref.parent && ref.parent.path === colecao;

const igual = (a, b) =>
    !!a && !!b &&
    typeof a.isEqual === 'function' &&
    a.isEqual(b);

const ms = (valor) =>
    valor && typeof valor.toMillis === 'function'
        ? valor.toMillis()
        : null;

const emailNormal = (valor) =>
    typeof valor === 'string'
        ? valor.trim().toLowerCase()
        : '';

const mensagemInterrompida =
    'A ativação não foi concluída. Não repita o cadastro. ' +
    'Procure o responsável pelo estabelecimento.';

const mensagemJaRegistrado =
    'O cadastro já foi registrado. Tente acessar sua conta. ' +
    'Se não conseguir, procure o responsável pelo estabelecimento.';

exports.aceitarConviteColaborador = functions.https.onCall(
    async (data, context) => {

        // 1. Validar parâmetros.
        // Não registrar token nem senha nos logs.

        const token = data && data.token;
        const senha = data && data.senha;

        if (
            typeof token !== 'string' ||
            !/^[a-fA-F0-9]{64}$/.test(token)
        ) {
            throw erro(
                'invalid-argument',
                'Token de convite inválido.'
            );
        }

        if (
            typeof senha !== 'string' ||
            senha.length < 8 ||
            senha.length > 128
        ) {
            throw erro(
                'invalid-argument',
                'A senha deve conter entre 8 e 128 caracteres.'
            );
        }

        const db = admin.firestore();

        const hash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const busca = await db
            .collection('convite')
            .where('token_hash', '==', hash)
            .limit(1)
            .get();

        if (busca.empty) {
            throw erro(
                'not-found',
                'Convite inválido ou não encontrado.'
            );
        }

        const conviteRef = busca.docs[0].ref;
        const colaboradorRef =
            busca.docs[0].data().colaborador_ref;

        if (!refColecao(colaboradorRef, 'colaboradores')) {
            throw erro(
                'failed-precondition',
                'Convite indisponível.'
            );
        }

        const controleRef = db
            .collection('controle_convites')
            .doc(colaboradorRef.id);

        // UID determinístico, exclusivo deste convite.
        // Uma conta preexistente nunca será reaproveitada
        // ou modificada pelo fluxo público.

        const uid = 'conv_' + crypto
            .createHash('sha256')
            .update(conviteRef.path)
            .digest('hex')
            .slice(0, 40);

        const usuarioRef = db.collection('users').doc(uid);
        const tentativaId = crypto.randomUUID();

        // 2. Identificar referências organizacionais.
        // A transação verificará os vínculos novamente.

        const colaboradorInicial =
            await colaboradorRef.get();

        if (!colaboradorInicial.exists) {
            throw erro(
                'failed-precondition',
                'Colaborador indisponível.'
            );
        }

        const estabelecimentoRef =
            colaboradorInicial.data().estabelecimento_ref;

        if (!refColecao(
            estabelecimentoRef,
            'estabelecimentos'
        )) {
            throw erro(
                'failed-precondition',
                'Estabelecimento inválido.'
            );
        }

        const estabelecimentoInicial =
            await estabelecimentoRef.get();

        if (!estabelecimentoInicial.exists) {
            throw erro(
                'failed-precondition',
                'Estabelecimento indisponível.'
            );
        }

        const estabelecimentoInicialDados =
            estabelecimentoInicial.data();

        const matrizRef =
            estabelecimentoInicialDados.tipo === 'MATRIZ'
                ? estabelecimentoRef
                : estabelecimentoInicialDados.tipo === 'FILIAL'
                    ? estabelecimentoInicialDados.matriz_ref
                    : null;

        if (!refColecao(matrizRef, 'estabelecimentos')) {
            throw erro(
                'failed-precondition',
                'Matriz inválida.'
            );
        }

        // 3. Validações organizacionais comuns.
        // Usadas na reserva, confirmação e finalização.

        const validarVinculos = (
            convite,
            controle,
            colaborador,
            estabelecimento,
            matriz
        ) => {

            const email = emailNormal(convite.email);

            if (
                !igual(
                    convite.colaborador_ref,
                    colaboradorRef
                ) ||
                !igual(
                    controle.convite_ref,
                    conviteRef
                ) ||
                convite.role !== 'COLABORADOR' ||
                colaborador.ativo !== true ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                email !== emailNormal(colaborador.email)
            ) {
                throw erro(
                    'failed-precondition',
                    'Dados do credenciamento inconsistentes.'
                );
            }

            // CT-10: não aceitar mudança de filial,
            // rede ou matriz durante a ativação.

            if (
                !refColecao(
                    convite.rede_ref,
                    'redes_franquias'
                ) ||
                !refColecao(
                    colaborador.rede_ref,
                    'redes_franquias'
                ) ||
                !igual(
                    convite.rede_ref,
                    colaborador.rede_ref
                ) ||
                !igual(
                    convite.estabelecimento_ref,
                    estabelecimentoRef
                ) ||
                !igual(
                    colaborador.estabelecimento_ref,
                    estabelecimentoRef
                ) ||
                !igual(
                    estabelecimento.rede_ref,
                    colaborador.rede_ref
                ) ||
                !igual(
                    matriz.rede_ref,
                    colaborador.rede_ref
                ) ||
                matriz.tipo !== 'MATRIZ'
            ) {
                throw erro(
                    'failed-precondition',
                    'Vínculos organizacionais inconsistentes.'
                );
            }

            if (
                !(
                    estabelecimento.tipo === 'MATRIZ' &&
                    igual(estabelecimentoRef, matrizRef)
                ) &&
                !(
                    estabelecimento.tipo === 'FILIAL' &&
                    igual(
                        estabelecimento.matriz_ref,
                        matrizRef
                    )
                )
            ) {
                throw erro(
                    'failed-precondition',
                    'Vínculo com a matriz inconsistente.'
                );
            }

            return email;
        };

        // As 72 horas só são verificadas
        // antes de reservar uma NOVA ativação.

        const validarPrazoInicial = (
            convite,
            controle,
            agora
        ) => {

            const expConvite = ms(convite.expira_em);
            const expControle = ms(controle.expira_em);

            if (
                expConvite === null ||
                expControle === null ||
                expConvite !== expControle ||
                expConvite <= agora
            ) {
                throw erro(
                    'failed-precondition',
                    'Convite expirado ou inconsistente.'
                );
            }
        };

        const conferirUsuarioFirestore = (
            usuario,
            colaborador,
            email
        ) =>
            usuario.uid === uid &&
            usuario.role === 'COLABORADOR' &&
            emailNormal(usuario.email) === email &&
            igual(
                usuario.rede_ref,
                colaborador.rede_ref
            ) &&
            igual(
                usuario.matriz_ref,
                matrizRef
            );

        // 4. Reservar ativação.
        // CT-01: PROCESSANDO nunca é retomado
        // automaticamente pelo fluxo público.
        // RC-10: CONCLUIDO e ATIVADO não são recuperados.

        const reserva = await db.runTransaction(async (tx) => {

            const [
                cDoc,
                kDoc,
                pDoc,
                eDoc,
                mDoc,
                uDoc
            ] = await Promise.all([
                tx.get(conviteRef),
                tx.get(controleRef),
                tx.get(colaboradorRef),
                tx.get(estabelecimentoRef),
                tx.get(matrizRef),
                tx.get(usuarioRef)
            ]);

            if (
                ![cDoc, kDoc, pDoc, eDoc, mDoc]
                    .every(doc => doc.exists)
            ) {
                throw erro(
                    'failed-precondition',
                    'Documentos de credenciamento indisponíveis.'
                );
            }

            const c = cDoc.data();
            const k = kDoc.data();
            const p = pDoc.data();
            const e = eDoc.data();
            const m = mDoc.data();

            const email = validarVinculos(
                c, k, p, e, m
            );

            if (
                k.status === 'CONCLUIDO' ||
                k.status === 'ATIVADO'
            ) {
                throw erro(
                    'failed-precondition',
                    mensagemJaRegistrado
                );
            }

            if (k.status === 'PROCESSANDO') {

                const expReserva = ms(k.reserva_expira_em);

                if (
                    expReserva !== null &&
                    expReserva > Date.now()
                ) {
                    throw erro(
                        'failed-precondition',
                        'Este convite está em ativação. ' +
                        'Não inicie outro cadastro.'
                    );
                }

                throw erro(
                    'failed-precondition',
                    mensagemInterrompida
                );
            }

            if (
                k.status !== 'DISPONIVEL' ||
                c.usado !== false ||
                k.usado !== false ||
                p.user_ref ||
                uDoc.exists
            ) {
                throw erro(
                    'failed-precondition',
                    'Convite indisponível. ' +
                    'Procure o responsável pelo estabelecimento.'
                );
            }

            const agora = Date.now();

            validarPrazoInicial(c, k, agora);

            tx.update(controleRef, {
                status: 'PROCESSANDO',
                tentativa_id: tentativaId,
                reservado_em:
                    admin.firestore.FieldValue.serverTimestamp(),
                reserva_expira_em:
                    admin.firestore.Timestamp.fromMillis(
                        agora + PRAZO_RESERVA_MS
                    ),
                atualizado_em:
                    admin.firestore.FieldValue.serverTimestamp()
            });

            return {
                email,
                reservaExpiraEm:
                    agora + PRAZO_RESERVA_MS
            };
        });

        // A partir daqui, qualquer falha ou resultado
        // incerto pode exigir reconciliação administrativa.
        // Não liberar a reserva automaticamente.

        const registrarFalha = (etapa, e) => {
            console.error('Falha no credenciamento:', {
                etapa,
                tentativa_id: tentativaId,
                codigo: e && (e.code || e.name),
                ocorrido_em: new Date().toISOString()
            });
        };

        // 5. Criar usuário DESABILITADO.
        // CT-03 e CT-07:
        // nunca redefinir senha, vincular ou habilitar
        // uma conta preexistente.

        try {

            await admin.auth().createUser({
                uid,
                email: reserva.email,
                password: senha,
                emailVerified: false,
                disabled: true
            });

        } catch (e) {

            registrarFalha('CRIAR_AUTH', e);

            throw erro(
                'failed-precondition',
                'Não foi possível concluir o cadastro. ' +
                'Não repita a ativação. ' +
                'Procure o responsável pelo estabelecimento.'
            );
        }

        // 6. Confirmar cadastro no Firestore.
        // Somente a tentativa que detém a reserva
        // pode confirmar a ativação.
        //
        // CT-05: NÃO revalidar as 72 horas aqui.
        // A reserva de cinco minutos continua obrigatória.

        try {

            await db.runTransaction(async (tx) => {

                const [
                    cDoc,
                    kDoc,
                    pDoc,
                    eDoc,
                    mDoc,
                    uDoc
                ] = await Promise.all([
                    tx.get(conviteRef),
                    tx.get(controleRef),
                    tx.get(colaboradorRef),
                    tx.get(estabelecimentoRef),
                    tx.get(matrizRef),
                    tx.get(usuarioRef)
                ]);

                if (
                    ![cDoc, kDoc, pDoc, eDoc, mDoc]
                        .every(doc => doc.exists) ||
                    uDoc.exists
                ) {
                    throw erro(
                        'failed-precondition',
                        'Dados alterados durante a ativação.'
                    );
                }

                const c = cDoc.data();
                const k = kDoc.data();
                const p = pDoc.data();

                const email = validarVinculos(
                    c,
                    k,
                    p,
                    eDoc.data(),
                    mDoc.data()
                );

                const agora = Date.now();

                if (
                    email !== reserva.email ||
                    c.usado !== false ||
                    k.usado !== false ||
                    p.user_ref ||
                    k.status !== 'PROCESSANDO' ||
                    k.tentativa_id !== tentativaId ||
                    ms(k.reserva_expira_em) === null ||
                    ms(k.reserva_expira_em) <= agora
                ) {
                    throw erro(
                        'failed-precondition',
                        'Reserva perdida ou expirada.'
                    );
                }

                // Confirmar a existência e o vínculo
                // do usuário no Firestore.

                tx.create(usuarioRef, {
                    uid,
                    email,
                    display_name: p.nome || '',
                    role: 'COLABORADOR',
                    rede_ref: p.rede_ref,
                    matriz_ref: matrizRef,
                    created_time:
                        admin.firestore.FieldValue.serverTimestamp()
                });

                tx.update(colaboradorRef, {
                    user_ref: usuarioRef
                });

                tx.update(conviteRef, {
                    usado: true,
                    atualizado_em:
                        admin.firestore.FieldValue.serverTimestamp()
                });

                tx.update(controleRef, {
                    usado: true,
                    status: 'CONCLUIDO',
                    atualizado_em:
                        admin.firestore.FieldValue.serverTimestamp()
                });
            });

        } catch (e) {

            registrarFalha('CONFIRMAR_FIRESTORE', e);

            // A conta Auth pode existir desabilitada.
            // Não excluir, habilitar ou reiniciar
            // automaticamente pelo token público.

            throw erro(
                'failed-precondition',
                mensagemInterrompida
            );
        }

        // 7. Conferir cadastro confirmado.
        // Esta etapa só é alcançada pela mesma
        // execução que criou a conta e confirmou
        // o Firestore.
        //
        // Não existe caminho público de recuperação
        // de CONCLUIDO ou ATIVADO.

        const conferirCadastro = async () => {

            const [
                cDoc,
                kDoc,
                pDoc,
                eDoc,
                mDoc,
                uDoc
            ] = await Promise.all([
                conviteRef.get(),
                controleRef.get(),
                colaboradorRef.get(),
                estabelecimentoRef.get(),
                matrizRef.get(),
                usuarioRef.get()
            ]);

            if (
                ![cDoc, kDoc, pDoc, eDoc, mDoc, uDoc]
                    .every(doc => doc.exists)
            ) {
                throw erro(
                    'failed-precondition',
                    'Cadastro incompleto.'
                );
            }

            const c = cDoc.data();
            const k = kDoc.data();
            const p = pDoc.data();
            const u = uDoc.data();

            const email = validarVinculos(
                c,
                k,
                p,
                eDoc.data(),
                mDoc.data()
            );

            if (
                c.usado !== true ||
                k.usado !== true ||
                k.status !== 'CONCLUIDO' ||
                k.tentativa_id !== tentativaId ||
                !igual(p.user_ref, usuarioRef) ||
                !conferirUsuarioFirestore(u, p, email)
            ) {
                throw erro(
                    'failed-precondition',
                    'Cadastro não autorizado para habilitação.'
                );
            }

            return email;
        };

        // 8. Habilitar a conta recém-criada.
        // Não habilitar contas de outras tentativas.

        try {

            const email = await conferirCadastro();

            const conta = await admin.auth().getUser(uid);

            if (
                emailNormal(conta.email) !== email ||
                conta.disabled !== true
            ) {
                throw erro(
                    'failed-precondition',
                    'Estado do Authentication inconsistente.'
                );
            }

            await admin.auth().updateUser(uid, {
                disabled: false
            });

        } catch (e) {

            registrarFalha('HABILITAR_AUTH', e);

            // Firestore pode estar CONCLUIDO.
            // Não desfazer os vínculos automaticamente.
            // A reconciliação será administrativa.

            throw erro(
                'failed-precondition',
                mensagemInterrompida
            );
        }

        // 9. Finalizar controle.
        // CT-04: se esta gravação falhar, a conta
        // pode estar habilitada com status CONCLUIDO.
        // Não bloquear o login apenas por esse status.

        try {

            await db.runTransaction(async (tx) => {

                const [
                    cDoc,
                    kDoc,
                    pDoc,
                    eDoc,
                    mDoc,
                    uDoc
                ] = await Promise.all([
                    tx.get(conviteRef),
                    tx.get(controleRef),
                    tx.get(colaboradorRef),
                    tx.get(estabelecimentoRef),
                    tx.get(matrizRef),
                    tx.get(usuarioRef)
                ]);

                if (
                    ![cDoc, kDoc, pDoc, eDoc, mDoc, uDoc]
                        .every(doc => doc.exists)
                ) {
                    throw erro(
                        'failed-precondition',
                        'Documentos finais indisponíveis.'
                    );
                }

                const c = cDoc.data();
                const k = kDoc.data();
                const p = pDoc.data();
                const u = uDoc.data();

                const email = validarVinculos(
                    c,
                    k,
                    p,
                    eDoc.data(),
                    mDoc.data()
                );

                if (
                    c.usado !== true ||
                    k.usado !== true ||
                    k.status !== 'CONCLUIDO' ||
                    k.tentativa_id !== tentativaId ||
                    !igual(p.user_ref, usuarioRef) ||
                    !conferirUsuarioFirestore(u, p, email)
                ) {
                    throw erro(
                        'failed-precondition',
                        'Estado final inconsistente.'
                    );
                }

                tx.update(controleRef, {
                    status: 'ATIVADO',
                    atualizado_em:
                        admin.firestore.FieldValue.serverTimestamp()
                });
            });

        } catch (e) {

            registrarFalha('FINALIZAR_CONTROLE', e);

            // A habilitação no Auth já foi solicitada.
            // O resultado não deve ser interpretado
            // como autorização para repetir o cadastro.

            throw erro(
                'failed-precondition',
                'A confirmação final não foi registrada. ' +
                'Se concluiu o cadastro, tente fazer login. ' +
                'Caso não consiga, procure o estabelecimento.'
            );
        }

        return {
            sucesso: true,
            mensagem: 'Acesso ativado com sucesso.'
        };
    }
);