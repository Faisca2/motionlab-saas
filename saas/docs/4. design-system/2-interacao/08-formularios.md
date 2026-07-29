# MotionLab SaaS

# Design System

# 08. Formulários

Versão: 0.1.0

---

# Essência

> **Todo formulário deve facilitar a comunicação entre o usuário e o sistema.**
>
> **Os formulários comunicam entrada de dados, reduzem erros e conduzem o usuário à conclusão de uma tarefa com clareza e segurança.**

---

# Objetivo

Definir os princípios e diretrizes para a construção de formulários no MotionLab, garantindo consistência visual, facilidade de preenchimento, validação eficiente e uma experiência intuitiva para o usuário.

Os formulários devem minimizar o esforço cognitivo e orientar o usuário durante todo o processo de entrada de dados.

---

# Contexto

Os formulários representam o principal canal de comunicação entre o usuário e a aplicação.

É por meio deles que informações são cadastradas, alteradas, pesquisadas ou confirmadas.

No MotionLab, todo formulário deve orientar o usuário de maneira clara, prevenir erros sempre que possível e fornecer feedback imediato durante a interação.

---

# Princípios

Os formulários do MotionLab devem ser:

- Simples;
- Objetivos;
- Consistentes;
- Intuitivos;
- Acessíveis;
- Tolerantes a erros.

Cada campo deve existir apenas quando possuir uma finalidade clara para o processo.

---

# Filosofia

Um bom formulário conduz o usuário.

Ele não apenas solicita informações, mas explica o que é esperado, valida os dados de maneira clara e informa o resultado da interação.

O usuário nunca deve sentir dúvidas sobre:

- O que informar.
- Como informar.
- O que é obrigatório.
- O que aconteceu após enviar os dados.

Quanto menor a incerteza durante o preenchimento, maior será a qualidade da experiência.

---

# Estrutura

Os formulários do MotionLab podem ser compostos por:

- Título;
- Descrição;
- Grupos de campos;
- Campos de entrada;
- Máscaras;
- Seletores;
- Checkboxes;
- Radio Buttons;
- Switches;
- Upload de arquivos;
- Mensagens de validação;
- Botões de ação;
- Mensagens de sucesso ou erro.

Todos os elementos devem seguir uma organização lógica e previsível.

---

# Regras

Os formulários devem seguir as seguintes regras:

- Cada campo deve possuir um rótulo claro.
- Campos obrigatórios devem ser identificados.
- As validações devem ocorrer o mais cedo possível.
- As mensagens de erro devem explicar como corrigir o problema.
- Os botões devem representar claramente sua ação.
- Os campos devem seguir uma ordem lógica de preenchimento.
- Evitar solicitar informações desnecessárias.

---

# Boas Práticas

Para manter uma boa experiência recomenda-se:

- Agrupar campos relacionados.
- Utilizar máscaras quando apropriado.
- Utilizar preenchimento automático quando possível.
- Exibir exemplos de preenchimento.
- Informar limites de caracteres quando relevantes.
- Validar dados em tempo real sempre que possível.
- Preservar informações já preenchidas em caso de erro.
- Priorizar poucos campos por tela quando possível.

---

# O que evitar

Evite:

- Formulários excessivamente longos.
- Campos sem identificação.
- Mensagens de erro genéricas.
- Solicitar informações já conhecidas pelo sistema.
- Validar apenas após o envio do formulário.
- Exigir formatos difíceis de compreender.
- Alterar o comportamento dos campos entre telas semelhantes.

---

# Implementação (FlutterFlow)

No FlutterFlow, os formulários devem ser implementados utilizando componentes reutilizáveis e validações padronizadas.

Sempre que possível:

- Utilizar Form Widget.
- Centralizar validações.
- Utilizar componentes reutilizáveis para campos comuns.
- Configurar máscaras padronizadas.
- Utilizar estados visuais para foco, erro e sucesso.
- Evitar lógica distribuída entre múltiplos widgets.

---

# Design Tokens

Os formulários utilizam os Design Tokens oficiais referentes a:

- Cores;
- Tipografia;
- Espaçamentos;
- Bordas;
- Ícones;
- Estados;
- Botões;
- Campos de entrada.

Este documento descreve os princípios de utilização dos formulários.

Os valores oficiais permanecem centralizados nos arquivos de Design Tokens.

---

# Critérios de Aceitação

Um formulário está aderente ao Design System quando:

- Atende ao objetivo definido neste documento.
- Respeita os princípios estabelecidos.
- Segue as regras de utilização.
- Não apresenta nenhuma das situações descritas em "O que evitar".
- Está implementado conforme as diretrizes do FlutterFlow.
- Utiliza exclusivamente os Design Tokens oficiais.
- Mantém consistência visual com os demais componentes do MotionLab.
- Contribui para uma experiência previsível, intuitiva e segura ao usuário.