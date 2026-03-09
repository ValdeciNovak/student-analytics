// "use client";

// import { TrendingUp } from "lucide-react";
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   type ChartConfig,
// } from "@/components/ui/chart";

// export const description = "A multiple bar chart";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--chart-1)",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "var(--chart-2)",
//   },
// } satisfies ChartConfig;

// export function ChartBarMultiple() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bar Chart - Multiple</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart accessibilityLayer data={chartData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent indicator="dashed" />}
//             />
//             <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
//             <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 leading-none font-medium">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts";
import { ChevronsUpDown } from "lucide-react";

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
  type ChartConfig,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FatorContagem {
  fator: string;
  [nivel: string]: string | number;
}

interface ChartBarMultipleProps {
  dados: FatorContagem[];
}

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const DESCRICOES: Record<string, string> = {
  Frequência: "Nível de presença dos alunos nas aulas",
  Motivação: "Nível de motivação declarado pelos alunos",
  "Apoio Familiar": "Grau de envolvimento dos pais no processo acadêmico",
  "Acesso Recursos": "Disponibilidade de materiais e ferramentas de estudo",
  Distância: "Distância física entre a residência e a instituição",
  Dificuldade: "Alunos com dificuldade de aprendizado declarada",
  "Sem Reforço": "Alunos sem reforço e com nota abaixo de 65",
  Professor: "Qualidade pedagógica do professor",
  "Tendência Nota": "Evolução da nota atual em relação à nota anterior",
  "Ativ. Extras": "Participação em atividades extracurriculares",
  "Horas Estudo": "Carga horária semanal dedicada aos estudos",
};

export function ChartBarMultiple({ dados }: ChartBarMultipleProps) {
  const todosFatores = useMemo(() => dados.map((d) => d.fator), [dados]);
  const [fatorSelecionado, setFatorSelecionado] = useState(todosFatores[0]);

  // Extrai os níveis e monta [{nivel, quantidade}] para o fator atual
  const { chartData, chartConfig } = useMemo(() => {
    const fator = dados.find((d) => d.fator === fatorSelecionado);
    if (!fator) return { chartData: [], chartConfig: {} as ChartConfig };

    const niveis = Object.keys(fator).filter((k) => k !== "fator");
    const data = niveis.map((nivel, i) => ({
      nivel,
      quantidade: fator[nivel] as number,
      fill: PALETTE[i % PALETTE.length],
    }));

    const config: ChartConfig = {};
    niveis.forEach((nivel, i) => {
      config[nivel] = {
        label: nivel,
        color: PALETTE[i % PALETTE.length],
      };
    });

    return { chartData: data, chartConfig: config };
  }, [dados, fatorSelecionado]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Distribuição - {fatorSelecionado}</CardTitle>
          <CardDescription className="mt-1">
            {DESCRICOES[fatorSelecionado] ??
              "Quantidade de alunos em cada nível."}
          </CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 gap-2">
              {fatorSelecionado}
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Selecionar fator</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={fatorSelecionado}
              onValueChange={setFatorSelecionado}
            >
              {todosFatores.map((fator) => (
                <DropdownMenuRadioItem key={fator} value={fator}>
                  {fator}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-62.5 w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 24 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nivel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
                    <span className="text-muted-foreground">
                      Total de pontos{" "}
                    </span>
                    <span className="font-semibold">
                      {payload[0].value?.toLocaleString("pt-BR")}
                    </span>
                  </div>
                );
              }}
            />
            <Bar dataKey="quantidade" radius={6}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}