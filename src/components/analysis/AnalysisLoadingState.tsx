import { LoaderCircle, Sparkles } from "lucide-react";

interface AnalysisLoadingStateProps {
  currentStepText: string;
}

export function AnalysisLoadingState({ currentStepText }: AnalysisLoadingStateProps) {
  return (
    <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" />
        <p className="text-sm font-medium text-cyan-100">{currentStepText}</p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800/80">
        <div className="loading-rail h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
      </div>

      <p className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
        <Sparkles className="h-3.5 w-3.5" />
        Aguarde: a IA esta cruzando a imagem com o briefing para gerar insights objetivos.
      </p>
    </div>
  );
}
