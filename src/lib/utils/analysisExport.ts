import { AnalysisResult } from "@/types";

function sanitizeFileStamp(value: string) {
  return value.replace(/[\s:]/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
}

function getTimestamp() {
  return sanitizeFileStamp(new Date().toISOString().slice(0, 19));
}

function getFileBaseName(prefix = "analise-briefing") {
  return `${prefix}-${getTimestamp()}`;
}

export function buildAnalysisText(result: AnalysisResult) {
  const lines: string[] = [];

  lines.push("ANALISE DE BRIEFING");
  lines.push("");
  lines.push(`Alinhamento: ${result.alinhamento.label} (${result.alinhamento.score}/100)`);
  lines.push("");

  lines.push("PONTOS POSITIVOS");
  result.pontos_positivos.forEach((item, index) => {
    lines.push(`${index + 1}. ${item}`);
  });
  lines.push("");

  lines.push("PONTOS DE MELHORIA");
  result.pontos_de_melhoria.forEach((item, index) => {
    lines.push(`${index + 1}. ${item}`);
  });
  lines.push("");

  lines.push("FALTOU NO CRIATIVO");
  result.faltou_no_criativo.forEach((item, index) => {
    lines.push(`${index + 1}. ${item}`);
  });

  return lines.join("\n");
}

export function downloadAnalysisAsTxt(result: AnalysisResult) {
  const content = buildAnalysisText(result);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${getFileBaseName()}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadAnalysisAsJson(result: AnalysisResult) {
  const content = JSON.stringify(result, null, 2);
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${getFileBaseName()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadAnalysisAsPdf(result: AnalysisResult) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=960,height=720");

  if (!printWindow) {
    throw new Error("Nao foi possivel abrir a janela de exportacao PDF. Verifique o bloqueador de pop-up.");
  }

  const htmlReport = `
  <!doctype html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Analise de Briefing</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 28px; color: #111827; }
        h1 { margin: 0 0 8px; font-size: 22px; }
        p { margin: 4px 0 16px; }
        h2 { margin: 24px 0 10px; font-size: 16px; }
        li { margin: 8px 0; }
      </style>
    </head>
    <body>
      <h1>Analise de Briefing</h1>
      <p><strong>Alinhamento:</strong> ${result.alinhamento.label} (${result.alinhamento.score}/100)</p>

      <h2>Pontos Positivos</h2>
      <ol>${result.pontos_positivos.map((item) => `<li>${item}</li>`).join("")}</ol>

      <h2>Pontos de Melhoria</h2>
      <ol>${result.pontos_de_melhoria.map((item) => `<li>${item}</li>`).join("")}</ol>

      <h2>Faltou no Criativo</h2>
      <ol>${result.faltou_no_criativo.map((item) => `<li>${item}</li>`).join("")}</ol>
    </body>
  </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlReport);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
