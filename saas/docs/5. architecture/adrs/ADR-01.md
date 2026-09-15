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