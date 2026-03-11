"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface AnaliseAcademicaProps {
  total_alunos: number;
  contagem_por_risco_academico: Record<string, number>;
  contagem_por_risco_evasao: Record<string, number>;
}

const chartConfig = {
  quantidade: { label: "Alunos" },
  Baixo: { label: "Baixo", color: "#10b981" },
  Médio: { label: "Médio", color: "#f97316" },
  Alto: { label: "Alto", color: "#f43f5e" },
} satisfies ChartConfig;

interface InfoDonutProps {
  itens: { label: string; valor: string }[];
  conclusao: string;
}

function InfoDonut({ itens, conclusao }: InfoDonutProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 px-4 py-3 text-sm h-full">
      <div className="flex flex-col gap-2 flex-1">
        {itens.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-foreground">
              {item.label}
            </span>
            <span className="text-xs text-muted-foreground">{item.valor}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2 text-xs font-medium text-foreground">
        💡 {conclusao}
      </div>
    </div>
  );
}

export function AnaliseAcademica({
  total_alunos,
  contagem_por_risco_academico,
  contagem_por_risco_evasao,
}: AnaliseAcademicaProps) {
  const acadAlto = contagem_por_risco_academico["Alto"] ?? 0;
  const acadMedio = contagem_por_risco_academico["Médio"] ?? 0;
  const acadBaixo = contagem_por_risco_academico["Baixo"] ?? 0;
  const evasAlto = contagem_por_risco_evasao["Alto"] ?? 0;
  const evasMedio = contagem_por_risco_evasao["Médio"] ?? 0;
  const evasBaixo = contagem_por_risco_evasao["Baixo"] ?? 0;

  const pctAcadAlto = ((acadAlto / total_alunos) * 100).toFixed(1);
  const pctAcadMedio = ((acadMedio / total_alunos) * 100).toFixed(1);
  const pctEvasaoAlto = ((evasAlto / total_alunos) * 100).toFixed(1);
  const pctEvasaoMedio = ((evasMedio / total_alunos) * 100).toFixed(1);
  const pctAcadBaixo = ((acadBaixo / total_alunos) * 100).toFixed(1);

  const dadosAcademico = [
    { nivel: "Baixo", quantidade: acadBaixo, fill: "var(--color-Baixo)" },
    { nivel: "Médio", quantidade: acadMedio, fill: "var(--color-Médio)" },
    { nivel: "Alto", quantidade: acadAlto, fill: "var(--color-Alto)" },
  ];

  const dadosEvasao = [
    { nivel: "Baixo", quantidade: evasBaixo, fill: "var(--color-Baixo)" },
    { nivel: "Médio", quantidade: evasMedio, fill: "var(--color-Médio)" },
    { nivel: "Alto", quantidade: evasAlto, fill: "var(--color-Alto)" },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* Section Cards */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Risco Acadêmico Alto</CardDescription>
            <div className="text-2xl font-semibold tabular-nums">
              {acadAlto.toLocaleString("pt-BR")}
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{pctAcadAlto}%</span>{" "}
            do total risco de reprovação iminente
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Risco Acadêmico Médio</CardDescription>
            <div className="text-2xl font-semibold tabular-nums">
              {acadMedio.toLocaleString("pt-BR")}
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{pctAcadMedio}%</span>{" "}
            do total monitoramento contínuo
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Risco de Evasão Alto</CardDescription>
            <div className="text-2xl font-semibold tabular-nums">
              {evasAlto.toLocaleString("pt-BR")}
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {pctEvasaoAlto}%
            </span>{" "}
            do total desengajamento silencioso
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Risco de Evasão Médio</CardDescription>
            <div className="text-2xl font-semibold tabular-nums">
              {evasMedio.toLocaleString("pt-BR")}
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {pctEvasaoMedio}%
            </span>{" "}
            do total zona de atenção
          </CardContent>
        </Card>
      </div>

      {/* Resumo executivo */}
      <div className="rounded-lg border bg-muted/40 px-5 py-4 text-sm text-muted-foreground leading-relaxed">
        A saúde acadêmica da instituição está estável {" "}
        <span className="text-foreground font-medium">
          apenas {pctAcadAlto}% dos alunos
        </span>{" "}
        apresentam risco alto de reprovação. O alerta real está no engajamento:{" "}
        <span className="text-foreground font-medium">
          {pctEvasaoAlto}% dos alunos
        </span>{" "}
        acumulam fatores silenciosos de desengajamento que não aparecem no
        boletim. Esses alunos precisam de atenção antes que desapareçam.
      </div>

      {/* Dois donuts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
        {/* Donut Acadêmico */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Risco Acadêmico</CardTitle>
            <CardDescription>
              Como estão as notas e a frequência?
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[200px]"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="nivel"
                      formatter={(value) => [
                        `${Number(value).toLocaleString("pt-BR")} alunos`,
                      ]}
                    />
                  }
                />
                <Pie
                  data={dadosAcademico}
                  dataKey="quantidade"
                  nameKey="nivel"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                />
                <ChartLegend content={<ChartLegendContent nameKey="nivel" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardContent className="pt-4 flex-1 flex flex-col">
            <InfoDonut
              itens={[
                {
                  label: "O que leva em conta",
                  valor:
                    "Frequência, tendência da nota, sessões de reforço, dificuldade de aprendizado e horas de estudo semanais",
                },
                {
                  label: "Por quê",
                  valor:
                    "Esses fatores refletem diretamente o desempenho são os sinais que aparecem no boletim e na chamada",
                },
              ]}
              conclusao={`${pctAcadBaixo}% dos alunos estão com risco baixo. O problema acadêmico grave é pontual e identificável.`}
            />
          </CardContent>
        </Card>

        {/* Donut Evasão */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Risco de Evasão</CardTitle>
            <CardDescription>
              Esses alunos vão continuar no curso?
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[200px]"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="nivel"
                      formatter={(value) => [
                        `${Number(value).toLocaleString("pt-BR")} alunos`,
                      ]}
                    />
                  }
                />
                <Pie
                  data={dadosEvasao}
                  dataKey="quantidade"
                  nameKey="nivel"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                />
                <ChartLegend content={<ChartLegendContent nameKey="nivel" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardContent className="pt-4 flex-1 flex flex-col">
            <InfoDonut
              itens={[
                {
                  label: "O que leva em conta",
                  valor:
                    "Nível de motivação, envolvimento dos pais, distância de casa, acesso a recursos e participação em atividades extracurriculares",
                },
                {
                  label: "Por quê",
                  valor:
                    "Esses fatores não aparecem nas notas são comportamentais e contextuais. Um aluno pode tirar 7 e estar prestes a abandonar o curso",
                },
              ]}
              conclusao={`${pctEvasaoAlto}% já estão em risco alto. São invisíveis para sistemas tradicionais baseados só em nota.`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
