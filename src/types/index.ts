export interface Briefing {
  id: string;
  user_id: string;
  text: string;
  image_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface AnalysisResult {
  alinhamento: { score: number; label: string };
  pontos_positivos: string[];
  pontos_de_melhoria: string[];
  faltou_no_criativo: string[];
}
