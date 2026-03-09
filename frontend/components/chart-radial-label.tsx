"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface RadialItem {
  fator: string;
  valor: number;
  fill: string;
}

interface Props {
  data: RadialItem[];
}

const chartConfig = {
  valor: { label: "Peso no risco" },
} satisfies ChartConfig;

export function ChartRadialLabel({ data }: Props) {
  // Ordena do maior para menor peso
  const sorted = [...data].sort((a, b) => b.valor - a.valor);

  return (
    <ChartContainer config={chartConfig} className="h-[220px] w-full">
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ left: 8, right: 32, top: 4, bottom: 4 }}
      >
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          type="category"
          dataKey="fator"
          width={110}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="valor" radius={4} maxBarSize={18}>
          {sorted.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
