// lib/documentMetaUtils.ts
import type { DocumentType } from "@/types/document_types/types";

export const getDateLabels = (type: DocumentType) => {
  return {
    dateLabel1: type === "RECEIPT" ? "Payment Date" : "Issue Date",
    dateLabel2:
      type === "QUOTATION" || type === "ESTIMATE" ? "Valid Until" : "Due Date",
  };
};

export const getMetaVisibility = (type: DocumentType) => {
  return {
    showSecondDate: type !== "RECEIPT",
    showTerms: type !== "RECEIPT",
  };
};

export const getGridCols = (type: DocumentType, showSecondDate: boolean) => {
  if (type === "RECEIPT") {
    return showSecondDate ? "lg:grid-cols-3" : "lg:grid-cols-2";
  }
  return showSecondDate ? "lg:grid-cols-4" : "lg:grid-cols-3";
};
