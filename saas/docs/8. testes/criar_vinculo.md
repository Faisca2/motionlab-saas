# Talleria — Evidência de Teste TE-03

**Módulo:** Gestão de vínculos de colaboradores  
**Teste:** TE-03 — Criação de vínculo de colaborador — Comando CRIAR  
**Período de execução:** Outubro de 2026  
**Ambiente:** Desenvolvimento — FlutterFlow / Firebase  
**Executor:** Equipe de desenvolvimento Talleria  
**Situação:** Execução realizada — consolidação de evidências pendente

---

## 1. Objetivo

Validar a jornada de criação de vínculo de colaborador no Talleria, por meio do comando `CRIAR` da Cloud Function `gerenciarVinculoColaborador`.

O teste contempla a integração entre a interface FlutterFlow e a Cloud Function, a persistência do colaborador no Firestore e a reserva de vínculo ativo na coleção `vinculos_ativos`.

Também busca verificar o tratamento de tentativas de criação duplicada, respeitando a regra de negócio que estabelece, para uma mesma rede, no máximo um vínculo ativo por identidade.

A criação do vínculo operacional não representa, por si só, o credenciamento de acesso à aplicação. O processo de convite e ativação é tratado separadamente.

## 2. Cenário de teste

**Rede/Matriz:** Matriz 01 0710  
**Ambiente operacional:** Filial vinculada à matriz  
**Operação:** `CRIAR`  
**Cloud Function:** `gerenciarVinculoColaborador`  
**Interface:** `criarColaboradorModal`

O fluxo foi implementado para que a criação do vínculo seja realizada pelo backend, evitando que a interface grave diretamente os documentos envolvidos na operação.

**Colaborador utilizado na validação:** Raimundo  
**E-mail utilizado:** `filiado.psm@gmail.com`  
**Situação inicial:** Identidade sem vínculo ativo correspondente na rede, conforme o cenário de criação executado.

A validação também contemplou tentativa de cadastro duplicado.

## 3. Execução e evidências

### EV-TE03-01 — Integração da interface com o comando CRIAR

A modal `criarColaboradorModal` foi configurada para executar a Cloud Function `gerenciarVinculoColaborador`, utilizando o comando `CRIAR`.

O fluxo passou a concentrar no backend a operação de criação do vínculo.

**Resultado:** Integração implementada e utilizada nos testes.

**Evidência:** Configuração da ação na modal FlutterFlow — captura pendente de consolidação.

### EV-TE03-02 — Criação válida de colaborador

Foi executado o cadastro de Raimundo pelo fluxo atual.

A Cloud Function concluiu a operação e retornou o status:

`CRIADO`

**Resultado:** Criação válida concluída com sucesso.

**Evidência:** Resposta da Cloud Function observada durante a execução. Captura pendente de consolidação.

### EV-TE03-03 — Persistência do vínculo no Firestore

A criação válida resultou no registro operacional do colaborador na coleção `colaboradores`.

O vínculo está associado à rede e ao estabelecimento correspondente.

**Resultado:** Persistência do vínculo observada no fluxo de criação.

**Evidência:** Registro no Firestore. Pendente consolidar captura dos campos e referências para comprovação documental integral.

### EV-TE03-04 — Reserva de vínculo ativo

A operação `CRIAR` produziu uma reserva na coleção `vinculos_ativos` para a identidade cadastrada.

A identificação da reserva utiliza a composição do identificador da rede com o hash SHA-256 do e-mail normalizado.

O e-mail é normalizado por remoção de espaços nas extremidades e conversão para letras minúsculas.

**Resultado:** Reserva criada pelo fluxo atual.

