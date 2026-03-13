"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
} from "@tabler/icons-react";
import {
  ChartRadialLabel,
  type RadialItem,
} from "@/components/chart-radial-label";
import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Tipos ---
export interface Aluno {
  ID_Aluno: number;
  Envolvimento_Pais: string;
  Nivel_Motivacao: string;
  Distancia_Casa: string;
  Acesso_Recursos: string;
  Atividades_Extra: string;
  Frequencia: number;
  Nota_Exame: number;
  // campos de risco individuais do backend
  Risco_Motivacao: number;
  Risco_Familiar: number;
  Risco_Recursos: number;
  Risco_Distancia: number;
  Risco_Frequencia: number;
  Bonus_Extra: number;
  Risco_Tendencia: number;
  // scores e níveis
  Probabilidade_Problema: number;
  Nivel_Risco: string;
  Score_Academico: number;
  Risco_Academico: string;
  Score_Evasao: number;
  Risco_Evasao: string;
  Texto_Diagnostico: string;
}

// --- Tooltips das colunas ---
const TOOLTIPS: Record<string, string> = {
  ID_Aluno: "Identificador único do aluno",
  Nivel_Risco:
    "Índice geral de vulnerabilidade combina fatores acadêmicos e de evasão",
  Probabilidade_Problema:
    "Score geral de risco em % quanto maior, mais fatores de risco acumulados",
  Risco_Academico:
    "Risco baseado em frequência, notas, reforço e dificuldade de aprendizado",
  Score_Academico:
    "Score acadêmico em % reflete desempenho e presença nas aulas",
  Risco_Evasao:
    "Risco baseado em motivação, apoio familiar, distância e vínculo institucional",
  Score_Evasao:
    "Score de evasão em % quanto maior, mais sinais silenciosos de desengajamento",
  Frequencia: "Percentual de presença nas aulas",
  Nota_Exame: "Nota obtida no exame (0-100)",
  Nivel_Motivacao: "Nível de motivação - Baixo aumenta risco de evasão",
  Envolvimento_Pais:
    "Grau de envolvimento dos pais - Baixo aumenta risco de evasão",
  Distancia_Casa:
    "Distância entre a residência e a instituição - Longe aumenta risco de evasão",
  Acesso_Recursos:
    "Disponibilidade de materiais de estudo - Baixo aumenta risco de evasão",
  Atividades_Extra:
    "Participação em atividades extracurriculares, protege contra evasão",
};

// --- Badge de risco ---
function RiscoBadge({ nivel }: { nivel: string }) {
  const cores: Record<string, string> = {
    Baixo: "bg-green-500",
    Médio: "bg-yellow-400",
    Alto: "bg-red-500",
  };
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block size-2.5 rounded-full shrink-0 ${cores[nivel] ?? "bg-gray-400"}`}
      />
      <span className="text-sm">{nivel}</span>
    </div>
  );
}

// --- Cabeçalho com tooltip ---
function HeaderComTooltip({
  label,
  colKey,
}: {
  label: string;
  colKey: string;
}) {
  const dica = TOOLTIPS[colKey];
  if (!dica) return <span>{label}</span>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center gap-1 cursor-default select-none">
          {label}
          <InfoIcon className="size-3 text-muted-foreground" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px] text-xs">
        {dica}
      </TooltipContent>
    </Tooltip>
  );
}

// --- Ação recomendada ---
function acaoRecomendada(aluno: Aluno): { titulo: string; descricao: string } {
  const acad = aluno.Risco_Academico; // "Baixo" | "Médio" | "Alto"
  const evasao = aluno.Risco_Evasao; // "Baixo" | "Médio" | "Alto"

  const acadGrave = acad === "Alto";
  const evasaoGrave = evasao === "Alto";
  const acadMedio = acad === "Médio";
  const evasaoMedio = evasao === "Médio";

  // Intervenção urgente: qualquer combinação de Alto+Alto ou Alto+Médio
  if (acadGrave && evasaoGrave)
    return {
      titulo: "🔴 Intervenção Urgente",
      descricao:
        "Risco crítico nos dois índices. Contato imediato da coordenação encaminhe para suporte pedagógico e psicossocial.",
    };

  if (acadGrave && evasaoMedio)
    return {
      titulo: "🔴 Intervenção Urgente",
      descricao:
        "Dificuldade acadêmica grave com sinais de desengajamento. Requer atenção combinada: reforço pedagógico e fortalecimento do vínculo institucional.",
    };

  if (acadMedio && evasaoGrave)
    return {
      titulo: "🔴 Intervenção Urgente",
      descricao:
        "Risco de evasão alto com desempenho acadêmico comprometido. Priorize mentoria e monitoramento próximo.",
    };

  // Risco de evasão isolado
  if (evasaoGrave && !acadGrave && !acadMedio)
    return {
      titulo: "🟠 Risco de Evasão",
      descricao:
        "Desempenho acadêmico ok, mas sinais silenciosos de desengajamento. Recomenda-se mentoria para fortalecer o vínculo com a instituição.",
    };

  // Dificuldade acadêmica isolada
  if (acadGrave && !evasaoGrave && !evasaoMedio)
    return {
      titulo: "🟡 Dificuldade Acadêmica",
      descricao:
        "Aluno engajado, mas com dificuldades de desempenho. Encaminhe para sessões de reforço ou tutoria acadêmica.",
    };

  // Atenção fatores médios acumulados
  if (acadMedio || evasaoMedio)
    return {
      titulo: "🟡 Atenção",
      descricao:
        "Sem risco crítico, mas com fatores de atenção acumulados. Monitore de perto e considere ação preventiva antes que se agrave.",
    };

  return {
    titulo: "🟢 Saudável",
    descricao:
      "Nenhum fator de risco relevante identificado. Manter monitoramento regular.",
  };
}

// --- Fatores de evasão do aluno ---
function fatoresEvasao(
  aluno: Aluno,
): { fator: string; valor: string; risco: boolean }[] {
  return [
    {
      fator: "Motivação",
      valor: aluno.Nivel_Motivacao,
      risco: aluno.Nivel_Motivacao === "Baixo",
    },
    {
      fator: "Apoio Familiar",
      valor: aluno.Envolvimento_Pais,
      risco: aluno.Envolvimento_Pais === "Baixo",
    },
    {
      fator: "Distância",
      valor: aluno.Distancia_Casa,
      risco: aluno.Distancia_Casa === "Longe",
    },
    {
      fator: "Acesso a Recursos",
      valor: aluno.Acesso_Recursos,
      risco: aluno.Acesso_Recursos === "Baixo",
    },
    {
      fator: "Ativ. Extras",
      valor: aluno.Atividades_Extra,
      risco: aluno.Atividades_Extra === "Não",
    },
  ];
}

// --- Colunas ---
function makeHeader(label: string, colKey: string) {
  return () => <HeaderComTooltip label={label} colKey={colKey} />;
}

const columns: ColumnDef<Aluno>[] = [
  {
    accessorKey: "ID_Aluno",
    header: makeHeader("ID", "ID_Aluno"),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        #{row.original.ID_Aluno}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "Nivel_Risco",
    header: makeHeader("Risco Geral", "Nivel_Risco"),
    cell: ({ row }) => <RiscoBadge nivel={row.original.Nivel_Risco} />,
    filterFn: (row, _, value) =>
      value === "Todos" || row.original.Nivel_Risco === value,
  },
  {
    accessorKey: "Probabilidade_Problema",
    header: makeHeader("Score Geral", "Probabilidade_Problema"),
    cell: ({ row }) => <span>{row.original.Probabilidade_Problema}%</span>,
  },
  {
    accessorKey: "Risco_Academico",
    header: makeHeader("Risco Acadêmico", "Risco_Academico"),
    cell: ({ row }) => <RiscoBadge nivel={row.original.Risco_Academico} />,
    filterFn: (row, _, value) =>
      value === "Todos" || row.original.Risco_Academico === value,
  },
  {
    accessorKey: "Score_Academico",
    header: makeHeader("Score Acadêmico", "Score_Academico"),
    cell: ({ row }) => <span>{row.original.Score_Academico}%</span>,
  },
  {
    accessorKey: "Risco_Evasao",
    header: makeHeader("Risco Evasão", "Risco_Evasao"),
    cell: ({ row }) => <RiscoBadge nivel={row.original.Risco_Evasao} />,
    filterFn: (row, _, value) =>
      value === "Todos" || row.original.Risco_Evasao === value,
  },
  {
    accessorKey: "Score_Evasao",
    header: makeHeader("Score Evasão", "Score_Evasao"),
    cell: ({ row }) => <span>{row.original.Score_Evasao}%</span>,
  },
  {
    accessorKey: "Frequencia",
    header: makeHeader("Frequência", "Frequencia"),
    cell: ({ row }) => <span>{row.original.Frequencia}%</span>,
  },
  {
    accessorKey: "Nota_Exame",
    header: makeHeader("Nota", "Nota_Exame"),
    cell: ({ row }) => <span>{row.original.Nota_Exame}</span>,
  },
  {
    accessorKey: "Nivel_Motivacao",
    header: makeHeader("Motivação", "Nivel_Motivacao"),
    cell: ({ row }) => <span>{row.original.Nivel_Motivacao}</span>,
  },
  {
    accessorKey: "Envolvimento_Pais",
    header: makeHeader("Apoio Familiar", "Envolvimento_Pais"),
    cell: ({ row }) => <span>{row.original.Envolvimento_Pais}</span>,
  },
  {
    accessorKey: "Distancia_Casa",
    header: makeHeader("Distância", "Distancia_Casa"),
    cell: ({ row }) => <span>{row.original.Distancia_Casa}</span>,
  },
  {
    accessorKey: "Acesso_Recursos",
    header: makeHeader("Acesso Recursos", "Acesso_Recursos"),
    cell: ({ row }) => <span>{row.original.Acesso_Recursos}</span>,
  },
  {
    accessorKey: "Atividades_Extra",
    header: makeHeader("Ativ. Extras", "Atividades_Extra"),
    cell: ({ row }) => <span>{row.original.Atividades_Extra}</span>,
  },
];

const NIVEIS = ["Todos", "Baixo", "Médio", "Alto"];

// --- Componente Principal ---
export function DataTableAlunos({ data }: { data: Aluno[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [alunoSelecionado, setAlunoSelecionado] = React.useState<Aluno | null>(
    null,
  );
  const [filtroGeral, setFiltroGeral] = React.useState("Todos");
  const [filtroAcademico, setFiltroAcademico] = React.useState("Todos");
  const [filtroEvasao, setFiltroEvasao] = React.useState("Todos");

  React.useEffect(() => {
    const filters: ColumnFiltersState = [];
    if (filtroGeral !== "Todos")
      filters.push({ id: "Nivel_Risco", value: filtroGeral });
    if (filtroAcademico !== "Todos")
      filters.push({ id: "Risco_Academico", value: filtroAcademico });
    if (filtroEvasao !== "Todos")
      filters.push({ id: "Risco_Evasao", value: filtroEvasao });
    setColumnFilters(filters);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [filtroGeral, filtroAcademico, filtroEvasao]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const colunasPodeSocultar = table
    .getAllColumns()
    .filter((c) => c.getCanHide());
  const visiveisCount = colunasPodeSocultar.filter((c) =>
    c.getIsVisible(),
  ).length;
  const acao = alunoSelecionado ? acaoRecomendada(alunoSelecionado) : null;
  const fatores = alunoSelecionado ? fatoresEvasao(alunoSelecionado) : [];

  function FiltroDropdown({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            {label}
            {value !== "Todos" && (
              <span className="rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5 leading-none">
                {value}
              </span>
            )}
            <IconChevronDown className="size-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuLabel>Filtrar por {label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {NIVEIS.map((n) => (
              <DropdownMenuRadioItem key={n} value={n}>
                {n}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 lg:px-6">
          <div className="flex flex-wrap gap-2">
            <FiltroDropdown
              label="Risco Geral"
              value={filtroGeral}
              onChange={setFiltroGeral}
            />
            <FiltroDropdown
              label="Risco Acadêmico"
              value={filtroAcademico}
              onChange={setFiltroAcademico}
            />
            <FiltroDropdown
              label="Risco Evasão"
              value={filtroEvasao}
              onChange={setFiltroEvasao}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Colunas</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {colunasPodeSocultar.map((col) => {
                const visivel = col.getIsVisible();
                const seriaUltima = visiveisCount === 1 && visivel;
                return (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={visivel}
                    disabled={seriaUltima}
                    onCheckedChange={(val) => col.toggleVisibility(!!val)}
                  >
                    {col.id.replace(/_/g, " ")}
                    {seriaUltima && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        mín. 1
                      </span>
                    )}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden rounded-lg border mx-4 lg:mx-6">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                  <TableHead />
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAlunoSelecionado(row.original)}
                      >
                        Ver aluno
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum aluno encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Linhas</Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger size="sm" className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 50].map((s) => (
                    <SelectItem key={s} value={`${s}`}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        open={!!alunoSelecionado}
        onOpenChange={(open) => !open && setAlunoSelecionado(null)}
        direction="right"
      >
        <DrawerContent>
          {alunoSelecionado && acao && (
            <>
              <DrawerHeader className="gap-1">
                <DrawerTitle>Aluno #{alunoSelecionado.ID_Aluno}</DrawerTitle>
                <DrawerDescription className="text-xs">
                  {alunoSelecionado.Texto_Diagnostico}
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col gap-4 overflow-y-auto px-4">
                {(() => {
                  // Cores baseadas no valor real do backend
                  // 0 = sem risco (proteção), 1 = risco médio, 2 = risco alto
                  // Bonus_Extra: 0 = sem proteção, -1 = proteção
                  // Risco_Tendencia: -1 = melhora, 0 = estável, 1 = crítico
                  const cor = (v: number) =>
                    v === 0 ? "#10b981" : v === 1 ? "#f97316" : "#f43f5e";

                  const a = alunoSelecionado;
                  const radialData: RadialItem[] = [
                    {
                      fator: "Motivação",
                      valor: Math.max(a.Risco_Motivacao * 50, 5),
                      fill: cor(a.Risco_Motivacao),
                    },
                    {
                      fator: "Apoio Familiar",
                      valor: Math.max(a.Risco_Familiar * 50, 5),
                      fill: cor(a.Risco_Familiar),
                    },
                    {
                      fator: "Acesso Recursos",
                      valor: Math.max(a.Risco_Recursos * 50, 5),
                      fill: cor(a.Risco_Recursos),
                    },
                    {
                      fator: "Distância",
                      valor: Math.max(a.Risco_Distancia * 50, 5),
                      fill: cor(a.Risco_Distancia),
                    },
                    {
                      fator: "Frequência",
                      valor: Math.max(a.Risco_Frequencia * 50, 5),
                      fill: cor(a.Risco_Frequencia),
                    },
                    {
                      fator: "Ativ. Extras",
                      valor: a.Bonus_Extra === -1 ? 5 : 30,
                      fill: a.Bonus_Extra === -1 ? "#10b981" : "#f97316",
                    },
                    {
                      fator: "Tendência Nota",
                      valor:
                        a.Risco_Tendencia === -1
                          ? 5
                          : a.Risco_Tendencia === 0
                            ? 20
                            : 50,
                      fill:
                        a.Risco_Tendencia === -1
                          ? "#10b981"
                          : a.Risco_Tendencia === 0
                            ? "#f97316"
                            : "#f43f5e",
                    },
                  ];
                  return (
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Perfil de Risco
                      </div>
                      <ChartRadialLabel data={radialData} />
                      <div className="flex items-center justify-center">
                        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <div className="size-2 rounded-sm bg-[#f43f5e]" />
                            <span>Risco Alto</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="size-2 rounded-sm bg-[#f97316]" />
                            <span>Atenção</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="size-2 rounded-sm bg-[#10b981]" />
                            <span>OK</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Índices */}
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  {(
                    [
                      [
                        "Geral",
                        `${alunoSelecionado.Probabilidade_Problema}%`,
                        alunoSelecionado.Nivel_Risco,
                      ],
                      [
                        "Acadêmico",
                        `${alunoSelecionado.Score_Academico}%`,
                        alunoSelecionado.Risco_Academico,
                      ],
                      [
                        "Evasão",
                        `${alunoSelecionado.Score_Evasao}%`,
                        alunoSelecionado.Risco_Evasao,
                      ],
                    ] as [string, string, string][]
                  ).map(([label, score, nivel]) => (
                    <div
                      key={label}
                      className="rounded-lg border p-3 flex flex-col items-center gap-1"
                    >
                      <div className="text-xs text-muted-foreground">
                        {label}
                      </div>
                      <div className="font-semibold">{score}</div>
                      <RiscoBadge nivel={nivel} />
                    </div>
                  ))}
                </div>

                {/* Ação recomendada */}
                <div className="rounded-lg border bg-muted/40 px-4 py-3 flex flex-col gap-1">
                  <div className="font-medium text-sm">{acao.titulo}</div>
                  <div className="text-xs text-muted-foreground">
                    {acao.descricao}
                  </div>
                </div>

                {/* Fatores de evasão */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Fatores de Evasão
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {fatores.map(({ fator, valor, risco }) => (
                      <div
                        key={fator}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${risco ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30" : ""}`}
                      >
                        <span className="text-muted-foreground">{fator}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block size-2 rounded-full ${risco ? "bg-red-500" : "bg-green-500"}`}
                          />
                          <span className="font-medium">{valor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dados acadêmicos */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Dados Acadêmicos
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {(
                      [
                        ["Frequência", `${alunoSelecionado.Frequencia}%`],
                        ["Nota Exame", `${alunoSelecionado.Nota_Exame}`],
                      ] as [string, string][]
                    ).map(([label, valor]) => (
                      <div key={label} className="rounded-lg border px-3 py-2">
                        <div className="text-xs text-muted-foreground">
                          {label}
                        </div>
                        <div className="font-medium">{valor}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Fechar</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
