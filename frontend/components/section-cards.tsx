"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon } from "lucide-react";

interface Estatisticas {
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
}

interface SectionCardsProps {
  estatisticas: Estatisticas;
}

export function SectionCards({ estatisticas }: SectionCardsProps) {
  if (!estatisticas || !estatisticas.contagem_por_risco) {
    return <div className="p-4 text-muted-foreground">Carregando cards...</div>;
  }

  

  const total = estatisticas.total_alunos;

  // Índice Geral
  const baixo = estatisticas.contagem_por_risco["Baixo"] ?? 0;
  const medio = estatisticas.contagem_por_risco["Médio"] ?? 0;
  const alto = estatisticas.contagem_por_risco["Alto"] ?? 0;

  // Percentuais do índice geral
  const pctBaixo = ((baixo / total) * 100).toFixed(1);
  const pctMedio = ((medio / total) * 100).toFixed(1);
  const pctAlto = ((alto / total) * 100).toFixed(1);

  // Quadrantes - para o subtexto dos cards
  const { risco_evasao, intervencao_urgente } = estatisticas.quadrantes;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* CARD 1 - Total */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Alunos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total.toLocaleString("pt-BR")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Risco médio geral: {estatisticas.media_risco_geral}%
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Baseado em {total.toLocaleString("pt-BR")} registros analisados
          </div>
        </CardFooter>
      </Card>

      {/* CARD 2 - Risco Baixo */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Alunos em Risco Baixo</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {baixo.toLocaleString("pt-BR")}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="bg-green-400 px-1.5 py-1.5 h-0"
            />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {pctBaixo}% do total de alunos
          </div>
          <div className="text-muted-foreground">
            Sem fatores relevantes de risco identificados
          </div>
        </CardFooter>
      </Card>

      {/* CARD 3 - Risco Médio */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Alunos em Risco Médio</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {medio.toLocaleString("pt-BR")}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="bg-yellow-400 px-1.5 py-1.5 h-0"
            />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm h-full">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {pctMedio}% do total de alunos
          </div>
          <div className="text-muted-foreground ">
            {risco_evasao.toLocaleString("pt-BR")} com risco de evasão
            silencioso
          </div>
        </CardFooter>
      </Card>

      {/* CARD 4 - Risco Alto */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Alunos em Risco Alto</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {alto.toLocaleString("pt-BR")}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-red-400 px-1.5 py-1.5 h-0" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm h-full">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {pctAlto}% do total de alunos
          </div>
          <div className="text-muted-foreground">
            {intervencao_urgente} requerem intervenção urgente
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}