---
applyTo: "**/*.{ts,tsx}"
---
# Strict Code Architecture Rules
Non-negotiable standards for BriefingCheck codebase. Enforced by Copilot Chat on every generation.

## TypeScript Enforcement
- **Zero `any`:** `any` type is strictly forbidden. Use `unknown` with type guards if necessary.
- **Centralized Types:** All shared interfaces/types must reside in `src/types/`. Local component props are allowed inline but prefer export from `types` for reuse.
- **Strict Mode:** Always satisfy TS compiler constraints (`strictNullChecks`, etc.).

## React & Next.js Architecture
- **Server-First Paradigm:** React Server Components (RSC) are default.
- **Client Boundary:** Use `'use client'` only when strictly necessary (hooks, DOM events, interactive state). Keep client components as small as possible at the leaves of the render tree.
- **Data Fetching:** Prefer `fetch` in Server Components over client-side fetching where SEO/performance demands it.

## Styling (Tailwind Only)
- **Exclusive Framework:** 100% Tailwind CSS utility classes.
- **No Custom CSS:** Zero `.css` or `.scss` files allowed except `globals.css` for root variables and theme configuration.
- **Component Styling:** Use `clsx` and `tailwind-merge` for dynamic classes (e.g., in UI components).

## Supabase Client & Error Handling
- **Typed Client:** All Supabase interactions must use the generated `Database` types from `database.types.ts`.
- **Defensive Data Access:** Every Supabase query must explicitly handle both data and error properties. Do not assume success.
- **Pattern:** `const { data, error } = await supabase.from('...').select()` -> Always check `if (error) throw error` or handle gracefully.
