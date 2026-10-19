const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

// O Firebase Admin já é inicializado pelo projeto FlutterFlow.

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

exports.validarConviteColaborador = functions.https.onCall(
    async (data, context) => {

        // 1. Validar o formato do token.

        const token = data && data.token;

        if (
            typeof token !== 'string' ||
            !/^[a-fA-F0-9]{64}$/.test(token)
        ) {
            throw erro(
                'invalid-argument',
                'Token de convite inválido.'
            );
        }

        const db = admin.firestore();

        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const resultado = await db.collection('convite')
            .where('token_hash', '==', tokenHash)
            .limit(1)
            .get();

        if (resultado.empty) {
            throw erro(
                'not-found',
                'Convite inválido ou não encontrado.'
            );
        }

        const conviteDoc = resultado.docs[0];
        const conviteRef = conviteDoc.ref;
        const convite = conviteDoc.data();

        // 2. Identificar o colaborador.

        const colaboradorRef = convite.colaborador_ref;

        if (!refColecao(colaboradorRef, 'colaboradores')) {
            throw erro(
                'failed-precondition',
                'Colaborador do convite inválido.'
            );
        }

        const colaboradorDoc = await colaboradorRef.get();

        if (!colaboradorDoc.exists) {
            throw erro(
                'not-found',
                'Colaborador não encontrado.'
            );
        }

        const colaborador = colaboradorDoc.data();

        // 3. Identificar o estabelecimento e a matriz.

        const estabelecimentoRef =
            colaborador.estabelecimento_ref;

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
                'Referência da matriz inválida.'
            );
        }

        const controleRef = db
            .collection('controle_convites')
            .doc(colaboradorRef.id);

        const [matrizDoc, controleDoc] =
            await Promise.all([
                matrizRef.get(),
                controleRef.get()
            ]);

        if (
            !matrizDoc.exists ||
            matrizDoc.data().tipo !== 'MATRIZ'
        ) {
            throw erro(
                'failed-precondition',
                'Matriz inválida.'
            );
        }

        if (!controleDoc.exists) {
            throw erro(
                'failed-precondition',
                'Controle do convite não encontrado.'
            );
        }

        const matriz = matrizDoc.data();
        const controle = controleDoc.data();

        // 4. Conferir os vínculos e os dados do convite.

        if (
            !igual(convite.colaborador_ref, colaboradorRef) ||
            !igual(controle.convite_ref, conviteRef) ||
            convite.role !== 'COLABORADOR' ||
            colaborador.ativo !== true
        ) {
            throw erro(
                'failed-precondition',
                'Convite ou colaborador indisponível.'
            );
        }

        const email = emailNormal(convite.email);

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            email !== emailNormal(colaborador.email)
        ) {
            throw erro(
                'failed-precondition',
                'E-mail do colaborador inconsistente.'
            );
        }

        // CT-10: o convite pertence ao estabelecimento
        // original. Transferências não são automáticas.

        if (
            !refColecao(convite.rede_ref, 'redes_franquias') ||
            !refColecao(colaborador.rede_ref, 'redes_franquias') ||
            !igual(convite.rede_ref, colaborador.rede_ref) ||
            !igual(
                convite.estabelecimento_ref,
                estabelecimentoRef
            ) ||
            !igual(
                estabelecimento.rede_ref,
                colaborador.rede_ref
            ) ||
            !igual(
                matriz.rede_ref,
                colaborador.rede_ref
            )
        ) {
            throw erro(
                'failed-precondition',
                'Vínculos de rede inconsistentes.'
            );
        }

        if (
            !(
                estabelecimento.tipo === 'MATRIZ' &&
                igual(estabelecimentoRef, matrizRef)
            ) &&
            !(
                estabelecimento.tipo === 'FILIAL' &&
                igual(estabelecimento.matriz_ref, matrizRef)
            )
        ) {
            throw erro(
                'failed-precondition',
                'Vínculo com a matriz inconsistente.'
            );
        }

        if (
            typeof estabelecimento.nome_fantasia !== 'string' ||
            !estabelecimento.nome_fantasia.trim() ||
            typeof colaborador.nome !== 'string' ||
            !colaborador.nome.trim()
        ) {
            throw erro(
                'failed-precondition',
                'Nome do colaborador ou estabelecimento inválido.'
            );
        }

        // 5. Validar o estado do credenciamento.
        //
        // A função é pública, mas não autoriza
        // recuperação ou alteração de contas.
        //
        // Uma reserva expirada não comprova que
        // nenhuma conta foi criada no Authentication.

        if (convite.envio_status !== 'ENVIADO') {
            throw erro(
                'failed-precondition',
                'O envio deste convite não foi confirmado.'
            );
        }

        if (controle.status === 'PROCESSANDO') {

            const expReserva = ms(controle.reserva_expira_em);

            if (
                expReserva === null ||
                expReserva > Date.now()
            ) {
                throw erro(
                    'failed-precondition',
                    'Este convite está em ativação. ' +
                    'Tente novamente mais tarde.'
                );
            }

            throw erro(
                'failed-precondition',
                'A ativação foi interrompida. ' +
                'Não repita o cadastro. ' +
                'Procure o responsável pelo estabelecimento.'
            );
        }

        // CT-02 e CT-04:
        // CONCLUIDO representa cadastro confirmado
        // no Firestore, mas não comprova, isoladamente,
        // que a conta está desabilitada no Authentication.

        if (controle.status === 'CONCLUIDO') {
            throw erro(
                'failed-precondition',
                'O cadastro já foi registrado. ' +
                'Tente acessar sua conta. ' +
                'Se não conseguir, procure o responsável ' +
                'pelo estabelecimento.'
            );
        }

        // RC-10:
        // Não recuperar contas pelo token público
        // depois que o convite foi utilizado.

        if (controle.status === 'ATIVADO') {
            throw erro(
                'already-exists',
                'Este convite já foi utilizado. ' +
                'Acesse com suas credenciais.'
            );
        }

        if (
            controle.status !== 'DISPONIVEL' ||
            convite.usado !== false ||
            controle.usado !== false ||
            colaborador.user_ref
        ) {
            throw erro(
                'failed-precondition',
                'Convite indisponível ou já utilizado.'
            );
        }

        // 6. Validar prazo somente para novas ativações.
        //
        // CT-05:
        // As 72 horas limitam o início da ativação.
        // A confirmação posterior será responsabilidade
        // da função aceitarConviteColaborador.

        const agora = Date.now();
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
                'Convite expirado ou com validade inconsistente.'
            );
        }

        // 7. Retornar somente os dados necessários
        // para apresentar o formulário de ativação.

        return {
            valido: true,
            nomeEstabelecimento:
                estabelecimento.nome_fantasia.trim(),
            nomeColaborador:
                colaborador.nome.trim(),
            emailColaborador:
                email
        };
    }
);