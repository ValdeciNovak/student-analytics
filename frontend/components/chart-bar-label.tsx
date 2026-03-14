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

const DESCRICOES: Record<string, string> = {
  // Fatores de risco
  Motivação: "Nível de motivação do aluno em relação ao curso e à instituição",
  "Apoio Familiar":
    "Grau de envolvimento dos pais ou responsáveis no processo acadêmico",
  "Acesso Recursos":
    "Disponibilidade de materiais, ferramentas e tecnologia para os estudos",
  Frequência: "Presença do aluno nas aulas ao longo do período",
  Distância: "Distância física entre a moradia do aluno e a instituição",
  Dificuldade: "Presença de dificuldades de aprendizado declaradas pelo aluno",
  Professor: "Qualidade pedagógica do professor avaliada pelo aluno",
  "Sem Reforço": "Aluno sem sessões de reforço e com nota abaixo de 65",
  // Fatores de proteção
  "Ativ. Extras":
    "Participação em atividades extracurriculares — fator de proteção contra evasão",
  "Tendência Nota":
    "Alunos com melhora significativa de nota (≥15%) recebem bônus de proteção",
  "Horas Estudo":
    "Alunos com 30h ou mais de estudo semanal recebem bônus de proteção",
};

export function ChartBarLabel({
  dados,
  titulo,
  descricao,
  rodape,
  cor,
}: ChartBarLabelProps) {
  const chartConfig = {
    total: {
      label: "Total de pontos:",
      color: cor,
    },
  } satisfies ChartConfig;

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
                const fator = payload[0].payload.fator as string;
                const total = payload[0].value as number;
                const desc = DESCRICOES[fator] ?? fator;
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm max-w-56">
                    <p className="font-semibold mb-1">{fator}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-2">
                      {desc}
                    </p>
                    {/* <p className="text-xs">
                      <span className="text-muted-foreground">
                        Total de pontos:{" "}
                      </span>
                      <span className="font-semibold">
                        {total.toLocaleString("pt-BR")}
                      </span>
                    </p> */}
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