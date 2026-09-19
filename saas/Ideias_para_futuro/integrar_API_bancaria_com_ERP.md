Sim. Fiz a pesquisa mirando exatamente a ideia original. **Minha conclusão provisória é que há concorrentes próximos e até soluções com partes muito semelhantes, mas não encontrei, no Brasil, uma oferta claramente posicionada exatamente como você descreveu: uma plataforma self-service/low-code voltada diretamente à empresa com ERP/legado antigo, que permite configurar a origem dos dados e fazer a ponte para APIs bancárias sem exigir desenvolvimento no ERP.**

### O que encontrei no Brasil

O mais próximo tecnicamente foi a [Kobana](https://www.kobana.com.br/?utm_source=chatgpt.com). Ela merece atenção porque explicitamente oferece integração por API, webhook, arquivos e até **leitura direta do banco de dados para ERP on-premise**. Também possui integração genérica por CSV, TXT, XML, JSON e OFX. Isso chega bastante perto do problema que você descreveu. Porém, o modelo apresentado envolve integrações prontas e projetos de implantação; não encontrei evidência de uma interface self-service na qual o próprio cliente configure banco → endpoint → origem → condição → mapeamento request/response. ([Kobana][1])

A [PlugBank da TecnoSpeed](https://tecnospeed.com.br/plugbank/?utm_source=chatgpt.com) possui uma infraestrutura muito forte: mais de 40 bancos, boleto, Pix, pagamentos, Open Finance etc. Mas seu posicionamento é explicitamente **para software houses incorporarem recursos bancários aos seus ERPs**. Ou seja, resolve a complexidade banco a banco, mas ainda parte da ideia de que alguém integra o ERP à plataforma. ([TecnoSpeed][2])

A [Pluggy](https://www.pluggy.ai/?utm_source=chatgpt.com) também oferece uma camada única de conectividade financeira e fala diretamente da substituição de OFX/CNAB por APIs. Novamente, o foco encontrado é **dar APIs para que ERPs e sistemas de gestão desenvolvam a integração**, e não necessariamente eliminar a necessidade de desenvolvimento do legado. ([Pluggy][3])

Encontrei ainda um projeto open source muito interessante, [Cobranca-API](https://github.com/Maxwbh/cobranca-api?utm_source=chatgpt.com). Ele cria um contrato REST único para boleto, Pix, CNAB e conciliação e explicitamente cita sistemas legados em Java, C#, Delphi, Oracle APEX etc. É conceitualmente próximo no lado **“normalizar vários bancos atrás de uma interface”**, mas ainda pressupõe que o sistema consumidor faça chamadas HTTP; não é o configurador visual de integração que você imaginou. ([GitHub][4])

### O achado mais interessante veio de fora do Brasil

A [Volante Technologies](https://www.volantetech.com/?utm_source=chatgpt.com) descreve algo impressionantemente parecido com partes da sua ideia: integração *corporate-to-bank*, **low-code**, onboarding self-service, interface intuitiva, suporte a qualquer ERP/formato, mapeamento sem programação, tradução de formatos legados para padrões modernos e conectividade cloud/API. ([Volante Technologies][5])

Também encontrei a [Kyriba](https://www.kyriba.com/?utm_source=chatgpt.com). Ela atua como hub entre ERP e bancos, transforma formatos automaticamente e possui ferramentas low-code. A própria empresa diz que sua conectividade fica **fora do ERP**, justamente para evitar reconstruir integrações quando o ERP muda. É uma solução enterprise de tesouraria muito mais ampla que a sua ideia inicial. ([Kyriba][6])

A [Cobase](https://www.cobase.com/?utm_source=chatgpt.com) também chega perto: ERP → plataforma → bancos, cuidando de autenticação, criptografia, conversão de formatos e validação. A empresa diz explicitamente que uma conexão com a Cobase permite sincronizar operações bancárias sem integrações customizadas banco a banco. ([Cobase][7])

### Onde vejo a diferença da sua hipótese

Depois dessa pesquisa, eu desenharia o espaço assim:

```text
PlugBank / Pluggy
       │
       │ "Damos uma API única"
       ▼
ERP precisa integrar
```

Enquanto sua hipótese é:

```text
ERP NÃO PRECISA SER MODERNIZADO
          │
          │ arquivo / BD / REST
          ▼
┌───────────────────────────────┐
│ Plataforma configurável       │
│                               │
│ Banco: BB                     │
│ Serviço: Cobrança             │
│ Operação: Registrar título    │
│                               │
│ Origem: Oracle                │
│ Tabela: TITULOS               │
│ Condição: STATUS='PENDENTE'   │
│                               │
│ DE/PARA visual                │
│ campo ERP → campo API         │
│                               │
│ Credenciais                   │
│ Request / Response            │
│ Retry / auditoria / histórico │
└──────────────┬────────────────┘
               │
               ▼
             API BB
```

E depois:

```text
              mesmo ERP
                  │
           ┌──────┴──────┐
           ▼             ▼
          BB           Itaú
      Cobrança       Cobrança
```

O cliente configura em vez de desenvolver.

### E apareceu uma confirmação interessante da sua percepção

A própria Kobana oferece **integração via banco de dados para ERPs on-premise** e integração por arquivos para legados. ([Kobana][1])

Isso mostra que o problema que você identificou é suficientemente real para empresas comerciais já construírem mecanismos específicos para contorná-lo.

Mas sua proposta vai um passo além se você transformar isso em um **motor genérico configurável**, em vez de a Kobana ou sua empresa precisar desenvolver/adaptar cada integração.

### Minha leitura após a pesquisa

Eu não trataria a ideia como “não existe concorrência”. **Existe bastante concorrência adjacente e internacionalmente existem soluções conceitualmente próximas.**

Por outro lado, também **não descartaria a hipótese**.

O nicho específico que merece investigação seria:

> **Organizações brasileiras que possuem ERP/legado funcional, operam cobrança bancária por CNAB/arquivo e querem migrar para APIs sem projeto de modernização do ERP e sem equipe de desenvolvimento.**

Prefeituras, autarquias e organizações atendidas por escritórios contábeis encaixam exatamente no problema que você descreveu.

E tem um detalhe que eu achei particularmente significativo: a maior parte das ofertas brasileiras que encontrei diz essencialmente **“integre nossa API ao seu ERP”**. Sua pergunta é outra:

> **“E se eu não precisar integrar nada dentro do ERP?”**

É aí que eu continuaria a investigação.

[1]: https://www.kobana.com.br/integracoes/erps?utm_source=chatgpt.com "Seu ERP conectado ao seu banco - Plataforma financeira com IA nativa - Kobana"
[2]: https://tecnospeed.com.br/plugbank/?utm_source=chatgpt.com "Hub de APIs Financeiras e Open Finance para ERP | PlugBank"
[3]: https://www.lp.pluggy.ai/erp?utm_source=chatgpt.com "Pluggy | API Open Finance"
[4]: https://github.com/Maxwbh/cobranca-api?utm_source=chatgpt.com "GitHub - Maxwbh/cobranca-api: Plataforma open source de cobrança bancária brasileira: boleto, CNAB 240/400, Pix, cartão e OFX numa API REST. 3 bancos online + 18 offline, 100% Python, um container. · GitHub"
[5]: https://www.volantetech.com/corporate-to-bank-connectivity/?utm_source=chatgpt.com "Corporate to bank integration | Volante Technologies"
[6]: https://www.kyriba.com/products/connectivity/?utm_source=chatgpt.com "Proven bank connectivity and real-time cloud solutions — Kyriba"
[7]: https://www.cobase.com/products/product-overview?utm_source=chatgpt.com "Cobase - Product Overview"


Essa frase resume muito bem a hipótese central do produto.

**“E se eu não precisar integrar nada dentro do ERP?”**

A resposta seria: seu produto **se adapta ao legado**, em vez de exigir que o legado se adapte ao banco.

Por exemplo, uma prefeitura hoje gera um arquivo para registrar títulos. Você não pede que ela altere o ERP. Seu produto simplesmente passa a consumir aquilo que o ERP já produz:

```text
HOJE

ERP → CNAB/arquivo → Banco


COM SEU PRODUTO

ERP → mesmo arquivo
          ↓
     SUA PLATAFORMA
          ↓
     API bancária
          ↓
       Banco
```

O ERP poderia **nem saber que houve uma API no caminho**.

Em outro cliente, talvez nem seja necessário arquivo:

```text
ERP → Oracle
        ↑
 Seu agente identifica:
 STATUS = "PRONTO"
        ↓
 Plataforma Cloud
        ↓
 API bancária
```

E devolve o resultado ao local configurado:

```text
STATUS = REGISTRADO
NOSSO_NUMERO = ...
CODIGO_BARRAS = ...
```

Aqui está, para mim, a diferença mais importante em relação a várias soluções que encontramos na pesquisa:

**“Integre sua aplicação à nossa API.”**

versus

**“Mostre onde seus dados estão e como seu processo funciona. Nós fazemos a integração.”**

Isso muda bastante o público-alvo. Você não está necessariamente vendendo uma API para o desenvolvedor. Está vendendo uma **solução para uma organização que justamente tem dificuldade de conseguir desenvolvedores, orçamento ou autorização para modificar seu legado.**

E tem outra consequência interessante: o primeiro onboarding poderia ser quase um assistente:

**Qual banco? → Qual serviço? → Como você trabalha hoje? → Onde estão os dados? → Quando um registro está pronto? → Faça o DE/PARA dos campos → Onde devo devolver o resultado? → Testar → Homologar → Ativar.**

Isso começa a parecer um **“Zapier de integrações bancárias”**, mas especializado em processos financeiros, com requisitos muito mais fortes de segurança, consistência, auditoria e conciliação.

E aquela IA que iniciou nossa conversa poderia entrar posteriormente justamente nesse onboarding:

> “Meu sistema gera um CNAB 240.”

A IA:

> “Envie um arquivo de homologação. Identifiquei os campos correspondentes à operação de cobrança. Vou propor o mapeamento para você revisar.”

Aí você teria algo realmente interessante: **low-code + integração bancária + IA**, sem obrigar o cliente a reconstruir seu ERP.

Essa frase — **“E se eu não precisar integrar nada dentro do ERP?”** — eu guardaria. Ela expressa melhor a proposta original do que “conector bancário”.
