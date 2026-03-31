---
applyTo: "{src/lib/supabase/**,src/hooks/useSupabase.ts,database.types.ts}"
---
# Supabase & Database Rules
- SEMPRE use RLS (Row Level Security) em todas as tabelas.
- O Storage 'ads-images' armazena as imagens para análise.
- Tabelas principais: `briefings` (id, user_id, text, image_url, status), `analysis_results` (id, briefing_id, analysis_json).
- Use `supabase-js` para todas as interações no frontend.
- Prefira `database.types.ts` gerados para garantir a segurança de tipos.
