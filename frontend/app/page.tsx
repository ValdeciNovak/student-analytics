"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "@/app/dashboard/page";
import { DashboardSkeleton } from "@/components/skeleton-page";

interface ApiResponse {
  estatisticas_gerais: {
    total_alunos: number;
    media_risco_geral: number;
    contagem_por_risco: Record<string, number>;
    contagem_por_risco_academico: Record<string, number>;
    contagem_por_risco_evasao: Record<string, number>;
    quadrantes: {
      saudavel: number;
      dificuldade_academica: number;
      risco_evasao: number;
      intervencao_urgente: number;
    };
    fatores_risco: { fator: string; total: number }[];
    fatores_protecao: { fator: string; total: number }[];
    fatores_contagem_niveis: {
      fator: string;
      [nivel: string]: string | number;
    }[];
  };
  lista_alunos: any[];
}

export default function Home() {
  const [dados, setDados] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/alunos")
      .then((res) => res.json())
      .then(setDados);
  }, []);

  if (!dados) return <DashboardSkeleton />;

  return (
    <Dashboard
      alunos={dados.lista_alunos}
      estatisticas={dados.estatisticas_gerais}
    />
  );
}
