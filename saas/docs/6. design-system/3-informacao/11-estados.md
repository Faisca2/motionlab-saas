# MotionLab SaaS

# Design System

# 11. Estados

Versão: 0.1.0

---

# Essência

> **Todo estado deve comunicar claramente o resultado de uma operação.**
>
> **Os estados representam a resposta do sistema às ações do operador, tornando visíveis suas consequências e permitindo decisões conscientes durante a utilização da aplicação.**

---

# Objetivo

Definir os princípios e diretrizes para utilização dos estados no MotionLab, garantindo que toda operação realizada possua um retorno claro, consistente e compreensível.

Os estados devem reduzir incertezas, orientar o operador e fortalecer a confiança na utilização do sistema.

---

# Contexto

Toda interação entre o operador e o sistema produz uma consequência.

Os estados representam a forma como essa consequência é comunicada.

Ao informar o resultado de uma operação, o sistema permite que o operador compreenda a situação atual, avalie seus efeitos e decida os próximos passos.

No MotionLab, nenhum processo deve permanecer sem uma resposta clara ao operador.

---

# Princípios

Os estados do MotionLab devem ser:

- Claros;
- Imediatos;
- Consistentes;
- Objetivos;
- Confiáveis;
- Rastreáveis.

Todo estado deve comunicar exatamente o que ocorreu, sem ambiguidades.

---

# Filosofia

O sistema não toma decisões.

As decisões pertencem ao operador.

O sistema executa as operações solicitadas e comunica suas consequências.

Cada ação realizada deve produzir um retorno que permita ao operador compreender o resultado obtido, assumir suas consequências e decidir sua próxima ação.

Essa comunicação estabelece uma relação contínua de confiança, responsabilidade e previsibilidade entre o operador e o sistema.

---

# Estrutura

Os estados podem representar:

- Sucesso;
- Erro;
- Atenção;
- Informação;
- Processamento;
- Aguardando confirmação;
- Bloqueado;
- Ativo;
- Inativo;
- Sincronizando;
- Concluído;
- Cancelado.

Cada estado deve possuir identidade visual, textual e comportamental padronizadas.

---

# Regras

Os estados devem seguir as seguintes regras:

- Toda operação deve produzir um estado.
- O estado deve ser apresentado no momento adequado.
- O texto deve explicar claramente o resultado.
- Sempre que possível, indicar a ação seguinte.
- Estados semelhantes devem possuir comportamento idêntico.
- Nunca utilizar estados contraditórios.
- O operador nunca deve ficar em dúvida sobre a situação da operação.

---

# Boas Práticas

Para manter uma boa experiência recomenda-se:

- Utilizar linguagem simples.
- Informar exatamente o que ocorreu.
- Diferenciar claramente sucesso, alerta, erro e processamento.
- Informar quando uma ação depende de confirmação.
- Apresentar mensagens acionáveis sempre que possível.
- Manter consistência entre módulos.

---

# Padrões de Estados

Todo estado deve definir:

- Nome oficial.
- Descrição.
- Cor oficial.
- Ícone oficial.
- Prioridade.
- Persistência (temporário ou permanente).
- Ação esperada do operador.
- Possibilidade de reversão.
- Registro em histórico (quando aplicável).

---

# O que evitar

Evite:

- Mensagens genéricas.
- Estados sem contexto.
- Estados contraditórios.
- Informações insuficientes.
- Uso excessivo de cores.
- Estados que desaparecem antes da leitura.
- Operações sem retorno ao operador.

---

# Implementação (FlutterFlow)

No FlutterFlow, os estados devem ser implementados utilizando componentes reutilizáveis.

Sempre que possível:

- Centralizar mensagens.
- Padronizar cores.
- Padronizar ícones.
- Utilizar Design Tokens.
- Reutilizar componentes de alerta, sucesso e erro.
- Registrar estados relevantes quando fizerem parte do processo de negócio.

---

# Design Tokens

Os estados utilizam os Design Tokens oficiais referentes a:

- Cores;
- Tipografia;
- Ícones;
- Espaçamentos;
- Bordas;
- Animações (quando aplicável).

Este documento descreve os princípios de utilização dos estados.

Os valores oficiais permanecem centralizados nos arquivos de Design Tokens.

---

# Critérios de Aceitação

Um estado está aderente ao Design System quando:

- Atende ao objetivo definido neste documento.
- Respeita os princípios estabelecidos.
- Segue as regras de utilização.
- Não apresenta nenhuma das situações descritas em "O que evitar".
- Está implementado conforme as diretrizes do FlutterFlow.
- Utiliza exclusivamente os Design Tokens oficiais.
- Mantém consistência visual com os demais componentes do MotionLab.
- Comunica claramente o resultado da operação e orienta a próxima decisão do operador.


