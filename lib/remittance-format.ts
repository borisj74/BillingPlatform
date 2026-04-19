/** Shared remittance source labels for import / parsed prototype screens. */

export const REMITTANCE_FORMAT_OPTIONS = [
  { id: "pdf" as const, label: "PDF / Scanned" },
  { id: "edi" as const, label: "EDI 820" },
  { id: "csv" as const, label: "CSV / Excel" },
  { id: "email" as const, label: "Email body" },
  { id: "paste" as const, label: "Paste text" },
] as const;

export type RemittanceFormatId = (typeof REMITTANCE_FORMAT_OPTIONS)[number]["id"];

const FORMAT_IDS: RemittanceFormatId[] = ["pdf", "edi", "csv", "email", "paste"];

export function isRemittanceFormatId(value: string | null): value is RemittanceFormatId {
  return value != null && FORMAT_IDS.includes(value as RemittanceFormatId);
}

/** Detects active format from file name and optional pasted text (import screen). */
export function detectRemittanceFormatFromInput(
  fileName: string | null,
  paste: string,
): RemittanceFormatId | null {
  const p = paste.trim();
  if (p.length > 0) return "paste";
  if (!fileName) return null;
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".csv") || lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "csv";
  if (lower.endsWith(".edi") || lower.includes("820")) return "edi";
  if (lower.endsWith(".eml") || lower.endsWith(".msg")) return "email";
  return null;
}

/** Parsed screen: infer from filename when no `format` query. */
export function detectRemittanceFormatFromFileName(fileName: string): RemittanceFormatId {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".edi") || lower.endsWith(".x12")) return "edi";
  if (lower.endsWith(".csv") || lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "csv";
  if (lower.endsWith(".eml") || lower.endsWith(".msg")) return "email";
  return "csv";
}
