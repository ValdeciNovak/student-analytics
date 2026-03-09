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

interface DashboardProps {
  alunos: any[];
  estatisticas: any;
}

export function Dashboard({ alunos, estatisticas }: DashboardProps) {
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
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards estatisticas={estatisticas} />
                <div className="px-4 lg:px-6 ">
                  {/* <ChartAreaInteractive /> */}
                  {/* <ChartBarLabel /> */}
                  <ChartBarLabel
                    dados={estatisticas.fatores_risco}
                    titulo="Fatores de Risco"
                    descricao="Soma total de pontos de risco gerados por cada fator. Quanto maior a barra, mais esse fator contribuiu para o risco geral dos alunos."
                    rodape={`${estatisticas.total_alunos.toLocaleString("pt-BR")} alunos analisados`}
                    cor="var(--color-rose-500)"
                  />
                </div>
                  <div className="px-4 lg:px-6">
                    <ChartBarLabel
                      dados={estatisticas.fatores_protecao}
                      titulo="Fatores de Proteção"
                      descricao="Alunos engajados em atividades extracurriculares, com melhora de notas ou alta carga de estudo acumulam bônus que reduzem o índice de risco blindando contra a evasão."
                      rodape={`${estatisticas.total_alunos.toLocaleString("pt-BR")} alunos analisados`}
                      cor="var(--color-emerald-500)"
                    />
                  </div>
                  <div className="px-4 lg:px-6">
                    <ChartBarMultiple
                      dados={estatisticas.fatores_contagem_niveis}
                    />
                  </div>
                

                {/* <DataTable data={alunos} /> */}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
