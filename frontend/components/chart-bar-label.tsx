// "use client";

// import { TrendingUp } from "lucide-react";
// import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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

// export const description = "A bar chart with a label";

// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--chart-1)",
//   },
// } satisfies ChartConfig;

// export function ChartBarLabel() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bar Chart - Label</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart
//             accessibilityLayer
//             data={chartData}
//             margin={{
//               top: 20,
//             }}
//           >
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
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
//               <LabelList
//                 position="top"
//                 offset={12}
//                 className="fill-foreground"
//                 fontSize={12}
//               />
//             </Bar>
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