# Análise Estudantil - Dashboard de Risco Acadêmico e Evasão

> Sistema de identificação precoce de risco estudantil construído sobre dados de 6.378 alunos.  
> O dashboard separa dois tipos de risco que sistemas tradicionais confundem: **dificuldade acadêmica** e **risco de evasão**.

---

## Sumário

1. [O problema que a análise resolve](#1-o-problema-que-a-análise-resolve)
2. [Fonte dos dados](#2-fonte-dos-dados)
3. [Arquitetura da análise](#3-arquitetura-da-análise)
4. [Índice Geral de Risco](#4-índice-geral-de-risco)
5. [Índice Acadêmico](#5-índice-acadêmico)
6. [Índice de Evasão](#6-índice-de-evasão)
7. [Quadrantes de Ação](#7-quadrantes-de-ação)
8. [Fatores de Risco e Proteção](#8-fatores-de-risco-e-proteção)
9. [Perfil Individual do Aluno](#9-perfil-individual-do-aluno)
10. [Stack técnica](#10-stack-técnica)

---

## 1. O problema que a análise resolve

Sistemas acadêmicos tradicionais monitoram apenas **nota e frequência**. Esse modelo tem um ponto cego crítico: um aluno pode ter nota 7, frequência de 85% e estar prestes a abandonar o curso.

Os fatores que levam à evasão - motivação baixa, falta de apoio familiar, distância de casa, isolamento - são **comportamentais e contextuais**. Não aparecem no boletim. Não disparam alertas no sistema.

Esta análise constrói dois índices separados para capturar os dois tipos de risco:

| Índice | O que mede | Por que importa |
|---|---|---|
| **Acadêmico** | Dificuldade de aprender | Identifica quem precisa de reforço e tutoria |
| **Evasão** | Risco de abandonar o curso | Identifica quem está se desconectando silenciosamente |

---

## 2. Fonte dos dados

**Dataset:** `StudentPerformanceFactors.csv`  
**Volume:** 6.378 registros após remoção de nulos  
**Origem:** Dados sintéticos de desempenho estudantil com 20 variáveis

### Variáveis utilizadas

| Variável original | Nome interno | Tipo |
|---|---|---|
| `Hours_Studied` | `Horas_Estudo` | Numérica |
| `Parental_Involvement` | `Envolvimento_Pais` | Categórica (Low/Medium/High) |
| `Access_to_Resources` | `Acesso_Recursos` | Categórica |
| `Motivation_Level` | `Nivel_Motivacao` | Categórica |
| `Attendance` | `Frequencia` | Numérica (%) |
| `Teacher_Quality` | `Qualidade_Professor` | Categórica |
| `Distance_from_Home` | `Distancia_Casa` | Categórica (Near/Moderate/Far) |
| `Learning_Disabilities` | `Dificuldades_Aprendizado` | Booleana (Yes/No) |
| `Tutoring_Sessions` | `Sessoes_Reforco` | Numérica |
| `Extracurricular_Activities` | `Atividades_Extra` | Booleana |
| `Previous_Scores` | `Notas_Anteriores` | Numérica |
| `Exam_Score` | `Nota_Exame` | Numérica |

---

## 3. Arquitetura da análise

A análise é feita em Python (`main.py`) e gera um JSON estático servido por uma API FastAPI. O frontend Next.js consome essa API e renderiza dois dashboards.

```
StudentPerformanceFactors.csv
        │
        ▼
    main.py (Python/Pandas)
        │  ├── Mapeamento de pesos
        │  ├── Cálculo dos índices
        │  ├── Diagnóstico automatizado
        │  └── Geração do JSON
        │
        ▼
dashboard_estudantes.json
        │
        ▼
    server.py (FastAPI)
        │
        ▼
    Next.js (Vercel)
        ├── Dashboard 1 - Saúde Universitária
        └── Dashboard 2 - Ação Universitária
```

---

## 4. Índice Geral de Risco

**Onde aparece:** Dashboard 1 - Saúde Universitária (cards superiores)

O índice geral é um termômetro consolidado da instituição. Soma 11 fatores com pesos diferentes, com máximo teórico de **14 pontos = 100%**.

### Fatores e pesos

| Fator | Escala | O que penaliza |
|---|---|---|
| Motivação | 0 a 2 | Motivação baixa |
| Apoio familiar | 0 a 2 | Baixo envolvimento dos pais |
| Acesso a recursos | 0 a 2 | Falta de materiais e ferramentas |
| Frequência | 0 a 2 | Presença baixa nas aulas |
| Distância de casa | 0 a 2 | Mora longe da instituição |
| Qualidade do professor | 0 a 1 | Professor com qualidade baixa |
| Sem reforço + nota ruim | 0 a 1 | Zero sessões de reforço E nota < 65 |
| Dificuldade de aprendizado | 0 a 1 | Dificuldade declarada |
| Tendência da nota | -1 a +1 | Nota < 60 = risco / melhora ≥ 15% = bônus |
| Atividades extras | -1 a 0 | Bônus para quem participa |
| Horas de estudo | -1 a 0 | Bônus para quem estuda ≥ 30h semanais |

### Faixas de classificação

| Nível | Score | Alunos | % |
|---|---|---|---|
| 🟢 Baixo | 0% a 20% | 1.582 | 24,8% |
| 🟡 Médio | 21% a 50% | 4.617 | 72,4% |
| 🔴 Alto | 51% a 100% | 179 | 2,8% |

### Por que separar risco e proteção visualmente

O dashboard mostra dois gráficos de barras separados: **Fatores de Risco** (vermelho) e **Fatores de Proteção** (verde). Isso é intencional misturar fatores positivos e negativos no mesmo gráfico tornaria a leitura ambígua para gestores.

**Fatores de risco** (soma bruta de pontos negativos acumulados pela instituição):

| Fator | Total de pontos |
|---|---|
| Motivação | 6.965 |
| Apoio Familiar | 5.833 |
| Acesso Recursos | 5.752 |
| Frequência | 5.748 |
| Distância | 3.213 |
| Dificuldade | 668 |
| Professor | 647 |
| Sem Reforço | 433 |

**Fatores de proteção** (bônus acumulados que blindam contra o risco):

| Fator | Total de bônus |
|---|---|
| Ativ. Extras | 3.807 |
| Tendência Nota | 897 |
| Horas Estudo | 363 |

---

## 5. Índice Acadêmico

**Onde aparece:** Dashboard 2 - Ação Universitária (donut esquerdo + tabela)

Mede se o aluno está com **dificuldade de aprender**. Foca nos sinais que aparecem no boletim e na chamada.

### Composição

Soma de 5 fatores. Máximo = **6 pontos = 100%**.

| Fator | Escala |
|---|---|
| Frequência | 0 a 2 |
| Sem reforço + nota ruim | 0 a 1 |
| Dificuldade de aprendizado | 0 a 1 |
| Tendência da nota | -1 a +1 |
| Horas de estudo | -1 a 0 |

### Resultados

| Nível | Alunos | % | Interpretação |
|---|---|---|---|
| 🟢 Baixo | 4.609 | 72,3% | Sem problema acadêmico identificado |
| 🟡 Médio | 1.694 | 26,6% | Problema quase exclusivamente de frequência |
| 🔴 Alto | 75 | 1,2% | Colapso acadêmico - todos os fatores pioraram juntos |

### O que cada nível significa na prática

**🟢 Baixo - 4.609 alunos**  
Frequência moderada, sem problemas graves. Dificuldade e ausência de reforço praticamente zeradas.  
✅ Sem intervenção necessária.

**🟡 Médio - 1.694 alunos**  
Frequência é o fator dominante. Os demais fatores ainda são baixos.  
⚠️ O problema aqui é quase exclusivamente presença nas aulas.

**🔴 Alto - 75 alunos**  
Frequência no teto, sem reforço, com dificuldade declarada, nota já em zona crítica.  
🚨 Ação indicada: tutoria, reforço, suporte pedagógico urgente.

---

## 6. Índice de Evasão

**Onde aparece:** Dashboard 2 - Ação Universitária (donut direito + tabela)

Mede se o aluno tem **risco de abandonar o curso**. Este é o índice mais estratégico - identifica alunos em risco invisível para o sistema tradicional de notas.

### Composição

Soma de 5 fatores. Máximo = **7 pontos = 100%**.

| Fator | Escala |
|---|---|
| Motivação | 0 a 2 |
| Apoio familiar | 0 a 2 |
| Distância de casa | 0 a 2 |
| Acesso a recursos | 0 a 2 |
| Atividades extras | -1 a 0 |

### Resultados

| Nível | Alunos | % | Interpretação |
|---|---|---|---|
| 🟢 Baixo | 1.187 | 18,6% | Vínculo sólido com a instituição |
| 🟡 Médio | 3.200 | 50,2% | Os três pilares principais enfraquecendo |
| 🔴 Alto | 1.991 | 31,2% | Desconexão silenciosa em curso |

### O insight mais importante desta análise

O grupo **Evasão Alto** tem nota média de **66,1** - perfeitamente aceitável para qualquer sistema baseado em boletim. Esses 1.991 alunos **não disparam nenhum alerta** no modelo tradicional.

São alunos se desconectando silenciosamente da instituição. Sem motivação, sem apoio familiar, com dificuldade de acesso e morando longe - mas com nota acima da média de reprovação.

🚨 Ação indicada: mentoria, acolhimento, criação de vínculo com a instituição.

---

## 7. Quadrantes de Ação

**Onde aparece:** Dashboard 2 - lógica da tabela e do drawer individual

Cruza o Índice Acadêmico com o Índice de Evasão para gerar uma recomendação de ação clara para cada aluno.

```
                    EVASÃO BAIXO            EVASÃO ALTO
                 ┌───────────────────┬────────────────────────┐
ACADÊMICO BAIXO  │  🟢 Saudável      │  🟠 Risco de Evasão    │
                 │  897 alunos       │  1.420 alunos          │
                 │  14,1%            │  22,3%                 │
                 ├───────────────────┼────────────────────────┤
ACADÊMICO ALTO   │  🟡 Dif. Acadêm.  │  🔴 Intervenção Urgente│
                 │  9 alunos         │  36 alunos             │
                 │  0,1%             │  0,6%                  │
                 └───────────────────┴────────────────────────┘
```

### 🟢 Saudável - 897 alunos (14,1%)
- Sem dificuldade acadêmica e sem risco de abandono
- Nota média: 69,9
- **Ação:** monitoramento leve, nenhuma intervenção necessária

### 🟡 Dificuldade Acadêmica - 9 alunos (0,1%)
- Frequência no teto máximo de risco, sem reforço, com dificuldade declarada
- Motivação ok - **quer ficar, só está com dificuldade**
- Nota média: 61,6
- **Ação:** tutoria, reforço, suporte pedagógico

### 🟠 Risco de Evasão - 1.420 alunos (22,3%)
- Academicamente estão bem - frequência, nota e reforço sem problema
- Motivação baixa, sem apoio familiar, sem acesso a recursos, mora longe
- Nota média: 67,4 - **invisíveis para o sistema de notas**
- **Ação:** mentoria, acolhimento, criar vínculo com a instituição

### 🔴 Intervenção Urgente - 36 alunos (0,6%)
- Colapso nos dois índices simultaneamente
- Frequência crítica, motivação baixa, sem apoio familiar, mora longe
- Nota média: 59,2
- **Ação:** contato imediato, assistência estudantil, intervenção direta

---

## 8. Fatores de Risco e Proteção

**Onde aparece:** Dashboard 1 - Saúde Universitária (gráfico de distribuição)

O gráfico de distribuição interativo mostra como os alunos estão distribuídos em cada nível de cada fator. É possível selecionar qualquer fator pelo dropdown para visualizar sua distribuição com cores semânticas.

### Sistema de cores

| Cor | Significado |
|---|---|
| 🟢 Verde `#10b981` | Bom / proteção / baixo risco |
| 🟠 Laranja `#f97316` | Atenção / nível médio |
| 🔴 Vermelho `#f43f5e` | Risco alto / crítico |

As cores são aplicadas **por fator + nível**, não apenas pelo nível. Isso resolve ambiguidades como: "Alto" em Acesso a Recursos é positivo (verde), mas "Alto" em Dificuldade de Aprendizado é negativo (vermelho).

---

## 9. Perfil Individual do Aluno

**Onde aparece:** Dashboard 2 - drawer lateral ao clicar em "Ver aluno" na tabela

Cada aluno tem um perfil completo com:

### Gráfico de barras horizontal - Perfil de Risco
Mostra 7 fatores individuais com barras coloridas por nível de risco. Ordenado do maior para o menor risco, facilitando a leitura imediata dos pontos críticos.

### Três cards de score
- **Geral:** score consolidado + classificação (Baixo/Médio/Alto)
- **Acadêmico:** score do índice acadêmico
- **Evasão:** score do índice de evasão

### Ação recomendada
Gerada automaticamente pelo cruzamento dos dois índices - 4 categorias possíveis:

| Situação | Ação |
|---|---|
| Acadêmico Alto + Evasão Alto (ou Médio) | 🔴 Intervenção Urgente |
| Acadêmico Baixo + Evasão Alto | 🟠 Risco de Evasão |
| Acadêmico Alto + Evasão Baixo | 🟡 Dificuldade Acadêmica |
| Qualquer Médio isolado | 🟡 Atenção |
| Todos Baixo | 🟢 Saudável |

### Diagnóstico textual automático
Gerado pelo `gerar_diagnostico()` em Python. Separa alertas em **crítico** (nível 2) e **atenção** (nível 1), e menciona fatores positivos como destaques. Exemplo:

> *"Risco Geral 35.71% | Acadêmico 16.67% | Evasão 57.14%. Acadêmico atenção: frequência abaixo do ideal. Evasão crítico: motivação baixa, sem apoio familiar. Evasão atenção: sem atividades extras."*

### Fatores de Evasão
Lista dos 5 fatores do índice de evasão com valor individual. Itens em risco alto são destacados com borda vermelha.

### Dados Acadêmicos
Frequência e nota do exame lado a lado.

---

## 10. Stack técnica

| Camada | Tecnologia |
|---|---|
| Processamento de dados | Python 3 + Pandas |
| API | FastAPI + Uvicorn |
| Hospedagem do backend | Render (free tier) |
| Frontend | Next.js 16 + TypeScript |
| UI Components | shadcn/ui + Tailwind CSS |
| Gráficos | Recharts |
| Hospedagem do frontend | Vercel |

### Fluxo de dados

```
main.py → dashboard_estudantes.json → server.py (FastAPI) → Next.js
```

O JSON é gerado localmente e commitado no repositório. A API serve o arquivo estático. Para atualizar os dados basta rodar `main.py` e fazer um novo deploy.

---

## Conclusão

O número mais estratégico deste dashboard é **1.420 alunos no quadrante Risco de Evasão**.

São alunos com nota aceitável, frequência razoável e processo silencioso de desconexão em curso. O sistema tradicional de boletins não os vê. Este índice sim.

A separação entre índice acadêmico e índice de evasão não é apenas metodológica ela muda o tipo de intervenção. Tutoria resolve dificuldade acadêmica. Mentoria e acolhimento resolvem evasão. Confundir os dois leva a intervenções erradas no grupo errado.