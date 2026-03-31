import { CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { AnalysisForm } from "@/components/AnalysisForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-900">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 w-full">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <ShieldCheck className="text-blue-500 w-6 h-6" />
            BriefingCheck
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-blue-500 font-semibold hover:opacity-80 transition-all duration-300" href="#">Produto</a>
            <a className="text-zinc-400 hover:text-white transition-all duration-300" href="#">Soluções</a>
            <a className="text-zinc-400 hover:text-white transition-all duration-300" href="#">Preços</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-white font-medium transition-all duration-300">Login</button>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-300 shadow-sm">
              Começar
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Validação de Criativos com <span className="text-blue-500 italic">Inteligência Artificial</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Faça o upload do seu anúncio, cole o briefing e deixe a nossa IA auditar o alinhamento em segundos.
          </p>
        </section>

        {/* Main Interaction Component */}
        <AnalysisForm />

        {/* Mock Result Section (For Layout Demo) */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-blue-500"></div>
            
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Relatório de Auditoria</h2>
                  <p className="text-zinc-500">Exemplo de análise processada</p>
                </div>
                <div className="flex items-center gap-3 bg-blue-500/10 px-6 py-3 rounded-full border border-blue-500/20">
                  <span className="font-bold text-blue-400">Alinhamento: 85% - Bom</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Pontos Positivos
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-start p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                      <CheckCircle2 className="text-emerald-500 w-5 h-5 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white">Consistência Visual</p>
                        <p className="text-sm text-zinc-400 mt-1">O uso das cores primárias está alinhado com o guia de marca.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Pontos Negativos/Faltantes
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-start p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                      <AlertCircle className="text-red-500 w-5 h-5 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white">Hierarquia de Texto</p>
                        <p className="text-sm text-zinc-400 mt-1">O título secundário está competindo visualmente com o Headline principal.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="border-t border-zinc-900 py-12 px-6 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto items-center">
          <div>
            <div className="text-lg font-black mb-4">BriefingCheck</div>
            <p className="text-sm text-zinc-500">
              © 2026 BriefingCheck. Intelligence-driven validation.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end">
            <a className="text-sm text-zinc-500 hover:text-white transition-colors" href="#">Privacidade</a>
            <a className="text-sm text-zinc-500 hover:text-white transition-colors" href="#">Termos</a>
            <a className="text-sm text-zinc-500 hover:text-white transition-colors" href="#">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
