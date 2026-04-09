"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Sparkles, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { triggerN8nWebhook } from "@/lib/n8n/webhook";
import { AnalysisResult } from "@/types";
import { UploadDropzone } from "@/components/analysis/UploadDropzone";
import { BriefingInput } from "@/components/analysis/BriefingInput";
import { AnalysisLoadingState } from "@/components/analysis/AnalysisLoadingState";
import { AnalysisResultsPanel } from "@/components/analysis/AnalysisResultsPanel";
import { ToastMessage, ToastVariant } from "@/components/ui/ToastMessage";

interface ToastState {
  title: string;
  description?: string;
  variant: ToastVariant;
}

export function AnalysisForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [briefingText, setBriefingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);

  const isSubmitDisabled = isLoading || !imageFile || briefingText.trim().length < 20;

  const loadingSteps = useMemo(
    () => [
      "Enviando criativo para processamento...",
      "Registrando briefing e preparando o fluxo...",
      "IA analisando estrutura visual e contexto...",
      "Consolidando insights e score final...",
    ],
    []
  );

  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }

    const stepTimer = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => clearInterval(stepTimer);
  }, [isLoading, loadingSteps.length]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      if (referenceImagePreview) {
        URL.revokeObjectURL(referenceImagePreview);
      }
    };
  }, [imagePreview, referenceImagePreview]);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setResult(null);
    setToast(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const handleClearFile = () => {
    setImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);
  };

  const handleReferenceFileSelect = (file: File) => {
    setReferenceImageFile(file);
    setResult(null);
    setToast(null);

    if (referenceImagePreview) {
      URL.revokeObjectURL(referenceImagePreview);
    }

    setReferenceImagePreview(URL.createObjectURL(file));
  };

  const handleClearReferenceFile = () => {
    setReferenceImageFile(null);

    if (referenceImagePreview) {
      URL.revokeObjectURL(referenceImagePreview);
    }

    setReferenceImagePreview(null);
  };

  const handleResetFlow = () => {
    setResult(null);
    setToast(null);
    setBriefingText("");
    handleClearFile();
    handleClearReferenceFile();
  };

  const showErrorToast = (description: string) => {
    setToast({
      title: "Nao foi possivel concluir a analise",
      description,
      variant: "error",
    });
  };

  const showSuccessToast = () => {
    setToast({
      title: "Analise finalizada com sucesso",
      description: "Os resultados ja estao disponiveis na tela.",
      variant: "success",
    });
  };

  const handleSubmit = async () => {
    if (!imageFile || !briefingText.trim()) {
      showErrorToast("Adicione uma imagem e preencha o briefing antes de analisar.");
      return;
    }

    if (briefingText.trim().length < 20) {
      showErrorToast("O briefing precisa ter pelo menos 20 caracteres para uma analise confiavel.");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      showErrorToast("A imagem ultrapassa 5MB. Use um arquivo menor para continuar.");
      return;
    }

    if (referenceImageFile && referenceImageFile.size > 5 * 1024 * 1024) {
      showErrorToast("A imagem de referencia ultrapassa 5MB. Use um arquivo menor para continuar.");
      return;
    }

    try {
      setIsLoading(true);
      setToast(null);
      setResult(null);
      
      const fileName = `${Date.now()}-${imageFile.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('creatives')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('creatives')
        .getPublicUrl(uploadData.path);

      let referenceImageUrl: string | undefined;

      if (referenceImageFile) {
        const referenceFileName = `ref-${Date.now()}-${referenceImageFile.name}`;
        const { data: referenceUploadData, error: referenceUploadError } = await supabase.storage
          .from('creatives')
          .upload(referenceFileName, referenceImageFile);

        if (referenceUploadError) {
          throw referenceUploadError;
        }

        const { data: { publicUrl: referencePublicUrl } } = supabase.storage
          .from('creatives')
          .getPublicUrl(referenceUploadData.path);

        referenceImageUrl = referencePublicUrl;
      }

      const createAnalysisLegacy = async () => {
        return supabase
          .from('analyses')
          .insert([{ 
            image_url: publicUrl,
            briefing_text: briefingText,
            status: 'pending'
          }])
          .select('id')
          .single();
      };

      // Insert com fallback para schema legado sem reference_image_url.
      let { data: analysisData, error: dbError } = await supabase
        .from('analyses')
        .insert([{ 
          image_url: publicUrl,
          reference_image_url: referenceImageUrl ?? null,
          briefing_text: briefingText,
          status: 'pending'
        }])
        .select('id')
        .single();

      const shouldRetryLegacyInsert =
        !!dbError &&
        (
          dbError.code === "PGRST204" ||
          dbError.code === "42703" ||
          dbError.message.toLowerCase().includes("reference_image_url")
        );

      if (shouldRetryLegacyInsert) {
        const legacyInsert = await createAnalysisLegacy();
        analysisData = legacyInsert.data;
        dbError = legacyInsert.error;
      }

      if (dbError) {
        console.error("Insert error:", dbError);
        throw dbError;
      }

      if (!analysisData?.id) {
        throw new Error("Nao foi possivel obter o identificador da analise criada.");
      }

      await triggerN8nWebhook({
        id: analysisData.id,
        image_url: publicUrl,
        briefing_text: briefingText,
        reference_image_url: referenceImageUrl,
      });

      const pollInterval = setInterval(async () => {
        const { data: pollData, error: pollError } = await supabase
          .from('analyses')
          .select('status, analysis_result')
          .eq('id', analysisData.id)
          .single();

        if (pollError) {
          console.error("Polling erro:", pollError);
          clearInterval(pollInterval);
          showErrorToast(`Erro ao verificar o status da analise: ${pollError.message}`);
          setIsLoading(false);
          return;
        }

        if (pollData.status === 'completed') {
          clearInterval(pollInterval);
          setResult(pollData.analysis_result as AnalysisResult);
          showSuccessToast();
          setIsLoading(false);
        } else if (pollData.status === 'failed') {
          clearInterval(pollInterval);
          showErrorToast("A analise falhou no fluxo do n8n.");
          setIsLoading(false);
        }
      }, 3000);

    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : "Erro desconhecido ao analisar.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast ? (
        <ToastMessage
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      ) : null}

      <section className="mb-8 grid w-full grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        <div className="h-full lg:col-span-3">
          <UploadDropzone
            imagePreview={imagePreview}
            onFileSelect={handleFileSelect}
            onClearFile={handleClearFile}
            disabled={isLoading}
            inputId="main-image-upload"
            title="Criativo principal"
            description="Arraste a imagem principal para analise"
            helperText="Selecionar criativo"
            previewAlt="Preview do criativo principal"
          />
        </div>

        <div className="h-full lg:col-span-3">
          <UploadDropzone
            imagePreview={referenceImagePreview}
            onFileSelect={handleReferenceFileSelect}
            onClearFile={handleClearReferenceFile}
            disabled={isLoading}
            inputId="reference-image-upload"
            title="Referencia visual (opcional)"
            description="Adicione uma segunda imagem para contextualizar"
            helperText="Selecionar referencia"
            previewAlt="Preview da referencia visual"
          />
        </div>

        <div className="h-full lg:col-span-3">
          <BriefingInput value={briefingText} onChange={setBriefingText} disabled={isLoading} />
        </div>

        <aside className="h-full lg:col-span-3">
          <div className="sticky top-24 min-h-[19.5rem] rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-lg shadow-cyan-950/20">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Control Hub</p>

            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-zinc-950 transition-all hover:bg-cyan-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? loadingSteps[loadingStepIndex] : "Analisar Criativo"}
              {!isLoading ? <Sparkles className="h-4 w-4" /> : null}
            </button>

            <button
              onClick={handleResetFlow}
              disabled={isLoading && !result}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Nova Analise
            </button>

            <div className="mt-4 space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-400">
              <p className="flex items-center gap-2 text-zinc-300">
                <Zap className="h-3.5 w-3.5 text-cyan-300" />
                Interacao principal pronta acima da dobra.
              </p>
              <p>Briefing minimo: 20 caracteres</p>
              <p>Imagem recomendada: ate 5MB</p>
              {result ? (
                <p className="font-semibold text-emerald-300">Ultimo score: {result.alinhamento.score}/100</p>
              ) : null}
            </div>

            {isLoading ? <AnalysisLoadingState currentStepText={loadingSteps[loadingStepIndex]} /> : null}
          </div>
        </aside>
      </section>

      {result ? (
        <AnalysisResultsPanel
          result={result}
          onStartOver={handleResetFlow}
        />
      ) : (
        <section className="mb-10 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-sm text-zinc-400">
          A area de resultados aparecera aqui apos a analise. Os paineis foram otimizados para evitar scroll longo.
        </section>
      )}

      <section className="mb-12 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Fluxo</p>
          <p className="mt-1 text-sm font-semibold text-zinc-100">Upload - Briefing - Insight</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Formato IA</p>
          <p className="mt-1 text-sm font-semibold text-zinc-100">Criterio | Impacto | Descricao</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Navegacao</p>
          <p className="mt-1 text-sm font-semibold text-zinc-100">Atalhos rapidos e abas compactas</p>
        </div>
      </section>
    </>
  );
}
