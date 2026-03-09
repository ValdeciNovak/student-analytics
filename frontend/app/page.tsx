"use client";
import { useState, useEffect } from "react";
import { Dashboard } from "@/app/dashboard/page"; // O componente que o shadcn criou

interface ApiResponse {
  estatisticas_gerais: {
    total_alunos: number;
    media_risco_geral: number;
    contagem_por_risco: Record<string, number>; // Baixo/Médio/Alto
    contagem_por_risco_academico: Record<string, number>;
    contagem_por_risco_evasao: Record<string, number>;
    quadrantes: {
      saudavel: number;
      dificuldade_academica: number;
      risco_evasao: number;
      intervencao_urgente: number;
    };
  };
  lista_alunos: {
    Envolvimento_Pais: string;
    Nivel_Motivacao: string;
    Frequencia: number;
    Nota_Exame: number;
    Probabilidade_Problema: number;
    Nivel_Risco: string;
    Score_Academico: number;
    Risco_Academico: string;
    Score_Evasao: number;
    Risco_Evasao: string;
    Texto_Diagnostico: string;
  }[];
}
export default function Home() {
  const [dados, setDados] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/alunos")
      .then((res) => res.json())
      .then(setDados);
  }, []);

  if (!dados)
    return <div className="p-10 text-center">Carregando IA Acadêmica...</div>;
console.log(
  "estatisticas_gerais:",
  JSON.stringify(dados.estatisticas_gerais, null, 2),
);

  // Passando os dados via Atributos (Props)
  return (
    <Dashboard
      alunos={dados.lista_alunos}
      estatisticas={dados.estatisticas_gerais}
    />
  );
}
