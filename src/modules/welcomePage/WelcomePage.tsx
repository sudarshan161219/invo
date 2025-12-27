import { useNavigate } from "react-router-dom";
import {
  FileText,
  Receipt,
  FileClock,
  Calculator,
  FileMinus,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import type { DocumentType } from "@/types/document_types/types";
import { useUnfinishedData } from "@/hooks/useUnfinishedData/useUnfinishedData";
import styles from "./index.module.css";
import { Button } from "@/components/button/Button";

const TYPE_TO_TITLE: Record<DocumentType, string> = {
  INVOICE: "INVOICE",
  TAX_INVOICE: "TAX INVOICE",
  QUOTATION: "QUOTATION",
  ESTIMATE: "ESTIMATE",
  RECEIPT: "RECEIPT",
  CREDIT_NOTE: "CREDIT NOTE",
};

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { form, clearAllData, updateDocumentDetails } = useDocumentStore();
  const { hasUnsavedWork, hasUserProfile } = useUnfinishedData();

  const handleContinue = () => {
    // 1. Strict check: Name is mandatory to skip the setup page
    const isProfileValid = Boolean(form.userDetails.contact.name?.trim());

    if (isProfileValid) {
      navigate("/create");
    } else {
      navigate("/user-details");
    }
  };

  const handleStartNew = (type: DocumentType) => {
    clearAllData();
    updateDocumentDetails({ documentType: type });
    updateDocumentDetails({ title: TYPE_TO_TITLE[type] });

    // Navigate to the next step
    navigate("/user-details");
  };

  const docTypes: { type: DocumentType; label: string; icon: LucideIcon }[] = [
    { type: "INVOICE", label: "Invoice", icon: FileText },
    { type: "TAX_INVOICE", label: "Tax Invoice", icon: ClipboardList },
    { type: "QUOTATION", label: "Quotation", icon: FileClock },
    { type: "RECEIPT", label: "Receipt", icon: Receipt },
    { type: "ESTIMATE", label: "Estimate", icon: Calculator },
    { type: "CREDIT_NOTE", label: "Credit Note", icon: FileMinus },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Invo Generator</h1>
        <p className={styles.subtitle}>
          Create professional Invoices, Quotes, and Receipts in seconds.
        </p>

        {hasUnsavedWork ? (
          <div className="flex flex-col gap-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-2 text-center">
              <p className="text-sm text-yellow-800 font-medium">
                Unsaved Progress Found
              </p>
              <p className="text-xs text-yellow-600">
                {hasUserProfile
                  ? "You have an active invoice."
                  : "You have unfinished details."}
              </p>
            </div>

            <Button onClick={handleContinue} className={styles.primaryBtn}>
              Continue {hasUserProfile ? "Editing" : "Setup"}
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink-0 mx-4 text-gray-400 text-xs uppercase">
                or start new
              </span>
              <div className="grow border-t border-gray-200"></div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-md">
          {docTypes.map((doc) => (
            <Button
              key={doc.type}
              size="md"
              onClick={() => handleStartNew(doc.type)}
              className="flex flex-col items-center justify-center gap-2"
            >
              <doc.icon size={24} className="text-gray-600" />
              <span className="text-sm font-medium">{doc.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
