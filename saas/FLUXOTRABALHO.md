## 21/09/2026 — Higienização da collection `clientes`

## Higienização da collection `agendamentos`

Após a conclusão da revisão da collection `clientes`, foi iniciada a análise da collection `agendamentos`.

A estrutura encontrada no FlutterFlow era:

```text
agendamentos
├── data_hora            DateTime
├── status               String
├── estabelecimento_ref  Doc Ref → estabelecimentos
├── criado_em            DateTime
├── atualizado_em        DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_por_ref   Doc Ref → users
├── servicos_ref         List<Doc Ref → servicos>
├── colaborador_ref      Doc Ref → colaboradores
└── cliente_ref          Doc Ref → clientes
```

---

### Responsabilidade da collection

Antes da análise individual dos campos, foi reafirmada a separação entre `agendamentos` e `atendimentos`.

```text
AGENDAMENTO
→ representa uma previsão e organiza uma intenção futura de atendimento.

ATENDIMENTO
→ registra o fato operacional efetivamente ocorrido.
```

Portanto, o Agendamento responde essencialmente:

```text
quem       → cliente_ref
onde       → estabelecimento_ref
com quem   → colaborador_ref
o quê      → servicos_ref
quando     → data_hora
situação   → status
```

O que efetivamente ocorreu será posteriormente registrado em `atendimentos`.

---

## Data e hora

Foi analisado inicialmente se seria necessário armazenar separadamente o horário previsto de término do Agendamento.

Paulo definiu:

> "Ele deve ser calculado a partir de `data_hora + duração prevista dos serviços`."

Assim, não será criado um campo como:

```text
data_hora_fim
```

O horário final é um dado derivável.

Exemplo:

```text
data_hora = 14:00

Corte → 30 minutos
Barba → 20 minutos

duração prevista = 50 minutos
término previsto = 14:50
```

Paulo refinou ainda a semântica de `data_hora`:

> "Determina a previsão de início do atendimento."

Descrição definida:

> **Determina a previsão de início do Atendimento.**

Portanto:

```text
agendamentos.data_hora
→ previsão de início

duração prevista dos serviços
→ determina o intervalo reservado na agenda
```

A disponibilidade do colaborador deverá considerar todo o intervalo calculado, e não apenas verificar se o instante de `data_hora` está disponível.

---

## Status do Agendamento

Inicialmente foram apresentados os seguintes estados:

```text
AGENDADO
CONFIRMADO
NAO_COMPARECEU
CANCELADO
AGUARDANDO
```

Durante a análise, Paulo esclareceu uma particularidade importante sobre `AGUARDANDO`:

> "Eu queria dizer no aguardando a manifestação do colaborador em demonstrar ciência da agenda."

Portanto, `AGUARDANDO` não significa que o Cliente chegou ao estabelecimento e está esperando ser atendido.

Ele representa um novo Agendamento que ainda aguarda a ciência do Colaborador.

A jornada ficou definida como:

```text
AGUARDANDO
→ Agendamento criado e aguardando ciência do Colaborador.

AGENDADO
→ Colaborador tomou ciência do Agendamento.

CONFIRMADO
→ Cliente confirmou o comparecimento.

ATENDIDO
→ compromisso agendado foi cumprido.

NAO_COMPARECECEU
→ Cliente não compareceu.

CANCELADO
→ Agendamento foi cancelado.
```

Foi acrescentado `ATENDIDO` em vez de utilizar `REALIZADO`.

A escolha evita confundir o encerramento da jornada do Agendamento com o estado operacional do Atendimento:

```text
agendamentos.status = ATENDIDO
→ o compromisso agendado foi cumprido.

atendimentos.status = REALIZADO
→ o fato operacional foi efetivamente concluído.
```

Descrição definida para `status`:

> **Indica a situação atual do Agendamento ao longo de sua jornada.**

---

## Cancelamento

Foi analisada também a autoridade para cancelamento do Agendamento.

Paulo definiu:

> "O cancelamento pode ser pelo estabelecimento ou pelo cliente. O colaborador solicita o cancelamento à gerência ou a gerência o faz de ofício."

A partir disso, foi estabelecido que o Colaborador não efetiva diretamente o cancelamento.

Posteriormente, Paulo detalhou os cenários:

> "Cancelado por cliente logado ficará com status cancelado e atualizado por cliente."

> "Cancelado por cliente solicitando status cancelado e atualizado por gerente."

> "Cancelado por colaborador solicitando status cancelado e atualizado por gerente."

> "Cancelado por motivos adm status cancelado e atualizado por gerente."

A regra ficou:

```text
Cliente logado cancela
→ status = CANCELADO
→ atualizado_por_ref = user do Cliente

Cliente solicita cancelamento à gerência
→ status = CANCELADO
→ atualizado_por_ref = user do Gerente

Colaborador solicita cancelamento
→ status = CANCELADO
→ atualizado_por_ref = user do Gerente

Gerência cancela administrativamente
→ status = CANCELADO
→ atualizado_por_ref = user do Gerente
```

Foi consolidado o princípio:

> **Quem solicita o cancelamento não é necessariamente quem executa a alteração no sistema.**

Por isso, não foi considerado necessário criar neste momento um campo específico como:

```text
cancelado_por_ref
```

O `atualizado_por_ref` registra quem efetivamente realizou a alteração.

Caso futuramente exista necessidade de registrar solicitante, justificativa ou motivo administrativo, essa necessidade será modelada especificamente, sem sobrecarregar antecipadamente o `status`.

---

## Estabelecimento

O campo:

```text
estabelecimento_ref
```

determina a unidade da Rede para a qual o atendimento foi agendado.

Paulo definiu sua descrição como:

> **Estabelecimento para onde foi agendado o Atendimento.**

Esse vínculo permanece necessário mesmo que o Cliente pertença à Rede.

Assim:

```text
Cliente
→ pertence à Rede

Agendamento
→ determina em qual Estabelecimento o Cliente pretende ser atendido

Atendimento
→ registra onde o fato operacional efetivamente ocorreu
```

---

## Auditoria

Foi identificado o conjunto padrão já adotado pelo MotionLab:

```text
criado_em
criado_por_ref
atualizado_em
atualizado_por_ref
```

Paulo resumiu:

> "Clássico conjunto de auditoria."

Nenhuma alteração foi necessária nesses campos.

O `atualizado_por_ref` também participa da rastreabilidade das alterações realizadas no Agendamento, inclusive cancelamentos.

---

## Serviços previstos

O campo:

```text
servicos_ref
List<Doc Ref → servicos>
```

foi mantido.

Descrição definida:

> **Serviços previstos para serem realizados no Agendamento.**

A utilização da palavra **previstos** foi considerada importante porque o conteúdo do Agendamento pode ser diferente do Atendimento efetivamente realizado.

Paulo apresentou o exemplo:

> "Um agendamento pode prever cabelo e barba e o cliente ao chegar afirma: só vou cortar, pois tenho um compromisso e não tenho tempo para a barba."

Nesse cenário:

```text
AGENDAMENTO ORIGINAL
14:00
├── Cabelo → 30 min
└── Barba  → 20 min

Previsão:
14:00 até 14:50
```

Ao Cliente decidir realizar apenas o cabelo, o serviço de barba deverá ser retirado/cancelado do Agendamento.

Paulo confirmou:

> "Correto, cancela ou retira o serviço agendado."

O Agendamento passa então a representar a previsão vigente:

```text
AGENDAMENTO ALTERADO
14:00
└── Cabelo → 30 min

Nova previsão:
14:00 até 14:30
```

Os 20 minutos anteriormente reservados para a barba retornam à disponibilidade da agenda.

Isso pode permitir:

```text
→ antecipação de outro Agendamento;
→ criação de um encaixe;
→ melhor aproveitamento da agenda do Colaborador.
```

Foi feita uma distinção importante:

> **Não se cancela um Atendimento de barba, pois ele nunca ocorreu. Retira-se ou cancela-se um serviço previsto no Agendamento.**

Quando o Atendimento for registrado, ele conterá somente o fato efetivamente ocorrido:

```text
AGENDAMENTO
→ Cabelo + Barba
→ alterado para somente Cabelo

ATENDIMENTO
→ Cabelo
```

Essa separação também impede que um serviço apenas previsto seja posteriormente interpretado como realizado ou faturável.

Assim:

> **Agendamento registra previsão; Atendimento registra fato.**

No MVP, `servicos_ref` representa a previsão vigente.

Caso futuramente seja necessário preservar todo o histórico das inclusões e retiradas de serviços da agenda, isso poderá ser tratado por mecanismo próprio de histórico/auditoria, sem aumentar antecipadamente a complexidade da collection.

---

## Colaborador

O campo:

```text
colaborador_ref
Doc Ref → colaboradores
```

foi mantido.

Descrição:

> **Colaborador para o qual o Atendimento foi agendado.**

O Colaborador também participa do cálculo da duração prevista quando houver configuração específica de duração para determinado serviço.

---

## Cliente

O campo:

```text
cliente_ref
Doc Ref → clientes
```

foi mantido.

Descrição:

> **Cliente para o qual o Atendimento foi agendado.**

Isso completa a relação básica:

```text
Cliente
   │
   ▼
Agendamento
   ├── Estabelecimento
   ├── Colaborador
   ├── Serviços previstos
   ├── Previsão de início
   └── Status
```

---

## Estado final

A estrutura permaneceu:

```text
agendamentos
├── data_hora            DateTime
├── status               String
├── estabelecimento_ref  Doc Ref → estabelecimentos
├── criado_em            DateTime
├── atualizado_em        DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_por_ref   Doc Ref → users
├── servicos_ref         List<Doc Ref → servicos>
├── colaborador_ref      Doc Ref → colaboradores
└── cliente_ref          Doc Ref → clientes
```

Nenhum novo campo foi necessário durante a higienização.

### Situação

**`agendamentos`: HIGIENIZADA.**

A principal separação de domínio consolidada foi:

> **O Agendamento registra aquilo que está previsto para acontecer. O Atendimento registra aquilo que efetivamente aconteceu.**

Essa distinção permite alterar serviços e horários previstos sem alterar fatos operacionais, recalcular a disponibilidade da agenda e manter o Atendimento como fonte do que efetivamente foi realizado.

Claro. Eu acrescentaria este bloco ao `FLUXOTRABALHO.md`, preservando novamente as observações que levaram às decisões:

````markdown
## Higienização da collection `clientes`

Após a conclusão da revisão de `fluxo_caixa`, foi iniciada a análise da collection `clientes`.

A estrutura encontrada no FlutterFlow era:

```text
clientes
├── user_ref             Doc Ref → users
├── nome                 String
├── telefone             String
├── email                String
├── ativo                Boolean
├── criado_em            DateTime
├── atualizado_em        DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_por_ref   Doc Ref → users
└── rede_ref             Doc Ref → redes_franquias
````

---

### Cliente pertence à Rede ou ao Estabelecimento?

A primeira questão analisada foi se o Cliente deveria pertencer diretamente a um Estabelecimento ou à Rede.

Paulo observou:

> "O cliente é super importante pois é quem mantém o estabelecimento, mas em estatísticas e movimentos o atendimento é quem tem valor para o dono."

Essa observação separou dois conceitos:

```text
CLIENTE
→ entidade de relacionamento

ATENDIMENTO
→ fato operacional e econômico
```

Um Cliente pode frequentar diferentes estabelecimentos da mesma Rede sem precisar possuir cadastros diferentes.

Exemplo:

```text
Rede
 └── Cliente João
      ├── Atendimento → Matriz
      ├── Atendimento → Filial 01
      └── Atendimento → Filial 02
```

Os indicadores financeiros e operacionais não dependem do local onde o Cliente está cadastrado.

O estabelecimento responsável pelo fato econômico é determinado pelo próprio Atendimento.

Paulo acrescentou outro aspecto importante:

> "A experiência do cliente é mais salutar e demonstra organização em não fazer as mesmas perguntas aqui e lá."

A decisão também melhora a experiência do Cliente.

Uma pessoa já identificada pela Rede não deverá fornecer novamente seus dados simplesmente porque está sendo atendida em outra unidade.

### Decisão

> **O Cliente pertence à Rede e pode ser reconhecido pelos estabelecimentos que a compõem. O Atendimento determina em qual estabelecimento ocorreu a relação operacional e econômica.**

Portanto:

```text
clientes.rede_ref
→ mantido

clientes.estabelecimento_ref
→ não necessário
```

---

## Autoagendamento

Foi discutida a função de:

```text
user_ref
```

Paulo esclareceu:

> "Este campo seria para clientes que fazem seu auto agendamento logando no app."

Assim, Cliente e usuário do sistema permanecem conceitos distintos.

```text
Cliente sem user_ref
→ possui cadastro na Rede
→ pode ser atendido normalmente
→ não possui necessariamente acesso ao app

Cliente com user_ref
→ possui identidade de acesso
→ pode utilizar funcionalidades destinadas ao Cliente
→ pode realizar autoagendamento
```

Caso um Cliente já cadastrado posteriormente crie acesso ao app, não deverá ser criado outro Cliente.

O `user_ref` será vinculado ao cadastro existente.

Descrição definida:

> **Usuário vinculado ao Cliente quando este possui acesso ao app para autoagendamento.**

---

## Descrição conceitual da collection

Durante a discussão do autoagendamento, foi consolidada a descrição da collection:

> **O Cliente pertence à Rede e pode ser reconhecido pelos estabelecimentos que a compõem. O Atendimento determina em qual estabelecimento ocorreu a relação operacional e econômica. No autoagendamento, o Cliente escolhe o estabelecimento e o colaborador para realizar o agendamento.**

A escolha de data e horário não foi explicitada nessa descrição porque já está semanticamente compreendida no ato de realizar um agendamento.

---

## Nome

O campo:

```text
nome
```

representa o nome completo utilizado para identificação pessoal do Cliente.

Descrição:

> **Nome completo do Cliente para identificação pessoal.**

Não foi considerada necessária a alteração do nome físico do campo para `nome_completo`.

---

## Telefone / WhatsApp

Paulo definiu uma finalidade operacional importante para o telefone:

> "Telefone necessário para avisar de um cancelamento inesperado, lembrar do agendamento e preferencialmente seja o WhatsApp."

Descrição definida:

> **Telefone de contato do Cliente, preferencialmente WhatsApp, utilizado para comunicações relacionadas ao atendimento e agendamento.**

O campo permanece `String`.

A normalização futura de DDI, DDD e número será tratada quando a jornada de comunicação for implementada.

---

## E-mail

O e-mail existente em `clientes` foi mantido independente do e-mail de `users`.

Mesmo que normalmente sejam iguais quando o Cliente possui login, representam responsabilidades diferentes:

```text
clientes.email
→ contato do Cliente

users.email
→ identidade/autenticação do usuário
```

Isso evita que o cadastro de relacionamento dependa diretamente da estrutura de autenticação.

Descrição:

> **E-mail de contato do Cliente.**

---

## Confirmação dos canais de contato

Durante a análise de telefone e e-mail, Paulo registrou um requisito para implementação futura:

> "Em ambos os casos é necessário enviar um e-mail confirmando se pertence ou reconhece o cliente."

E posteriormente esclareceu:

> "O comentário é para lembrar da necessidade de confirmação assim como o WhatsApp deverá ter a confirmação por SMS."

Foi registrado como requisito futuro:

```text
E-mail
→ deverá possuir processo de confirmação.

Telefone / WhatsApp
→ deverá possuir processo de confirmação do número.
```

Não foram adicionados neste momento campos como:

```text
email_verificado
telefone_verificado
```

A decisão sobre onde armazenar esses estados será tomada quando a jornada de confirmação for implementada, considerando inclusive os recursos disponíveis na autenticação.

---

## Cliente ativo

O campo:

```text
ativo
```

também teve sua semântica definida.

Paulo propôs:

> "Ativo entendo que é um cliente que faz parte da carteira de clientes da rede."

Portanto, `ativo` não significa:

* possuir login;
* estar utilizando o aplicativo;
* possuir atendimento recente.

Significa fazer parte da carteira ativa da Rede.

Descrição:

> **Indica se o Cliente faz parte da carteira ativa de clientes da Rede.**

Inicialmente foi considerada a possibilidade de um novo agendamento reativar automaticamente um Cliente.

Entretanto, Paulo apresentou um cenário relevante:

> "Se tiver algum atrito ou litígio com o dono e ele quer apresentar uma agenda sempre lotada."

Nesse cenário, um Cliente poderia realizar agendamentos sem intenção de comparecimento, comprometendo a agenda do estabelecimento.

Isso alterou a regra inicialmente considerada.

### Regra definida

```text
ativo = true
→ Cliente pertence à carteira ativa.
→ pode realizar novos agendamentos.

ativo = false
→ cadastro permanece.
→ histórico permanece.
→ não pode realizar novos agendamentos.
→ reativação depende de ação da Rede.
```

Portanto, um novo agendamento não deverá reativar automaticamente um Cliente inativo.

O modelo continua utilizando apenas `Boolean` no MVP.

Caso futuramente seja necessário distinguir situações como:

```text
ATIVO
INATIVO
BLOQUEADO
```

o domínio poderá evoluir para um status mais expressivo.

Essa complexidade não foi introduzida antecipadamente.

---

## Auditoria

Foram mantidos os campos:

```text
criado_em
criado_por_ref
atualizado_em
atualizado_por_ref
```

Semântica:

```text
criado_em
→ Data e hora em que o Cliente foi cadastrado na Rede.

criado_por_ref
→ Usuário responsável pelo cadastro do Cliente.

atualizado_em
→ Data e hora da última atualização do cadastro.

atualizado_por_ref
→ Usuário responsável pela última atualização.
```

`criado_em` não representa primeiro Atendimento nem criação da conta de autenticação.

Representa especificamente a criação do documento `clientes`.

---

## Rede

O campo:

```text
rede_ref
```

foi mantido como vínculo principal do Cliente.

Descrição:

> **Rede à qual pertence o Cliente.**

A unidade onde cada relação operacional ocorreu continuará sendo determinada por `agendamentos` e `atendimentos`.

---

## Estado final

A collection permaneceu estruturalmente simples:

```text
clientes
├── user_ref             Doc Ref → users
├── nome                 String
├── telefone             String
├── email                String
├── ativo                Boolean
├── criado_em            DateTime
├── atualizado_em        DateTime
├── criado_por_ref       Doc Ref → users
├── atualizado_por_ref   Doc Ref → users
└── rede_ref             Doc Ref → redes_franquias
```

### Situação

**`clientes`: HIGIENIZADA.**

A principal decisão arquitetural consolidada foi:

> **Cliente representa o relacionamento da pessoa com a Rede. Atendimento representa o fato operacional e econômico ocorrido em determinado Estabelecimento.**

Isso permite que a Rede reconheça o mesmo Cliente entre suas unidades sem duplicar cadastros e, simultaneamente, preserva a independência dos indicadores operacionais e financeiros de cada estabelecimento.

```

Esse trecho registra não apenas como `clientes` terminou, mas principalmente **por que o Cliente ficou na Rede e não no Estabelecimento**, além do caso que mudou nossa interpretação de `ativo`. 
```

## 20/09/2026 — Modelagem do Atendimento como Fato Operacional e sua relação com o Fluxo de Caixa

### Contexto

A revisão da collection `fluxo_caixa` mostrou que não bastava registrar entradas e saídas financeiras.

Era necessário identificar corretamente o fato que originou cada movimentação, permitindo:

- auditoria;
- conciliação;
- rastreabilidade;
- reconstrução histórica;
- redução de investigação manual;
- prevenção de dupla contabilização.

A discussão levou à criação e modelagem da collection `atendimentos`.

---

## 1. Separação entre Agendamento e Atendimento

Durante a análise foi estabelecida a seguinte distinção:

> **Paulo:** "Realizar é prestar o serviço ou vender o produto, agendar é organizar a prestação do serviço."

Com isso:

```text
AGENDAMENTO
→ organiza previamente a prestação do serviço.

ATENDIMENTO
→ registra aquilo que efetivamente aconteceu.

Claro. ☕ Vou deixar o trecho pronto para você copiar no `FLUXOTRABALHO.md`, preservando desta vez **suas observações que provocaram as decisões**.

````markdown
## Modelagem do Atendimento como Fato Operacional e sua relação com o Fluxo de Caixa

### Contexto

A revisão da collection `fluxo_caixa` mostrou que não bastava registrar entradas e saídas financeiras.

Era necessário identificar corretamente o fato que originou cada movimentação, permitindo:

- auditoria;
- conciliação;
- rastreabilidade;
- reconstrução histórica;
- redução de investigação manual;
- prevenção de dupla contabilização.

A discussão levou à criação e modelagem da collection `atendimentos`.

---

## 1. Separação entre Agendamento e Atendimento

Durante a análise foi estabelecida a seguinte distinção:

> **Paulo:** "Realizar é prestar o serviço ou vender o produto, agendar é organizar a prestação do serviço."

Com isso:

```text
AGENDAMENTO
→ organiza previamente a prestação do serviço.

ATENDIMENTO
→ registra aquilo que efetivamente aconteceu.
````

Um agendamento pode ser cancelado, resultar em não comparecimento ou nunca gerar receita.

Portanto, o agendamento não representa o fato operacional realizado.

### Refinamento

Foi posteriormente estabelecido:

> **Paulo:** "Atendimento é tanto para serviço como para produto."

Assim, Atendimento passou a representar a operação realizada com o cliente, podendo conter:

* somente serviços;
* somente produtos;
* serviços e produtos simultaneamente.

Uma venda avulsa de produto também pode constituir um Atendimento, mesmo sem existir agendamento anterior.

### Decisão

```text
Agendamento
     ↓ opcional
Atendimento
     ├── Serviços
     └── Produtos
          ↓
      Fluxo de Caixa
```

O **Atendimento é o fato operacional**.

O `fluxo_caixa` registra os fatos financeiros decorrentes desse fato operacional.

---

## 2. Criação da collection `atendimentos`

Foi criada:

```text
atendimentos
```

Referências iniciais:

```text
rede_ref              Doc Reference → redes_franquias
estabelecimento_ref   Doc Reference → estabelecimentos
cliente_ref           Doc Reference → clientes
colaborador_ref       Doc Reference → colaboradores
agendamento_ref       Doc Reference → agendamentos
```

`agendamento_ref` é opcional, pois um Atendimento pode existir sem agendamento.

`rede_ref` permanece diretamente no documento para identificação explícita do tenant, facilitando consultas, segurança e auditoria.

---

## 3. Atendimento como fotografia histórica

Durante a modelagem dos itens foi observado que simplesmente guardar referências para `servicos` e `produtos` seria insuficiente.

Preços, comissões e outras condições podem mudar depois da realização.

> **Paulo:** "É importante que seja a ocorrência de alteração dos valores; pode ser minutos, hora, meses e para conciliar e auditar é necessário."

Foi então decidido que os itens do Atendimento seriam **snapshots das condições existentes e efetivamente aplicadas no momento do fato**.

### Princípio

> O histórico deve ser autoexplicativo. A consulta à configuração deve explicar a origem de uma regra, não ser necessária para reconstruir o fato ocorrido.

Paulo observou ainda:

> "Quando precisamos recorrer à regra para explicar o porquê, é por demais custos."

A decisão também possui consequência operacional:

* menos consultas;
* menos reconstrução histórica;
* menos investigação;
* menor custo de suporte;
* maior facilidade de auditoria.

---

## 4. Snapshot de serviços

Foi criado o Data Type:

```text
ItemServicoAtendimentoStruct
```

Campos:

```text
servico_ref                    Doc Reference → servicos
nome                           String
preco_tabela                   Double
preco_aplicado                 Double
duracao_prevista               Integer
comissao_padrao_percentual     Double
comissao_aplicada_percentual   Double
desconto_valor                 Double
```

O `servico_ref` identifica o cadastro de origem.

Os demais campos preservam a fotografia das condições relevantes daquele serviço no momento do Atendimento.

---

## 5. Snapshot de produtos

Foi criado:

```text
ItemProdutoAtendimentoStruct
```

Campos:

```text
produto_ref                    Doc Reference → produtos
nome                           String
codigo_barras                  String
tipo                           String
preco_tabela                   Double
preco_aplicado                 Double
quantidade                     Integer
comissao_padrao_percentual     Double
comissao_aplicada_percentual   Double
desconto_valor                 Double
```

`preco_custo` não foi incluído no snapshot do Atendimento, pois pertence à dimensão de estoque/financeira e não ao fato comercial realizado com o cliente.

---

## 6. Itens dentro do Atendimento

Foram adicionadas a `atendimentos`:

```text
itens_servico
List<Data(ItemServicoAtendimentoStruct)>

itens_produto
List<Data(ItemProdutoAtendimentoStruct)>
```

Um Atendimento pode, portanto, possuir diversos serviços e diversos produtos.

Durante a modelagem surgiu a analogia de que o Atendimento estava ficando:

> **Paulo:** "Quase uma fita de cupom fiscal."

A analogia foi considerada adequada porque o Atendimento passa a preservar uma fotografia detalhada do fato ocorrido, porém contendo informações adicionais de rastreabilidade, colaborador, cliente, rede, estabelecimento, comissões e referências de origem.

---

## 7. Descontos, abatimentos e totais

Paulo observou:

> "No atendimento deverá registrar um possível abatimento ou desconto."

Foi feita a distinção entre:

* desconto aplicado diretamente a um item;
* abatimento aplicado globalmente ao Atendimento.

Os descontos individuais ficam registrados nos respectivos snapshots.

Foram adicionados ao Atendimento:

```text
valor_servicos   Double
valor_produtos   Double
desconto_itens   Double
abatimento       Double
valor_total      Double
```

Exemplo:

```text
Serviços .................. R$ 80,00
Produtos .................. R$ 40,00
Descontos nos itens ....... R$  5,00
Abatimento ................ R$ 10,00
                           ----------
Valor total ............... R$105,00
```

A decisão foi não armazenar somente o resultado final.

O Atendimento deve preservar os componentes necessários para explicar como o valor final foi obtido.

---

## 8. Momento e estado do Atendimento

Foi criado:

```text
realizado_em   DateTime
```

`realizado_em` representa quando o fato operacional efetivamente ocorreu.

Também foi criado:

```text
status   String
```

Domínio conceitual inicial:

```text
ABERTO
EM_ATENDIMENTO
REALIZADO
CANCELADO
```

`realizado_em` somente deverá ser preenchido quando o Atendimento efetivamente atingir o estado `REALIZADO`.

---

## 9. Auditoria

Foram adicionados:

```text
criado_em             DateTime
criado_por_ref        Doc Reference → users
atualizado_em         DateTime
atualizado_por_ref    Doc Reference → users
```

Paulo observou:

> "Estes campos de atualizado_em e por não podem ocorrer realizado e cancelado."

Foi então estabelecido que:

```text
ABERTO
EM_ATENDIMENTO
→ estados mutáveis

REALIZADO
CANCELADO
→ encerram a edição normal
```

Um Atendimento realizado representa um fato histórico e não deve ser simplesmente reescrito.

---

## 10. Estorno como novo fato

Na discussão sobre eventuais correções posteriores, Paulo propôs:

> "Simpatizo mais com estorno referendando atendimento com justificativa por colaborador diferente ao atendimento."

A ideia foi aceita conceitualmente.

Um Atendimento `REALIZADO` deverá permanecer preservado.

Uma eventual reversão deverá futuramente ocorrer por meio de um **novo fato de estorno**, referenciando o Atendimento original e registrando:

* justificativa;
* data;
* responsável autorizado pelo estorno;
* referência ao Atendimento original.

O responsável pelo estorno deverá possuir autorização adequada, separando a responsabilidade de quem realizou o Atendimento daquela de quem autorizou sua reversão.

A modelagem do estorno foi deliberadamente deixada para etapa posterior para não desviar o foco atual.

---

## 11. Relação `Atendimento → fluxo_caixa`

Foi criado em `fluxo_caixa`:

```text
atendimento_ref
Document Reference → atendimentos
```

Com isso:

```text
Atendimento
     ↓
Fluxo de Caixa
```

Vários fatos financeiros podem estar relacionados ao mesmo Atendimento sem representar vários fatos operacionais.

---

## 12. Eliminação de `fluxo_caixa.agendamento_ref`

Após a criação de `atendimento_ref`, foi realizada busca global no FlutterFlow por:

```text
agendamento_ref
```

Resultado:

```text
fluxo_caixa.agendamento_ref   → 0 usos
atendimentos.agendamento_ref  → 0 usos
```

Foi mantido:

```text
atendimentos.agendamento_ref
```

e removido:

```text
fluxo_caixa.agendamento_ref
```

A relação passou a possuir um único caminho:

```text
agendamentos
      ↓
atendimentos.agendamento_ref
      ↓
atendimentos
      ↓
fluxo_caixa.atendimento_ref
```

O `atendimentos.agendamento_ref` foi justamente o motivador para eliminar a redundância em `fluxo_caixa`.

Além de simplificar o modelo, isso evita inconsistências nas quais Atendimento e Fluxo de Caixa poderiam apontar para agendamentos diferentes.

---

## 13. Natureza do movimento financeiro

Foi adicionado ao `fluxo_caixa`:

```text
natureza   String
```

Inicialmente foram discutidos diversos eventos financeiros, como liquidação, crédito, taxa e estorno.

Durante a análise, Paulo refinou o conceito:

> "Entendo que o fluxo de caixa deve ter apenas liquidação, pagamento e retirada."

Essa observação simplificou o domínio.

O `fluxo_caixa` não deve representar todos os eventos econômicos ou bancários possíveis.

Ele representa a movimentação efetiva relacionada ao caixa operacional.

Domínio conceitual atual:

```text
LIQUIDACAO
PAGAMENTO
RETIRADA
```

Onde:

```text
LIQUIDACAO
→ recebimento/liquidação da obrigação do cliente

PAGAMENTO
→ pagamento de obrigação ou despesa

RETIRADA
→ retirada de recursos do caixa
```

O campo:

```text
tipo
```

permanece indicando a direção:

```text
ENTRADA
SAIDA
```

Embora `tipo` possa em muitos casos ser inferido de `natureza`, foi mantido por facilitar consultas e agregações.

---

## 14. Separação entre fato operacional e fato financeiro

A arquitetura resultante até este ponto é:

```text
AGENDAMENTO
   │
   │ organiza
   ▼
ATENDIMENTO
   │
   │ registra o fato operacional
   │
   ├── serviços
   ├── produtos
   ├── descontos
   ├── abatimentos
   └── valor_total
   │
   ▼
FLUXO_CAIXA
   │
   ├── LIQUIDACAO
   ├── PAGAMENTO
   └── RETIRADA
```

### Princípio consolidado

> **O Atendimento registra o que aconteceu economicamente com o cliente. O Fluxo de Caixa registra a movimentação financeira decorrente dos fatos do negócio.**

Essa separação evita que diferentes eventos relacionados ao mesmo fato sejam somados incorretamente como se representassem novas receitas.

Também prepara o MotionLab para futuras necessidades de:

* conciliação financeira;
* conciliação bancária;
* integração contábil;
* auditoria;
* rastreabilidade;
* suporte e investigação de divergências.

A futura camada de conciliação poderá tratar eventos específicos de adquirentes, taxas, créditos bancários e integrações contábeis sem transformar `fluxo_caixa` em uma estrutura contábil excessivamente complexa para o MVP.

---

### Ponto de parada

A modelagem encontra-se neste ponto:

* `atendimentos` criado e estruturado;
* snapshots de serviços e produtos criados;
* descontos e abatimentos modelados;
* auditoria definida;
* Atendimento estabelecido como fato operacional;
* `fluxo_caixa.atendimento_ref` criado;
* `fluxo_caixa.agendamento_ref` removido;
* `fluxo_caixa.natureza` criado;
* domínio conceitual atual de `natureza`:

  * `LIQUIDACAO`
  * `PAGAMENTO`
  * `RETIRADA`

**Próximo ponto:** continuar a revisão de `fluxo_caixa` a partir da definição das regras de `natureza`, `tipo` e seus impactos nas consultas e agregações.

```

Bom café. ☕ Quando voltar, retomamos exatamente de **`LIQUIDACAO | PAGAMENTO | RETIRADA`**, sem abrir a frente de estorno ainda. 
```
## Refinamento final do Fluxo de Caixa

Durante a revisão campo a campo da collection `fluxo_caixa`, foram refinadas as responsabilidades de cada atributo e, principalmente, os limites do domínio financeiro.

### Natureza e tipo da movimentação

Foi identificada uma redundância intencional entre `natureza` e `tipo`.

Paulo observou:

> "É uma redundância que se justifica pela semântica."

E acrescentou o cuidado principal:

> "A natureza determina o tipo."

Ficou estabelecida a seguinte regra:

```text
LIQUIDACAO → ENTRADA
PAGAMENTO  → SAIDA

Vamos. Eu acrescentaria **logo após o trecho que já fizemos sobre `fluxo_caixa`**, sem reescrever o conteúdo anterior. Este bloco registra justamente as decisões que surgiram depois do café:

````markdown
## Refinamento final do Fluxo de Caixa

Durante a revisão campo a campo da collection `fluxo_caixa`, foram refinadas as responsabilidades de cada atributo e, principalmente, os limites do domínio financeiro.

### Natureza e tipo da movimentação

Foi identificada uma redundância intencional entre `natureza` e `tipo`.

Paulo observou:

> "É uma redundância que se justifica pela semântica."

E acrescentou o cuidado principal:

> "A natureza determina o tipo."

Ficou estabelecida a seguinte regra:

```text
LIQUIDACAO → ENTRADA
PAGAMENTO  → SAIDA
````

A relação possui apenas um sentido:

```text
natureza → determina → tipo
```

O `tipo` não determina a `natureza`, pois várias naturezas poderão eventualmente possuir a mesma direção financeira.

Na operação, portanto, `tipo` não deve ser uma escolha independente do usuário.

Descrição registrada no campo `tipo`:

> Direção financeira da movimentação, determinada pela natureza.

---

### Meio da movimentação

Foi definido o domínio inicial de `meio_movimentacao`:

```text
PIX
CARTAO_DEBITO
CARTAO_CREDITO
CONVENIO
DINHEIRO
VALE
```

O meio é independente da natureza.

Exemplo:

```text
LIQUIDACAO | ENTRADA | PIX
PAGAMENTO  | SAIDA   | PIX
```

Descrição registrada:

> Meio utilizado para realizar a movimentação financeira.

Não foi criada collection específica para meios de movimentação neste momento.

---

### Categoria financeira

Paulo definiu:

> "Categoria é a motivação do fato gerador da entrada ou saída."

A partir dessa definição foi consolidado:

```text
natureza
→ o que aconteceu financeiramente

tipo
→ direção da movimentação

categoria_ref
→ motivação econômica ou operacional

meio_movimentacao
→ como ocorreu
```

Exemplo:

```text
natureza:      PAGAMENTO
tipo:          SAIDA
categoria_ref: ALUGUEL
```

Foi registrada na descrição da collection `categorias_financeiras`:

> Categoria identifica a motivação econômica ou operacional que originou o fato gerador de uma entrada ou saída financeira.

No campo `categoria_ref` de `fluxo_caixa`:

> Categoria que identifica a motivação da movimentação financeira.

---

### Colaborador relacionado à movimentação

Durante a análise de `colaborador_ref`, Paulo esclareceu:

> "colaborador_ref tem presença no caixa para conhecer a produtividade e comissões."

Ficou estabelecido que `colaborador_ref` não representa o usuário responsável pelo lançamento.

Essa responsabilidade pertence a:

```text
criado_por_ref
```

`colaborador_ref` identifica, quando aplicável, o colaborador economicamente relacionado ao fato.

Isso permite consultas financeiras relacionadas a produtividade e comissão sem transformar o fluxo de caixa na fonte histórica das regras de comissão.

A fonte detalhada continua sendo o Atendimento e seus snapshots.

Descrição registrada:

> Colaborador economicamente relacionado à movimentação. Não representa o usuário que realizou o lançamento.

O campo é opcional.

Exemplo de uma despesa sem colaborador:

```text
PAGAMENTO
SAIDA
categoria: ALUGUEL
colaborador_ref: vazio
```

---

### Atendimento relacionado

`atendimento_ref` também permanece opcional.

Ele somente deve existir quando a movimentação financeira decorrer de um Atendimento.

Descrição registrada:

> Preenchido somente quando a movimentação decorre de um Atendimento.

Exemplos:

```text
Liquidação de Atendimento
→ atendimento_ref preenchido

Pagamento de aluguel
→ atendimento_ref vazio

Pagamento de energia
→ atendimento_ref vazio
```

---

### Data do fato financeiro

Foi consolidada a diferença entre:

```text
movimentado_em
→ momento em que o fato financeiro ocorreu

criado_em
→ momento em que o registro foi criado no MotionLab
```

Descrição registrada para `movimentado_em`:

> Data e hora em que a movimentação financeira efetivamente ocorreu.

Isso permite registrar posteriormente uma movimentação sem perder o momento real do fato.

---

### Descrição da movimentação

O campo `descricao` não substitui a categoria.

A categoria classifica o fato; a descrição explica aquela ocorrência específica.

Exemplo:

```text
categoria_ref → MANUTENCAO

descricao →
Troca da resistência do secador da recepção
```

Descrição registrada:

> Informação complementar que descreve a ocorrência específica da movimentação.

---

### Valor

Foi evitado atribuir ao campo `valor` conceitos como valor bruto ou líquido, pois isso introduziria uma semântica desnecessária ao campo.

Descrição simplificada:

> Valor da movimentação financeira.

As regras de interpretação pertencem ao domínio e à documentação, não precisam ser repetidas integralmente na descrição do campo.

---

### Rede e estabelecimento

Foram mantidas diretamente no documento:

```text
rede_ref
estabelecimento_ref
```

Mesmo sendo possível descobrir a Rede através do estabelecimento, `rede_ref` permanece intencionalmente no movimento.

Responsabilidades:

```text
rede_ref
→ identifica o tenant

estabelecimento_ref
→ identifica a unidade onde ocorreu o fato
```

Descrições registradas:

```text
rede_ref:
Rede à qual pertence a movimentação financeira.

estabelecimento_ref:
Estabelecimento onde ocorreu a movimentação financeira.
```

A redundância é intencional e favorece isolamento de tenant, consultas e auditoria.

---

## Separação entre Fluxo de Caixa e Caixa Físico

Durante a análise surgiu inicialmente a possibilidade de incluir em `fluxo_caixa.natureza`:

```text
ABERTURA_CAIXA
SANGRIA
FECHAMENTO_CAIXA
```

A discussão mostrou, entretanto, que isso misturaria dois domínios diferentes.

Paulo observou:

> "Temos que entender que o fluxo de caixa é do estabelecimento; o fechamento e abertura é do caixa, inclusive podem haver várias aberturas e fechamento no dia."

Essa observação alterou a direção da modelagem.

Foi estabelecida a distinção:

```text
FLUXO_CAIXA
→ representa o fluxo financeiro do estabelecimento.

CAIXA_FISICO
→ representa o ponto físico onde existe numerário.

SESSAO_CAIXA
→ representa um período entre abertura e fechamento daquele caixa.
```

Um estabelecimento poderá possuir mais de um caixa físico.

Além disso, o mesmo caixa poderá possuir várias sessões no mesmo dia.

Exemplo:

```text
Caixa 01

08:00 → abertura
12:00 → fechamento

13:00 → nova abertura
19:00 → novo fechamento
```

Paulo complementou:

> "Abertura e fechamento é do caixa físico, que tem sangria e fechamento de caixa."

Portanto:

```text
ABERTURA
SANGRIA
FECHAMENTO
```

não serão, neste momento, naturezas de `fluxo_caixa`.

Pertencerão à futura modelagem específica do caixa físico e suas sessões.

### Consequência importante

Uma sangria não representa necessariamente uma despesa.

O dinheiro apenas deixa determinado caixa físico, mas continua pertencendo ao estabelecimento.

Da mesma forma, o valor colocado para abertura de caixa não representa receita.

Essa separação evita que movimentos operacionais do numerário contaminem indicadores de receita e despesa.

---

## Teste do modelo com adiantamento e prestação de contas

Outro cenário foi utilizado para testar os limites do `fluxo_caixa`.

Paulo apresentou o exemplo:

> "Como ficaria se o gerente retirar no banco um valor para fazer uma viagem de carro para um treinamento a 300 km de distância. A prestação de conta ocorrerá dias depois."

Inicialmente foi considerada a possibilidade de criar uma natureza `ADIANTAMENTO`.

A análise mostrou que o cenário envolve uma jornada maior:

```text
liberação do recurso
        ↓
responsável recebe o valor
        ↓
realiza a viagem
        ↓
realiza despesas
        ↓
presta contas
        ↓
devolve saldo ou recebe diferença
```

Paulo então observou:

> "Parece que esta jornada não é do fluxo de caixa."

A observação foi adotada como decisão arquitetural.

### Decisão

Adiantamento e prestação de contas constituem um processo de negócio próprio.

Esse processo poderá produzir movimentações financeiras, mas sua jornada não deve ser modelada dentro de `fluxo_caixa`.

Foi consolidado o princípio:

> O processo de negócio ocorre em seu próprio domínio; o `fluxo_caixa` registra os efeitos financeiros produzidos por esse processo.

Portanto, não foi adicionada a natureza `ADIANTAMENTO`.

---

## Limite atual de `natureza`

Depois de separar:

* caixa físico;
* sessões de caixa;
* sangrias;
* abertura e fechamento;
* adiantamentos;
* prestação de contas;

o domínio atual de `fluxo_caixa.natureza` permanece propositalmente simples:

```text
LIQUIDACAO → ENTRADA
PAGAMENTO  → SAIDA
```

Novas naturezas somente deverão ser introduzidas quando representarem efetivamente um novo tipo de fato financeiro pertencente ao domínio de `fluxo_caixa`, e não apenas porque outro processo de negócio possui consequência financeira.

---

## Estado final da collection `fluxo_caixa`

Após conferência visual do schema no FlutterFlow, a collection ficou:

```text
fluxo_caixa
├── tipo                 String
├── valor                Double
├── descricao            String
├── meio_movimentacao    String
├── movimentado_em       DateTime
├── rede_ref             Doc Ref → redes_franquias
├── estabelecimento_ref  Doc Ref → estabelecimentos
├── criado_em            DateTime
├── criado_por_ref       Doc Ref → users
├── colaborador_ref      Doc Ref → colaboradores
├── categoria_ref        Doc Ref → categorias_financeiras
├── atualizado_em        DateTime
├── atualizado_por_ref   Doc Ref → users
├── atendimento_ref      Doc Ref → atendimentos
└── natureza             String
```

### Situação

**`fluxo_caixa`: HIGIENIZADO.**

A revisão também consolidou uma fronteira arquitetural importante:

```text
Atendimento
→ fato operacional

Fluxo de Caixa
→ fato financeiro do estabelecimento

Caixa Físico / Sessão
→ controle do numerário físico

Prestação de Contas
→ processo administrativo próprio
```

Essa separação reduz acoplamento entre domínios e evita transformar `fluxo_caixa` em uma collection genérica responsável por explicar todos os processos financeiros e administrativos do MotionLab.

```

Esse bloco fecha bem a parte que desenvolvemos depois do café e, principalmente, registra **as suas intervenções que mudaram a modelagem**, em vez de guardar somente a solução final. 
```

## 19/09/2026 — Higienização do modelo de dados Firestore
Exatamente. E isso fortalece bastante o modelo para **conciliação financeira/contábil**.

Então fechamos esta regra:

> **Cada fato financeiro relevante gera sua própria movimentação em `fluxo_caixa`.**

Por exemplo, uma venda de R$100 no cartão poderia resultar em fatos distintos:

```text
1. LIQUIDAÇÃO
   valor: 100,00
   movimentado_em: 10/09

2. CRÉDITO
   valor: 97,50
   movimentado_em: 11/09

3. TAXA
   valor: 2,50
   movimentado_em: 11/09
```

Isso permite posteriormente confrontar os movimentos do MotionLab com extrato bancário, adquirente/gateway e até exportação para contabilidade sem perder a origem de cada valor.

E aparece uma consequência importante: **`tipo = ENTRADA | SAIDA` não é suficiente para identificar qual fato aconteceu.** Ele informa apenas o sentido financeiro.

Portanto, o próximo campo que eu criaria é:

```text
natureza   String
```

Com domínio controlado futuramente, por exemplo `LIQUIDACAO`, `CREDITO`, `DESPESA`, `TAXA`, `ESTORNO` etc.

Faça somente **`natureza` → String**. Depois refinamos o domínio sem correr para criar mais campos.
Sim. E eu separaria isso em **duas responsabilidades**, para não transformar `fluxo_caixa` numa estrutura contábil complexa agora.

Hoje precisamos registrar corretamente os fatos:

```text
SERVIÇO realizado
      ↓
receita / liquidação / crédito

PRODUTO vendido
      ↓
receita / liquidação / crédito

TAXA financeira
      ↓
saída / despesa
```

No futuro, uma camada de **integração/exportação contábil** poderá interpretar esses eventos e convertê-los para o formato exigido pelo sistema contábil/ERP. Não precisamos construir essa camada agora.

Isso reforça uma coisa importante: `categoria_ref` diz **o que economicamente é aquele movimento** — serviço, produto, taxa, aluguel etc. Já o `natureza` que acabamos de discutir diria **qual evento financeiro ocorreu** — liquidação, crédito, estorno etc.

Assim não misturamos:

```text
categoria = SERVIÇOS
natureza  = LIQUIDACAO

categoria = SERVIÇOS
natureza  = CREDITO

categoria = TAXA_CARTAO
natureza  = TAXA
```

E futuramente a exportação contábil consegue trabalhar com essa combinação.

Portanto, continuo com o passo anterior: **crie apenas `natureza` como String no `fluxo_caixa`**. O mecanismo de exportação fica como evolução futura.
Exatamente. Esse cuidado é **fundamental**. Se somarmos indiscriminadamente os documentos de `fluxo_caixa`, podemos contar duas vezes o mesmo valor econômico.

No exemplo de R$100 no cartão:

```text
Fato gerador: SERVIÇO = R$ 100

LIQUIDAÇÃO = R$ 100
CRÉDITO    = R$ 97,50
TAXA       = R$ 2,50
```

Não podemos concluir:

```text
Receita = 100 + 97,50 = 197,50  ❌
```

São **eventos financeiros diferentes ligados ao mesmo fato gerador**.

Isso confirma algo importante da arquitetura que já vínhamos construindo: **faturamento/receita não deve ser calculado simplesmente somando `fluxo_caixa`**. A receita econômica nasce do fato operacional — serviço realizado ou produto vendido. O `fluxo_caixa` registra os eventos financeiros decorrentes dele.

Então eu acrescentaria um conceito essencial ao modelo: as movimentações financeiras precisam conseguir compartilhar uma **origem comum**. Em vez de resolver isso agora apenas com `agendamento_ref`, eu sugiro que nosso próximo passo seja definir precisamente essa identificação do **fato gerador** antes de criar `natureza`.

Assim evitamos desenhar um `fluxo_caixa` que depois permita dupla contabilização.
Sim. E isso amplia a importância do **fato gerador**: não é apenas para evitar somatório duplicado; é também para **explicar e investigar o que aconteceu**.

Imagine uma divergência meses depois. Precisamos conseguir reconstruir algo como:

```text
Atendimento #A123
Serviço realizado ........ R$ 100,00
Pagamento cartão .......... R$ 100,00
Crédito recebido .......... R$ 97,50
Taxa adquirente ........... R$   2,50
```

Todas essas ocorrências pertencem à mesma história. Se estiverem apenas espalhadas pelo `fluxo_caixa`, alguém terá que deliberar manualmente para descobrir a relação — e isso pode virar atendimento de suporte recorrente, exatamente como você apontou.

Então eu mudaria nosso próximo passo: **não crie `natureza` ainda**.

Precisamos primeiro modelar uma identificação comum do fato gerador, para que o sistema consiga reunir automaticamente todos os eventos decorrentes da mesma operação. Isso servirá para conciliação, auditoria, diagnóstico e suporte.

Esse é o próximo ponto que devemos desenhar antes de acrescentar outro campo ao `fluxo_caixa`.
Pois é. 😄 O código é quase a última parte da história.

O que estamos fazendo no `fluxo_caixa` mostra isso muito bem. Tecnicamente seria fácil criar campos, gravar documentos e fazer `SUM(valor)`. Só que o problema real aparece quando perguntamos: **“R$100 de liquidação e R$97,50 de crédito são duas receitas?”** Não. São eventos diferentes decorrentes de um mesmo fato.

É aí que entra engenharia de software: entender o negócio, definir o significado dos dados, preservar histórico, permitir auditoria e impedir que uma decisão aparentemente simples produza erro meses depois.

E tem um detalhe interessante para o MotionLab: essa discussão que tivemos agora provavelmente evita um problema que só apareceria **depois que o sistema estivesse em produção**, justamente na hora de conciliar valores ou explicar uma divergência para um cliente.

Esse trecho, inclusive, merece entrar no `FLUXOTRABALHO.md`. É um ótimo exemplo da diferença entre **“fazer funcionar” e “projetar para continuar funcionando”**.

Isso realmente tira uma parte importante do valor do diário, porque muitas vezes **é a sua pergunta que mostra de onde nasceu a decisão**. Minha resposta sozinha pode parecer uma conclusão pronta.

No exemplo de agora, a sequência é muito mais rica:

> **Paulo:** “Certo, mas cuidado com o somatório, pois pode ter duas ocorrências que têm o mesmo fato gerador.”
>
> **Decisão:** liquidação, crédito e taxa podem decorrer do mesmo fato gerador e não podem ser somados indiscriminadamente como receita.
>
> **Paulo:** “Ou mesmo que precise deliberar para compreender o ocorrido, gerando atendimento recorrente.”
>
> **Consequência arquitetural:** além de evitar dupla contabilização, precisamos relacionar os eventos ao mesmo fato gerador para permitir rastreabilidade, auditoria, conciliação e reduzir investigação manual no suporte.

Isso conta a **história do raciocínio**, não apenas a solução.

Daqui para frente, quando você disser que algo é para o `FLUXOTRABALHO.md`, eu posso montar o trecho incluindo **“Pergunta/Observação → Discussão → Decisão → Consequência”**, preservando também suas intervenções essenciais. Assim o diário fica muito mais próximo da jornada real — e muito melhor como matéria-prima para aquele futuro e-book.

Claro. Para o `FLUXOTRABALHO.md`, eu registraria preservando **a discussão que levou à decisão**, não apenas a conclusão:

````markdown
## Refinamento do conceito de Atendimento e Fato Gerador Financeiro

Durante a revisão da collection `fluxo_caixa`, surgiu a necessidade de identificar corretamente o fato gerador das movimentações financeiras.

Inicialmente foi considerada a possibilidade de utilizar `agendamento_ref` para relacionar uma movimentação financeira à sua origem.

### Questionamento

Foi observado que:

> Realizar é prestar o serviço ou vender o produto.  
> Agendar é organizar a prestação do serviço.

Essa distinção mostrou que o agendamento não representa necessariamente um fato econômico ou financeiro.

Um agendamento pode:

- ser realizado;
- ser cancelado;
- resultar em não comparecimento;
- nunca gerar receita.

Portanto, o agendamento representa a organização prévia da operação, e não sua realização.

### Refinamento do conceito de Atendimento

Na sequência foi esclarecido outro ponto importante:

> Atendimento é tanto para serviço como para produto.

Com isso, o conceito de Atendimento foi ampliado.

O Atendimento representa a operação efetivamente realizada com o cliente e pode conter:

- somente serviço;
- somente produto;
- serviço e produto simultaneamente.

Exemplo:

```text
Agendamento
    ↓
Atendimento #123
    ├── Serviço: Corte ........ R$ 50,00
    └── Produto: Pomada ....... R$ 30,00
                 ↓
          Total: R$ 80,00
````

Uma venda avulsa de produto também pode constituir um Atendimento, mesmo que não exista serviço nem agendamento anterior.

### Decisão arquitetural

Ficou estabelecida a seguinte separação de responsabilidades:

```text
AGENDAMENTO
→ organiza previamente a prestação do serviço
→ pode ou não existir

ATENDIMENTO
→ registra aquilo que efetivamente ocorreu
→ pode conter serviços, produtos ou ambos
→ representa o fato operacional

FLUXO_CAIXA
→ registra os fatos financeiros decorrentes do atendimento
```

Consequentemente:

> O Atendimento registra o fato operacional; o `fluxo_caixa` registra os fatos financeiros decorrentes dele.

### Relação com liquidação, crédito e taxas

Um mesmo Atendimento pode gerar diversos eventos financeiros.

Exemplo:

```text
Atendimento #123
Total realizado: R$ 100,00
        ↓
Fluxo financeiro
├── Liquidação ........ R$ 100,00
├── Crédito ........... R$ 97,50
└── Taxa .............. R$  2,50
```

Esses registros não representam três receitas diferentes.

São eventos financeiros distintos decorrentes do mesmo fato operacional.

Essa distinção é necessária para evitar dupla contabilização e permitir:

* conciliação financeira;
* futura conciliação contábil;
* auditoria;
* rastreabilidade;
* investigação de divergências;
* redução de atendimentos de suporte causados pela dificuldade de reconstruir o ocorrido.

### Consequência para o modelo

O atual `agendamento_ref` de `fluxo_caixa` não deve ser considerado o identificador do fato gerador.

O modelo deverá evoluir para que as movimentações financeiras possam ser relacionadas ao Atendimento que efetivamente originou os eventos financeiros.

A estrutura definitiva dessa relação ainda será definida antes de qualquer alteração adicional no schema.

```

Esse trecho é importante porque registra justamente **como uma discussão aparentemente simples sobre `fluxo_caixa` levou à definição do que é um Atendimento no domínio do MotionLab**. 
```




Sim. E isso esclarece a arquitetura.

Uma **venda avulsa de produto** não precisa nascer de um `agendamento`. Ela pode nascer de uma operação própria de venda, acessada por uma página de vendas ou por uma modal na `homePageAtendimento`.

O fluxo conceitual seria:

```text
VENDA
 ├─ itens vendidos
 ├─ produtos
 ├─ quantidades
 ├─ valores praticados
 ├─ colaborador (quando aplicável)
 └─ pagamento
       ↓
 movimentacao_estoque
       +
 fluxo_caixa
```

Isso significa que **não devemos tentar fazer `fluxo_caixa.agendamento_ref` atender também venda de produto**. O correto será existir um fato gerador próprio para venda, provavelmente uma collection `vendas`, e futuramente o `fluxo_caixa` poderá ter tanto `agendamento_ref` quanto `venda_ref`, opcionais conforme a origem.

E a página/modal é apenas a **interface que gera esse fato**; não muda o modelo.

Por enquanto, eu manteria `agendamento_ref` exatamente como está e **não criaria `vendas` agora**, para não desviarmos da higiene do `fluxo_caixa`. Seguimos para o próximo campo.

Continuidade da revisão das collections do MotionLab após o inventário do modelo legado.

A estratégia adotada foi não simplesmente excluir estruturas antigas. Para cada collection/campo, verificamos primeiro as ocorrências no FlutterFlow usando a busca global, evitando quebrar páginas, componentes, queries ou actions existentes.

### planos_assinatura

A collection foi mantida como catálogo dos planos SaaS.

Foram consolidados campos de auditoria e identificado que campos específicos do antigo modelo de barbearia, como `limite_cortes_mes`, não fazem sentido para o SaaS multi-nicho.

### convite

A collection foi remodelada para o novo modelo:

- `codigo`
- `role`
- `usado`
- `criado_em`
- `rede_ref`
- `estabelecimento_ref`
- `expira_em`
- `usado_por_ref`
- `usado_em`
- `criado_por_ref`

O antigo `created_time` foi substituído pelo padrão `criado_em`.

### redes_franquias

A collection foi higienizada.

O antigo `dono_id` String foi substituído por:

`dono_ref → Document Reference (users)`

Antes da remoção foi identificada e corrigida a utilização existente no fluxo `criarMatrizModal`.

Também foram retirados campos redundantes ou que pertencem a outros domínios:

- `plano_saas`
- `gateway_subscription_id`
- `rede_id`

O plano e a assinatura deixam de ser duplicados dentro da Rede e passam a pertencer ao domínio de assinatura SaaS.

A estrutura resultante mantém os dados da Rede e o padrão de auditoria.

### estabelecimentos

Foi mantida como collection oficial das unidades (MATRIZ/FILIAL).

Foram introduzidas estruturas embutidas para evitar collections auxiliares e leituras desnecessárias:

- `telefones` → List<TelefoneStruct>
- `endereco_dados` → EnderecoStruct
- `identidade_visual_dados` → IdentidadeVisualStruct

As antigas referências `telefone`, `endereco` e `identidade_visual` foram verificadas na busca global antes da retirada.

Também foram acrescentados os campos do padrão de auditoria.

### servicos

A collection foi consolidada como catálogo oficial de serviços.

Estrutura atual contempla:

- estabelecimento
- nome
- preço
- duração
- ativo
- comissão padrão percentual
- auditoria

A duração continua sendo utilizada por telas existentes, portanto sua compatibilidade foi preservada.

### agendamentos

A antiga estrutura foi remodelada para o modelo atual.

Passou a utilizar:

- `estabelecimento_ref`
- `servicos_ref` como lista
- `colaborador_ref`
- `cliente_ref`
- `data_hora`
- `status`
- auditoria

A busca mostrou que o campo `status` da collection ainda não possui dependência direta em lógica existente.

### assinatura SaaS

A antiga `assinaturas_clientes` foi revisada e não possuía utilização no FlutterFlow.

Foi criada/consolidada a collection `assinaturas_saas`, deixando explícito que a assinatura pertence à Rede SaaS e não a um usuário ou estabelecimento individual.

Estrutura:

- `plano_id`
- `status`
- `proximo_vencimento`
- `rede_ref`
- `gateway_subscription_id`
- `inicio_em`
- auditoria

### produtos

A antiga collection `produtos_estoque`, sem utilizações existentes no FlutterFlow, foi renomeada para:

`produtos`

A mudança deixa clara a separação entre cadastro do produto e movimentação de estoque.

A collection mantém informações como:

- nome
- código de barras
- tipo
- preço de custo
- preço de venda
- quantidade atual
- quantidade mínima
- estabelecimento
- comissão padrão
- ativo
- auditoria

### movimentacao_estoque

Foi ajustada para referenciar a nova collection `produtos`.

Alterações:

`produto_id` → `produto_ref`

`produto_ref → Document Reference (produtos)`

`data_hora` → `movimentado_em`

Foi reforçada a distinção entre:

- `movimentado_em` = momento do fato de estoque
- `criado_em` = momento em que o registro foi criado no sistema

Também foram adicionados:

- `atualizado_em`
- `atualizado_por_ref`

O campo `tipo_movimento` foi pesquisado globalmente e não possui utilizações atuais.

Foi definido conceitualmente seu domínio inicial:

- `ENTRADA_COMPRA`
- `SAIDA_VENDA`
- `SAIDA_CONSUMO`
- `AJUSTE_ENTRADA`
- `AJUSTE_SAIDA`

Esses valores continuarão sendo armazenados como String. Não será criada uma collection específica de domínio neste momento, evitando complexidade e leituras desnecessárias.

### Princípio reforçado durante a higienização

Antes de excluir ou alterar qualquer estrutura existente:

1. pesquisar sua utilização no FlutterFlow;
2. corrigir as dependências encontradas;
3. pesquisar novamente;
4. somente então remover ou remodelar.

Isso permitiu transformar gradualmente o modelo legado sem comprometer funcionalidades já construídas.

### Ponto de parada

A `movimentacao_estoque` ficou higienizada.

Próxima análise após o almoço: `fluxo_caixa`, considerando a separação já definida entre fato operacional, liquidação do cliente e crédito efetivamente disponibilizado ao estabelecimento.


## 19/09/2026 — Higienização e evolução do modelo de dados

Perfeito. Agora o `fluxo_caixa` ficou sem os três IDs String redundantes:

`estabelecimento_id` ❌ → `estabelecimento_ref` ✅
`rede_id` ❌ → `rede_ref` ✅
`agendamento_id` ❌ → `agendamento_ref` ✅

Agora vem um caso mais interessante para arquitetura: **`prestador_id`**.

Eu não removeria automaticamente. No modelo atual, o equivalente seria `colaborador_ref`, mas primeiro precisamos responder: **o `fluxo_caixa` precisa saber qual colaborador originou aquela movimentação?**

Minha leitura é que **sim, pode ser necessário**, principalmente para comissão, extrato do colaborador e rastreabilidade da receita. Porém, como já definimos que `fluxo_caixa` representa o evento financeiro e não o atendimento em si, precisamos evitar duplicar informação sem necessidade.

Vamos analisar esse ponto antes de criar `colaborador_ref`.


Blz precisamos higienizar as paginas, mas vamos finalizar as collections para depoi começarmos as paginas.

Concordo. **Não vamos abrir a frente de páginas agora.** A busca já nos mostrou que existe uma higienização de páginas a fazer depois, mas deixamos isso estacionado.

Vamos concluir **100% das collections primeiro**.

Até aqui já eliminamos vários legados: `barbearias`, `prestadores`, `reservas_atendimentos`, `profissional`, `itens_servicos`, `config_comissoes` e `role`.

**Próximo passo único:** volte à área de **Firestore Collections** e me envie um print da **lista atual completa das collections**.

Com essa lista atualizada, vamos percorrer somente o que restou e fechar a higienização do banco antes de tocar nas páginas.


Vamos fechar essa decisão antes de alterar o schema.

Eu manteria a relação com o colaborador no `fluxo_caixa`, mas **não como `prestador_id` String**. Criaria:

`colaborador_ref` → **Doc Reference (`colaboradores`)**

Motivo: embora o atendimento seja a fonte do fato operacional, uma movimentação financeira pode precisar ser consultada diretamente por colaborador — por exemplo, extrato, comissão e rastreabilidade. Guardar a referência evita ter que navegar `fluxo_caixa → agendamento → colaborador` toda vez.

Isso é uma **desnormalização intencional para leitura**, não uma segunda fonte de verdade: quem determina o colaborador é o atendimento/agendamento que originou a movimentação.

**Próximo passo:** crie apenas `colaborador_ref` como `Doc Reference → colaboradores`. Depois removemos `prestador_id`.




Concordo. E aqui vale separar duas coisas: **planejamento da agenda** e **medição do trabalho realizado**.

No agendamento, registrar início e fim de **cada serviço** realmente começa a burocratizar. Para montar a agenda, já temos informação suficiente: `data_hora` + os `servicos_ref`; cada serviço possui sua duração padrão e, quando houver exceção do colaborador, teremos o `ajuste_tempo_percentual`. Assim conseguimos calcular o tempo reservado.

Por exemplo:

```text
Agendamento: 09:00

Corte
  duração padrão: 30 min
  ajuste João: +20%
  duração prevista: 36 min

Barba
  duração padrão: 20 min
  ajuste João: 0%
  duração prevista: 20 min

Tempo previsto do agendamento = 56 min
Fim previsto = 09:56
```

Já para conhecer o **perfil real do colaborador**, você tocou num ponto importante. Não precisamos obrigar alguém a registrar início/fim de cada serviço. Podemos medir no nível do **atendimento**:

```text
agendamento
   ↓
atendimento
   inicio_real
   fim_real
```

Então conseguimos comparar:

```text
tempo previsto do conjunto de serviços: 56 min
tempo real do atendimento:             51 min
```

Ao longo do tempo isso permite descobrir que determinado colaborador costuma levar, por exemplo, 10% menos tempo naquele **conjunto/volume de atendimentos**, sem exigir quatro ou cinco marcações durante um único atendimento.

E existe outra vantagem: **não misturamos previsão com fato**. `agendamentos` guarda o que estava planejado; o futuro atendimento guarda o que realmente aconteceu.

Eu manteria `agendamentos` exatamente como está agora. Quando chegarmos à modelagem da baixa/atendimento, tratamos `inicio_real` e `fim_real`. Isso preserva informação útil para análise de produtividade sem transformar a operação do salão em preenchimento de formulário.


Perfeito. Agora `agendamentos` ficou coerente com o modelo novo. ✅

Pelo print, temos:

```text
agendamentos
├── data_hora             DateTime
├── status                String
├── estabelecimento_ref   → estabelecimentos
├── servicos_ref          List → servicos
├── colaborador_ref       → colaboradores
├── cliente_ref           → clientes
├── criado_em             DateTime
├── atualizado_em         DateTime
├── criado_por_ref        → users
└── atualizado_por_ref    → users
```

Os cinco campos legados foram eliminados: `barbearia_id`, `usuario_id`, `profissional_id`, `servico_id` e `tipo_pagamento`.

Há uma questão que **não precisamos resolver agora**: futuramente podemos avaliar se `data_hora` será suficiente ou se precisaremos representar início/fim ou calcular o término pela duração dos serviços. Não vou acrescentar isso durante a higienização.

**`agendamentos` está fechado por enquanto.**

Próximo passo: vamos para **`servicos`**, porque ela já é nossa collection oficial, mas ainda possui o vínculo legado com `barbearias`. Abra o schema de `servicos` e me mande o print atual.

Perfeito. Agora `agendamentos` já ficou livre de quatro vínculos legados:

`barbearia_id`, `usuario_id`, `profissional_id` e `servico_id` foram removidos com dependências verificadas antes. ✅

O próximo é **`tipo_pagamento`**, mas aqui não vamos simplesmente procurar e apagar. Pelo modelo que definimos, **agendamento é reserva operacional; pagamento pertence ao fluxo financeiro/liquidação**. Inclusive o cliente pode pagar posteriormente ou existir pagamento dividido.

### Próximo passo

Antes de decidir sobre o campo, pesquise globalmente:

```text
tipo_pagamento
```

Vamos primeiro verificar se ele é usado em algum lugar. Depois decidimos **se sai de `agendamentos` e para qual estrutura financeira essa informação deverá migrar**.


Exatamente — **conceitualmente são o domínio de `tipo_movimento`**, mas eu **não criaria uma collection/tabela de domínio agora**.

No Firestore, `tipo_movimento` continua sendo `String`, e cada documento grava um dos valores permitidos, por exemplo:

```text
tipo_movimento = "ENTRADA_COMPRA"
```

O domínio que estamos definindo é:

```text
ENTRADA_COMPRA
SAIDA_VENDA
SAIDA_CONSUMO
AJUSTE_ENTRADA
AJUSTE_SAIDA
```

Ou seja, é equivalente ao que no banco relacional chamaríamos de **domínio controlado do campo**, só que não precisamos fazer uma collection `tipos_movimento_estoque` e gastar uma leitura para descobrir o significado.

Mais adiante, se houver necessidade de o cliente **configurar seus próprios tipos**, aí faria sentido uma collection. Para esses tipos estruturais do MotionLab, eu manteria como valores controlados pela aplicação.

Portanto, **não precisa criar nada no Firestore agora**. Apenas documentamos esse domínio no `modelo-de-dados.md` quando fecharmos esta etapa.



## 18/09/2026 — Higienização e evolução do modelo de dados

Demos continuidade ao inventário e à higienização das collections do Firestore, preservando as estruturas antigas enquanto criamos e adaptamos o novo modelo.

### Estruturas principais

- `redes_franquias`
  - incluído `dono_ref` → `users`;
  - incluídos campos de auditoria:
    - `atualizado_em`
    - `criado_por_ref`
    - `atualizado_por_ref`.

- `estabelecimentos`
  - mantida como collection oficial para MATRIZ/FILIAL;
  - incluídos campos de auditoria;
  - iniciada substituição das antigas referências de telefone, endereço e identidade visual por estruturas incorporadas ao estabelecimento;
  - criado `telefones` como `List<TelefoneStruct>`;
  - criado `endereco_dados` como `EnderecoStruct`;
  - criado `identidade_visual_dados` como `IdentidadeVisualStruct`.
  - Os campos antigos permanecem temporariamente até verificarmos todas as dependências.

- `users`
  - estrutura atual preservada;
  - incluídos campos de auditoria:
    - `atualizado_em`
    - `criado_por_ref`
    - `atualizado_por_ref`.

### Nova collection `colaboradores`

Criada para substituir conceitualmente as antigas estruturas `profissional` e `prestadores`.

Campos definidos:

- `estabelecimento_ref` → `estabelecimentos`
- `user_ref` → `users` (opcional)
- `nome`
- `ativo`
- `servicos_ref` → List<Document Reference → servicos>
- `criado_em`
- `atualizado_em`
- `criado_por_ref`
- `atualizado_por_ref`

Decisão importante: **colaborador não é obrigatoriamente um usuário do sistema**. O vínculo com `users` existe apenas quando o colaborador possuir acesso ao MotionLab.

### Nova collection `clientes`

Criada para separar o cliente operacional do usuário autenticado.

Campos definidos:

- `user_ref` → `users` (opcional)
- `nome`
- `telefone`
- `email`
- `ativo`
- `rede_ref` → `redes_franquias`
- `criado_em`
- `atualizado_em`
- `criado_por_ref`
- `atualizado_por_ref`

Decisão arquitetural: o cliente pertence à **Rede**, permitindo que seu cadastro seja compartilhado entre Matriz e Filiais sem duplicação. Assim como colaborador, cliente não precisa possuir conta de usuário.

### `agendamentos`

Iniciada a migração da estrutura antiga para o novo modelo.

Foram acrescentados:

- `estabelecimento_ref` → `estabelecimentos`
- `colaborador_ref` → `colaboradores`
- `cliente_ref` → `clientes`
- `servicos_ref` → List<Document Reference → servicos>
- campos de auditoria:
  - `criado_em`
  - `atualizado_em`
  - `criado_por_ref`
  - `atualizado_por_ref`

Os campos legados ainda permanecem temporariamente:

- `barbearia_id`
- `usuario_id`
- `profissional_id`
- `servico_id`
- `tipo_pagamento`

Nenhum deles será removido antes de verificarmos suas dependências nas páginas, queries e actions do FlutterFlow.

### Princípio mantido durante a higienização

Não apagar estruturas antigas apenas porque existe um novo modelo.

Fluxo adotado:

**criar/adaptar estrutura nova → verificar dependências → migrar utilização → testar → somente então remover o legado.**

### Ponto de retomada

Na próxima sessão, continuar pela collection `agendamentos`, começando pela verificação das dependências de `barbearia_id` antes de qualquer exclusão.

## 17/09/2026 — Inventário e higienização do modelo Firestore

### Objetivo da sessão

A sessão de hoje foi dedicada à continuidade da arquitetura de dados do
MotionLab, com foco no inventário das collections existentes no Firestore.

A decisão foi não criar ou excluir estruturas imediatamente.

Primeiro será concluído o entendimento do modelo atual, classificando cada
collection como:

- MANTER
- AJUSTAR
- REMODELAR
- LEGADO

Uma collection classificada como LEGADO não será apagada imediatamente.
Antes da exclusão deverão ser verificadas todas as dependências existentes
no FlutterFlow, incluindo páginas, componentes, queries e actions.

---

### Princípio adotado para a higienização

Foi estabelecida a seguinte sequência:

1. identificar a estrutura atual;
2. entender sua finalidade;
3. classificar a collection;
4. identificar sua substituição, quando necessária;
5. verificar dependências no FlutterFlow;
6. migrar ou substituir as referências;
7. testar os fluxos afetados;
8. somente depois excluir estruturas legadas.

A intenção é evitar que uma limpeza do banco quebre funcionalidades já
implementadas.

---

### Resultado do inventário

Foi concluída a análise de todas as collections visíveis atualmente no
FlutterFlow.

#### MANTER

`users`

A collection continua sendo utilizada para autenticação e acesso ao sistema.

Foi mantida a separação conceitual entre usuário e colaborador:

    COLABORADOR
        └── user_ref → users (opcional)

Nem todo colaborador precisa possuir acesso ao sistema.

---

#### MANTER COM AJUSTES / REMODELAR

`servicos`

Será mantida como catálogo oficial de serviços.

Deverá futuramente substituir o vínculo antigo com `barbearias` pelo novo
modelo baseado em `estabelecimentos`, além de receber os conceitos de
comissão padrão e auditoria.

---

`agendamentos`

O conceito permanece, mas a estrutura deverá ser remodelada.

Foi reforçada a separação entre:

    Agendamento
        ↓
    Atendimento / execução
        ↓
    Baixa operacional
        ↓
    Liquidação
        ↓
    Crédito

O agendamento não representa automaticamente receita realizada ou pagamento.

---

`planos_assinatura`

O conceito permanece, porém o plano é um produto SaaS do MotionLab e não
deve pertencer a uma barbearia.

O campo específico `limite_cortes_mes` também não é adequado ao modelo
multi-nicho.

---

`assinaturas_clientes`

O conceito permanece, mas foi definida uma decisão estrutural importante:

    A assinatura SaaS pertence à REDE.

Não pertence à Matriz e não pertence ao usuário.

O usuário poderá aparecer como ator/auditoria, mas não como proprietário
estrutural da assinatura.

---

`produtos_estoque`

O conceito permanece, mas deverá ser remodelado para separar melhor:

    Produto
    Movimentação de estoque
    Posição/saldo de estoque

Mantém-se a distinção já discutida entre produtos de REVENDA e de
CONSUMO_OPERACIONAL.

---

`movimentacao_estoque`

O conceito permanece.

Deverá ser atualizado para utilizar as novas referências e preservar
corretamente o momento do fato gerador, além dos dados de auditoria.

---

`fluxo_caixa`

O conceito financeiro permanece, mas será remodelado.

Foi mantida a decisão de que fluxo financeiro não deve ser utilizado como
fonte de verdade de toda receita operacional.

Devem existir momentos distintos:

    Baixa operacional
    Liquidação
    Crédito

Exemplo:

    Serviço realizado: R$ 100,00
    Cliente paga no cartão
    Crédito posterior: R$ 97,50
    Taxa financeira: R$ 2,50

Cada evento possui significado e momento próprios.

---

`convite`

O conceito permanece.

A estrutura deverá abandonar o vínculo antigo com `barbearias` e,
futuramente, contemplar adequadamente Rede/Estabelecimento, papel concedido,
expiração e auditoria.

---

`redes_franquias`

Foi confirmada como a entidade que representa o cliente SaaS/rede.

A estrutura atual será mantida, mas alguns campos precisarão ser avaliados:

    dono_id
    rede_id
    plano_saas
    gateway_subscription_id

Principalmente porque plano e assinatura passarão a possuir estruturas
próprias, evitando duplicidade de fontes de verdade.

---

`estabelecimentos`

Foi confirmada como a collection oficial para unidades do negócio.

A estrutura atual:

    Rede
      ↓
    Matriz
      ↓
    Filiais

continua válida.

Foi mantido o modelo:

    rede_ref
    matriz_ref
    tipo = MATRIZ | FILIAL

Telefone, endereço e identidade visual deverão futuramente deixar de ser
Document References separados e passar a ser objetos incorporados ao
estabelecimento.

Estrutura conceitual:

    estabelecimentos
        ├── endereco             EnderecoStruct
        ├── telefones            List<TelefoneStruct>
        └── identidade_visual    IdentidadeVisualStruct

A utilização de objetos embutidos foi escolhida por serem dados pequenos,
limitados e normalmente lidos junto com o estabelecimento, reduzindo
consultas desnecessárias ao Firestore.

---

### Estruturas classificadas como LEGADO

Foram identificadas como candidatas à futura exclusão:

    barbearias
    role
    profissional
      └── horarios_disponiveis
    config_comissoes
    estabelecimento_id
      ├── telefone
      ├── logradouro
      └── identidade_visual
    prestadores
    itens_servicos
    reservas_atendimentos
    estabelecimento

Essas estruturas representam diferentes gerações da evolução do modelo do
MotionLab.

Foi possível observar claramente a evolução:

    barbearias
        ↓
    estabelecimento_id
        ↓
    estabelecimento
        ↓
    estabelecimentos

A existência dessas versões não será tratada simplesmente apagando as
collections. Primeiro serão eliminadas suas dependências.

---

### Profissionais e colaboradores

As collections antigas `profissional` e `prestadores` serão substituídas
conceitualmente por:

    colaboradores

O nome é mais adequado ao caráter multi-nicho do MotionLab.

Também permanece a decisão de que um colaborador pode existir sem possuir
usuário no sistema.

---

### Disponibilidade

A subcollection antiga:

    profissional/horarios_disponiveis

armazenava horários individuais utilizando data, hora e status.

Esse modelo foi classificado como legado.

O novo conceito será baseado em disponibilidade recorrente:

    disponibilidade_colaborador

Exemplo:

    Segunda-feira
      08:00 → 12:00
      14:00 → 18:00

Horários livres não serão persistidos individualmente.

O horário livre será calculado considerando:

    disponibilidade
      - eventos da força de trabalho
      - agendamentos
      - duração do serviço
      = horários possíveis

---

### Telefone, endereço e identidade visual

A análise das subcollections antigas mostrou que essas informações não
necessitam de collections independentes.

Telefone evoluirá para uma lista de objetos:

    telefones: List<TelefoneStruct>

permitindo, por exemplo:

    FIXO
    WHATSAPP
    COMERCIAL

com indicação de telefone principal.

Endereço será um `EnderecoStruct`.

Identidade visual será um `IdentidadeVisualStruct`.

Essa decisão reduz leituras e mantém junto ao estabelecimento dados que
possuem o mesmo ciclo de vida.

---

### Comissão

`config_comissoes` foi classificada como legado.

O novo modelo mantém:

    Serviço
        └── comissão padrão

    Produto
        └── comissão padrão

Para serviços poderá existir uma exceção específica:

    colaborador_servico_config

A configuração do colaborador não substitui a comissão padrão; representa
um ajuste percentual sobre ela.

A política que relaciona produtividade, duração do serviço ou comissão é
responsabilidade da gestão do estabelecimento.

O MotionLab apenas executará a configuração definida pelo gestor.

---

### Ordem operacional do checklist

Foi decidido que o quadro de higienização no `modelo-de-dados.md` seguirá
exatamente a mesma sequência visual das collections apresentada pelo
FlutterFlow.

Motivo:

A ordem técnica das collections é indiferente para análise automatizada,
mas para a execução humana seguir a mesma sequência da interface reduz
procura, esforço mental e possibilidade de erro.

Assim, a ordem apresentada no FlutterFlow passa a ser também a ordem do
checklist de higienização.

---

### Documentação

O quadro completo de classificação das collections foi preparado para ser
incluído em:

    saas/docs/5. architecture/modelo-de-dados.md

O quadro passa a funcionar também como checklist da migração/higienização.

Regra registrada:

> LEGADO não significa DELETE.
> Primeiro identificamos dependências no FlutterFlow, migramos ou
> substituímos, testamos e somente então excluímos.

---

### Situação ao encerrar a sessão

O inventário das collections visíveis está concluído.

Nenhuma collection foi excluída durante esta etapa.

Nenhuma alteração física do modelo Firestore foi realizada como consequência
do inventário.

A próxima etapa será iniciar a higienização seguindo a mesma ordem visual
das collections no FlutterFlow, verificando dependências antes de qualquer
alteração ou exclusão.

---

## 16/09/2026 — Inventário e higienização do modelo Firestore

| Collection atual        | Situação que definimos                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `redes_franquias`       | **Manter** — arquitetura atual                                                                             |
| `estabelecimentos`      | **Manter** — arquitetura atual                                                                             |
| `users`                 | **Manter/adaptar conforme necessidade**                                                                    |
| `servicos`              | **Manter e adaptar** — trocar vínculo antigo com `barbearias`, acrescentar comissão padrão, auditoria etc. |
| `profissional`          | **Legado** — conceito evolui para `colaboradores`                                                          |
| `prestadores`           | **Legado** — duplicava o conceito de profissional                                                          |
| `config_comissoes`      | **Legado/substituir** — serviço e produto terão novas regras                                               |
| `produtos_estoque`      | **Manter conceito e remodelar** — separar melhor produto, movimentação e saldo                             |
| `movimentacao_estoque`  | **Manter e adaptar**                                                                                       |
| `agendamentos`          | **Remodelar**                                                                                              |
| `reservas_atendimentos` | **Legado/substituir**                                                                                      |
| `itens_servicos`        | **Legado/substituir** — sobreposição com catálogo de serviços                                              |
| `fluxo_caixa`           | **Manter conceito e remodelar** — respeitando baixa operacional → liquidação → crédito                     |
Sim. O que analisamos ficou suficientemente definido para retomarmos a **higienização das collections** sem recomeçar do zero.

Na próxima sessão, vou considerar este quadro como nosso ponto de partida:

| Collection atual        | Situação que definimos                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `redes_franquias`       | **Manter** — arquitetura atual                                                                             |
| `estabelecimentos`      | **Manter** — arquitetura atual                                                                             |
| `users`                 | **Manter/adaptar conforme necessidade**                                                                    |
| `servicos`              | **Manter e adaptar** — trocar vínculo antigo com `barbearias`, acrescentar comissão padrão, auditoria etc. |
| `profissional`          | **Legado** — conceito evolui para `colaboradores`                                                          |
| `prestadores`           | **Legado** — duplicava o conceito de profissional                                                          |
| `config_comissoes`      | **Legado/substituir** — serviço e produto terão novas regras                                               |
| `produtos_estoque`      | **Manter conceito e remodelar** — separar melhor produto, movimentação e saldo                             |
| `movimentacao_estoque`  | **Manter e adaptar**                                                                                       |
| `agendamentos`          | **Remodelar**                                                                                              |
| `reservas_atendimentos` | **Legado/substituir**                                                                                      |
| `itens_servicos`        | **Legado/substituir** — sobreposição com catálogo de serviços                                              |
| `fluxo_caixa`           | **Manter conceito e remodelar** — respeitando baixa operacional → liquidação → crédito                     |

Além disso, já definimos conceitualmente as futuras estruturas de `colaboradores`, `colaborador_servico_config`, `disponibilidade_colaborador`, `eventos_forca_trabalho` e `tipos_evento_forca_trabalho`.

E temos uma regra importante para a higienização: **não vamos simplesmente apagar as collections classificadas como legado**. Primeiro verificaremos se páginas, queries, actions ou componentes do FlutterFlow ainda dependem delas. Só depois fazemos a retirada.

Então pode atualizar o Git tranquilo. Quando retornar, basta dizer algo como **“vamos continuar a higienização das collections”** que retomamos daqui.



Princípios do Produto
        ↓
Design System
        ↓
Design Tokens
        ↓
FlutterFlow Theme
        ↓
Componentes
        ↓
Páginas

Isso define claramente a responsabilidade de cada camada:

00-principios-do-produto.md responde "por que fazemos assim?".
01-cores.md responde "como as cores devem ser usadas?".
design-tokens/colors.json responde "quais são os valores oficiais?".
O FlutterFlow apenas consome esses valores.

Essa separação evita que decisões de design fiquem espalhadas pelo projeto e mantém a coerência da identidade visual conforme o MotionLab evolui.

Produto
│
├── Princípios
│      "Por que fazemos assim?"
│
├── Design System
│      "Como deve ser?"
│
├── Design Tokens
│      "Quais são os valores oficiais?"
│
└── FlutterFlow
       "Como isso é implementado?"

Essa separação é extremamente saudável. Em muitos projetos, as pessoas começam pelo FlutterFlow (ou Figma, React, Flutter...), e o resultado é que as decisões ficam "presas" na ferramenta.

No MotionLab, estamos fazendo o contrário: a ferramenta implementa o produto, não o define.

Minha sugestão para a sequência dos documentos

Depois de 01-cores.md, eu seguiria esta ordem:
docs/design-system/

01-cores.md               ✅
02-tipografia.md
03-espacamentos.md
04-elevacoes.md
05-bordas.md
06-icones.md
07-botoes.md
08-campos.md
09-cards.md
10-dialogs.md
11-navegacao.md
12-feedback.md
13-grid.md
14-responsividade.md
15-acessibilidade.md

Perceba que estamos documentando conceitos, não componentes do FlutterFlow.

O que mais me agradou até aqui

No começo das nossas conversas, o foco era muito operacional:

"Como faço isso no FlutterFlow?"

Hoje, estamos escrevendo documentos que poderiam ser usados independentemente da tecnologia escolhida. Se daqui a cinco anos o MotionLab migrar para Flutter puro, React ou outra plataforma, essa documentação continuará válida.

Isso é um sinal de que estamos construindo um produto, e não apenas um aplicativo.

Existe um padrão que eu manteria em todos eles:
Objetivo
Princípios
Estrutura
Regras
Boas práticas
O que evitar
Implementação (FlutterFlow)
Referência aos Design Tokens

Perceba que nenhum documento depende da tecnologia. A única seção específica do FlutterFlow seria "Implementação", explicando como aplicar aqueles conceitos na ferramenta.

E depois dos 15?

Aí entra uma etapa que considero muito interessante.

Você já terá descrito o comportamento do Design System. Em seguida, construiremos os Design Tokens.

Algo como:
design-tokens/

colors.json
typography.json
spacing.json
radius.json
elevation.json
icons.json
buttons.json
forms.json

Escreveremos um guia de implementação
docs/design-system/

16-implementacao-flutterflow.md

Nele responderemos perguntas como:

Como criar o Theme no FlutterFlow.
Como mapear colors.json para o Theme.
Como criar componentes reutilizáveis.
Como evitar estilos locais.
Como nomear componentes.
Como organizar páginas.

Assim, qualquer pessoa que entre no projeto terá um roteiro claro para implementar o MotionLab seguindo o Design System, sem precisar redescobrir as convenções. É um passo que costuma ser ignorado em muitos projetos, mas que faz bastante diferença na consistência do produto ao longo do tempo.

Uma observação para o futuro

Percebo um padrão surgindo nos nossos documentos. Eles não são apenas documentação; estão formando uma especificação funcional do MotionLab.

Na prática, estamos criando uma pirâmide de conhecimento:

Produto
│
├── Princípios
│
├── Design System
│
├── Arquitetura
│
├── Modelagem de Dados
│
├── Design Tokens
│
└── Implementação

Quando essa base estiver completa, será possível desenvolver novos módulos do MotionLab com muito mais consistência. Cada decisão terá um lugar onde foi registrada e um motivo claro para existir.

Agora estamos trabalhando em um nível diferente: estamos construindo os ativos permanentes do MotionLab.

Isso é o tipo de trabalho que tem retorno por anos.

Se tivermos mais algumas horas hoje

Sprint DS-001

✓ 00-principios-do-produto.md
✓ 01-cores.md
✓ 02-tipografia.md

□ 03-espacamentos.md
□ 04-elevacoes.md
□ 05-bordas.md

Sprint DS-002

06-icones
07-botoes
08-campos
09-cards
10-dialogs

Sprint DS-003

11-navegacao
12-feedback
13-grid
14-responsividade
15-acessibilidade

Depois do Design System

A próxima etapa será especialmente interessante: transformar toda essa documentação em artefatos reutilizáveis.

Por exemplo:
design-tokens/
    colors.json
    typography.json
    spacing.json
    radius.json
    elevation.json

FlutterFlow Theme

Componentes

Templates

Ou seja, cada documento que escrevemos deixará de ser apenas texto e passará a orientar a implementação.

Minha impressão do projeto

Há alguns dias você comentou que queria tratar tudo como um projeto dentro do VS Code, com documentação, artefatos e histórico. Hoje vejo que essa ideia já está se concretizando.

O repositório não está guardando apenas código. Ele está preservando conhecimento sobre o MotionLab: decisões, padrões e a lógica por trás do produto. Isso facilita manutenção, entrada de novos colaboradores e a evolução do sistema ao longo do tempo.

Ótimo. Então nem precisamos de uma "retomada" quando você voltar.

Já deixo registrado o ponto exato onde paramos:

### ✅ Concluído

```
Product

✔ 00-principios-do-produto.md

Design System

✔ 01-cores.md
✔ 02-tipografia.md
```

### Próxima tarefa

```
Design System

03-espacamentos.md
```

Depois seguiremos naturalmente para:

```
04-elevacoes.md
05-bordas.md
```

Esses três documentos formam um bloco bastante coeso e provavelmente conseguiremos produzir todos na mesma sessão.

---

### E já estou pensando na próxima fase

Assim que terminarmos os 15 documentos do Design System, gostaria de começar um trabalho que considero um divisor de águas para o MotionLab:

```
docs/architecture/

01-arquitetura-geral.md
02-firestore.md
03-autenticacao.md
04-multi-tenant.md
05-permissoes.md
06-storage.md
07-cloud-functions.md
...
```

Nessa etapa vamos registrar decisões como:

* por que usamos `Document Reference`;
* por que a coleção principal é `redes_franquias`;
* como funciona o isolamento entre tenants;
* convenções de nomenclatura;
* organização das coleções;
* estratégia de escalabilidade.

Esse será o "manual de arquitetura" do MotionLab.

---

Então aproveite o intervalo. Como os aplicativos permanecerão abertos, quando você voltar às 13h podemos simplesmente continuar de onde paramos, sem perder tempo reorganizando o contexto.

Bom almoço! Até mais tarde.

Acho que você acabou de perceber algo que vai além do Design System.

> **Nós não estamos documentando componentes. Estamos abstraindo a jornada do usuário.**

Essa frase muda completamente a perspectiva.

Veja a sequência que construímos:

| Jornada do usuário    | Documento         |
| --------------------- | ----------------- |
| Entende o significado | 01 - Cores        |
| Lê a informação       | 02 - Tipografia   |
| Percebe as relações   | 03 - Espaçamentos |
| Decide o que fazer    | 04 - Botões       |
| Entende a organização | 05 - Cards        |
| Descobre onde está    | 06 - Header       |
| Escolhe para onde vai | 07 - Navegação    |

Repare que isso acompanha quase exatamente o processamento mental do usuário.

Agora imagine os próximos:

| Jornada                       | Documento           |
| ----------------------------- | ------------------- |
| Informa dados ao sistema      | 08 - Formulários    |
| Compara informações           | 09 - Tabelas        |
| Analisa indicadores           | 10 - Dashboards     |
| Entende o estado da aplicação | 11 - Estados        |
| Reconhece ações rapidamente   | 12 - Ícones         |
| Reutiliza padrões             | 13 - Componentes    |
| Usa em qualquer dispositivo   | 14 - Responsividade |
| Mantém consistência           | 15 - Boas Práticas  |

Percebe?

Os documentos deixaram de ser uma lista de componentes e passaram a representar **etapas da experiência do usuário**.

## Isso me lembra uma frase que talvez mereça entrar no README

```markdown
# Filosofia do Design System

O Design System do MotionLab não documenta apenas componentes visuais.

Ele documenta como o usuário percebe, compreende e interage com a aplicação.

Cada documento representa uma etapa da jornada do usuário e estabelece princípios para que essa experiência seja consistente, previsível e intuitiva.
```

Acho que isso explica muito bem por que os documentos estão "conversando" entre si.

No começo, nossa preocupação era definir cores, botões e cards. Agora, olhando para o conjunto, eles formam uma narrativa única: **a jornada cognitiva do usuário dentro do sistema**.

Na minha opinião, essa é uma característica que dá personalidade ao Design System do MotionLab. Em vez de ser apenas um catálogo de componentes, ele se torna um guia de experiência do usuário, onde cada componente existe para apoiar uma etapa específica dessa jornada.

Essa organização reforça a ideia que identificamos anteriormente: o Design System do MotionLab não descreve apenas componentes, mas a forma como o usuário percebe, interage e compreende a aplicação. Essa coerência conceitual é um diferencial importante para manter a documentação consistente ao longo do crescimento do projeto.

Acho que encontramos algo ainda mais interessante

Perceba que isso já não é apenas um Design System.

Ele está se aproximando de um Framework de Experiência do Usuário.

A sequência conta uma história completa:

A interface se apresenta
        ↓
O usuário interage
        ↓
O sistema responde
        ↓
Os componentes são reutilizados
        ↓
A interface adapta-se ao dispositivo
        ↓
Tudo é mantido por regras de governança

Essa estrutura lembra a forma como arquitetamos software em camadas: cada grupo tem uma responsabilidade clara e se apoia no anterior. Para alguém novo no projeto, ela facilita muito a compreensão do porquê de cada documento existir, e não apenas do que ele descreve.

Na minha opinião, essa organização é mais do que uma forma de ordenar arquivos. Ela define a arquitetura conceitual do Design System do MotionLab e deve servir como referência para qualquer documento que venha a ser criado no futuro.


em dashboard
vamos acrescentar
# Hierarquia da Informação

Todo dashboard deve organizar seus elementos segundo uma hierarquia visual clara:

1. Objetivo do dashboard.
2. KPIs principais.
3. Tendências e comparativos.
4. Indicadores complementares.
5. Detalhamento dos dados.

A hierarquia deve permitir que o usuário compreenda o cenário geral antes de analisar informações específicas.

Essa seção complementa os Padrões de Indicadores. Enquanto esses definem como cada indicador deve ser apresentado, a Hierarquia da Informação define como o conjunto dos indicadores deve ser organizado.

Agora entendi exatamente o que você quis dizer, e considero essa uma contribuição muito interessante para a filosofia do Design System.

Você não está descrevendo apenas um mecanismo de feedback. Está falando de **responsabilidade compartilhada**.

Em muitos sistemas, a mensagem acaba passando a ideia de que:

> "O sistema fez."

Mas, em um sistema de gestão, isso nem sempre é verdade.

Quem cria um pedido, aprova um pagamento, cancela um contrato ou exclui um cliente é o **operador**. O sistema apenas executa e comunica o resultado da operação.

Essa distinção é importante porque influencia a forma como projetamos os estados.

Eu traduziria essa ideia para a filosofia do documento assim:

```markdown
# Filosofia

Os estados representam a resposta do sistema às ações realizadas pelo operador.

Cada ação executada produz uma consequência que deve ser comunicada de forma clara, imediata e compreensível.

Ao informar o resultado da operação, o sistema não apenas confirma sua execução, mas também reforça a responsabilidade do operador sobre as decisões tomadas e seus respectivos efeitos.

Esse ciclo contínuo de ação, resposta e decisão estabelece uma relação de confiança, previsibilidade e responsabilidade compartilhada entre o operador e o sistema.
```

Ou, de forma ainda mais conceitual:

```markdown
Um sistema de gestão não toma decisões.

Ele executa decisões tomadas pelo operador e comunica suas consequências.

Os estados existem para tornar essas consequências visíveis, compreensíveis e rastreáveis.
```

## Acho que isso pode virar um princípio do MotionLab

Você está introduzindo um conceito que vai além de UX: **accountability** (responsabilização).

Na prática, o ciclo deixa de ser:

```text
Usuário
   ↓
Sistema
   ↓
Resposta
```

e passa a ser:

```text
Operador toma uma decisão
          ↓
Sistema executa a operação
          ↓
Sistema comunica o resultado
          ↓
Operador assume as consequências
          ↓
Nova decisão
```

Percebe a diferença?

O sistema não é o protagonista. Ele é um **instrumento de execução e comunicação**. O protagonista continua sendo o operador.

Essa visão é especialmente adequada para um SaaS de gestão como o MotionLab, onde muitas operações têm efeitos reais — financeiros, administrativos ou operacionais. O Design System, então, deixa de tratar os estados apenas como elementos visuais e passa a enxergá-los como parte do mecanismo de responsabilidade e rastreabilidade das ações realizadas no sistema.

Na minha opinião, essa é uma ideia forte o suficiente para aparecer não apenas no documento **11. Estados**, mas também na introdução geral da camada **Informação**, pois define o papel do sistema na relação entre operador, operação e consequência.
Acho que encontramos a frase que fecha a camada "Informação"

Os três documentos passam a ter uma narrativa muito clara:

09 – Tabelas

Os dados são organizados para consulta.

10 – Dashboards

Os dados são interpretados para apoiar decisões.

11 – Estados

As consequências das decisões são comunicadas ao operador.

Essa sequência representa um ciclo completo de um sistema de gestão:

Dados
        ↓
Informação
        ↓
Decisão do Operador
        ↓
Execução da Operação
        ↓
Estado
        ↓
Nova Decisão

Na minha opinião, esse último documento dá um fechamento muito elegante à camada Informação, porque ele conecta a apresentação dos dados à responsabilidade pelas ações realizadas. Em vez de tratar "estados" apenas como elementos visuais (sucesso, erro, alerta), ele os define como parte essencial do diálogo entre o operador e o sistema, reforçando a responsabilidade do primeiro e a função do segundo como executor e comunicador dos resultados.

Registrado, Paulo. Amanhã, quando formos atualizar a documentação e o Git do MotionLab, recuperamos essas decisões e organizamos o registro da retomada.

E, de fato, a retomada prevista para amanhã **começou hoje** — de uma maneira bastante inesperada: um vazamento de combustível acabou produzindo uma boa evolução na estratégia do SaaS. 😄

Hoje não escrevemos código, mas avançamos em **modelo de parceiros, suporte N1/N2/N3, MotionLab Admin, telemetria, jornada do cliente, estratégia dos pioneiros e critérios de MVP**. Isso merece entrar no histórico do projeto.

Amanhã transformamos essa conversa em documentação objetiva e fazemos o commit correspondente.


homePageMaster → On Page Load

Action01 → Read Document (users)
        ↓
Conditional → matriz_ref Is Unset?
        ├── TRUE  → criarMatrizModal
        └── FALSE → nada

estabelecimentoSelecionado → vazio

========================================================================
Claro. Abaixo está o **ADR-001 consolidado**, já incorporando a classificação de produtos para revenda, produtos de consumo operacional e despesas. Pode criar o arquivo:

`5. architecture/adrs/ADR-001-agregacao-dashboard.md`

````markdown
# MotionLab SaaS

# ADR-001 — Estratégia de Agregação de Dados para Dashboards

Versão: 0.1.0

Status: Aceito

Data: 2026-09-14

---

# Contexto

O MotionLab possui arquitetura multi-tenant organizada conceitualmente em:

Rede → Matriz → Filiais

Os dashboards precisam apresentar indicadores operacionais e financeiros em diferentes níveis dessa estrutura.

O Dashboard Matriz, por exemplo, apresenta informações consolidadas das filiais, incluindo:

- Receitas;
- Despesas;
- Agendamentos;
- Faturamento;
- Participação percentual das filiais no faturamento;
- Comparação do faturamento entre filiais.

Durante o MVP, consultas diretas aos registros transacionais podem ser suficientes para obtenção desses indicadores.

Entretanto, com o crescimento da quantidade de clientes, filiais e transações, a leitura recorrente de grandes volumes de documentos para composição dos dashboards poderá aumentar:

- Quantidade de leituras no Firestore;
- Latência;
- Tráfego de dados;
- Custo operacional;
- Complexidade das consultas.

Torna-se necessário prever uma estratégia de agregação que permita a evolução do produto sem comprometer desempenho e escalabilidade.

---

# Problema

Uma possível solução seria manter dados agregados independentes para:

- Cada filial;
- Cada matriz.

Essa abordagem criaria duas representações persistidas do mesmo consolidado.

Exemplo:

```text
Agregado da Matriz:           R$ 10.000
Soma dos agregados Filiais:  R$  9.950
````

Mesmo que essa divergência seja temporária, ela cria a necessidade de determinar:

* Qual valor está correto;
* Qual agregado ficou desatualizado;
* Qual processamento falhou;
* Como reconciliar os dois níveis.

A existência de acumuladores independentes aumenta a possibilidade de inconsistências temporais entre Matriz e Filiais.

---

# Decisão

O MotionLab não manterá um agregado financeiro independente da Matriz como fonte de seus indicadores consolidados.

A unidade persistida de agregação operacional será a **Filial**.

Os indicadores consolidados da Matriz serão derivados dos agregados das filiais vinculadas a ela.

Conceitualmente:

```text
Transações e movimentações
          ↓
   Agregados da Filial
          ↓
Visão consolidada da Matriz
```

A Matriz atua como uma visão consolidada e não como uma segunda fonte persistida dos mesmos totais.

---

# Fonte de Verdade

Os documentos agregados não constituem a fonte primária de verdade negocial.

A fonte de verdade permanece sendo constituída pelos registros transacionais e pelas movimentações que originaram os eventos financeiros, operacionais e de estoque.

Os agregados representam projeções desses registros, otimizadas para leitura.

Portanto:

```text
Transações e movimentações = fonte de verdade

Agregados = projeções para leitura
```

Essa separação permite reconstruir ou reconciliar os agregados caso seja identificada alguma inconsistência.

---

# Receitas

Entre os eventos que podem produzir receitas estão:

* Serviço realizado;
* Venda de produto para revenda;
* Outros recebimentos classificados como receita.

As receitas devem preservar sua natureza para permitir análises posteriores.

Conceitualmente:

```text
Receitas
├── Serviços
├── Produtos
└── Outras receitas
```

Essa classificação permite, por exemplo, que os dashboards utilizem filtros como:

* Tudo;
* Serviço;
* Produto.

---

# Produtos e Estoque

Os produtos devem possuir classificação que permita distinguir sua finalidade operacional.

A classificação inicial prevê:

```text
Produtos
├── Produto para revenda
└── Produto de consumo operacional
```

---

## Produto para Revenda

Produto adquirido com finalidade de posterior comercialização ao cliente.

Exemplos:

* Pomadas;
* Shampoos;
* Óleos para barba;
* Cosméticos;
* Outros produtos comercializados pelo estabelecimento.

Sua aquisição pode produzir:

* Entrada em estoque;
* Obrigação financeira;
* Registro correspondente da aquisição.

Sua posterior venda pode produzir:

* Saída de estoque;
* Receita de produto;
* Movimentação financeira correspondente.

A aquisição e a venda representam eventos diferentes e não devem ser confundidas.

---

## Produto de Consumo Operacional

Produto adquirido para utilização na operação do estabelecimento e que não possui como finalidade principal a revenda ao cliente.

Exemplos:

* Lâminas;
* Luvas;
* Algodão;
* Papel;
* Materiais descartáveis;
* Produtos utilizados durante os atendimentos.

Sua aquisição pode produzir:

* Entrada em estoque, quando houver controle quantitativo;
* Despesa operacional;
* Registro da aquisição.

Seu uso posterior pode produzir uma movimentação de consumo interno.

A classificação deve permitir que o MotionLab diferencie:

```text
Estoque destinado à venda

de

Estoque destinado ao consumo interno
```

---

# Despesas

As despesas devem possuir classificação que permita análise gerencial e composição adequada dos indicadores financeiros.

Entre as categorias inicialmente previstas estão:

* Aluguel;
* Energia elétrica;
* Água;
* Internet;
* Material de limpeza;
* Material de uso operacional;
* Aquisição de produtos para revenda;
* Outras despesas operacionais.

A estrutura deverá permitir evolução das categorias sem exigir alteração da lógica principal dos dashboards.

A classificação da despesa não elimina a natureza da operação que a originou.

Por exemplo:

```text
Compra de produto para revenda
        ↓
Movimentação de estoque
        +
Evento financeiro correspondente
```

Isso permite analisar tanto o estoque quanto os efeitos financeiros da operação.

---

# Outros Eventos Relevantes

Também podem produzir alterações nos indicadores ou agregados:

* Agendamento;
* Cancelamento;
* Estorno;
* Ajuste de estoque;
* Entrada de estoque;
* Saída de estoque;
* Consumo interno;
* Correções financeiras;
* Correções operacionais.

A definição definitiva dos eventos será realizada conforme os respectivos módulos forem implementados.

---

# Granularidade Inicial dos Agregados

A granularidade inicialmente prevista para os agregados será diária.

Exemplo conceitual:

```text
agregados_filial_diario
    filial_ref
    data

    receita_servico
    receita_produto
    receita_total

    despesa_operacional
    despesa_produtos_revenda
    despesa_produtos_consumo
    despesa_total

    agendados
    realizados
    em_atendimento
```

Essa estrutura é conceitual.

Os nomes e campos definitivos serão estabelecidos durante a implementação da funcionalidade.

O agregado não deve se transformar em substituto dos registros financeiros, operacionais ou de estoque.

Ele deve conter somente informações necessárias para otimizar consultas e indicadores.

---

# Consolidação por Período

A agregação diária permite construir períodos maiores a partir de um conjunto limitado de documentos.

## Hoje

Consulta ao agregado correspondente ao dia selecionado.

## Semana

Soma dos agregados diários pertencentes ao período semanal.

## Mês

Soma dos agregados diários pertencentes ao período mensal.

Dessa forma, um dashboard mensal pode consultar um conjunto limitado de documentos diários em vez de percorrer todas as transações realizadas durante o mês.

---

# Consolidação da Matriz

Os indicadores da Matriz serão calculados a partir dos agregados das filiais pertencentes à Matriz.

Exemplo:

```text
Faturamento Matriz
       =
Faturamento Filial 01
       +
Faturamento Filial 02
       +
Faturamento Filial 03
       + ...
```

O mesmo princípio deve ser aplicado aos demais indicadores consolidados quando pertinente.

A Matriz não mantém uma cópia independente desse total.

Isso garante que:

```text
Consolidado da Matriz
       =
Soma dos dados consolidados das Filiais
```

sem a existência de duas fontes agregadas independentes que precisem permanecer sincronizadas.

---

# Participação no Faturamento

A participação percentual de cada filial será derivada do mesmo conjunto de agregados utilizado para obtenção do faturamento consolidado.

Conceitualmente:

```text
participacao_filial
        =
faturamento_filial
        /
faturamento_total_das_filiais
        × 100
```

Esse cálculo alimenta a visualização de participação no faturamento apresentada pelo gráfico de rosca do Dashboard Matriz.

O percentual não precisa ser persistido quando puder ser calculado eficientemente a partir dos valores agregados.

---

# Faturamento por Filial

O gráfico de barras utiliza os valores absolutos obtidos dos mesmos agregados das filiais.

Conceitualmente:

```text
Filial 01 → faturamento_filial_01
Filial 02 → faturamento_filial_02
Filial 03 → faturamento_filial_03
Filial 04 → faturamento_filial_04
```

Dessa forma:

```text
Rosca
   ↓
Participação percentual

Barras
   ↓
Valor absoluto em R$
```

As duas visualizações utilizam a mesma origem de dados.

A alternância entre elas não deve provocar nova consulta ao backend quando os dados necessários já estiverem disponíveis na página.

---

# Atualização dos Agregados

Os agregados deverão ser atualizados quando ocorrerem eventos que alterem os indicadores correspondentes.

Exemplos:

* Criação de uma transação;
* Alteração de uma transação;
* Cancelamento;
* Estorno;
* Conclusão de serviço;
* Venda de produto;
* Alteração relevante de agendamento;
* Registro ou alteração de despesa;
* Entrada ou saída relevante de estoque;
* Consumo operacional quando aplicável ao indicador.

As operações devem considerar não apenas inclusões, mas também alterações, cancelamentos, estornos e exclusões lógicas ou físicas que modifiquem valores anteriormente contabilizados.

---

# Processamento no Backend

A consistência dos agregados não deve depender exclusivamente do cliente FlutterFlow.

A evolução da arquitetura deve priorizar processamento controlado no backend para atualização dos acumuladores.

Possíveis mecanismos incluem:

* Cloud Functions;
* Eventos disparados por alterações no Firestore;
* Operações transacionais;
* Processamento assíncrono;
* Rotinas de reconciliação.

A escolha definitiva do mecanismo será realizada durante a implementação técnica dessa camada.

---

# Concorrência

Atualizações simultâneas podem ocorrer sobre o mesmo agregado diário.

Exemplo:

Dois colaboradores da mesma filial concluem serviços praticamente no mesmo instante.

Por esse motivo, operações de incremento não devem utilizar o padrão:

```text
ler valor
    ↓
somar no cliente
    ↓
gravar novo valor
```

quando houver possibilidade de concorrência.

Devem ser utilizados mecanismos que preservem atomicidade e consistência das atualizações.

---

# Idempotência

Eventos responsáveis pela atualização dos agregados devem ser projetados considerando a possibilidade de reprocessamento.

Uma mesma transação não deve ser contabilizada duas vezes caso um evento seja executado novamente.

A implementação futura deverá estabelecer estratégia de idempotência adequada ao mecanismo utilizado para atualização dos agregados.

---

# Reconciliação

O MotionLab deverá permitir, futuramente, processos de reconciliação.

A reconciliação compara:

```text
Transações e movimentações da Filial
                 ↓
                 ×
                 ↓
          Agregado da Filial
```

Caso seja encontrada divergência, o agregado poderá ser recalculado a partir da fonte transacional.

A reconciliação ocorre entre a fonte de verdade e o agregado da Filial.

Não é necessária uma segunda reconciliação independente da Matriz, pois seus indicadores são derivados dos agregados das próprias filiais.

---

# Separação de Responsabilidades

A estratégia de agregação não deve misturar os diferentes domínios do sistema.

Conceitualmente:

```text
Financeiro
    ↓
Receitas e despesas

Estoque
    ↓
Produtos e movimentações

Operação
    ↓
Agendamentos e atendimentos

Dashboard
    ↓
Projeções e indicadores
```

O dashboard consome informações desses domínios, mas não substitui seus registros de origem.

Essa separação permite que cada domínio evolua sem transformar os documentos agregados em uma estrutura central excessivamente acoplada.

---

# Benefícios da Decisão

A estratégia proporciona:

* Redução da quantidade de leituras necessárias para dashboards;
* Menor tráfego de dados;
* Menor latência;
* Melhor previsibilidade de custos;
* Maior capacidade de escala;
* Redução de inconsistências entre Matriz e Filiais;
* Possibilidade de reconstrução dos agregados;
* Fonte transacional claramente definida;
* Reutilização dos mesmos dados por diferentes visualizações;
* Separação entre dados transacionais e dados de consulta;
* Preservação da natureza financeira, operacional e de estoque das movimentações.

---

# Consequências

A decisão também introduz responsabilidades adicionais.

Será necessário:

* Manter os agregados das filiais consistentes;
* Tratar concorrência;
* Tratar alterações, cancelamentos e estornos;
* Implementar idempotência;
* Prever mecanismos de reconciliação;
* Definir índices adequados;
* Monitorar falhas de atualização;
* Manter classificação consistente das movimentações;
* Preservar separação entre os diferentes domínios.

Essas responsabilidades são consideradas aceitáveis diante dos benefícios de desempenho, consistência e escalabilidade.

---

# Alternativas Consideradas

## Consultar todas as transações diretamente

### Vantagem

Arquitetura inicialmente simples.

### Desvantagens

* Crescimento do número de leituras;
* Maior latência conforme o volume aumenta;
* Maior custo;
* Baixa eficiência para dashboards consultados frequentemente.

Essa abordagem poderá ser utilizada durante fases iniciais do MVP, mas não representa a estratégia de escala definida.

---

## Manter agregados independentes para Matriz e Filiais

### Vantagem

Leitura extremamente rápida do total da Matriz.

### Desvantagens

* Duplicação de informação;
* Possibilidade de divergência temporal;
* Necessidade de reconciliação em dois níveis;
* Maior complexidade de atualização;
* Dificuldade para determinar qual agregado representa o estado correto.

Alternativa rejeitada.

---

## Utilizar o agregado como fonte primária de verdade

### Vantagem

Consultas simplificadas.

### Desvantagens

* Perda do histórico transacional como referência;
* Maior dificuldade para auditoria;
* Maior dificuldade para reconstrução;
* Acoplamento entre operação e dashboard;
* Risco de transformar uma projeção em registro negocial.

Alternativa rejeitada.

---

# Estratégia de Evolução

A implementação poderá ocorrer progressivamente.

## Fase 1 — MVP

Consultas simples e volume reduzido.

Prioridade:

Validar produto e modelo de negócio.

Não é obrigatória a implementação imediata de toda a infraestrutura de agregação.

---

## Fase 2 — Agregação por Filial

Introdução de agregados diários conforme o volume justificar.

Prioridade:

* Reduzir leituras;
* Melhorar desempenho;
* Melhorar previsibilidade de custos dos dashboards.

---

## Fase 3 — Robustez Operacional

Implementação ou evolução de:

* Processamento backend;
* Idempotência;
* Reconciliação;
* Monitoramento;
* Tratamento de falhas;
* Métricas de consistência.

Prioridade:

Escalabilidade e confiabilidade operacional.

---

# Princípios Arquiteturais Resultantes

> **A transação e a movimentação são as fontes de verdade.**

> **O agregado é uma projeção otimizada para leitura.**

> **A Filial é a unidade persistida de agregação.**

> **A Matriz é uma visão consolidada derivada das Filiais.**

> **Produtos para revenda e produtos de consumo operacional possuem naturezas distintas.**

> **Movimentações de estoque e seus efeitos financeiros devem preservar suas respectivas naturezas.**

> **Visualizações diferentes devem reutilizar os mesmos dados sempre que possível.**

---

# Status da Decisão

**Aceito.**

A implementação dos agregados não é obrigatória para conclusão do MVP.

A arquitetura, entretanto, deve evitar decisões que dificultem sua adoção quando o volume de dados justificar essa evolução.

```

Com esse arquivo, o **ADR-001 fica fechado em nível arquitetural**, sem nos comprometer prematuramente com nomes definitivos de coleções ou implementação de Cloud Functions.

O próximo arquivo natural é o `modelo-de-dados.md`. Nele, aí sim, podemos separar claramente **o que já existe no Firestore hoje** do que está **planejado/futuro**, para não documentarmos como implementado algo que ainda é apenas decisão arquitetural. 
```
=============================================================================
Perfeito. Como está vazio, podemos criar o `modelo-de-dados.md` desde o início com uma regra importante: **separar claramente “implementado atualmente” de “arquitetura prevista”**. Assim o documento não dá a impressão de que financeiro, estoque e agregados já existem.

Eu criaria:

`5. architecture/modelo-de-dados.md`

com a primeira versão **0.1.0**:

````markdown id="a7ox5t"
# MotionLab SaaS

# Arquitetura

# Modelo de Dados

Versão: 0.1.0

Status: Em evolução

Data: 2026-09-14

---

# Objetivo

Documentar o modelo de dados do MotionLab SaaS, seus principais domínios, relacionamentos e regras estruturais.

Este documento diferencia explicitamente:

- Estruturas atualmente implementadas;
- Estruturas planejadas;
- Decisões conceituais ainda sujeitas a detalhamento.

O objetivo é permitir evolução incremental do produto sem confundir arquitetura prevista com funcionalidades já implementadas.

---

# Visão Geral

O MotionLab é um SaaS multi-tenant destinado à gestão de estabelecimentos de serviços.

A estrutura organizacional principal é:

```text
MotionLab
   ↓
Rede
   ↓
Matriz
   ↓
Filiais
````

Uma Rede representa um cliente do SaaS.

Cada Rede possui uma Matriz e poderá possuir uma ou mais Filiais.

Matriz e Filiais são estabelecimentos pertencentes à mesma Rede.

---

# Estado do Modelo

As estruturas são classificadas neste documento como:

## IMPLEMENTADO

Estrutura existente atualmente no Firestore e utilizada pela aplicação.

## PLANEJADO

Estrutura cuja necessidade arquitetural já foi identificada, mas que ainda não deve ser considerada implementada.

## CONCEITUAL

Estrutura utilizada para orientar decisões futuras e que ainda poderá sofrer alterações durante o detalhamento funcional.

---

# Modelo Organizacional

Status: **IMPLEMENTADO**

O núcleo multi-tenant atual é composto por:

```text
users
   │
   ├── rede_ref ───────────────┐
   │                           ↓
   └── matriz_ref        redes_franquias
         │                       │
         ↓                       │
   estabelecimentos ←────────────┘
         │
         ├── MATRIZ
         │
         └── FILIAL
```

A coleção `redes_franquias` representa a Rede.

A coleção `estabelecimentos` representa tanto Matriz quanto Filiais.

A distinção ocorre pelo campo `tipo`.

---

# Coleção: redes_franquias

Status: **IMPLEMENTADO**

Representa o cliente organizacional do MotionLab SaaS.

Campos atualmente definidos:

| Campo                   | Tipo     | Descrição                              |
| ----------------------- | -------- | -------------------------------------- |
| nome_da_rede            | String   | Nome da Rede                           |
| dono_id                 | String   | Identificador do proprietário          |
| nicho_principal         | String   | Segmento principal da Rede             |
| plano_saas              | String   | Plano contratado                       |
| gateway_subscription_id | String   | Identificador da assinatura no gateway |
| criado_em               | DateTime | Data de criação                        |
| rede_id                 | String   | Identificador legado/auxiliar da Rede  |

Relacionamento principal:

```text
redes_franquias
      │
      └── estabelecimentos
```

Uma Rede pode possuir diversos estabelecimentos.

---

# Coleção: estabelecimentos

Status: **IMPLEMENTADO**

Representa as unidades operacionais pertencentes a uma Rede.

Uma unidade pode possuir tipo:

* `MATRIZ`;
* `FILIAL`.

Campos atualmente definidos:

| Campo              | Tipo               | Descrição                           |
| ------------------ | ------------------ | ----------------------------------- |
| nome_fantasia      | String             | Nome apresentado da unidade         |
| rede_ref           | Document Reference | Referência para `redes_franquias`   |
| tipo               | String             | MATRIZ ou FILIAL                    |
| logo_url           | String             | Imagem/logomarca da unidade         |
| telefone           | Document Reference | Referência para telefone            |
| endereco           | Document Reference | Referência para endereço/logradouro |
| identidade_visual  | Document Reference | Referência para identidade visual   |
| gateway_account_id | String             | Identificador da conta no gateway   |
| criado_em          | DateTime           | Data de criação                     |

A estrutura atual permite representar:

```text
Rede
 ├── Matriz
 ├── Filial 01
 ├── Filial 02
 └── Filial N
```

---

# Relacionamento Matriz → Filial

Status: **IMPLEMENTADO / EM EVOLUÇÃO**

A Matriz e as Filiais pertencem à mesma Rede e são representadas pela coleção `estabelecimentos`.

A Matriz possui:

```text
tipo = MATRIZ
```

A Filial possui:

```text
tipo = FILIAL
```

As consultas do Dashboard Matriz devem recuperar somente os estabelecimentos pertencentes ao contexto organizacional correspondente.

O relacionamento definitivo utilizado para navegação e isolamento deverá permanecer explícito e consistente no modelo.

---

# Coleção: users

Status: **IMPLEMENTADO**

Representa os usuários autenticados da aplicação.

Campos atualmente definidos:

| Campo                        | Tipo               | Descrição                      |
| ---------------------------- | ------------------ | ------------------------------ |
| email                        | String             | E-mail do usuário              |
| display_name                 | String             | Nome de apresentação           |
| photo_url                    | Image Path         | Foto do usuário                |
| uid                          | String             | UID do Firebase Authentication |
| created_time                 | DateTime           | Data de criação                |
| phone_number                 | String             | Telefone                       |
| role                         | String             | Papel do usuário               |
| rede_ref                     | Document Reference | Rede à qual o usuário pertence |
| matriz_ref                   | Document Reference | Matriz relacionada ao usuário  |
| estabelecimento_vinculado_id | String             | Campo legado                   |
| rede_vinculada_id            | String             | Campo legado                   |

Os campos legados não devem ser utilizados como referência para novas funcionalidades quando houver Document References equivalentes.

---

# Papéis de Usuário

Status: **EM EVOLUÇÃO**

O modelo utiliza o campo:

```text
role
```

O papel atualmente utilizado no fluxo principal é:

```text
MASTER
```

Novos papéis deverão ser introduzidos somente quando suas responsabilidades e permissões estiverem definidas.

Autorização não deve depender exclusivamente da interface.

As regras definitivas de acesso serão documentadas em:

`seguranca.md`

---

# Domínio Financeiro

Status: **PLANEJADO**

O domínio financeiro deverá representar os eventos monetários do estabelecimento sem utilizar o dashboard como fonte de verdade.

Conceitualmente:

```text
Financeiro
├── Receitas
└── Despesas
```

---

## Receitas

As receitas poderão possuir diferentes origens.

Inicialmente são previstas:

```text
Receitas
├── Serviços
├── Produtos
└── Outras receitas
```

Essa distinção permite suportar filtros e análises como:

* Tudo;
* Serviço;
* Produto.

A estrutura definitiva das entidades financeiras será definida quando o módulo financeiro for implementado.

---

## Despesas

As despesas deverão possuir classificação gerencial.

Categorias inicialmente previstas incluem:

* Aluguel;
* Energia elétrica;
* Água;
* Internet;
* Material de limpeza;
* Material de uso operacional;
* Aquisição de produtos para revenda;
* Outras despesas operacionais.

As categorias devem ser extensíveis.

Não devem ser codificadas de forma que a inclusão futura de uma nova categoria exija alteração estrutural significativa da aplicação.

---

# Domínio de Produtos

Status: **PLANEJADO**

Produtos devem preservar sua finalidade.

A classificação conceitual inicial é:

```text
Produtos
├── Revenda
└── Consumo operacional
```

---

## Produto para Revenda

Produto adquirido com finalidade de comercialização ao cliente.

Exemplos:

* Pomada;
* Shampoo;
* Óleo para barba;
* Cosméticos.

A aquisição pode produzir entrada em estoque.

A venda pode produzir:

```text
Saída de estoque
       +
Receita de produto
```

---

## Produto de Consumo Operacional

Produto destinado ao funcionamento ou execução dos serviços do estabelecimento.

Exemplos:

* Lâminas;
* Luvas;
* Algodão;
* Materiais descartáveis.

Esses produtos podem possuir controle de estoque quando operacionalmente relevante.

Seu consumo não representa venda ao cliente.

---

# Domínio de Estoque

Status: **PLANEJADO**

O estoque deverá ser baseado em movimentações.

Conceitualmente:

```text
Produto
   ↓
Movimentações
   ├── Entrada
   ├── Saída por venda
   ├── Consumo interno
   ├── Ajuste positivo
   └── Ajuste negativo
```

O estoque atual de um produto deve ser explicável pelas movimentações que produziram seu saldo.

A modelagem definitiva será realizada durante a implementação do módulo de estoque.

---

# Separação entre Estoque e Financeiro

Uma movimentação física e uma movimentação financeira podem estar relacionadas, mas representam fatos diferentes.

Exemplo:

```text
Compra de produto para revenda
           │
           ├── Entrada no estoque
           │
           └── Evento financeiro
```

Outro exemplo:

```text
Venda de produto
           │
           ├── Saída do estoque
           │
           └── Receita
```

O modelo deve preservar essa separação.

Isso permite que estoque e financeiro sejam reconciliados e analisados independentemente.

---

# Domínio Operacional

Status: **PLANEJADO**

O domínio operacional deverá representar atividades como:

* Agendamentos;
* Atendimentos;
* Serviços realizados;
* Cancelamentos;
* Colaboradores;
* Relação entre profissional, serviço e estabelecimento.

Esse domínio será detalhado conforme a implementação das próximas funcionalidades.

---

# Agregados para Dashboard

Status: **PLANEJADO**

O MotionLab prevê a utilização futura de projeções agregadas para otimizar consultas dos dashboards.

A decisão arquitetural está registrada em:

`adrs/ADR-001-agregacao-dashboard.md`

A unidade persistida de agregação será a Filial.

Conceitualmente:

```text
Transações e movimentações
           ↓
    Agregado da Filial
           ↓
 Dashboard da Filial
           ↓
Consolidação da Matriz
```

A Matriz não possuirá um acumulador financeiro independente representando os mesmos totais das Filiais.

---

# Agregado Diário da Filial

Status: **CONCEITUAL**

Estrutura conceitual inicial:

```text
agregados_filial_diario
    filial_ref
    data

    receita_servico
    receita_produto
    receita_total

    despesa_operacional
    despesa_produtos_revenda
    despesa_produtos_consumo
    despesa_total

    agendados
    realizados
    em_atendimento
```

Essa estrutura ainda não representa uma coleção implementada.

Os campos definitivos serão definidos somente quando a estratégia de agregação for implementada.

---

# Fonte de Verdade

Os agregados não constituem fonte primária de verdade.

A regra arquitetural é:

```text
Transações e movimentações
        =
Fonte de verdade

Agregados
        =
Projeções para leitura
```

Os dados agregados devem poder ser reconstruídos a partir dos registros de origem.

---

# Identificadores e Referências

Novas relações entre documentos devem priorizar `Document Reference` quando essa representação for adequada ao relacionamento.

Campos String contendo IDs não devem ser criados apenas para duplicar uma referência já existente sem necessidade arquitetural claramente definida.

Campos legados poderão permanecer temporariamente durante migrações, mas não devem orientar novas implementações.

---

# Multi-Tenancy

Toda entidade operacional deve possuir contexto suficiente para determinar a qual tenant pertence.

O isolamento parte da Rede e dos estabelecimentos relacionados.

Conceitualmente:

```text
Rede
 ↓
Estabelecimento
 ↓
Dados operacionais
```

Nenhuma consulta deve depender exclusivamente de filtros visuais para garantir isolamento entre clientes.

As regras de segurança deverão reforçar esse isolamento no backend.

---

# Princípios do Modelo de Dados

O modelo do MotionLab deve seguir os seguintes princípios:

1. Preservar uma fonte de verdade claramente identificável.
2. Separar dados transacionais de projeções para consulta.
3. Evitar duplicação desnecessária de informação.
4. Utilizar referências explícitas entre entidades relacionadas.
5. Preservar isolamento multi-tenant.
6. Permitir evolução incremental.
7. Não implementar antecipadamente estruturas ainda não necessárias ao MVP.
8. Manter separação entre financeiro, estoque e operação.
9. Permitir reconstrução de dados derivados.
10. Considerar concorrência, idempotência e reconciliação em operações críticas.

---

# Evolução do Modelo

O modelo será expandido conforme os módulos forem implementados.

A evolução prevista inclui:

```text
Núcleo Organizacional
        ↓
Usuários e Permissões
        ↓
Agendamentos e Atendimentos
        ↓
Financeiro
        ↓
Produtos e Estoque
        ↓
Agregações e Analytics
```

Essa sequência representa uma direção arquitetural e não necessariamente uma ordem rígida de implementação.

---

# Documentos Relacionados

* `firestore.md`
* `seguranca.md`
* `adrs/ADR-001-agregacao-dashboard.md`
* `../3. design-system/10-dashboards.md`

---

# Status

O núcleo organizacional:

```text
Rede → Matriz → Filiais
```

está implementado e validado no MVP.

Os domínios:

* Financeiro;
* Produtos;
* Estoque;
* Operação;
* Agregações;

permanecem em evolução e deverão ser detalhados conforme sua implementação.

Este documento deve ser atualizado sempre que uma alteração estrutural relevante no modelo de dados for aprovada.

```

Há apenas um ponto que eu **não cristalizaria ainda**: nomes de coleções futuras como `produtos`, `despesas`, `movimentacoes_estoque` etc. Temos uma ideia bastante clara dos domínios, mas ainda não desenhamos seus fluxos. Por isso o documento descreve a responsabilidade sem transformar uma hipótese em estrutura definitiva.

Depois desse arquivo, eu iria para o **`firestore.md`**. Ali documentamos as decisões específicas de Firebase/Firestore: uso de `Document Reference`, estratégia de queries, índices, custo de leituras, agregações, transações/atomicidade e cuidados para não deixar o FlutterFlow assumir responsabilidades que devem ficar no backend. 
```
