import { FileText } from "lucide-react";

interface BriefingInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function BriefingInput({ value, onChange, disabled = false }: BriefingInputProps) {
  return (
    <div className="flex h-full min-h-[19.5rem] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-sm md:p-5">
      <label
        htmlFor="briefing-textarea"
        className="mb-4 flex cursor-pointer items-center gap-2 text-lg font-bold text-white"
      >
        <FileText className="h-5 w-5 text-cyan-400" />
        Campaign Briefing
      </label>

      <textarea
        id="briefing-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Texto do briefing"
        className="min-h-[11.5rem] max-h-[20rem] w-full flex-1 resize-y rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-70 md:text-base"
        placeholder="Cole aqui os detalhes da campanha, publico-alvo, canais de veiculacao e requisitos visuais obrigatorios..."
      />
    </div>
  );
}
