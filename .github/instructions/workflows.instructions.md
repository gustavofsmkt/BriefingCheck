---
applyTo: "**/*.{ts,tsx}"
---
# n8n AI Agent Integration
- A comunicação com n8n é via Webhooks POST.
- Payload esperado: { briefingId: string, imageUrl: string, briefingText: string }.
- O n8n processa a imagem via GPT-4o-vision e retorna JSON estruturado.
- Use `SWR` ou `React Query` para gerenciar o estado do polling de análise se necessário.
- Mantenha as URLs de webhooks em variáveis de ambiente (.env.local).

# Standard Operating Procedures (SOPs)
Enforce these strict workflows when generating implementations.

## Workflow 1: Component Creation SOP
1. **Type Definition:** Define the `Props` interface explicitly (export from `types` if shared).
2. **Skeleton & Props:** Create a functional component skeleton receiving props. Use Next.js Server Components unless `'use client'` is mandatory.
3. **Styling (Tailwind):** Apply Tailwind CSS classes for layout, typography, and responsive design (`md:`, `lg:`). Use `clsx`/`twMerge` for conditional classes.
4. **State & Logic:** Implement core logic, hooks, or event handlers.
5. **Resilience:** Add loading spinners (`lucide-react`) and explicit error states/boundaries.

## Workflow 2: Backend Integration SOP (Supabase/n8n)
1. **Schema Validation:** Verify/define the corresponding TypeScript interface in `src/types/` matching `database.types.ts` or n8n payload contract.
2. **Service Layer:** Implement the data fetching/mutation function in `src/lib/supabase/` or `src/lib/n8n/`.
3. **Frontend Connection:** Wire the service function to the UI using Server Actions or Client Hooks (`SWR`), managing loading and error states.
4. **Error Handling & Logging:** Wrap the service call in `try/catch`. Log errors descriptively and return a standardized error object to the UI.
