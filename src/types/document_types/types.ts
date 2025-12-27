// ----------------------------------------------------
// BRAND ASSETS (Logo / Signature)
// ----------------------------------------------------
export interface BrandAsset {
  dataUrl: string;
  filename?: string;
  type?: string; // mime type OR method
}

export type SignatureType = "draw" | "upload" | "typed";

export interface TypedSignatureData {
  text: string;
  font: string;
  color: string;
}

export interface SignatureData extends BrandAsset {
  type: SignatureType;
  typedData?: TypedSignatureData; // only when type === "typed"
}

// ----------------------------------------------------
// DOCUMENT ITEM (Was InvoiceItem)
// ----------------------------------------------------
export interface DocumentItem {
  id: string; // useful for React lists
  description: string;
  quantity: number;
  rate: number;
  amount: number; // computed automatically
}

// ----------------------------------------------------
// CURRENCY
// ----------------------------------------------------
export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD";

// ----------------------------------------------------
// PAYMENT METHODS
// ----------------------------------------------------
export type PaymentMethodType =
  | "bank"
  | "upi"
  | "paypal"
  | "cashapp"
  | "custom";

export type DocumentType =
  | "INVOICE"
  | "TAX_INVOICE"
  | "QUOTATION"
  | "ESTIMATE"
  | "RECEIPT"
  | "CREDIT_NOTE";

export type DiscountType = "amount" | "percentage";

export interface DocumentLabels {
  numberLabel: string;
  dateLabel: string;
  dueLabel: string;
  totalLabel: string;

  fromLabel: string; // e.g. "Sold By", "From"
  toLabel: string; // e.g. "Bill To", "Prepared For"
  shipLabel?: string; // Optional, e.g. "Ship To", "Site Location"
}

// ----------------------------------------------------
// PAYMENT DETAILS (For User/Issuer)
// ----------------------------------------------------

export interface PaymentMethods {
  type: PaymentMethodType;

  // COMMON
  label?: string; // e.g. "PayPal", "UPI", "HDFC Bank"

  // BANK
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  bankCode?: string; // IFSC / SWIFT / Routing / Sort Code

  // UPI
  upiId?: string; // yourname@bank

  // PayPal
  paypalEmail?: string;

  // Cash App
  cashTag?: string; // $username

  // For extra easy support
  customValue?: string; // can store link
}

// ----------------------------------------------------
// ADDRESS (Reusable)
// ----------------------------------------------------
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

// ----------------------------------------------------
// SHIPPING DETAILS (Ship To)
// ----------------------------------------------------
export interface ShippingDetails {
  name?: string;
  address: Address;
}

// ----------------------------------------------------
// USER DETAILS (Person Issuing the Document)
// ----------------------------------------------------

export interface UserDetails {
  // --------------------------------------------------
  // ISSUER MODE
  // --------------------------------------------------
  issuerType: "individual" | "business";

  // --------------------------------------------------
  // CONTACT
  // --------------------------------------------------
  contact: {
    name: string; // Person name OR business contact person
    email: string;
    phone?: string;
  };

  // --------------------------------------------------
  // ADDRESS
  // --------------------------------------------------
  address: Address;

  // --------------------------------------------------
  // BUSINESS (ONLY WHEN issuerType === "business")
  // --------------------------------------------------
  business?: {
    legalName: string;
    tradeName?: string;
    taxId?: string;
    taxIdLabel?: string;
  };

  // --------------------------------------------------
  // BRANDING
  // --------------------------------------------------
  branding: {
    logo: BrandAsset | null;
    signature: SignatureData | null;
    logoEnabled: boolean;
    signatureEnabled: boolean;
    logoWidth: number;
  };

  // --------------------------------------------------
  // PAYMENTS
  // --------------------------------------------------
  paymentMethods: PaymentMethods[];
  paymentFooterText?: string;

  // --------------------------------------------------
  // PREFERENCES
  // --------------------------------------------------
  preferences?: {
    defaultDocumentTitle: string;
    defaultCurrency: Currency;
    defaultTerms: number;
    defaultNote?: string;
  };
}

// ----------------------------------------------------
// CLIENT DETAILS (Customer/Recipient)
// ----------------------------------------------------
export interface ClientDetails {
  id: number;
  name: string;
  companyName?: string;
  taxId?: string;
  taxIdLabel?: string;
  email: string;
  phone: string;
  address: Address;
  shippingAddress?: ShippingDetails;
}

// ----------------------------------------------------
// DOCUMENT META (Dates, Numbers, Titles)
// ----------------------------------------------------
export interface DocumentDetails {
  // Renamed from InvoiceDetails
  documentType: DocumentType;
  title: string;
  documentNumber: string;
  poNumber?: string;
  paymentMethod?: string;
  currency: Currency;
  issueDate: string;
  dueDate: string;
  dueDateManuallyEdited?: boolean;
  paymentTerms?: number;
  footerNote?: string;
}

// ----------------------------------------------------
// MAIN DOCUMENT INPUT (The Core State Object)
// ----------------------------------------------------
export interface DocumentInput {
  // Renamed from InvoiceInput
  // Renamed invoiceType -> issuerMode to avoid confusion with DocumentType
  issuerMode: "freelancer" | "business";

  userDetails: UserDetails;
  clientDetails: ClientDetails;

  // META
  // Renamed invoiceDetails -> documentDetails
  documentDetails: DocumentDetails;

  // LINE ITEMS
  // Renamed Type: InvoiceItem[] -> DocumentItem[]
  items: DocumentItem[];

  tax: number;
  taxType: "fixed" | "percentage"; // "fixed" usually means Flat Amount
  discount: number;
  discountType: "amount" | "percentage";

  // CONTEXT
  description?: string;

  // COMPUTED TOTALS
  subtotal?: number;
  taxAmount?: number; // Renamed from gst (Generic)
  total?: number;
}
