import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type {
  DocumentInput,
  UserDetails,
  BrandAsset,
  SignatureData,
  DocumentDetails,
  ClientDetails,
  DocumentItem,
  Currency,
  Address,
  ShippingDetails,
  DocumentType,
} from "@/types/document_types/types";

// ------------------------------------------------------------------
// CONFIG & DEFAULTS
// ------------------------------------------------------------------
const DEFAULT_CURRENCY: Currency = "USD";
const DEFAULT_TITLE = "INVOICE";
const DEFAULT_TERMS = 7;

interface DocumentState {
  // STATE
  form: DocumentInput;
  roundOff: boolean;
  modal: boolean;
  shipToDiffrentAddress: boolean;
  signatureModal: boolean;
  lastDocumentNumber?: string; // Renamed from lastInvoiceNumber

  // ACTIONS
  generateNewDocumentNumber: () => void; // Renamed
  setIssuerType: (type: "freelancer" | "business") => void; // Renamed from setInvoiceType for clarity
  setDocumentType: (type: DocumentType) => void;

  // FORM UPDATES
  updateForm: <K extends keyof DocumentInput>(
    key: K,
    value: DocumentInput[K]
  ) => void;

  // SPECIFIC SECTION UPDATES
  updateDocumentDetails: (patch: Partial<DocumentDetails>) => void; // Renamed
  updateClientDetails: (patch: Partial<ClientDetails>) => void;
  updateClientAddress: (patch: Partial<Address>) => void;
  updateClientShippingAddress: (patch: Partial<Address>) => void;
  updateClientShippingName: (name: string) => void;

  // USER UPDATES
  updateUserDetails: (patch: Partial<UserDetails>) => void;
  updateUserContact: (patch: Partial<UserDetails["contact"]>) => void;
  updateUserBusiness: (patch: Partial<UserDetails["business"]>) => void;
  updateUserAddress: (patch: Partial<Address>) => void;

  // BRANDING
  setUserLogo: (data: BrandAsset | null) => void;
  setUserSignature: (data: SignatureData | null) => void;
  setUserLogoEnabled: (enabled: boolean) => void;
  setUserSignatureEnabled: (enabled: boolean) => void;

  // ITEMS
  addItem: () => void;
  updateItem: (id: string, patch: Partial<DocumentItem>) => void;
  deleteItem: (id: string) => void;

  // COMPUTATIONS
  getTotals: () => {
    subtotal: number;
    gst: number;
    discountAmount: number;
    taxableAmount: number;
    total: number;
  };

  getFormattedTotals: () => {
    subtotal: string;
    gst: string;
    discount: string;
    total: string;
  };

  // UI STATE
  openModal: () => void;
  closeModal: () => void;
  shipToDiffrentAddressToggle: () => void;
  openSignatureModal: () => void;
  closeSignatureModal: () => void;
  resetDocumentForm: () => void; // Renamed
  clearAllData: () => void;
}

/* -------------------------------------------------------
   DEFAULTS
-------------------------------------------------------- */
const defaultUserDetails = (): UserDetails => ({
  issuerType: "individual",
  contact: { name: "", email: "", phone: "" },
  address: { line1: "", city: "", state: "", postalCode: "", country: "" },
  business: undefined,
  branding: {
    logo: null,
    signature: null,
    logoEnabled: false,
    signatureEnabled: false,
    logoWidth: 120,
  },
  paymentMethods: [],
  preferences: {
    defaultCurrency: DEFAULT_CURRENCY,
    defaultDocumentTitle: DEFAULT_TITLE,
    defaultTerms: DEFAULT_TERMS,
    defaultNote: "",
  },
});

const defaultClientDetails = (): ClientDetails => ({
  id: 0,
  name: "",
  companyName: "",
  email: "",
  phone: "",
  address: { line1: "", city: "", state: "", postalCode: "", country: "" },
});

// Renamed: defaultInvoiceDetails -> defaultDocumentDetails
const defaultDocumentDetails = (
  type: DocumentType = "INVOICE"
): DocumentDetails => {
  const now = new Date();
  const issueDate = now.toISOString();

  // 1. Determine Terms
  const isImmediate = type === "RECEIPT" || type === "CREDIT_NOTE";
  const terms = isImmediate ? 0 : DEFAULT_TERMS;

  // 2. Calculate Due Date
  const dueDateObj = new Date(now);
  dueDateObj.setDate(dueDateObj.getDate() + terms);
  const dueDate = dueDateObj.toISOString();
  const dueDateManuallyEdited = false;

  // 3. Smart Title
  const title = type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // 4. Prefix Helper
  const getPrefix = (t: DocumentType) => {
    switch (t) {
      case "QUOTATION":
        return "QT-";
      case "ESTIMATE":
        return "EST-";
      case "RECEIPT":
        return "RCPT-";
      case "CREDIT_NOTE":
        return "CN-";
      default:
        return "INV-";
    }
  };

  return {
    documentType: type,
    title: title === "Invoice" ? "Invoice" : title,
    documentNumber: `${getPrefix(type)}001`,
    currency: DEFAULT_CURRENCY,
    issueDate: issueDate,
    dueDate: dueDate,
    dueDateManuallyEdited: dueDateManuallyEdited,
    paymentTerms: terms,
    footerNote:
      type === "QUOTATION"
        ? "Valid for 14 days"
        : "Thank you for your business!",
  };
};

const defaultItem = (): DocumentItem => ({
  id: uuid(),
  description: "",
  quantity: 1,
  rate: 0,
  amount: 0,
});

// Renamed: defaultInvoiceInput -> defaultDocumentInput
const defaultDocumentInput = (): DocumentInput => ({
  issuerMode: "freelancer",
  userDetails: defaultUserDetails(),
  clientDetails: defaultClientDetails(),
  documentDetails: defaultDocumentDetails(),
  items: [defaultItem()],
  tax: 0,
  taxType: "percentage",
  discount: 0,
  discountType: "amount",
  description: "",
});

// Renamed: generateInvoiceNumber -> generateNextNumber
const generateNextNumber = (last?: string) => {
  if (!last) return "INV-0001";
  const match = last.match(/(\d+)$/);
  if (match) {
    const num = parseInt(match[0], 10) + 1;
    const prefix = last.replace(/(\d+)$/, "");
    return `${prefix}${String(num).padStart(match[0].length, "0")}`;
  }
  return "INV-0001";
};

/* -------------------------------------------------------
   STORE IMPLEMENTATION
-------------------------------------------------------- */
// Renamed hook to useDocumentStore
export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      form: defaultDocumentInput(),
      roundOff: true,
      modal: false,
      shipToDiffrentAddress: false,
      signatureModal: false,
      lastDocumentNumber: undefined,

      /* --- TOGGLE FREELANCER / BUSINESS --- */
      // Renamed to setIssuerType for clarity
      setIssuerType: (type) =>
        set((state) => {
          const existingBusinessData = state.form.userDetails.business;
          let nextBusinessData = existingBusinessData;
          if (type === "business" && !nextBusinessData) {
            nextBusinessData = {
              legalName: "",
              taxId: "",
              taxIdLabel: "Tax ID",
            };
          }
          return {
            form: {
              ...state.form,
              invoiceType: type,
              userDetails: {
                ...state.form.userDetails,
                issuerType: type === "business" ? "business" : "individual",
                business: nextBusinessData,
              },
            },
          };
        }),

      /* --- SWITCH DOCUMENT TYPE (Invoice / Quote / Receipt) --- */
      setDocumentType: (type: DocumentType) =>
        set((state) => {
          const newDefaults = defaultDocumentDetails(type);
          return {
            form: {
              ...state.form,
              documentDetails: {
                ...state.form.documentDetails,
                ...newDefaults,
              },
            },
          };
        }),

      /* --- GENERATE NUMBER --- */
      generateNewDocumentNumber: () =>
        set((state) => {
          const newNo = generateNextNumber(state.lastDocumentNumber);
          return {
            lastDocumentNumber: newNo,
            form: {
              ...state.form,
              documentDetails: {
                ...state.form.documentDetails,
                invoiceNumber: newNo,
              },
            },
          };
        }),

      updateForm: (key, value) =>
        set((state) => ({ form: { ...state.form, [key]: value } })),

      // Renamed from updateInvoiceDetails
      updateDocumentDetails: (patch) => {
        set((state) => ({
          form: {
            ...state.form,
            documentDetails: { ...state.form.documentDetails, ...patch },
          },
        }));
      },

      updateClientDetails: (patch) =>
        set((state) => ({
          form: {
            ...state.form,
            clientDetails: { ...state.form.clientDetails, ...patch },
          },
        })),

      updateUserDetails: (patch) =>
        set((state) => ({
          form: {
            ...state.form,
            userDetails: { ...state.form.userDetails, ...patch },
          },
        })),

      updateUserContact: (patch) =>
        set((state) => ({
          form: {
            ...state.form,
            userDetails: {
              ...state.form.userDetails,
              contact: { ...state.form.userDetails.contact, ...patch },
            },
          },
        })),

      updateUserBusiness: (patch) =>
        set((state) => ({
          form: {
            ...state.form,
            userDetails: {
              ...state.form.userDetails,
              business: { ...state.form.userDetails.business!, ...patch },
            },
          },
        })),

      updateUserAddress: (patch) =>
        set((state) => ({
          form: {
            ...state.form,
            userDetails: {
              ...state.form.userDetails,
              address: { ...state.form.userDetails.address, ...patch },
            },
          },
        })),

      updateClientAddress: (patch) =>
        set((state) => {
          const currentAddress = state.form.clientDetails.address;
          const newAddress = { ...currentAddress, ...patch };

          const clientDetailsUpdates: Partial<ClientDetails> = {
            address: newAddress,
          };

          if (state.shipToDiffrentAddress) {
            const currentShipping = state.form.clientDetails
              .shippingAddress || {
              name: state.form.clientDetails.name,
              address: currentAddress,
            };

            clientDetailsUpdates.shippingAddress = {
              ...currentShipping,
              address: newAddress,
            };
          }

          return {
            form: {
              ...state.form,
              clientDetails: {
                ...state.form.clientDetails,
                ...clientDetailsUpdates,
              },
            },
          };
        }),

      updateClientShippingAddress: (patch) =>
        set((state) => {
          const prevShipping =
            state.form.clientDetails.shippingAddress ??
            ({
              name: "",
              address: {
                line1: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
              },
            } as ShippingDetails);

          return {
            form: {
              ...state.form,
              clientDetails: {
                ...state.form.clientDetails,
                shippingAddress: {
                  ...prevShipping,
                  address: { ...prevShipping.address, ...patch },
                },
              },
            },
          };
        }),

      updateClientShippingName: (name: string) =>
        set((state) => {
          const prev =
            state.form.clientDetails.shippingAddress ??
            ({
              name: "",
              address: {
                line1: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
              },
            } as ShippingDetails);

          return {
            form: {
              ...state.form,
              clientDetails: {
                ...state.form.clientDetails,
                shippingAddress: { ...prev, name },
              },
            },
          };
        }),

      /* --- BRANDING --- */
      setUserLogo: (data) =>
        set((state) => ({
          form: {
            ...state.form,
            userDetails: {
              ...state.form.userDetails,
              branding: { ...state.form.userDetails.branding, logo: data },
            },
          },
        })),

      setUserSignature: (data) =>
        set((state) => ({
          form: {
            ...state.form,
            userDetails: {
              ...state.form.userDetails,
              branding: { ...state.form.userDetails.branding, signature: data },
            },
          },
        })),

      setUserLogoEnabled: (enabled) =>
        set((state) => ({
          form: {
            ...state.form,
            userDetails: {
              ...state.form.userDetails,
              branding: {
                ...state.form.userDetails.branding,
                logoEnabled: enabled,
              },
            },
          },
        })),

      setUserSignatureEnabled: (enabled) =>
        set((state) => ({
          form: {
            ...state.form,
            userDetails: {
              ...state.form.userDetails,
              branding: {
                ...state.form.userDetails.branding,
                signatureEnabled: enabled,
              },
            },
          },
        })),

      /* --- ITEMS --- */
      addItem: () =>
        set((state) => ({
          form: { ...state.form, items: [...state.form.items, defaultItem()] },
        })),

      updateItem: (id, patch) =>
        set((state) => ({
          form: {
            ...state.form,
            items: state.form.items.map((it) => {
              if (it.id !== id) return it;
              const newItem = { ...it, ...patch };
              const rate = Number(newItem.rate) || 0;
              const qty = Number(newItem.quantity) || 0;
              if (patch.amount === undefined) {
                newItem.amount = rate * qty;
              }
              return newItem;
            }),
          },
        })),

      deleteItem: (id) =>
        set((state) => ({
          form: {
            ...state.form,
            items: state.form.items.filter((it) => it.id !== id),
          },
        })),

      /* --- MATH --- */
      getTotals: () => {
        const { items, tax, discount, discountType, taxType } = get().form;
        const round = (num: number) => Math.round(num * 100) / 100;

        const subtotal = items.reduce(
          (sum, item) => sum + item.quantity * item.rate,
          0
        );

        let discountAmount = 0;
        const discountValue = parseFloat(String(discount)) || 0;

        if (discountType === "percentage") {
          discountAmount = (subtotal * discountValue) / 100;
        } else {
          discountAmount = discountValue;
        }

        discountAmount = Math.min(discountAmount, subtotal);
        const taxableAmount = Math.max(0, subtotal - discountAmount);

        let gst = 0;
        const taxValue = parseFloat(String(tax)) || 0;

        if (taxType === "percentage") {
          gst = (taxableAmount * taxValue) / 100;
        } else {
          gst = taxValue;
        }

        const total = taxableAmount + gst;

        return {
          subtotal: round(subtotal),
          gst: round(gst),
          taxableAmount: round(taxableAmount),
          discountAmount: round(discountAmount),
          total: get().roundOff ? Math.round(total) : round(total),
        };
      },

      getFormattedTotals: () => {
        const raw = get().getTotals();
        const currency = get().form.documentDetails.currency;
        const locale = currency === "INR" ? "en-IN" : "en-US";

        const format = (x: number) =>
          new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(x);

        return {
          subtotal: format(raw.subtotal),
          gst: format(raw.gst),
          discount: format(raw.discountAmount),
          total: format(raw.total),
        };
      },

      /* --- MODALS --- */
      openModal: () => set({ modal: true }),
      closeModal: () => set({ modal: false }),
      openSignatureModal: () => set({ signatureModal: true }),
      closeSignatureModal: () => set({ signatureModal: false }),
      shipToDiffrentAddressToggle: () =>
        set((state) => ({
          shipToDiffrentAddress: !state.shipToDiffrentAddress,
        })),

      /* --- RESET --- */
      resetDocumentForm: () => {
        const state = get();
        const currentUser = state.form.userDetails;
        const newNo = generateNextNumber(state.lastDocumentNumber);

        // Preserve current document type so we don't switch from Quote back to Invoice on reset
        const currentDocType = state.form.documentDetails.documentType;
        const smartDefaults = defaultDocumentDetails(currentDocType);

        set({
          lastDocumentNumber: newNo,
          form: {
            ...defaultDocumentInput(),
            issuerMode: state.form.issuerMode, // Keep freelancer/business preference
            userDetails: currentUser,
            documentDetails: {
              ...smartDefaults,
              documentNumber: newNo,
            },
          },
        });
      },

      clearAllData: () => {
        set({
          lastDocumentNumber: undefined,
          form: defaultDocumentInput(),
        });
      },
    }),
    {
      name: "document-store", // Updated storage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
