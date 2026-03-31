import { Upload, FileText, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-24 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Briefing<span className="text-blue-500">Check</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
          Analise o alinhamento entre seus anúncios e briefings usando IA avançada. 
          Descubra pontos positivos, negativos e o que falta em segundos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Card: Upload de Imagem */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <div className="p-4 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold">Imagem do Anúncio</h3>
            <p className="text-zinc-500 text-sm">Arraste e solte ou clique para enviar</p>
          </div>

          {/* Card: Texto do Briefing */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <div className="p-4 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold">Texto do Briefing</h3>
            <p className="text-zinc-500 text-sm">Insira o objetivo e regras do anúncio</p>
          </div>
        </div>

        <button className="mt-8 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-colors disabled:opacity-50">
          Iniciar Análise
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 pt-10 border-t border-zinc-900">
          <div className="flex items-center space-x-3 text-zinc-500">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">Pontos Positivos</span>
          </div>
          <div className="flex items-center space-x-3 text-zinc-500">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm">Pontos de Melhoria</span>
          </div>
          <div className="flex items-center space-x-3 text-zinc-500">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span className="text-sm">O que falta</span>
          </div>
        </div>
      </div>
    </main>
  );
}
