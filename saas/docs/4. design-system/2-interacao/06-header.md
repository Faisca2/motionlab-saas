# MotionLab SaaS

# Design System

# 06. Header

Versão: 0.1.0

---

# Essência

> **Todo header deve comunicar claramente o contexto da interface.**
>
> **O header orienta o usuário, identifica onde ele está e facilita a navegação pela aplicação.**

---

# Objetivo

Definir os princípios e diretrizes para utilização dos headers no MotionLab, garantindo consistência visual, identificação clara do contexto e uma navegação previsível.

O header deve apresentar as informações essenciais da tela sem competir com o conteúdo principal.

---

# Contexto

O header representa o ponto de orientação da interface.

É por meio dele que o usuário identifica rapidamente a página atual, compreende seu contexto e acessa as principais ações relacionadas ao conteúdo apresentado.

No MotionLab, o header deve permanecer consistente em toda a aplicação, fortalecendo a identidade visual e reduzindo a carga cognitiva durante a navegação.

---

# Princípios

Os headers do MotionLab devem ser:

- Consistentes;
- Objetivos;
- Organizados;
- Funcionais;
- Discretos;
- Acessíveis.

Todo header deve facilitar a navegação sem desviar a atenção do conteúdo principal.

---

# Filosofia

O header representa o contexto da interface.

Antes de interagir com qualquer elemento da tela, o usuário deve compreender onde está, qual é o objetivo daquela página e quais ações principais estão disponíveis.

Um bom header reduz dúvidas, melhora a orientação e transmite segurança durante a navegação.

---

# Estrutura

O sistema de headers define padrões para:

- Título da página;
- Subtítulo (quando necessário);
- Botão de retorno;
- Ações da página;
- Perfil do usuário;
- Notificações;
- Pesquisa (quando aplicável);
- Breadcrumb (quando aplicável).

Todos os elementos devem possuir posicionamento consistente em toda a aplicação.

---

# Regras

Os headers do MotionLab devem seguir as seguintes regras:

- Toda página deve possuir um título claro.
- O título deve representar o conteúdo da página.
- As ações devem estar relacionadas ao contexto da tela.
- O botão de retorno deve seguir um comportamento consistente.
- Não utilizar informações desnecessárias.
- Evitar múltiplos níveis de informação no header.

---

# Boas Práticas

Para manter a consistência do Design System, recomenda-se:

- Utilizar títulos curtos e objetivos.
- Destacar apenas as ações mais importantes.
- Manter o alinhamento consistente entre todas as telas.
- Utilizar ícones somente quando agregarem significado.
- Preservar espaçamentos padronizados.
- Garantir boa legibilidade em dispositivos móveis.

---

# O que evitar

Evite:

- Headers excessivamente altos.
- Muitos botões de ação.
- Títulos longos ou pouco objetivos.
- Informações duplicadas entre o header e o conteúdo.
- Alterar a posição dos elementos entre telas semelhantes.
- Utilizar o header como área de conteúdo.

---

# Implementação (FlutterFlow)

No FlutterFlow, os headers devem ser implementados utilizando componentes reutilizáveis.

Sempre que possível:

- Criar um componente único para o Header padrão.
- Centralizar estilos no Theme.
- Utilizar Design Tokens para cores, tipografia e espaçamentos.
- Configurar ações dinamicamente conforme o contexto da página.
- Evitar personalizações específicas para cada tela.

---

# Design Tokens

Os valores oficiais referentes aos headers são definidos pelos Design Tokens correspondentes.

Os principais tokens utilizados incluem:

- Cores;
- Tipografia;
- Espaçamentos;
- Altura do Header;
- Ícones;
- Estados dos botões;
- Bordas (quando aplicável).

Este documento descreve os princípios de utilização dos headers.

Os valores oficiais permanecem centralizados nos arquivos de Design Tokens, garantindo uma única fonte de verdade para todas as aplicações do MotionLab.

---

# Critérios de Aceitação

Um componente está aderente ao Design System quando:

- Atende ao objetivo definido neste documento.
- Respeita os princípios estabelecidos.
- Segue as regras de utilização.
- Não apresenta nenhuma das situações descritas em "O que evitar".
- Está implementado conforme as diretrizes do FlutterFlow.
- Utiliza exclusivamente os Design Tokens oficiais.