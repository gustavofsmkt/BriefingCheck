import { AnalysisForm } from "@/components/AnalysisForm";

export default function Home() {
  return (
    <div className="selection:bg-cyan-500/30">
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/45 px-6 py-8 sm:px-8">
        <div className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Creative Lab Intelligence</p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
              Analise Criativos em
              <span className="ml-2 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text italic text-transparent">
                segundos
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
              Upload, briefing e acao na primeira tela. Receba score, melhorias e lacunas em um painel compacto com foco operacional.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="text-lg font-extrabold text-cyan-300">+60%</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">tempo poupado</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="text-lg font-extrabold text-blue-300">3x</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">mais clareza</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="text-lg font-extrabold text-emerald-300">100%</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">insights acionaveis</p>
            </div>
          </div>
        </div>
      </section>

      <AnalysisForm />
    </div>
  );
}
