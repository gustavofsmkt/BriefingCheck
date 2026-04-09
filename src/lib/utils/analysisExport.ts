import { AnalysisResult } from "@/types";
import { jsPDF } from "jspdf";

interface PdfExportOptions {
  campaignName?: string;
  briefingText?: string;
  generatedAt?: Date;
}

function sanitizeFileStamp(value: string) {
  return value.replace(/[\s:]/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
}

function getTimestamp() {
  return sanitizeFileStamp(new Date().toISOString().slice(0, 19));
}

function getFileBaseName(prefix = "analise-briefing") {
  return `${prefix}-${getTimestamp()}`;
}

function formatDate(value: Date) {
  return value.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function clipText(value: string, size: number) {
  if (value.length <= size) {
    return value;
  }

  return `${value.slice(0, size - 3)}...`;
}

function toPdfSafeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseStructuredItem(item: string) {
  const safeItem = toPdfSafeText(item);
  const parts = safeItem.split("|").map((part) => part.trim());

  if (parts.length < 3) {
    return {
      criterio: "Observacao",
      impacto: "Neutro",
      descricao: item,
    };
  }

  return {
    criterio: parts[0],
    impacto: parts[1],
    descricao: parts.slice(2).join(" | "),
  };
}

function buildExecutiveSummary(result: AnalysisResult) {
  const topImprovement = result.pontos_de_melhoria[0] ? parseStructuredItem(result.pontos_de_melhoria[0]) : null;
  const topMissing = result.faltou_no_criativo[0] ? parseStructuredItem(result.faltou_no_criativo[0]) : null;

  const priorities: string[] = [];

  if (topImprovement) {
    priorities.push(`Prioridade 1: melhorar ${topImprovement.criterio.toLowerCase()}.`);
  }

  if (topMissing) {
    priorities.push(`Prioridade 2: incluir ${topMissing.criterio.toLowerCase()} no criativo.`);
  }

  if (priorities.length === 0) {
    priorities.push("Nao ha pontos criticos em aberto. Execute iteracoes de refinamento visual.");
  }

  const label = result.alinhamento.label.toLowerCase();
  const overview = `O alinhamento atual foi classificado como ${label} com score ${result.alinhamento.score}/100.`;
  return `${overview} ${priorities.join(" ")}`;
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

export function downloadAnalysisAsPdf(result: AnalysisResult, options: PdfExportOptions = {}) {
  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "a4",
    putOnlyUsedFonts: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const rowGap = 10;
  const cardPadding = 12;
  const generatedAt = options.generatedAt ?? new Date();
  const campaignName = options.campaignName?.trim() ? options.campaignName.trim() : "Campanha sem nome";
  const briefingSnapshot = options.briefingText?.trim() ? clipText(options.briefingText.trim(), 220) : "Nao informado";
  const executiveSummary = buildExecutiveSummary(result);
  let cursorY = 0;

  const toLines = (text: string, maxWidth: number) => {
    const safeText = toPdfSafeText(text);
    if (!safeText) {
      return ["-"];
    }

    return doc.splitTextToSize(safeText, maxWidth) as string[];
  };

  const ensurePageSpace = (requiredHeight: number) => {
    if (cursorY + requiredHeight <= pageHeight - margin) {
      return;
    }

    doc.addPage();
    drawPageBackground();
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CONTINUACAO DO RELATORIO", margin, margin + 12);
    cursorY = margin + 24;
  };

  const drawPageBackground = () => {
    doc.setFillColor(6, 10, 22);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  };

  const drawLogoMark = (x: number, y: number) => {
    doc.setFillColor(34, 211, 238);
    doc.circle(x + 10, y + 10, 10, "F");
    doc.setFillColor(6, 10, 22);
    doc.circle(x + 10, y + 10, 5.5, "F");
    doc.setFillColor(34, 211, 238);
    doc.circle(x + 27, y + 10, 4, "F");
  };

  const drawCoverPage = () => {
    drawPageBackground();

    doc.setFillColor(8, 13, 27);
    doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 18, 18, "F");
    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(1);
    doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 18, 18, "S");

    drawLogoMark(margin + 24, margin + 26);

    doc.setTextColor(34, 211, 238);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("BRIEFINGCHECK REPORT", margin + 62, margin + 43);

    doc.setTextColor(240, 249, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.text("Analise Premium", margin + 24, margin + 112);

    doc.setFontSize(19);
    doc.text("de Criativo", margin + 24, margin + 139);

    const metadataY = margin + 172;
    const metadataLabelX = margin + 40;
    const metadataValueX = margin + 180;
    const metadataValueWidth = contentWidth - (metadataValueX - margin) - 40;
    const campaignLines = toLines(campaignName, metadataValueWidth).slice(0, 2);
    const dateLine = formatDate(generatedAt);
    const scoreLine = `${result.alinhamento.label} (${result.alinhamento.score}/100)`;
    const metadataHeight = 124;

    doc.setFillColor(10, 17, 36);
    doc.roundedRect(margin + 24, metadataY, contentWidth - 48, metadataHeight, 14, 14, "F");
    doc.setDrawColor(39, 52, 72);
    doc.roundedRect(margin + 24, metadataY, contentWidth - 48, metadataHeight, 14, 14, "S");

    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("DATA DO RELATORIO", metadataLabelX, metadataY + 26);
    doc.text("CAMPANHA", metadataLabelX, metadataY + 62);
    doc.text("ALINHAMENTO", metadataLabelX, metadataY + 102);

    doc.setTextColor(241, 245, 249);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(dateLine, metadataValueX, metadataY + 26);
    doc.text(campaignLines, metadataValueX, metadataY + 62);

    const scoreColor =
      result.alinhamento.label === "Bom"
        ? [34, 197, 94]
        : result.alinhamento.label === "Regular"
          ? [250, 204, 21]
          : [248, 113, 113];

    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(scoreLine, metadataValueX, metadataY + 102);

    const summaryY = metadataY + metadataHeight + 24;
    doc.setTextColor(34, 211, 238);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("RESUMO EXECUTIVO", margin + 24, summaryY);

    const summaryLines = toLines(executiveSummary, contentWidth - 72).slice(0, 7);
    const summaryBoxHeight = Math.max(84, summaryLines.length * 15 + 30);
    doc.setFillColor(10, 17, 36);
    doc.roundedRect(margin + 24, summaryY + 12, contentWidth - 48, summaryBoxHeight, 12, 12, "F");
    doc.setDrawColor(39, 52, 72);
    doc.roundedRect(margin + 24, summaryY + 12, contentWidth - 48, summaryBoxHeight, 12, 12, "S");

    doc.setTextColor(203, 213, 225);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(summaryLines, margin + 36, summaryY + 36);

    const snapshotY = summaryY + 12 + summaryBoxHeight + 24;
    const briefingLines = toLines(briefingSnapshot, contentWidth - 72).slice(0, 5);
    const snapshotBoxHeight = Math.max(72, briefingLines.length * 14 + 30);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("SNAPSHOT DO BRIEFING", margin + 24, snapshotY);

    doc.setFillColor(10, 17, 36);
    doc.roundedRect(margin + 24, snapshotY + 10, contentWidth - 48, snapshotBoxHeight, 12, 12, "F");
    doc.setDrawColor(39, 52, 72);
    doc.roundedRect(margin + 24, snapshotY + 10, contentWidth - 48, snapshotBoxHeight, 12, 12, "S");

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(10);
    doc.text(briefingLines, margin + 36, snapshotY + 31);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text("Documento gerado automaticamente pelo BriefingCheck", margin + 24, pageHeight - margin - 14);

    doc.addPage();
    drawPageBackground();
    cursorY = margin;
  };

  const drawHeader = () => {
    const headerHeight = 92;

    doc.setFillColor(10, 17, 36);
    doc.roundedRect(margin, margin, contentWidth, headerHeight, 16, 16, "F");

    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(1);
    doc.roundedRect(margin, margin, contentWidth, headerHeight, 16, 16, "S");

    doc.setTextColor(34, 211, 238);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("CREATIVE LAB INTELLIGENCE", margin + 16, margin + 20);

    doc.setTextColor(240, 249, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Analise de Briefing", margin + 16, margin + 48);

    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Relatorio estruturado para compartilhamento e revisao", margin + 16, margin + 66);

    const badgeWidth = 170;
    const badgeHeight = 42;
    const badgeX = margin + contentWidth - badgeWidth - 16;
    const badgeY = margin + 24;

    doc.setFillColor(8, 13, 27);
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 12, 12, "F");
    doc.setDrawColor(51, 65, 85);
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 12, 12, "S");

    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("ALINHAMENTO", badgeX + 12, badgeY + 15);

    const scoreColor =
      result.alinhamento.label === "Bom"
        ? [34, 197, 94]
        : result.alinhamento.label === "Regular"
          ? [250, 204, 21]
          : [248, 113, 113];

    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${result.alinhamento.label} (${result.alinhamento.score}/100)`, badgeX + 12, badgeY + 32);

    cursorY = margin + headerHeight + 18;
  };

  const drawSection = (title: string, items: string[], color: [number, number, number]) => {
    ensurePageSpace(56);

    doc.setFillColor(10, 17, 36);
    doc.roundedRect(margin, cursorY, contentWidth, 34, 10, 10, "F");
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.roundedRect(margin, cursorY, contentWidth, 34, 10, 10, "S");

    doc.setTextColor(226, 232, 240);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, margin + 12, cursorY + 22);

    cursorY += 44;

    if (items.length === 0) {
      ensurePageSpace(44);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text("Nenhum item nesta secao.", margin + 4, cursorY + 14);
      cursorY += 24;
      return;
    }

    items.forEach((rawItem, index) => {
      const item = parseStructuredItem(rawItem);

      const titleLines = toLines(`${index + 1}. ${item.criterio}`, contentWidth - cardPadding * 2 - 8);
      const impactLine = `Impacto: ${item.impacto}`;
      const impactLines = toLines(impactLine, contentWidth - cardPadding * 2 - 8);
      const descriptionLines = toLines(item.descricao, contentWidth - cardPadding * 2 - 8);

      const lineHeight = 13;
      const cardHeight =
        cardPadding * 2 +
        titleLines.length * lineHeight +
        6 +
        impactLines.length * lineHeight +
        6 +
        descriptionLines.length * lineHeight;

      ensurePageSpace(cardHeight + rowGap);

      doc.setFillColor(8, 13, 27);
      doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 10, 10, "F");
      doc.setDrawColor(39, 52, 72);
      doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 10, 10, "S");

      let textY = cursorY + cardPadding + 10;

      doc.setTextColor(226, 232, 240);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(titleLines, margin + cardPadding, textY);
      textY += titleLines.length * lineHeight + 6;

      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(impactLines, margin + cardPadding, textY);
      textY += impactLines.length * lineHeight + 6;

      doc.setTextColor(203, 213, 225);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(descriptionLines, margin + cardPadding, textY);

      cursorY += cardHeight + rowGap;
    });

    cursorY += 6;
  };

  const drawFooter = () => {
    const pageCount = doc.getNumberOfPages();

    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`BriefingCheck | Pagina ${page} de ${pageCount}`, margin, pageHeight - 18);
    }
  };

  drawCoverPage();
  drawHeader();
  drawSection("Pontos Positivos", result.pontos_positivos, [34, 197, 94]);
  drawSection("Pontos de Melhoria", result.pontos_de_melhoria, [250, 204, 21]);
  drawSection("Faltou no Criativo", result.faltou_no_criativo, [248, 113, 113]);
  drawFooter();

  doc.save(`${getFileBaseName()}.pdf`);
}
