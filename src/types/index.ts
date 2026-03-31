export interface Briefing {
  id: string;
  user_id: string;
  text: string;
  image_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface AnalysisResult {
  id: string;
  briefing_id: string;
  positive_points: string[];
  negative_points: string[];
  missing_elements: string[];
  overall_score: number;
  raw_analysis?: any;
}
