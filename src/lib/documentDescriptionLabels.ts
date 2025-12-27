import type { DocumentType } from "@/types/document_types/types";

export const DOCUMENT_DESCRIPTION_LABEL: Record<DocumentType, string> = {
  INVOICE: "Description",
  TAX_INVOICE: "Description",
  QUOTATION: "Project Overview",
  ESTIMATE: "Project Overview",
  RECEIPT: "Notes",
  CREDIT_NOTE: "Reason",
};
