export const DOCUMENT_TITLES = [
  "INVOICE",
  "TAX_INVOICE",
  "RECEIPT",
  "QUOTATION",
  "ESTIMATE",
  "CREDIT_NOTE",
] as const;

export type DocumentTitle = (typeof DOCUMENT_TITLES)[number];