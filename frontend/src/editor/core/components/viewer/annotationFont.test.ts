import { describe, it, expect } from "vitest";
import { PdfStandardFont, PdfAnnotationSubtype } from "@embedpdf/models";
import { toPdfStandardFont } from "./annotationDefaults";
import { TOOL_DEFAULT_BUILDERS } from "./AnnotationAPIBridge";

describe("toPdfStandardFont (Issue #8709)", () => {
  it("resolves default/empty/null/undefined to Helvetica (never Courier)", () => {
    expect(toPdfStandardFont()).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont(null)).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont("")).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont("   ")).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont(undefined)).toBe(PdfStandardFont.Helvetica);
  });

  it("resolves string font names to expected numeric PdfStandardFont enums", () => {
    expect(toPdfStandardFont("Helvetica")).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont("helvetica")).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont("Arial")).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont("sans-serif")).toBe(PdfStandardFont.Helvetica);

    expect(toPdfStandardFont("Courier")).toBe(PdfStandardFont.Courier);
    expect(toPdfStandardFont("courier")).toBe(PdfStandardFont.Courier);
    expect(toPdfStandardFont("monospace")).toBe(PdfStandardFont.Courier);

    expect(toPdfStandardFont("Times-Roman")).toBe(PdfStandardFont.Times_Roman);
    expect(toPdfStandardFont("Times")).toBe(PdfStandardFont.Times_Roman);
    expect(toPdfStandardFont("Georgia")).toBe(PdfStandardFont.Times_Roman);
    expect(toPdfStandardFont("serif")).toBe(PdfStandardFont.Times_Roman);

    expect(toPdfStandardFont("Symbol")).toBe(PdfStandardFont.Symbol);
    expect(toPdfStandardFont("ZapfDingbats")).toBe(PdfStandardFont.ZapfDingbats);
  });

  it("handles bold and italic style variants", () => {
    expect(toPdfStandardFont("Helvetica-Bold")).toBe(PdfStandardFont.Helvetica_Bold);
    expect(toPdfStandardFont("Helvetica-Oblique")).toBe(PdfStandardFont.Helvetica_Oblique);
    expect(toPdfStandardFont("Helvetica-BoldOblique")).toBe(PdfStandardFont.Helvetica_BoldOblique);

    expect(toPdfStandardFont("Courier-Bold")).toBe(PdfStandardFont.Courier_Bold);
    expect(toPdfStandardFont("Courier-Oblique")).toBe(PdfStandardFont.Courier_Oblique);
    expect(toPdfStandardFont("Courier-BoldOblique")).toBe(PdfStandardFont.Courier_BoldOblique);

    expect(toPdfStandardFont("Times-Bold")).toBe(PdfStandardFont.Times_Bold);
    expect(toPdfStandardFont("Times-Italic")).toBe(PdfStandardFont.Times_Italic);
    expect(toPdfStandardFont("Times-BoldItalic")).toBe(PdfStandardFont.Times_BoldItalic);
  });

  it("preserves numeric PdfStandardFont enum values intact", () => {
    expect(toPdfStandardFont(PdfStandardFont.Helvetica)).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont(PdfStandardFont.Courier)).toBe(PdfStandardFont.Courier);
    expect(toPdfStandardFont(PdfStandardFont.Times_Roman)).toBe(PdfStandardFont.Times_Roman);
    expect(toPdfStandardFont(PdfStandardFont.Symbol)).toBe(PdfStandardFont.Symbol);
    expect(toPdfStandardFont(PdfStandardFont.ZapfDingbats)).toBe(PdfStandardFont.ZapfDingbats);
  });

  it("falls back to Helvetica when given unknown or invalid strings", () => {
    expect(toPdfStandardFont("Comic Sans MS")).toBe(PdfStandardFont.Helvetica);
    expect(toPdfStandardFont("UnknownCustomFont")).toBe(PdfStandardFont.Helvetica);
  });

  it("ensures TOOL_DEFAULT_BUILDERS builds FreeText with numeric PdfStandardFont", () => {
    const textDefaults = TOOL_DEFAULT_BUILDERS.text();
    expect(textDefaults).not.toBeNull();
    expect(textDefaults?.type).toBe(PdfAnnotationSubtype.FREETEXT);
    if (textDefaults && "fontFamily" in textDefaults) {
      expect(textDefaults.fontFamily).toBe(PdfStandardFont.Helvetica);
      expect(typeof textDefaults.fontFamily).toBe("number");
    }

    const noteDefaults = TOOL_DEFAULT_BUILDERS.note();
    expect(noteDefaults).not.toBeNull();
    expect(noteDefaults?.type).toBe(PdfAnnotationSubtype.FREETEXT);
    if (noteDefaults && "fontFamily" in noteDefaults) {
      expect(noteDefaults.fontFamily).toBe(PdfStandardFont.Helvetica);
      expect(typeof noteDefaults.fontFamily).toBe("number");
    }

    const customTextDefaults = TOOL_DEFAULT_BUILDERS.text({
      fontFamily: "Courier",
    });
    if (customTextDefaults && "fontFamily" in customTextDefaults) {
      expect(customTextDefaults.fontFamily).toBe(PdfStandardFont.Courier);
      expect(typeof customTextDefaults.fontFamily).toBe("number");
    }

    const timesTextDefaults = TOOL_DEFAULT_BUILDERS.text({
      fontFamily: "Times-Roman",
    });
    if (timesTextDefaults && "fontFamily" in timesTextDefaults) {
      expect(timesTextDefaults.fontFamily).toBe(PdfStandardFont.Times_Roman);
      expect(typeof timesTextDefaults.fontFamily).toBe("number");
    }
  });
});

