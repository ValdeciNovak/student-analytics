"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface FatorItem {
  fator: string;
  total: number;
}

interface ChartBarLabelProps {
  dados: FatorItem[];
  titulo: string;
  descricao: string;
  rodape: string;
  cor: string;
}

export function ChartBarLabel({
  dados,
  titulo,
  descricao,
  rodape,
  cor,
}: ChartBarLabelProps) {
  const chartConfig = {
    total: {
      label: "Total de pontos :",
      color: cor,
    },
  } satisfies ChartConfig;

  // ordena do maior para o menor para facilitar leitura
  const dadosOrdenados = [...dados].sort((a, b) => b.total - a.total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-62.5 w-full">
          <BarChart
            accessibilityLayer
            data={dadosOrdenados}
            margin={{ top: 24 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fator"
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
            <Bar dataKey="total" fill={cor} radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString("pt-BR")}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="leading-none text-muted-foreground text-sm">
          {rodape}
        </div>
      </CardFooter>
    </Card>
  );
}