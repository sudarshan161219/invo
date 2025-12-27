import { DOCUMENT_LABELS } from "@/lib/documentConfig";
import type { DocumentType } from "@/types/document_types/types";

export function getDocumentContext(documentType: DocumentType) {
  const labels = DOCUMENT_LABELS[documentType] ?? DOCUMENT_LABELS.INVOICE;

  return {
    type: documentType,
    labels,
    isQuote: documentType === "QUOTATION" || documentType === "ESTIMATE",
    isReceipt: documentType === "RECEIPT",
    isCreditNote: documentType === "CREDIT_NOTE",
  };
}
