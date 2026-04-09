import { Upload, X } from "lucide-react";
import Image from "next/image";

interface UploadDropzoneProps {
  imagePreview: string | null;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
  disabled?: boolean;
  inputId?: string;
  title?: string;
  description?: string;
  helperText?: string;
  previewAlt?: string;
}

export function UploadDropzone({
  imagePreview,
  onFileSelect,
  onClearFile,
  disabled = false,
  inputId = "image-upload",
  title = "Arraste sua imagem aqui",
  description = "Suporte para PNG e JPG",
  helperText = "Procurar arquivo",
  previewAlt = "Preview da imagem selecionada",
}: UploadDropzoneProps) {
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-sm transition-shadow md:p-5">
      <label
        htmlFor={inputId}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="group relative flex h-full min-h-[19.5rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-950/50 p-6 outline-none transition-colors hover:bg-zinc-800/40 focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <input
          id={inputId}
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />

        {imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt={previewAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              unoptimized
              className="absolute inset-0 z-10 h-full w-full rounded-xl object-contain p-3"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClearFile();
              }}
              className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-950/85 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-zinc-600 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Remover
            </button>
          </>
        ) : (
          <>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 transition-transform group-hover:scale-110">
              <Upload className="h-7 w-7 text-cyan-400" />
            </div>
            <p className="mb-1 text-center text-sm font-semibold text-white md:text-base">
              {title}
            </p>
            <p className="mb-4 text-center text-xs text-zinc-500 md:text-sm">{description}</p>
            <span className="rounded-lg bg-zinc-800 px-5 py-2 text-sm font-medium text-white transition-colors group-hover:bg-zinc-700">
              {helperText}
            </span>
          </>
        )}
      </label>
    </div>
  );
}
