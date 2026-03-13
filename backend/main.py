import pandas as pd
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

df = pd.read_csv(os.path.join(BASE_DIR, "data", "StudentPerformanceFactors.csv")).dropna().copy()


df = df.rename(columns={
    'Hours_Studied': 'Horas_Estudo',
    'Parental_Involvement': 'Envolvimento_Pais',
    'Access_to_Resources': 'Acesso_Recursos',
    'Motivation_Level': 'Nivel_Motivacao',
    'Attendance': 'Frequencia',
    'Teacher_Quality': 'Qualidade_Professor',
    'Distance_from_Home': 'Distancia_Casa',
    'Learning_Disabilities': 'Dificuldades_Aprendizado',
    'Tutoring_Sessions': 'Sessoes_Reforco',
    'Extracurricular_Activities': 'Atividades_Extra',
    'Previous_Scores': 'Notas_Anteriores',
    'Exam_Score': 'Nota_Exame'
})

df['ID_Aluno'] = range(1, len(df) + 1)

# --- 2. MAPEAMENTOS DE RISCO (PESOS) ---
mapa_inv = {'Low': 2, 'Medium': 1, 'High': 0}


mapa_professor = {'Low': 1, 'Medium': 0, 'High': 0}

df['Risco_Familiar'] = df['Envolvimento_Pais'].map(mapa_inv)
df['Risco_Recursos'] = df['Acesso_Recursos'].map(mapa_inv)
df['Risco_Motivacao'] = df['Nivel_Motivacao'].map(mapa_inv)
df['Risco_Professor'] = df['Qualidade_Professor'].map(mapa_professor)
df['Risco_Distancia'] = df['Distancia_Casa'].map({'Near': 0, 'Moderate': 1, 'Far': 2})
df['Risco_Dificuldade'] = df['Dificuldades_Aprendizado'].map({'Yes': 1, 'No': 0})
df['Risco_Reforco'] = df.apply(
    lambda x: 1 if (x['Sessoes_Reforco'] == 0 and x['Nota_Exame'] < 65) else 0,
    axis=1
)
df['Bonus_Extra'] = df['Atividades_Extra'].map({'Yes': -1, 'No': 0})

# --- BÔNUS POR HORAS DE ESTUDO ---
def calcular_bonus_estudo(horas):
    if horas >= 30: return -1
    return 0

df['Bonus_Estudo'] = df['Horas_Estudo'].apply(calcular_bonus_estudo)

# Risco de Frequência
df['Risco_Frequencia'] = pd.cut(df['Frequencia'], bins=[0, 70, 85, 100], labels=[2, 1, 0], include_lowest=True).astype(int)

# --- 3. LÓGICA DE MOMENTUM ---
def calcular_risco_tendencia(linha):
    atual = linha['Nota_Exame']
    anterior = linha['Notas_Anteriores']
    variacao = (atual - anterior) / anterior * 100 if anterior > 0 else 0
    
    if atual < 60: return 1       
    if variacao >= 15: return -1  
    return 0                      


df['Risco_Tendencia'] = df.apply(calcular_risco_tendencia, axis=1)

# --- 4. CÁLCULO FINAL DO ÍNDICE ---
# Mantemos max_pontos em 14 como referência de risco base
max_pontos = 14
colunas_soma = [
    'Risco_Familiar', 'Risco_Recursos', 'Risco_Motivacao', 'Risco_Frequencia',
    'Risco_Professor', 'Risco_Distancia', 'Risco_Reforco', 'Risco_Dificuldade',
    'Risco_Tendencia', 'Bonus_Extra', 'Bonus_Estudo' # Adicionado Bonus_Estudo
]

df['Pontos_Vulnerabilidade'] = df[colunas_soma].sum(axis=1).clip(lower=0, upper=max_pontos)
df['Probabilidade_Problema'] = (df['Pontos_Vulnerabilidade'] / max_pontos * 100).round(2)

def categorizar_risco(prob):
    if prob <= 20: return 'Baixo'
    if prob <= 50: return 'Médio'
    return 'Alto'

df['Nivel_Risco'] = df['Probabilidade_Problema'].apply(categorizar_risco)
# --- ÍNDICE ACADÊMICO ---
# Foca em dificuldade de aprendizado: frequência, reforço, tendência da nota
cols_academico = ['Risco_Frequencia', 'Risco_Reforco', 'Risco_Dificuldade', 'Risco_Tendencia', 'Bonus_Estudo']
max_academico  = 6
df['Score_Academico'] = (df[cols_academico].sum(axis=1).clip(0, max_academico) / max_academico * 100).round(2)
df['Risco_Academico'] = df['Score_Academico'].apply(lambda p: 'Baixo' if p <= 20 else ('Médio' if p <= 50 else 'Alto'))

# --- ÍNDICE DE EVASÃO ---
# Foca em desengajamento: motivação, apoio familiar, distância, recursos, vínculo
cols_evasao = ['Risco_Motivacao', 'Risco_Familiar', 'Risco_Distancia', 'Risco_Recursos', 'Bonus_Extra']
max_evasao  = 7
df['Score_Evasao'] = (df[cols_evasao].sum(axis=1).clip(0, max_evasao) / max_evasao * 100).round(2)
df['Risco_Evasao'] = df['Score_Evasao'].apply(lambda p: 'Baixo' if p <= 20 else ('Médio' if p <= 50 else 'Alto'))

# --- DIAGNÓSTICO AUTOMATIZADO ---
def gerar_diagnostico(row):
    alertas_acad = []
    alertas_evas = []
    atencao_acad = []
    atencao_evas = []
    elogios = []

    # --- críticos acadêmicos (nível 2) ---
    if row['Risco_Frequencia'] == 2: alertas_acad.append("frequência crítica")
    if row['Risco_Tendencia']  == 1: alertas_acad.append("nota em zona crítica")
    if row['Risco_Reforco']    == 1: alertas_acad.append("sem reforço e com dificuldade")
    if row['Risco_Professor']  == 1: alertas_acad.append("necessita suporte pedagógico")

    # --- atenção acadêmica (nível 1) ---
    if row['Risco_Frequencia'] == 1: atencao_acad.append("frequência abaixo do ideal")

    # --- críticos de evasão (nível 2) ---
    if row['Risco_Motivacao'] == 2: alertas_evas.append("motivação baixa")
    if row['Risco_Familiar']  == 2: alertas_evas.append("sem apoio familiar")
    if row['Risco_Distancia'] == 2: alertas_evas.append("distância crítica")

    # --- atenção evasão (nível 1) ---
    if row['Risco_Motivacao'] == 1: atencao_evas.append("motivação média")
    if row['Risco_Familiar']  == 1: atencao_evas.append("apoio familiar médio")
    if row['Risco_Distancia'] == 1: atencao_evas.append("distância moderada")
    if row['Risco_Recursos']  == 1: atencao_evas.append("acesso a recursos médio")
    if row['Risco_Recursos']  == 2: alertas_evas.append("sem acesso a recursos")
    if row['Bonus_Extra']     == 0: atencao_evas.append("sem atividades extras")

    # --- elogios ---
    if row['Risco_Tendencia'] == -1: elogios.append("ótima evolução nas notas")
    if row['Bonus_Extra']     == -1: elogios.append("engajado em atividades extras")
    if row['Bonus_Estudo']    == -1: elogios.append("alta carga de estudo individual")

    msg = f"Risco Geral {row['Probabilidade_Problema']}% | Acadêmico {row['Score_Academico']}% | Evasão {row['Score_Evasao']}%."
    if alertas_acad:  msg += f" Acadêmico crítico: {', '.join(alertas_acad)}."
    if atencao_acad:  msg += f" Acadêmico atenção: {', '.join(atencao_acad)}."
    if alertas_evas:  msg += f" Evasão crítico: {', '.join(alertas_evas)}."
    if atencao_evas:  msg += f" Evasão atenção: {', '.join(atencao_evas)}."
    if elogios:       msg += f" Destaque: {', '.join(elogios)}."
    return msg


df['Texto_Diagnostico'] = df.apply(gerar_diagnostico, axis=1)


# --- FATORES DE RISCO E PROTEÇÃO ---
nomes = {
    'Risco_Frequencia':  'Frequência',
    'Risco_Motivacao':   'Motivação',
    'Risco_Familiar':    'Apoio Familiar',
    'Risco_Recursos':    'Acesso Recursos',
    'Risco_Distancia':   'Distância',
    'Risco_Dificuldade': 'Dificuldade',
    'Risco_Reforco':     'Sem Reforço',
    'Risco_Professor':   'Professor',
    'Risco_Tendencia':   'Tendência Nota',
    'Bonus_Extra':       'Ativ. Extras',
    'Bonus_Estudo':      'Horas Estudo',
}

# Gráfico 1 soma bruta separada em risco e proteção
fatores_risco = []
fatores_protecao = []

for col, label in nomes.items():
    total = int(df[col].sum())
    if total >= 0:
        fatores_risco.append({"fator": label, "total": total})
    else:
        fatores_protecao.append({"fator": label, "total": abs(total)})

# Gráfico 2 contagem por nível de cada fator
niveis_originais = {
    'Risco_Frequencia':  {0: 'Alta', 1: 'Média', 2: 'Baixa'},
    'Risco_Motivacao':   {0: 'Alta', 1: 'Média', 2: 'Baixa'},
    'Risco_Familiar':    {0: 'Alto', 1: 'Médio', 2: 'Baixo'},
    'Risco_Recursos':    {0: 'Alto', 1: 'Médio', 2: 'Baixo'},
    'Risco_Distancia':   {0: 'Perto', 1: 'Moderada', 2: 'Longe'},
    'Risco_Dificuldade': {0: 'Não', 1: 'Sim'},
    'Risco_Reforco':     {0: 'Com reforço', 1: 'Sem reforço'},
    'Risco_Professor':   {0: 'Med/Alto', 1: 'Baixo'},
    'Risco_Tendencia':   {-1: 'Melhora', 0: 'Estável', 1: 'Crítico'},
    'Bonus_Extra':       {-1: 'Participa', 0: 'Não participa'},
    'Bonus_Estudo':      {-1: '≥30h', 0: '<30h'},
}

fatores_contagem_niveis = []
for col, label in nomes.items():
    contagem = df[col].value_counts().sort_index().to_dict()
    mapa = niveis_originais[col]
    entry = {"fator": label}
    for val, qtd in contagem.items():
        entry[mapa.get(val, str(val))] = int(qtd)
    fatores_contagem_niveis.append(entry)

# Traduções
mapa_traducao = {
    'Low': 'Baixo', 'Medium': 'Médio', 'High': 'Alto',
    'Near': 'Perto', 'Moderate': 'Moderada', 'Far': 'Longe',
    'Yes': 'Sim', 'No': 'Não',
}

for col in ['Envolvimento_Pais', 'Nivel_Motivacao', 'Qualidade_Professor',
            'Distancia_Casa','Acesso_Recursos', 'Dificuldades_Aprendizado', 'Atividades_Extra']:
    df[col] = df[col].map(mapa_traducao).fillna(df[col])


resumo = {
    "total_alunos": len(df),
    "media_risco_geral": round(df['Probabilidade_Problema'].mean(), 2),
    "contagem_por_risco": df['Nivel_Risco'].value_counts().to_dict(),
    "contagem_por_risco_academico": df['Risco_Academico'].value_counts().to_dict(),
    "contagem_por_risco_evasao":    df['Risco_Evasao'].value_counts().to_dict(),
    "quadrantes": {
        "saudavel":              int(len(df[(df['Risco_Academico']=='Baixo') & (df['Risco_Evasao']=='Baixo')])),
        "dificuldade_academica": int(len(df[(df['Risco_Academico']=='Alto')  & (df['Risco_Evasao']=='Baixo')])),
        "risco_evasao":          int(len(df[(df['Risco_Academico']=='Baixo') & (df['Risco_Evasao']=='Alto')])),
        "intervencao_urgente":   int(len(df[(df['Risco_Academico']=='Alto')  & (df['Risco_Evasao']=='Alto')])),
    },
    "fatores_risco":             fatores_risco,       
    "fatores_protecao":          fatores_protecao,    
    "fatores_contagem_niveis":   fatores_contagem_niveis,  
}

pacote_completo = {
    "estatisticas_gerais": resumo,
    "lista_alunos": df[[
        'ID_Aluno',
        'Risco_Familiar',
        'Risco_Recursos',
        'Risco_Distancia',
        'Risco_Frequencia',
        'Risco_Tendencia',
        'Risco_Motivacao',
        'Bonus_Extra',
        'Envolvimento_Pais', 
        'Distancia_Casa', 'Acesso_Recursos',
        'Atividades_Extra','Nivel_Motivacao', 'Frequencia', 'Nota_Exame',
        'Probabilidade_Problema', 'Nivel_Risco',
        'Score_Academico', 'Risco_Academico',
        'Score_Evasao', 'Risco_Evasao',
        'Texto_Diagnostico'
    ]].to_dict(orient='records')
}


output_path = os.path.join(BASE_DIR, 'dashboard_estudantes.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(pacote_completo, f, ensure_ascii=False, indent=4)
    
print("Script atualizado e JSON gerado!")

