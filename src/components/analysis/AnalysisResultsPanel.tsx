"use client";

import {
  AlertCircle,
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Download,
  Dot,
  Info,
  ListPlus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { AnalysisResult } from "@/types";
import {
  downloadAnalysisAsJson,
  downloadAnalysisAsPdf,
  downloadAnalysisAsTxt,
} from "@/lib/utils/analysisExport";

type ResultType = "positive" | "warning" | "missing";

interface AnalysisResultsPanelProps {
  result: AnalysisResult;
  onStartOver?: () => void;
}

interface ResultSectionProps {
  title: string;
  data: string[];
  type: ResultType;
  icon: React.ComponentType<{ className?: string }>;
}

function getSeverityIcon(impact: string) {
  const value = impact.toLowerCase();

  if (value.includes("alto") || value.includes("critico") || value.includes("crítico")) {
    return <ArrowUp className="h-3.5 w-3.5 text-red-400" />;
  }
  if (value.includes("medio") || value.includes("médio") || value.includes("moderado")) {
    return <ArrowRight className="h-3.5 w-3.5 text-yellow-400" />;
  }
  if (value.includes("baixo") || value.includes("leve")) {
    return <ArrowDown className="h-3.5 w-3.5 text-blue-400" />;
  }

  return <Info className="h-3.5 w-3.5 text-zinc-500" />;
}

function getSeverityLabel(impact: string) {
  const value = impact.toLowerCase();

  if (value.includes("alto") || value.includes("critico") || value.includes("crítico")) {
    return "Alto";
  }
  if (value.includes("medio") || value.includes("médio") || value.includes("moderado")) {
    return "Medio";
  }
  if (value.includes("baixo") || value.includes("leve")) {
    return "Baixo";
  }

  return "Neutro";
}

function ResultSection({ title, data, type, icon: Icon }: ResultSectionProps) {
  const colorMap = {
    positive: { text: "text-emerald-300", bg: "bg-emerald-500", soft: "bg-emerald-500/12", border: "border-emerald-500/30" },
    warning: { text: "text-amber-300", bg: "bg-amber-500", soft: "bg-amber-500/12", border: "border-amber-500/30" },
    missing: { text: "text-rose-300", bg: "bg-rose-500", soft: "bg-rose-500/12", border: "border-rose-500/30" },
  } as const;

  const fallbackTitles = {
    positive: "Ponto Positivo",
    warning: "Ponto de Melhoria",
    missing: "Item Ausente",
  } as const;

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/75 to-zinc-950/70 p-3 md:p-4">
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2">
        <div className={`rounded-xl border border-white/5 p-2.5 shadow-sm ${colorMap[type].soft}`}>
          <Icon className={`h-5 w-5 ${colorMap[type].text}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
          <p className="text-xs text-zinc-500">Lista priorizada para tomada de decisao rapida</p>
        </div>
        <span className="ml-auto rounded-md border border-zinc-700/50 bg-zinc-800/50 px-2.5 py-1 text-xs font-bold text-zinc-300">
          {data.length} itens
        </span>
      </div>

      <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-1">
        {data.map((item, idx) => {
          const parts = item.split("|").map((segment) => segment.trim());
          const isStructured = parts.length >= 3;

          const criterio = isStructured ? parts[0] : fallbackTitles[type];
          const impacto = isStructured ? parts[1] : "";
          const descricao = isStructured ? parts.slice(2).join(" | ") : item;
          const severityLabel = getSeverityLabel(impacto);

          return (
            <div
              key={`${type}-${idx}`}
              className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-700/80 hover:bg-zinc-800/70"
            >
              <div
                className={`absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full ${colorMap[type].bg} opacity-0 transition-all duration-300 group-hover:h-1/2 group-hover:opacity-100`}
              />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-[10px] font-bold text-zinc-300">
                    {idx + 1}
                  </span>
                  <Dot className="h-3.5 w-3.5" />
                  <span>{type === "positive" ? "Forca" : type === "warning" ? "Melhoria" : "Ausencia"}</span>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h4 className="flex-1 text-base font-semibold leading-snug text-zinc-100">{criterio}</h4>
                  <div className="flex items-center gap-2">
                    {impacto && impacto !== "-" ? (
                      <div className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 shadow-sm">
                        <span className="flex items-center gap-1.5">
                          {getSeverityIcon(impacto)}
                          {impacto}
                        </span>
                      </div>
                    ) : null}
                    <div className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${colorMap[type].border} ${colorMap[type].soft} ${colorMap[type].text}`}>
                      {severityLabel}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">{descricao}</p>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-10 text-zinc-600">
            <CheckCircle2 className="mb-4 h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">Nenhum item reportado nesta secao.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function AnalysisResultsPanel({ result, onStartOver }: AnalysisResultsPanelProps) {
  const sections = useMemo(
    () => [
      { id: "positivos", title: "Pontos Positivos", type: "positive" as const, icon: CheckCircle2, data: result.pontos_positivos },
      { id: "melhorias", title: "Pontos de Melhoria", type: "warning" as const, icon: AlertCircle, data: result.pontos_de_melhoria },
      { id: "faltantes", title: "Faltou no Criativo", type: "missing" as const, icon: ListPlus, data: result.faltou_no_criativo },
    ],
    [result]
  );

  const [activeTab, setActiveTab] = useState<ResultType>("positive");
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement | null>(null);
  const activeSection = sections.find((section) => section.type === activeTab) ?? sections[0];

  useEffect(() => {
    if (!isDownloadMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(target)) {
        setIsDownloadMenuOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isDownloadMenuOpen]);

  const handleDownload = async (format: "txt" | "json" | "pdf") => {
    setIsDownloading(true);
    setIsDownloadMenuOpen(false);

    try {
      if (format === "txt") {
        downloadAnalysisAsTxt(result);
        return;
      }

      if (format === "json") {
        downloadAnalysisAsJson(result);
        return;
      }

      downloadAnalysisAsPdf(result);
    } finally {
      setIsDownloading(false);
    }
  };

  const tabStyle = {
    positive: "border-emerald-500/45 bg-emerald-500/18 text-emerald-200",
    warning: "border-amber-500/45 bg-amber-500/18 text-amber-200",
    missing: "border-rose-500/45 bg-rose-500/18 text-rose-200",
  } as const;

  return (
    <section className="anim-rise w-full animate-in fade-in zoom-in duration-300">
      <div className="sticky top-20 z-20 mb-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/88 p-4 shadow-xl shadow-cyan-950/30 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Resultado da Analise
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">Priorize correcoes com maior impacto e execute iteracoes rapidas</p>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">
            <span className="text-xs font-medium text-zinc-400">Alinhamento:</span>
            <span
              className={`text-sm font-bold ${
                result.alinhamento.label === "Bom"
                  ? "text-green-500"
                  : result.alinhamento.label === "Regular"
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {result.alinhamento.label} ({result.alinhamento.score}/100)
            </span>
          </div>

          {onStartOver ? (
            <button
              onClick={onStartOver}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reanalisar
            </button>
          ) : null}

          <div className="relative" ref={downloadMenuRef}>
            <button
              type="button"
              onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
              disabled={isDownloading}
              aria-label="Baixar analise"
              aria-haspopup="menu"
              aria-expanded={isDownloadMenuOpen}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              {isDownloading ? "Preparando..." : "Baixar analise"}
            </button>

            {isDownloadMenuOpen ? (
              <div
                role="menu"
                className="absolute right-0 z-30 mt-2 min-w-44 rounded-xl border border-zinc-700 bg-zinc-950/95 p-1 shadow-xl"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleDownload("txt")}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
                >
                  Download TXT
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleDownload("json")}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
                >
                  Download JSON
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleDownload("pdf")}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
                >
                  Download PDF
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.type)}
              className={`inline-flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === section.type
                  ? tabStyle[section.type]
                  : "border-zinc-700/80 bg-zinc-900/70 text-zinc-300 hover:border-zinc-600 hover:text-white"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {section.title}
              </span>
              <span className="rounded-md bg-zinc-950/60 px-2 py-0.5 text-[10px] font-bold text-zinc-200">{section.data.length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/55 to-zinc-950/70 p-4 md:p-6">
        <div className="mb-5 grid gap-3 md:grid-cols-[1.25fr_0.75fr]">
          <div>
            <h3 className="mb-1 flex items-center gap-3 text-2xl font-bold text-white">
              <Sparkles className="h-6 w-6 text-cyan-400" />
              Painel de Insights
            </h3>
            <p className="text-sm text-zinc-400">Visual focado em decisao: identifique impacto, ajuste e rode nova iteracao.</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Tab ativa</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{activeSection.title}</p>
            <p className="mt-0.5 text-xs text-zinc-400">{activeSection.data.length} pontos mapeados nesta secao</p>
          </div>
        </div>

        <ResultSection
          icon={activeSection.icon}
          title={activeSection.title}
          data={activeSection.data}
          type={activeSection.type}
        />
      </div>
    </section>
  );
}
