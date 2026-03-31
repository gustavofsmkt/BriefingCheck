---
applyTo: "src/lib/n8n/**"
---
# n8n AI Agent Integration
- A comunicação com n8n é via Webhooks POST.
- Payload esperado: { briefingId: string, imageUrl: string, briefingText: string }.
- O n8n processa a imagem via GPT-4o-vision e retorna JSON estruturado.
- Use `SWR` ou `React Query` para gerenciar o estado do polling de análise se necessário.
- Mantenha as URLs de webhooks em variáveis de ambiente (.env.local).
