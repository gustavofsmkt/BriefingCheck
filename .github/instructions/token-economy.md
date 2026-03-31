---
applyTo: "**/*"
---
# Token Economy & High-Efficiency Rules
Strict rules for AI behavior to minimize token usage and maximize precision in GitHub Copilot Chat.

## Core Interaction Rules
- **Ultra-Concise:** No conversational filler (e.g., "Here is the code", "I hope this helps", "Sure!").
- **Direct Output:** Provide only requested code snippets/edits and a 1-line technical justification.
- **Smart Edits:** Never rewrite entire files unless explicitly requested. Use `replace_string_in_file` for targeted changes.
- **Complexity Check:** If a solution requires >50 lines of new code, ask for permission with a brief architecture summary first.

## Prompt Engineering for Copilot
- **Context Pinning:** Always prioritize information from `.github/instructions/` relevant to the active file.
- **Symbol Search:** Use `vscode_listCodeUsages` instead of reading multiple files to find references.
- **Minimalist Metadata:** Omit boilerplate comments in generated code unless required for logic/types.
- **Chunking:** Read only necessary line ranges using `read_file` to keep the context window clean.
