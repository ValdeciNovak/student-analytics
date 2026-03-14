"use client";

import { SiteHeader } from "@/components/site-header";
import {
  BookOpenCheckIcon,
  TrendingUpIcon,
  UsersIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  ZapIcon,
  EyeOffIcon,
  TargetIcon,
  BarChart2Icon,
  ShieldIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

interface CardInfoProps {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  destaque?: string;
}

function CardInfo({ icon, titulo, descricao, destaque }: CardInfoProps) {
  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <h3 className="font-semibold text-sm">{titulo}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {descricao}
      </p>
      {destaque && (
        <div className="rounded-md bg-muted/60 px-3 py-2 text-xs font-medium text-foreground">
          💡 {destaque}
        </div>
      )}
    </div>
  );
}

interface QuadranteProps {
  cor: string;
  emoji: string;
  titulo: string;
  alunos: string;
  descricao: string;
  acao: string;
}

function Quadrante({
  cor,
  emoji,
  titulo,
  alunos,
  descricao,
  acao,
}: QuadranteProps) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-2 ${cor}`}>
      <div className="flex items-center justify-between">
        <span className="text-lg">{emoji}</span>
        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
          {alunos}
        </span>
      </div>
      <h3 className="font-semibold text-sm">{titulo}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {descricao}
      </p>
      <div className="border-t pt-2 text-xs font-medium">Ação: {acao}</div>
    </div>
  );
}

export default function DetalhesAnalise() {
  return (
    <>
      <SiteHeader />
      <div className="flex md:mb-10 flex-1 flex-col gap-8 px-4 py-8 lg:px-6 max-w-4xl mx-auto w-full pb-5 md:pb-8">
        {/* Hero */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <BookOpenCheckIcon className="size-3.5" />
            Análise Estudantil
          </div>
          <h1 className="text-2xl font-bold leading-tight">
            Como identificamos alunos em risco antes que desapareçam
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Sistemas tradicionais olham para o passado, notas já dadas, faltas
            já acumuladas. Esta análise olha para os sinais que o boletim não
            mostra.
          </p>
        </div>

        {/* O problema */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">
            O ponto cego dos sistemas tradicionais
          </h2>
          <div className="rounded-xl border bg-muted/30 px-5 py-4 text-sm text-muted-foreground leading-relaxed">
            Imagine um aluno com{" "}
            <span className="text-foreground font-medium">nota 7</span> e{" "}
            <span className="text-foreground font-medium">
              85% de frequência
            </span>
            . Para qualquer sistema baseado em boletim, ele está bem. Mas e se
            ele mora longe, perdeu a motivação, não tem apoio em casa e parou de
            participar de qualquer atividade na universidade? Esse aluno está se
            desconectando silenciosamente e ninguém está vendo.
          </div>
        </div>

        {/* Índice Geral */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">
            Dashboard 1 - Saúde Universitária
          </h2>
          <p className="text-sm text-muted-foreground">
            A primeira tela mostra a saúde geral da instituição. Os quatro cards
            do topo trazem o Índice Geral de Risco, um termômetro combinado que
            soma fatores acadêmicos e de evasão em um único score por aluno.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-4 flex flex-col gap-1 text-center">
              <span className="text-2xl font-bold tabular-nums">1.582</span>
              <span className="text-xs text-muted-foreground">
                Risco Baixo - 24,8%
              </span>
              <div className="mt-1 h-1.5 w-full rounded-full bg-emerald-500/20">
                <div className="h-full w-[24.8%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4 flex flex-col gap-1 text-center">
              <span className="text-2xl font-bold tabular-nums">4.617</span>
              <span className="text-xs text-muted-foreground">
                Risco Médio - 72,4%
              </span>
              <div className="mt-1 h-1.5 w-full rounded-full bg-yellow-400/20">
                <div className="h-full w-[72.4%] rounded-full bg-yellow-400" />
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4 flex flex-col gap-1 text-center">
              <span className="text-2xl font-bold tabular-nums">179</span>
              <span className="text-xs text-muted-foreground">
                Risco Alto - 2,8%
              </span>
              <div className="mt-1 h-1.5 w-full rounded-full bg-rose-500/20">
                <div className="h-full w-[2.8%] rounded-full bg-rose-500" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            O índice geral é calculado somando 11 fatores com pesos diferentes.
            Máximo teórico de 14 pontos = 100% de risco. Alunos com score acima
            de 50% são classificados como Alto.
          </p>
        </div>

        {/* Fatores de Risco e Proteção */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">
            Fatores de Risco e Proteção
          </h2>
          <p className="text-sm text-muted-foreground">
            Logo abaixo dos cards, dois gráficos de barras mostram quais fatores
            mais contribuíram para o risco geral separados em dois grupos
            opostos.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CardInfo
              icon={<BarChart2Icon className="size-4" />}
              titulo="Fatores de Risco"
              descricao="Soma total de pontos negativos acumulados pela instituição em cada fator. Motivação lidera com 6.965 pontos, seguida de Apoio Familiar (5.833) e Acesso a Recursos (5.752)."
              destaque="Quanto maior a barra, mais alunos foram penalizados por esse fator"
            />
            <CardInfo
              icon={<ShieldIcon className="size-4" />}
              titulo="Fatores de Proteção"
              descricao="Bônus acumulados que reduzem o índice de risco. Atividades Extracurriculares protegem 3.807 alunos, seguido de melhora de notas (897) e alta carga de estudo (363)."
              destaque="Esses fatores blindam o aluno contra a evasão"
            />
          </div>
        </div>

        {/* Distribuição por fator */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">Distribuição por fator</h2>
          <p className="text-sm text-muted-foreground">
            O terceiro gráfico do Dashboard 1 permite explorar como os alunos
            estão distribuídos em cada nível de cada fator com cores
            semânticas que facilitam a leitura.
          </p>
          <CardInfo
            icon={<SlidersHorizontalIcon className="size-4" />}
            titulo="Gráfico de Distribuição Interativo"
            descricao="Use o seletor no canto superior direito para alternar entre os 11 fatores. As barras mostram quantos alunos estão em cada nível, verde para bom, laranja para atenção, vermelho para risco alto."
            destaque="As cores são aplicadas por fator + nível. 'Alto' em Acesso a Recursos é verde (bom), mas 'Alto' em Dificuldade de Aprendizado é vermelho (ruim)."
          />
        </div>

        {/* Os dois índices */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">
            Dashboard 2 - Dois índices, dois problemas
          </h2>
          <p className="text-sm text-muted-foreground">
            A segunda tela separa o risco em dois índices independentes. São
            problemas diferentes que precisam de respostas diferentes.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CardInfo
              icon={<TrendingUpIcon className="size-4" />}
              titulo="Índice Acadêmico"
              descricao="Mede a dificuldade de aprender. Leva em conta frequência, tendência da nota, sessões de reforço, dificuldade declarada e horas de estudo semanais. Máximo de 6 pontos."
              destaque="Foco: tutoria e suporte pedagógico"
            />
            <CardInfo
              icon={<EyeOffIcon className="size-4" />}
              titulo="Índice de Evasão"
              descricao="Mede o risco de abandono. Leva em conta motivação, apoio familiar, distância de casa, acesso a recursos e participação em atividades extracurriculares. Máximo de 7 pontos."
              destaque="Foco: mentoria e fortalecimento do vínculo"
            />
          </div>
        </div>

        {/* Fatores */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">O que entra no cálculo</h2>
          <p className="text-sm text-muted-foreground">
            Cada aluno recebe pontos de risco por fator. Fatores verdes protegem
            e reduzem o índice. Fatores vermelhos penalizam e aumentam o risco.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                label: "Motivação",
                desc: "Nível baixo é o principal fator de evasão",
                risco: true,
              },
              {
                label: "Apoio Familiar",
                desc: "Pouco envolvimento dos pais aumenta o risco",
                risco: true,
              },
              {
                label: "Frequência",
                desc: "Presença baixa é o principal fator acadêmico",
                risco: true,
              },
              {
                label: "Distância de Casa",
                desc: "Morar longe dificulta a permanência",
                risco: true,
              },
              {
                label: "Acesso a Recursos",
                desc: "Falta de materiais compromete o desempenho",
                risco: true,
              },
              {
                label: "Qualidade do Professor",
                desc: "Professor com qualidade baixa penaliza levemente",
                risco: true,
              },
              {
                label: "Sem Reforço + Nota Ruim",
                desc: "Zero sessões de reforço E nota abaixo de 65",
                risco: true,
              },
              {
                label: "Dificuldade de Aprendizado",
                desc: "Dificuldade declarada no cadastro",
                risco: true,
              },
              {
                label: "Atividades Extras",
                desc: "Participar protege contra evasão e reduz o risco",
                risco: false,
              },
              {
                label: "Tendência da Nota",
                desc: "Melhora de 15%+ é bônus. Nota abaixo de 60 é crítico",
                risco: false,
              },
              {
                label: "Horas de Estudo",
                desc: "Estudar 30h ou mais por semana é proteção",
                risco: false,
              },
            ].map(({ label, desc, risco }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
              >
                <span
                  className={`mt-0.5 inline-block size-2 rounded-full shrink-0 ${risco ? "bg-rose-500" : "bg-emerald-500"}`}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrantes */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">Os 4 grupos de ação</h2>
          <p className="text-sm text-muted-foreground">
            O cruzamento dos dois índices divide os alunos em quatro grupos,
            cada um com uma recomendação diferente para a instituição.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Quadrante
              cor="border-emerald-200 dark:border-emerald-900"
              emoji="🟢"
              titulo="Saudável"
              alunos="897 alunos · 14,1%"
              descricao="Sem dificuldade acadêmica e sem risco de abandono. Engajados e com bom desempenho."
              acao="Monitoramento leve"
            />
            <Quadrante
              cor="border-orange-200 dark:border-orange-900"
              emoji="🟠"
              titulo="Risco de Evasão"
              alunos="1.420 alunos · 22,3%"
              descricao="Nota aceitável, mas se desconectando silenciosamente. Invisíveis para o boletim."
              acao="Mentoria e acolhimento"
            />
            <Quadrante
              cor="border-yellow-200 dark:border-yellow-900"
              emoji="🟡"
              titulo="Dificuldade Acadêmica"
              alunos="9 alunos · 0,1%"
              descricao="Querem ficar, mas estão com dificuldade real de aprendizado. Motivação preservada."
              acao="Tutoria e reforço"
            />
            <Quadrante
              cor="border-red-200 dark:border-red-900"
              emoji="🔴"
              titulo="Intervenção Urgente"
              alunos="36 alunos · 0,6%"
              descricao="Colapso nos dois índices. Nota abaixo de 60, frequência crítica, sem apoio e sem motivação."
              acao="Contato imediato"
            />
          </div>
        </div>

        {/* O número mais importante */}
        <div className="rounded-xl border bg-muted/30 px-5 py-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="size-4 text-orange-500" />
            <span className="font-semibold text-sm">
              O número mais importante
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-foreground font-semibold">1.420 alunos</span>{" "}
            têm nota aceitável e risco alto de evasão. Nenhum sistema baseado só
            em boletim os identifica. São estudantes se desconectando da
            universidade sem que ninguém perceba até que param de aparecer.
          </p>
        </div>

        {/* Perfil individual */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">Diagnóstico individual</h2>
          <p className="text-sm text-muted-foreground">
            Na tabela da segunda tela, clique em "Ver aluno" para abrir o perfil
            completo. Cada aluno tem três camadas de análise:
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CardInfo
              icon={<UsersIcon className="size-4" />}
              titulo="Perfil de Risco"
              descricao="Gráfico com 7 fatores individuais coloridos por nível, do mais crítico ao mais protegido, ordenados por gravidade."
            />
            <CardInfo
              icon={<TargetIcon className="size-4" />}
              titulo="Três Scores"
              descricao="Geral, Acadêmico e de Evasão calculados individualmente, com classificação Baixo, Médio ou Alto para cada um."
            />
            <CardInfo
              icon={<ZapIcon className="size-4" />}
              titulo="Ação Recomendada"
              descricao="Gerada automaticamente pelo cruzamento dos índices de monitoramento leve a intervenção urgente, com texto explicativo."
            />
          </div>
        </div>

        {/* Dataset */}
        <div className="rounded-xl border px-5 py-4 flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-4 text-muted-foreground" />
            <span className="font-medium">Fonte dos dados</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Dataset{" "}
            <a
              href="https://www.kaggle.com/datasets/ayeshasiddiqa123/student-perfirmance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Student Academic Performance
            </a>{" "}
            do Kaggle 6.378 registros com 20 variáveis sobre hábitos de
            estudo, contexto familiar, motivação e desempenho acadêmico.
          </p>
        </div>
      </div>
    </>
  );
}
