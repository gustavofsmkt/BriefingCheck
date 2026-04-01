import { ShieldCheck } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/70 bg-zinc-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/55">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          BriefingCheck
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a className="font-semibold text-cyan-300 transition-opacity hover:opacity-80" href="#">
            Produto
          </a>
          <a className="text-zinc-400 transition-colors hover:text-white" href="#">
            Solucoes
          </a>
          <a className="text-zinc-400 transition-colors hover:text-white" href="#">
            Precos
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white">
            Login
          </button>
          <button className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-cyan-400 active:scale-95">
            Comecar
          </button>
        </div>
      </nav>
    </header>
  );
}
