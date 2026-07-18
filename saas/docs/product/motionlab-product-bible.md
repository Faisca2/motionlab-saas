Verificando se o repositorio esta funcionando 
Agora entendi melhor o seu fluxo — e ele é mais estruturado do que o modelo simples que eu havia sugerido.

Pelo que descreveu, funciona aproximadamente assim:

```text
main
└── desenvolvimento integrado e build realizado

HU-12345
└── branch de trabalho da equipe vinculada à História de Usuário

VRS 1.2.0 RC01
└── versão candidata fechada para homologação

VRS 1.2.0
└── versão aprovada e disponibilizada em produção
```

Isso combina três mecanismos diferentes:

* **Branches** para organizar o desenvolvimento por HU;
* **Release Candidate** para congelar e validar uma versão em homologação;
* **Versão definitiva** para identificar exatamente o que foi para produção.

É um fluxo coerente para ambientes corporativos, principalmente quando há rastreabilidade entre requisito, implementação, homologação e produção.

Para o MotionLab, podemos adaptar sem copiar toda a complexidade corporativa desde o primeiro dia:

```text
main
└── estado integrado e utilizável do produto

hu/001-cadastro-rede
└── implementação de uma História de Usuário

v0.1.0-rc.1
└── versão candidata para validação

v0.1.0
└── versão oficialmente fechada
```

No Git, versões normalmente ficam melhor representadas por **tags**, não por branches permanentes:

```bash
git tag -a v0.1.0-rc.1 -m "Release candidate 1 da versão 0.1.0"
git push origin v0.1.0-rc.1
```

Depois da validação:

```bash
git tag -a v0.1.0 -m "Release 0.1.0"
git push origin v0.1.0
```

Assim, a branch continua evoluindo, enquanto a tag preserva exatamente o ponto correspondente à RC ou à produção.

Também podemos manter sua nomenclatura institucional, caso prefira:

```text
VRS-0.1.0-RC01
VRS-0.1.0
```

Mas, para compatibilidade com ferramentas e convenções, eu recomendaria:

```text
v0.1.0-rc.1
v0.1.0
```

Seu modelo mostra que o objetivo não é apenas “guardar o código”. É garantir que qualquer analista consiga responder:

> Qual HU originou esta alteração, qual versão foi homologada e qual versão está em produção?

Esse princípio deve entrar futuramente no `docs/development/git-workflow.md`.
