const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

// Firebase Admin inicializado pelo projeto FlutterFlow.

const PRAZO_MS = 72 * 60 * 60 * 1000;

const URL_APP = 'https://motion-lab-rqosl0.flutterflow.app';

// const URL_APP = 'https://app.talleria.com.br';
const REMETENTE = 'Talleria <convites@talleria.com.br>';

const erro = (codigo, mensagem) =>
    new functions.https.HttpsError(codigo, mensagem);

const refColecao = (ref, nome) =>
    !!ref && !!ref.parent && ref.parent.path === nome;

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

const htmlEscape = (valor) =>
    String(valor).replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[c]);

async function enviarResend(
    chave,
    destinatario,
    nome,
    estabelecimento,
    link,
    id
) {
    const resposta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${chave}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `convite-${id}`
        },
        body: JSON.stringify({
            from: REMETENTE,
            to: [destinatario],
            subject: 'Convite para acessar o Talleria',
            html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h2>Convite para o Talleria</h2>
          <p>Olá, ${htmlEscape(nome)}!</p>
          <p>Você foi convidado a acessar o estabelecimento
          <strong>${htmlEscape(estabelecimento)}</strong>.</p>
          <p><a href="${htmlEscape(link)}">Ativar meu acesso</a></p>
          <p>O convite expira em 72 horas.
          Se não o esperava, ignore esta mensagem.</p>
        </div>
      `
        })
    });

    if (!resposta.ok) {
        throw new Error(`Resend HTTP ${resposta.status}`);
    }

    const retorno = await resposta.json();

    if (!retorno || !retorno.id) {
        throw new Error('Resend sem confirmação de envio');
    }

    return retorno.id;
}

exports.emitirConviteColaborador = functions
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {

        // 1. Autenticação e parâmetros.

        if (!context.auth) {
            throw erro(
                'unauthenticated',
                'Usuário não autenticado.'
            );
        }

        const id = data && data.colaboradorId;

        if (
            typeof id !== 'string' ||
            !/^[a-zA-Z0-9]{20}$/.test(id)
        ) {
            throw erro(
                'invalid-argument',
                'Identificador do colaborador inválido.'
            );
        }

        const chave = process.env.RESEND_API_KEY;

        if (!chave) {
            throw erro(
                'internal',
                'Serviço de e-mail indisponível.'
            );
        }

        const db = admin.firestore();

        const usuarioRef = db
            .collection('users')
            .doc(context.auth.uid);

        const alvoRef = db
            .collection('colaboradores')
            .doc(id);

        const controleRef = db
            .collection('controle_convites')
            .doc(id);

        const conviteRef = db
            .collection('convite')
            .doc();

        // 2. Identificação preliminar.
        // Os vínculos serão revalidados na transação.

        const [usuarioDoc, alvoDoc] = await Promise.all([
            usuarioRef.get(),
            alvoRef.get()
        ]);

        if (!usuarioDoc.exists) {
            throw erro(
                'permission-denied',
                'Usuário não encontrado.'
            );
        }

        if (!alvoDoc.exists) {
            throw erro(
                'not-found',
                'Colaborador não encontrado.'
            );
        }

        const usuario = usuarioDoc.data();
        const alvo = alvoDoc.data();

        const estabelecimentoRef =
            alvo.estabelecimento_ref;

        if (!refColecao(estabelecimentoRef, 'estabelecimentos')) {
            throw erro(
                'failed-precondition',
                'Estabelecimento inválido.'
            );
        }

        const estabelecimentoDoc =
            await estabelecimentoRef.get();

        if (!estabelecimentoDoc.exists) {
            throw erro(
                'not-found',
                'Estabelecimento não encontrado.'
            );
        }

        const estabelecimento = estabelecimentoDoc.data();

        const matrizRef =
            estabelecimento.tipo === 'MATRIZ'
                ? estabelecimentoRef
                : estabelecimento.tipo === 'FILIAL'
                    ? estabelecimento.matriz_ref
                    : null;

        if (!refColecao(matrizRef, 'estabelecimentos')) {
            throw erro(
                'failed-precondition',
                'Matriz inválida.'
            );
        }

        // GERENTE:
        // users.role = COLABORADOR
        // colaboradores.perfil_acesso = GERENTE

        let gerenteRef = null;

        if (usuario.role !== 'MASTER') {

            if (usuario.role !== 'COLABORADOR') {
                throw erro(
                    'permission-denied',
                    'Usuário sem permissão para emitir convites.'
                );
            }

            const gestores = await db
                .collection('colaboradores')
                .where('user_ref', '==', usuarioRef)
                .limit(2)
                .get();

            if (gestores.size !== 1) {
                throw erro(
                    'permission-denied',
                    'Vínculo do gerente ausente ou ambíguo.'
                );
            }

            gerenteRef = gestores.docs[0].ref;
        }

        // 3. Token seguro.
        // Somente o hash será armazenado.

        const token = crypto
            .randomBytes(32)
            .toString('hex');

        const hash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 4. Autorização, concorrência e emissão.
        // Nenhum envio externo ocorre na transação.

        const dados = await db.runTransaction(async (tx) => {

            const refs = [
                usuarioRef,
                alvoRef,
                estabelecimentoRef,
                matrizRef,
                controleRef
            ];

            if (gerenteRef) {
                refs.push(gerenteRef);
            }

            const docs = await Promise.all(
                refs.map(ref => tx.get(ref))
            );

            const [uDoc, aDoc, eDoc, mDoc, cDoc, gDoc] = docs;

            if (
                !uDoc.exists ||
                !aDoc.exists ||
                !eDoc.exists ||
                !mDoc.exists
            ) {
                throw erro(
                    'failed-precondition',
                    'Documentos de credenciamento indisponíveis.'
                );
            }

            const u = uDoc.data();
            const a = aDoc.data();
            const e = eDoc.data();
            const m = mDoc.data();

            const agora = Date.now();

            const criadoEm =
                admin.firestore.Timestamp.fromMillis(agora);

            const expiraEm =
                admin.firestore.Timestamp.fromMillis(
                    agora + PRAZO_MS
                );

            const email = emailNormal(a.email);

            // 4.1. Dados obrigatórios.

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                typeof a.nome !== 'string' ||
                !a.nome.trim() ||
                typeof e.nome_fantasia !== 'string' ||
                !e.nome_fantasia.trim()
            ) {
                throw erro(
                    'failed-precondition',
                    'Dados de contato do convite inválidos.'
                );
            }

            if (
                a.ativo !== true ||
                a.user_ref ||
                !['GERENTE', 'ATENDENTE', 'COLABORADOR']
                    .includes(a.perfil_acesso)
            ) {
                throw erro(
                    'failed-precondition',
                    'Colaborador indisponível ou perfil inválido.'
                );
            }

            // 4.2. Isolamento multi-tenant.

            if (
                !refColecao(u.rede_ref, 'redes_franquias') ||
                !igual(u.rede_ref, a.rede_ref) ||
                !igual(u.rede_ref, e.rede_ref) ||
                !igual(u.rede_ref, m.rede_ref) ||
                !igual(a.estabelecimento_ref, estabelecimentoRef) ||
                m.tipo !== 'MATRIZ' ||
                !(
                    (
                        e.tipo === 'MATRIZ' &&
                        igual(estabelecimentoRef, matrizRef)
                    ) ||
                    (
                        e.tipo === 'FILIAL' &&
                        igual(e.matriz_ref, matrizRef)
                    )
                )
            ) {
                throw erro(
                    'permission-denied',
                    'Rede ou estabelecimento inconsistente.'
                );
            }

            // 4.3. Permissões do emissor.

            if (u.role === 'MASTER') {

                if (!igual(u.matriz_ref, matrizRef)) {
                    throw erro(
                        'permission-denied',
                        'Matriz não autorizada.'
                    );
                }

            } else {

                if (
                    u.role !== 'COLABORADOR' ||
                    !gDoc ||
                    !gDoc.exists
                ) {
                    throw erro(
                        'permission-denied',
                        'Emissor não autorizado.'
                    );
                }

                const g = gDoc.data();

                if (
                    g.ativo !== true ||
                    g.perfil_acesso !== 'GERENTE' ||
                    !igual(g.user_ref, usuarioRef) ||
                    !igual(g.rede_ref, u.rede_ref) ||
                    !igual(g.estabelecimento_ref, estabelecimentoRef) ||
                    !igual(u.matriz_ref, matrizRef) ||
                    a.perfil_acesso === 'GERENTE'
                ) {
                    throw erro(
                        'permission-denied',
                        'Gerente não autorizado para este convite.'
                    );
                }
            }

            // 4.4. Reemissão.
            // Permitida somente quando o convite anterior
            // estiver DISPONIVEL, expirado e não utilizado.

            if (cDoc.exists) {

                const controle = cDoc.data();
                const expControle = ms(controle.expira_em);

                if (
                    controle.status !== 'DISPONIVEL' ||
                    controle.usado !== false ||
                    expControle === null ||
                    expControle > agora ||
                    !refColecao(controle.convite_ref, 'convite')
                ) {
                    throw erro(
                        'already-exists',
                        'Existe convite vigente ou ativação pendente. ' +
                        'Verifique o credenciamento antes de reemitir.'
                    );
                }

                const anteriorDoc =
                    await tx.get(controle.convite_ref);

                if (!anteriorDoc.exists) {
                    throw erro(
                        'failed-precondition',
                        'Convite anterior não encontrado.'
                    );
                }

                const anterior = anteriorDoc.data();

                // CT-09 e reforço de integridade histórica.
                // Não reassociar convites entre redes ou filiais.

                if (
                    !igual(anterior.colaborador_ref, alvoRef) ||
                    !igual(anterior.rede_ref, a.rede_ref) ||
                    !igual(
                        anterior.estabelecimento_ref,
                        estabelecimentoRef
                    ) ||
                    anterior.usado !== false ||
                    ms(anterior.expira_em) !== expControle
                ) {
                    throw erro(
                        'failed-precondition',
                        'Histórico do convite inconsistente. ' +
                        'Solicite verificação administrativa.'
                    );
                }
            }

            // 4.5. Criar convite.
            // Convites históricos não são apagados.

            tx.create(conviteRef, {
                token_hash: hash,
                colaborador_ref: alvoRef,
                email,
                role: 'COLABORADOR',
                usado: false,
                criado_em: criadoEm,
                expira_em: expiraEm,
                rede_ref: u.rede_ref,
                estabelecimento_ref: estabelecimentoRef,
                criado_por_ref: usuarioRef,
                envio_status: 'PENDENTE'
            });

            // 4.6. Controle único por colaborador.

            tx.set(controleRef, {
                convite_ref: conviteRef,
                usado: false,
                status: 'DISPONIVEL',
                criado_em: criadoEm,
                expira_em: expiraEm
            });

            tx.update(alvoRef, {
                atualizado_em: criadoEm,
                atualizado_por_ref: usuarioRef
            });

            return {
                email,
                nome: a.nome.trim(),
                estabelecimento: e.nome_fantasia.trim()
            };
        });

        // 5. Envio após a transação.
        // CT-08: não repetir automaticamente
        // quando o resultado for incerto.

        const link =
            `${URL_APP}/aceitarConvitePage?token=${token}`;

        // Antes de chamar o provedor, registrar que
        // o envio será tentado. Se esta gravação falhar,
        // não enviar o e-mail.

        try {
            await conviteRef.update({
                envio_status: 'ENVIO_INCERTO',
                envio_atualizado_em:
                    admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) {

            console.error(
                'Falha ao registrar início da tentativa de envio:',
                e.code || e.name
            );

            throw erro(
                'internal',
                'Convite registrado, mas o envio não foi iniciado. ' +
                'Solicite verificação administrativa.'
            );
        }

        let emailId;

        try {

            emailId = await enviarResend(
                chave,
                dados.email,
                dados.nome,
                dados.estabelecimento,
                link,
                conviteRef.id
            );

        } catch (e) {

            console.error(
                'Resultado de envio incerto:',
                e.code || e.message
            );

            // ENVIO_INCERTO já foi persistido antes
            // da chamada ao provedor.
            // Não reenviar automaticamente.

            throw erro(
                'unavailable',
                'Convite registrado, mas envio não confirmado. ' +
                'Verifique o envio antes de tentar novamente.'
            );
        }

        // 6. Confirmação do aceite pelo Resend.
        // ENVIADO não significa entregue ao destinatário.

        try {

            await conviteRef.update({
                envio_status: 'ENVIADO',
                resend_email_id: emailId,
                envio_atualizado_em:
                    admin.firestore.FieldValue.serverTimestamp()
            });

        } catch (e) {

            console.error(
                'Envio aceito, confirmação não registrada:',
                e.code || e.name
            );

            // O estado anterior permanece ENVIO_INCERTO.
            // O Resend pode ter aceitado o envio.
            // Não realizar nova tentativa automaticamente.

            throw erro(
                'internal',
                'E-mail aceito pelo serviço, mas a confirmação ' +
                'não foi registrada. Solicite verificação.'
            );
        }

        return {
            sucesso: true,
            conviteId: conviteRef.id,
            mensagem: 'Convite aceito pelo serviço de e-mail.'
        };
    });