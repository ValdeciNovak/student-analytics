# 📊 Documentação do Dashboard de Risco Estudantil

> Este documento descreve como os dados do JSON são estruturados, o que cada campo significa e como interpretá-los no dashboard.

---

## Estrutura geral do JSON

```json
{
  "estatisticas_gerais": { ... },
  "lista_alunos": [ ... ]
}
```

---

## 1. `estatisticas_gerais`

Visão macro da instituição. Alimenta o **Dashboard 1 — Saúde Universitária**.

```json
"estatisticas_gerais": {
  "total_alunos": 6378,
  "media_risco_geral": 27.15,
  "contagem_por_risco": { ... },
  "contagem_por_risco_academico": { ... },
  "contagem_por_risco_evasao": { ... },
  "quadrantes": { ... }
}
```

---

## 2. `contagem_por_risco` — Índice Geral

> Índice combinado que mistura fatores acadêmicos e de evasão em um único score.  
> Serve como **termômetro geral** da instituição — comparação entre semestres e cursos.

```json
"contagem_por_risco": {
  "Baixo":  1582,
  "Médio":  4617,
  "Alto":    179
}
```

### Como é calculado

Soma de 11 fatores de risco com pesos diferentes. Máximo teórico = **14 pontos = 100%**.

| Fator | Escala | O que penaliza |
|---|---|---|
| Frequência | 0 a 2 | Presença baixa nas aulas |
| Apoio familiar | 0 a 2 | Baixo envolvimento dos pais |
| Acesso a recursos | 0 a 2 | Falta de materiais e ferramentas |
| Motivação | 0 a 2 | Motivação baixa |
| Distância de casa | 0 a 2 | Mora longe da instituição |
| Qualidade do professor | 0 a 1 | Professor com qualidade baixa |
| Sem reforço + nota ruim | 0 a 1 | Zero sessões de reforço E nota < 65 |
| Dificuldade de aprendizado | 0 a 1 | Dificuldade declarada |
| Tendência da nota | -1 a +1 | Nota < 60 = risco / melhora ≥ 15% = bônus |
| Atividades extras | -1 a 0 | Bônus para quem participa |
| Horas de estudo | -1 a 0 | Bônus para quem estuda ≥ 30h |

### Faixas de classificação

| Nível | Score | Interpretação |
|---|---|---|
| 🟢 Baixo | 0% a 20% | Aluno sem fatores relevantes de risco |
| 🟡 Médio | 21% a 50% | Aluno com atenção moderada |
| 🔴 Alto | 51% a 100% | Aluno com múltiplos fatores de risco simultâneos |

---

## 3. `contagem_por_risco_academico` — Índice Acadêmico

> Mede se o aluno está com **dificuldade de aprender**.  
> Alimenta o **Dashboard 1** e o perfil individual do aluno.

```json
"contagem_por_risco_academico": {
  "Baixo": 4609,
  "Médio": 1694,
  "Alto":    75
}
```

### Como é calculado

Soma de 5 fatores. Máximo = **6 pontos = 100%**.

| Fator | Escala | O que representa |
|---|---|---|
| Frequência | 0 a 2 | Presença nas aulas |
| Sem reforço + nota ruim | 0 a 1 | Zero sessões de reforço E nota < 65 |
| Dificuldade de aprendizado | 0 a 1 | Dificuldade declarada no cadastro |
| Tendência da nota | -1 a +1 | Nota < 60 = risco / melhora ≥ 15% = bônus |
| Horas de estudo | -1 a 0 | Bônus para quem estuda ≥ 30h |

### O que cada nível significa na prática

**🟢 Baixo — 4.609 alunos (72.3%) | nota média 68.4**
- Frequência moderada, sem problemas graves
- Dificuldade e ausência de reforço praticamente zeradas
- ✅ Sem problema acadêmico identificado

**🟡 Médio — 1.694 alunos (26.6%) | nota média 64.3**
- Frequência é o fator dominante (média +1.81 de 2.0 possíveis)
- Os demais fatores ainda são baixos
- ⚠️ O problema aqui é quase exclusivamente presença nas aulas

**🔴 Alto — 75 alunos (1.2%) | nota média 60.1**
- Frequência no teto (+1.99), sem reforço e com dificuldade (+0.87)
- Dificuldade de aprendizado declarada (+0.71)
- Nota já em zona crítica (+0.56)
- 🚨 Todos os fatores pioraram juntos — colapso acadêmico completo
- **Ação indicada: tutoria, reforço, suporte pedagógico urgente**

---

## 4. `contagem_por_risco_evasao` — Índice de Evasão

> Mede se o aluno tem **risco de abandonar o curso**.  
> Este é o índice mais estratégico — identifica alunos em risco invisível para o sistema tradicional de notas.

```json
"contagem_por_risco_evasao": {
  "Baixo": 1187,
  "Médio": 3200,
  "Alto":  1991
}
```

### Como é calculado

Soma de 5 fatores. Máximo = **7 pontos = 100%**.

| Fator | Escala | O que representa |
|---|---|---|
| Motivação | 0 a 2 | Nível de motivação do aluno |
| Apoio familiar | 0 a 2 | Envolvimento dos pais no estudo |
| Distância de casa | 0 a 2 | Distância física até a instituição |
| Acesso a recursos | 0 a 2 | Acesso a materiais e ferramentas |
| Atividades extras | -1 a 0 | Bônus para quem participa de atividades |

### O que cada nível significa na prática

**🟢 Baixo — 1.187 alunos (18.6%) | nota média 68.9**
- Motivação e apoio familiar com pouco risco
- Alto engajamento em atividades extras (bônus médio de -0.82)
- ✅ Vínculo sólido com a instituição — baixo risco de abandono

**🟡 Médio — 3.200 alunos (50.2%) | nota média 67.3**
- Motivação (+1.05), apoio familiar (+0.87) e acesso a recursos (+0.85) já aparecem juntos
- Bônus de atividades extras ainda presente (-0.63), mas menor que no grupo Baixo
- ⚠️ Os três pilares principais estão enfraquecendo — grupo de atenção preventiva

**🔴 Alto — 1.991 alunos (31.2%) | nota média 66.1**
- Motivação (+1.48), apoio familiar (+1.27) e acesso a recursos (+1.28) todos elevados
- Distância de casa relevante (+0.89)
- Bônus de atividades extras caiu pela metade (-0.41 vs -0.82 do grupo Baixo)
- 📌 **Nota ainda em 66.1 — o sistema de notas tradicional não os vê como problema**
- 🚨 São alunos se desconectando silenciosamente da instituição
- **Ação indicada: mentoria, acolhimento, criação de vínculo**

---

## 5. `quadrantes` — Dashboard de Ação

> Cruza o Índice Acadêmico com o Índice de Evasão.  
> Alimenta o **Dashboard 2 — Central de Ação**, indicando exatamente o que fazer com cada grupo.

```json
"quadrantes": {
  "saudavel":              897,
  "dificuldade_academica":   9,
  "risco_evasao":         1420,
  "intervencao_urgente":    36
}
```

### Os 4 quadrantes

```
                    EVASÃO BAIXO          EVASÃO ALTO
                 ┌─────────────────┬──────────────────────┐
ACADÊMICO BAIXO  │  🟢 Saudável    │  🟠 Risco de Evasão  │
                 │    897 alunos   │    1.420 alunos       │
                 ├─────────────────┼──────────────────────┤
ACADÊMICO ALTO   │  🟡 Dificuldade │  🔴 Urgente          │
                 │    9 alunos     │    36 alunos          │
                 └─────────────────┴──────────────────────┘
```

---

### 🟢 Saudável — 897 alunos (14.1%)
**Acadêmico Baixo + Evasão Baixo | nota média 69.9**

- Sem dificuldade acadêmica e sem risco de abandono
- Alto engajamento em atividades extras (maior protetor observado)
- ✅ **Ação: monitoramento leve, nenhuma intervenção necessária**

---

### 🟡 Dificuldade Acadêmica — 9 alunos (0.1%)
**Acadêmico Alto + Evasão Baixo | nota média 61.6**

- Frequência no teto máximo de risco (+2.00)
- Sem reforço e com dificuldade de aprendizado declarada (+0.89)
- Mas motivação está ok — **quer ficar, só está com dificuldade**
- ✅ **Ação: tutoria, reforço, suporte pedagógico**

---

### 🟠 Risco de Evasão — 1.420 alunos (22.3%)
**Acadêmico Baixo + Evasão Alto | nota média 67.4**

- Academicamente estão bem — frequência, nota e reforço sem problema
- O perigo está todo no desengajamento:
  - Motivação baixa (+1.47)
  - Sem apoio familiar (+1.26)
  - Sem acesso a recursos (+1.28)
  - Mora longe (+0.90)
- 📌 **Invisíveis para o sistema tradicional de notas**
- 🚨 **Ação: mentoria, acolhimento, criar vínculo com a instituição**

---

### 🔴 Intervenção Urgente — 36 alunos (0.6%)
**Acadêmico Alto + Evasão Alto | nota média 59.2**

- Colapso nos dois índices simultaneamente
- Frequência crítica (+1.97), motivação baixa (+1.44), sem apoio familiar (+1.42), mora longe (+1.14)
- Nota já abaixo de 60
- 🚨 **Ação: contato imediato, assistência estudantil, intervenção direta**

---

## Resumo visual para o dashboard

| Card | Dado | Fonte no JSON |
|---|---|---|
| Total de alunos | `total_alunos` | `estatisticas_gerais` |
| Risco Geral | `contagem_por_risco` | `estatisticas_gerais` |
| Risco Acadêmico | `contagem_por_risco_academico` | `estatisticas_gerais` |
| Risco de Evasão | `contagem_por_risco_evasao` | `estatisticas_gerais` |
| Quadrantes de ação | `quadrantes` | `estatisticas_gerais` |
| Perfil individual | todos os scores | `lista_alunos[i]` |

---

> **Nota:** O número mais estratégico do dashboard é o `risco_evasao: 1.420` nos quadrantes.  
> São alunos com nota aceitável mas em processo silencioso de desconexão —  
> o único sistema capaz de identificá-los antes do abandono é este índice.