# MotionLab SaaS

# Jornadas do Usuário

Versão: 0.1.0

---

# Objetivo

Definir como cada tipo de usuário utiliza o MotionLab para alcançar seus objetivos.

As jornadas descrevem a experiência do usuário e orientam a construção das funcionalidades, módulos e interfaces do sistema.

---

# Conceitos

## Persona

Representa um tipo de usuário do sistema.

Cada persona possui objetivos, responsabilidades e necessidades específicas.

## Jornada

Representa a sequência de interações realizadas por uma persona para atingir um objetivo.

Uma jornada pode envolver diversas páginas, módulos e processos do sistema.

---

# Personas

## MASTER

Responsável pela administração da rede.

Objetivos:

- Implantar a rede.
- Administrar filiais.
- Acompanhar indicadores.
- Gerenciar usuários.

---

## GESTOR

Responsável pela operação de uma filial.

Objetivos:

- Administrar equipe.
- Acompanhar agenda.
- Gerenciar atendimento.

---

## COLABORADOR

Responsável pela execução dos serviços.

Objetivos:

- Consultar agenda.
- Executar atendimentos.
- Registrar informações.

---

## CLIENTE

Consumidor dos serviços.

Objetivos:

- Agendar serviços.
- Consultar histórico.
- Avaliar atendimento.

---

# Jornadas Transversais

Estas jornadas são comuns a todos os usuários.

## JT-01 Autenticação

Login

Logout

Recuperação de senha

---

## JT-02 Primeiro Acesso

Cadastro

Configuração inicial

Validação dos vínculos

Direcionamento para a Home correspondente.

---

## JT-03 Home

Apresenta o contexto inicial conforme a persona.

Cada tipo de usuário possui uma Home adaptada às suas necessidades.

---

## JT-04 Perfil

Visualização dos dados.

Alteração dos dados permitidos.

Troca de senha.

---

# Jornadas Específicas

## MASTER

### Implantação da Rede

Criar conta

↓

Criar Rede

↓

Cadastrar primeira filial

↓

Concluir implantação

---

### Gestão da Rede

Consultar Dashboard

↓

Administrar Filiais

↓

Administrar Usuários

↓

Acompanhar Indicadores

---

## GESTOR

### Operação da Filial

Consultar Dashboard

↓

Gerenciar Agenda

↓

Gerenciar Equipe

↓

Acompanhar Resultados

---

## COLABORADOR

### Atendimento

Consultar Agenda

↓

Realizar Atendimento

↓

Registrar Informações

↓

Finalizar Atendimento

---

## CLIENTE

### Agendamento

Selecionar Unidade

↓

Escolher Serviço

↓

Escolher Profissional

↓

Confirmar Agendamento

---

# Relação entre Personas, Jornadas e Módulos

| Persona | Jornada | Módulos |
|----------|----------|----------|
| MASTER | Implantação | Usuários, Redes, Filiais |
| MASTER | Gestão | Dashboard, Filiais, Usuários |
| GESTOR | Operação | Agenda, Colaboradores |
| COLABORADOR | Atendimento | Agenda, Clientes |
| CLIENTE | Agendamento | Agenda, Serviços |

---

# Princípio

Toda funcionalidade do MotionLab deve estar associada a uma jornada de uma persona.

Nenhum módulo deve existir sem atender claramente ao objetivo de um tipo de usuário.

A experiência do usuário deve orientar a evolução do produto.