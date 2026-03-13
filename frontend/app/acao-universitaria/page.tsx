"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { AnaliseAcademica } from "@/components/analise-academica";
import { Aluno, DataTableAlunos } from "@/components/data-table-alunos";

import { DashboardSkeleton } from "@/components/skeleton-page";

interface Estatisticas {
  total_alunos: number;
  contagem_por_risco_academico: Record<string, number>;
  contagem_por_risco_evasao: Record<string, number>;
  quadrantes: {
    saudavel: number;
    dificuldade_academica: number;
    risco_evasao: number;
    intervencao_urgente: number;
  };
}

interface ApiResponse {
  estatisticas_gerais: Estatisticas;
  lista_alunos: Aluno[];
}

export default function AcaoUniversitaria() {
  const [dados, setDados] = useState<ApiResponse | null>(null);

  useEffect(() => {
    // fetch("https://student-analytics-y0kf.onrender.com/alunos")
    fetch("/dashboard_estudantes.json")
      .then((res) => res.json())
      .then(setDados);
  }, []);

  if (!dados) return <DashboardSkeleton />;

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6" />
          <AnaliseAcademica
            total_alunos={dados.estatisticas_gerais.total_alunos}
            contagem_por_risco_academico={
              dados.estatisticas_gerais.contagem_por_risco_academico
            }
            contagem_por_risco_evasao={
              dados.estatisticas_gerais.contagem_por_risco_evasao
            }
          />
          <DataTableAlunos data={dados.lista_alunos} />
        </div>
      </div>
    </>
  );
}
