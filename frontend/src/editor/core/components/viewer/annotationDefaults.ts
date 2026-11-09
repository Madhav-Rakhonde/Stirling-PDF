import { PdfStandardFont } from "@embedpdf/models";

/** Markup-annotation colours shared by the tool defaults and the menu. */
export const MARKUP_ANNOTATION_COLORS = {
  highlight: "#ffd54f",
  underline: "#ffb300",
  strikeout: "#e53935",
  squiggly: "#00acc1",
} as const;

/**
 * Resolves a font family name or PdfStandardFont enum value to a numeric
 * PdfStandardFont expected by EmbedPDF/PDFium.
 *
 * Strings passed directly to EmbedPDF are coerced by WebAssembly to 0
 * (PdfStandardFont.Courier), causing FreeText annotations to be saved in
 * Courier instead of the selected or default font (Issue #8709).
 */
export function toPdfStandardFont(
  font?: string | number | null,
): PdfStandardFont {
  if (
    typeof font === "number" &&
    font in PdfStandardFont &&
    font !== PdfStandardFont.Unknown
  ) {
    return font as PdfStandardFont;
  }
  if (!font || typeof font !== "string") {
    return PdfStandardFont.Helvetica;
  }
  const normalized = font.trim().toLowerCase();
  if (normalized.includes("courier") || normalized.includes("mono")) {
    const bold = normalized.includes("bold");
    const italic =
      normalized.includes("italic") || normalized.includes("oblique");
    if (bold && italic) return PdfStandardFont.Courier_BoldOblique;
    if (bold) return PdfStandardFont.Courier_Bold;
    if (italic) return PdfStandardFont.Courier_Oblique;
    return PdfStandardFont.Courier;
  }
  if (
    !normalized.includes("sans") &&
    (normalized.includes("times") ||
      normalized.includes("serif") ||
      normalized.includes("georgia"))
  ) {
    const bold = normalized.includes("bold");
    const italic =
      normalized.includes("italic") || normalized.includes("oblique");
    if (bold && italic) return PdfStandardFont.Times_BoldItalic;
    if (bold) return PdfStandardFont.Times_Bold;
    if (italic) return PdfStandardFont.Times_Italic;
    return PdfStandardFont.Times_Roman;
  }
  if (normalized === "symbol") {
    return PdfStandardFont.Symbol;
  }
  if (normalized.includes("zapf")) {
    return PdfStandardFont.ZapfDingbats;
  }
  const bold = normalized.includes("bold");
  const italic =
    normalized.includes("italic") || normalized.includes("oblique");
  if (bold && italic) return PdfStandardFont.Helvetica_BoldOblique;
  if (bold) return PdfStandardFont.Helvetica_Bold;
  if (italic) return PdfStandardFont.Helvetica_Oblique;
  return PdfStandardFont.Helvetica;
}
