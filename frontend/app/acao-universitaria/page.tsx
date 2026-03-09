"use client";
"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ChartBarLabel } from "@/components/chart-bar-label";
import { ChartBarMultiple } from "@/components/chart-bar-multiple";
import { useState, useEffect } from "react";
import { AnaliseAcademica } from "@/components/analise-academica";
import { DataTableAlunos } from "@/components/data-table-alunos";

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
  lista_alunos: any[];
}

export default function AcaoUniversitaria() {
  const [dados, setDados] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/alunos")
      .then((res) => res.json())
      .then(setDados);
  }, []);

  if (!dados)
    return <div className="p-10 text-center">Carregando IA Acadêmica...</div>;

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
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
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
