/**
 * PDF generation utility for MEN school readiness assessment reports.
 * Uses jsPDF to produce a printable document following the Polish MEN template.
 */
import { jsPDF } from "jspdf";
import type { Diagnosis, Child } from "./types.js";

/** Skill level labels in Polish for PDF output */
const SKILL_LEVEL_LABELS: Record<string, string> = {
  MASTERED: "Opanowane",
  SUPPORTED: "Wspomagane",
  NEEDS_HELP: "Wymaga pomocy",
};

/** Development area labels in Polish for PDF output */
const AREA_LABELS: Record<string, string> = {
  PHYSICAL: "Rozwój fizyczny",
  EMOTIONAL: "Rozwój emocjonalny",
  SOCIAL: "Rozwój społeczny",
  COGNITIVE: "Rozwój poznawczy",
};

/** Diagnosis type labels in Polish for PDF output */
const TYPE_LABELS: Record<string, string> = {
  INITIAL: "Diagnoza wstępna",
  FINAL: "Informacja o gotowości dziecka do podjęcia nauki w szkole podstawowej",
  SHORT: "Obserwacja bieżąca",
};

/**
 * Generates a PDF report for a given diagnosis and child.
 * The PDF follows the MEN template structure.
 */
export function generateDiagnosisPdf(diagnosis: Diagnosis, child: Child, indicatorLabels: Record<string, string>): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ── Header ──────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const title = TYPE_LABELS[diagnosis.type] ?? diagnosis.type;
  const titleLines = doc.splitTextToSize(title, contentWidth) as string[];
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 7 + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("(zgodnie z wymogami MEN)", pageWidth / 2, y, { align: "center" });
  y += 10;

  // ── Child info ───────────────────────────────────────────────────────
  doc.setDrawColor(180);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Dane dziecka", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Imię i nazwisko: ${child.firstName} ${child.lastName}`, margin, y);
  y += 5;
  doc.text(`Rok urodzenia: ${child.birthYear}`, margin, y);
  y += 5;
  doc.text(`Rok szkolny: ${diagnosis.year}/${diagnosis.year + 1}`, margin, y);
  y += 5;
  doc.text(`Data wydruku: ${new Date().toLocaleDateString("pl-PL")}`, margin, y);
  y += 10;

  // ── Development areas ────────────────────────────────────────────────
  for (const category of diagnosis.categories) {
    // Section heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const areaLabel = AREA_LABELS[category.area] ?? category.area;
    doc.text(areaLabel, margin, y);
    y += 7;

    for (const indicator of category.indicators) {
      const label = indicatorLabels[indicator.id] ?? indicator.id;
      const level = indicator.skillLevel ? (SKILL_LEVEL_LABELS[indicator.skillLevel] ?? indicator.skillLevel) : "—";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const labelLines = doc.splitTextToSize(`• ${label}`, contentWidth - 4) as string[];
      doc.text(labelLines, margin + 2, y);
      y += labelLines.length * 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Ocena: ${level}`, margin + 6, y);
      y += 4.5;

      if (indicator.notes) {
        const noteLines = doc.splitTextToSize(indicator.notes, contentWidth - 8) as string[];
        doc.setTextColor(60);
        doc.text(noteLines, margin + 6, y);
        doc.setTextColor(0);
        y += noteLines.length * 4.5;
      }

      y += 2;

      // Page break if needed
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
    }

    y += 4;
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
  }

  // ── Additional sections ──────────────────────────────────────────────
  const additionalSections: { label: string; value: string }[] = [
    { label: "Potrzeby rozwojowe i edukacyjne (zauważone trudności)", value: diagnosis.developmentalNeeds },
    { label: "Predyspozycje i uzdolnienia (mocne strony)", value: diagnosis.strengths },
    { label: "Wskazówki dla nauczyciela klasy I", value: diagnosis.teacherNotes },
  ];

  for (const section of additionalSections) {
    if (!section.value) continue;

    if (y > 250) {
      doc.addPage();
      y = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(section.label, margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(section.value, contentWidth) as string[];
    doc.text(lines, margin, y);
    y += lines.length * 5 + 6;
  }

  // ── Footer / signature ───────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Strona ${i} z ${pageCount}  ·  Cenzurki – Diagnoza Dojrzałości Szkolnej`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.setTextColor(0);
  }

  const fileName = `Diagnoza_${child.lastName}_${child.firstName}_${diagnosis.year}.pdf`;
  doc.save(fileName);
}
