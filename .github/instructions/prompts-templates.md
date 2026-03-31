---
applyTo: "**/*"
---
# Copilot Chat High-Efficiency Prompts
Templates for maximizing Copilot Chat performance via strict, context-rich requests.

## Refactoring for Isolation & Performance
Use this prompt to split monolithic or slow components.

**Prompt:**
```markdown
# Refactoring Request
Role: Senior Next.js Architect
Task: Refactor the following React Server/Client Component to improve rendering performance and isolation.
Rules:
- Strictly adhere to `ui.instructions.md` and `code-rules.md`.
- Extract UI elements into separate functional components if necessary.
- Optimize imports and minimize client boundary (`'use client'`).
- Return ONLY the updated code blocks, no conversational text.

Code:
[INSERIR CÓDIGO AQUI]
```

## Advanced Bug Resolution
Use this prompt when encountering a terminal/browser error.

**Prompt:**
```markdown
# Debug Request
Role: TypeScript/Next.js Expert
Task: Resolve the following error. Do not guess; if you need to read more files to find the root cause, use `vscode_listCodeUsages` or `read_file`.
Rules:
- Adhere strictly to `token-economy.md`.
- Explain the root cause in 1 concise line.
- Provide only the necessary code blocks to fix the issue using `replace_string_in_file` logic.

Error Log:
[INSERIR ERRO AQUI]

Failing Code Snippet:
[INSERIR CÓDIGO AQUI]
```

## Documentation Generation
Use this prompt to document complex logic or API routes.

**Prompt:**
```markdown
# Documentation Request
Role: Technical Writer & Engineer
Task: Add JSDoc comments to the following complex block.
Rules:
- Explain *why* the logic exists, not just *what* it does.
- Document expected input payloads and return types.
- Ensure compliance with `token-economy.md` (no filler text).
- Return ONLY the documented code block.

Code:
[INSERIR CÓDIGO AQUI]
```
