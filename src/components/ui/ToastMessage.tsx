import { AlertCircle, CheckCircle2, X } from "lucide-react";

export type ToastVariant = "success" | "error";

interface ToastMessageProps {
  title: string;
  description?: string;
  variant: ToastVariant;
  onClose: () => void;
}

export function ToastMessage({ title, description, variant, onClose }: ToastMessageProps) {
  const variantStyles = {
    success: {
      container: "border-emerald-500/35 bg-emerald-500/10",
      icon: "text-emerald-300",
    },
    error: {
      container: "border-red-500/35 bg-red-500/10",
      icon: "text-red-300",
    },
  } as const;

  return (
    <div className={`fixed inset-x-4 bottom-4 z-[70] w-auto rounded-xl border p-4 shadow-2xl backdrop-blur md:inset-x-auto md:bottom-auto md:right-6 md:top-20 md:w-[min(92vw,420px)] ${variantStyles[variant].container}`}>
      <div className="flex items-start gap-3">
        <div className={variantStyles[variant].icon}>
          {variant === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-100">{title}</p>
          {description ? <p className="mt-1 text-sm text-zinc-300">{description}</p> : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-900/35 hover:text-zinc-100"
          aria-label="Fechar notificacao"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
