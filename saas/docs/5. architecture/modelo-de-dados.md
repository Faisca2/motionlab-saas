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