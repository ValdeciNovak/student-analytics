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

// Verde = bom/proteção, Laranja = atenção, Vermelho = risco
const CORES_POR_FATOR: Record<string, Record<string, string>> = {
  Frequência: {
    Alta: "#10b981", 
    Média: "#f97316",
    Baixa: "#f43f5e",
  },
  Motivação: {
    Alta: "#10b981",
    Média: "#f97316",
    Baixa: "#f43f5e",
  },
  "Apoio Familiar": {
    Alto: "#10b981", 
    Médio: "#f97316",
    Baixo: "#f43f5e",
  },
  "Acesso Recursos": {
    Alto: "#10b981", 
    Médio: "#f97316",
    Baixo: "#f43f5e",
  },
  Distância: {
    Perto: "#10b981",
    Moderada: "#f97316",
    Longe: "#f43f5e",
  },
  Dificuldade: {
    Não: "#10b981", 
    Sim: "#f43f5e",
  },
  "Sem Reforço": {
    "Com reforço": "#10b981",
    "Sem reforço": "#f43f5e",
  },
  Professor: {
    "Med/Alto": "#10b981",
    Baixo: "#f43f5e",
  },
  "Tendência Nota": {
    Melhora: "#10b981",
    Estável: "#f97316",
    Crítico: "#f43f5e",
  },
  "Ativ. Extras": {
    Participa: "#10b981",
    "Não participa": "#f43f5e",
  },
  "Horas Estudo": {
    "≥30h": "#10b981",
    "<30h": "#f97316",
  },
};

function corParaNivel(fator: string, nivel: string): string {
  return CORES_POR_FATOR[fator]?.[nivel] ?? "#94a3b8";
}

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
    const data = niveis.map((nivel) => ({
      nivel,
      quantidade: fator[nivel] as number,
      fill: corParaNivel(fatorSelecionado, nivel),
    }));

    const config: ChartConfig = {};
    niveis.forEach((nivel) => {
      config[nivel] = {
        label: nivel,
        color: corParaNivel(fatorSelecionado, nivel),
      };
    });

    return { chartData: data, chartConfig: config };
  }, [dados, fatorSelecionado]);

  return (
    <Card className="max-h[200px]">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Distribuição {fatorSelecionado}</CardTitle>
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
              content={<ChartTooltipContent hideLabel />}
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