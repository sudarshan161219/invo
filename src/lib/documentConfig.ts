import type { DocumentType } from "@/types/document_types/types";

// 1. Update the Interface
export interface DocumentLabels {
  numberLabel: string;
  dateLabel: string;
  dueLabel: string;
  totalLabel: string;
  termLabel: string; // <--- ADDED THIS

  fromLabel: string;
  toLabel: string;
  shipLabel?: string;
}

// 2. Update the Constant
export const DOCUMENT_LABELS: Record<DocumentType, DocumentLabels> = {
  INVOICE: {
    // Headers
    fromLabel: "From",
    toLabel: "Bill To",
    shipLabel: "Ship To",
    // Meta
    numberLabel: "Invoice No",
    dateLabel: "Issue Date",
    dueLabel: "Due Date",
    termLabel: "Payment Terms", // e.g. "Net 30"
    totalLabel: "Total Due",
  },
  TAX_INVOICE: {
    // Headers
    fromLabel: "Sold By",
    toLabel: "Billed To",
    shipLabel: "Ship To",
    // Meta
    numberLabel: "Tax Invoice No",
    dateLabel: "Issue Date",
    dueLabel: "Due Date",
    termLabel: "Payment Terms",
    totalLabel: "Total (Inc. Tax)",
  },
  RECEIPT: {
    // Headers
    fromLabel: "Issued By",
    toLabel: "Received From",
    shipLabel: undefined,
    // Meta
    numberLabel: "Receipt No",
    dateLabel: "Receipt Date",
    dueLabel: "Payment Date",
    termLabel: "Payment Mode", // Receipts don't have "Terms", they have "Mode" (Cash, Card)
    totalLabel: "Amount Paid",
  },
  QUOTATION: {
    // Headers
    fromLabel: "Proposed By",
    toLabel: "Prepared For",
    shipLabel: "Site Location",
    // Meta
    numberLabel: "Quote No",
    dateLabel: "Quote Date",
    dueLabel: "Valid Until",
    termLabel: "Valid For", // Quotes have a validity period, not payment terms yet
    totalLabel: "Estimated Total",
  },
  ESTIMATE: {
    // Headers
    fromLabel: "Estimated By",
    toLabel: "Estimate For",
    shipLabel: "Site Location",
    // Meta
    numberLabel: "Estimate No",
    dateLabel: "Date",
    dueLabel: "Valid Until",
    termLabel: "Validity (Days)",
    totalLabel: "Estimate",
  },
  CREDIT_NOTE: {
    // Headers
    fromLabel: "Issued By",
    toLabel: "Credited To",
    shipLabel: undefined,
    // Meta
    numberLabel: "Credit Note No",
    dateLabel: "Date",
    dueLabel: "Ref Invoice",
    termLabel: "Terms",
    totalLabel: "Credit Amount",
  },
};
