"use client";

import { useState } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";

export function AnalysisForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [briefingText, setBriefingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile || !briefingText) {
      setError("Por favor, adicione uma imagem e o texto do briefing.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Upload image to Supabase Storage -> Get URL
      // TODO: Call triggerN8nWebhook with imageUrl and briefingText
      
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido ao analisar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 w-full">
      {/* Upload Zone */}
      <div className="lg:col-span-5 bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 shadow-sm transition-shadow">
        <label 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleImageDrop}
          className="h-full flex flex-col justify-center items-center border-2 border-dashed border-zinc-700 rounded-xl p-10 bg-zinc-950/50 hover:bg-zinc-800/50 transition-colors group cursor-pointer relative"
        >
          <input 
            type="file" 
            accept="image/png, image/jpeg, video/mp4" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Upload className="text-blue-500 w-8 h-8" />
          </div>
          <p className="text-white font-semibold mb-2">
            {imageFile ? imageFile.name : "Arraste o arquivo aqui"}
          </p>
          <p className="text-zinc-500 text-sm mb-6">Suporte para PNG, JPG</p>
          <span className="bg-zinc-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors">
            Procurar arquivo
          </span>
        </label>
      </div>

      {/* Briefing Textarea */}
      <div className="lg:col-span-7 bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 shadow-sm flex flex-col">
        <label className="block text-white font-bold text-lg mb-4 flex items-center gap-2">
          <FileText className="text-blue-500 w-6 h-6" />
          Campaign Briefing
        </label>
        
        <textarea 
          value={briefingText}
          onChange={(e) => setBriefingText(e.target.value)}
          className="w-full flex-1 min-h-[16rem] p-5 bg-zinc-950/50 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none resize-none text-white placeholder:text-zinc-600" 
          placeholder="Cole aqui os detalhes da campanha, público-alvo, canais de veiculação e requisitos visuais obrigatórios..."
        />
        
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <div className="mt-8">
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processando..." : "Analisar Criativo"}
            {!isLoading && <Sparkles className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </section>
  );
}
