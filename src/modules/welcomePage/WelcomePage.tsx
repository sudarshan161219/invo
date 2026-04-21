import { useNavigate } from "react-router-dom";
import {
  FileText,
  Receipt,
  FileClock,
  Calculator,
  FileMinus,
  ClipboardList,
  ArrowRight,
  History,
  Sparkles,
  Twitter,
  Coffee,
  ShieldCheck,
  Download,
  Palette,
  Info,
  type LucideIcon,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import type { DocumentType } from "@/types/document_types/types";
import { useUnfinishedData } from "@/hooks/useUnfinishedData/useUnfinishedData";
import styles from "./index.module.css";

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
    const isProfileValid = Boolean(form.userDetails.contact.name?.trim());
    navigate(isProfileValid ? "/create" : "/user-details");
  };

  const handleStartNew = (type: DocumentType) => {
    // 1. Data Loss Warning Logic
    if (hasUnsavedWork) {
      const confirm = window.confirm(
        "You have an unfinished document. Starting a new one will replace it. Are you sure?",
      );
      if (!confirm) return;
    }

    clearAllData();
    updateDocumentDetails({ documentType: type });
    updateDocumentDetails({ title: TYPE_TO_TITLE[type] });
    navigate("/user-details");
  };

  const docTypes: {
    type: DocumentType;
    label: string;
    desc: string;
    icon: LucideIcon;
    styleClass: string;
  }[] = [
    {
      type: "INVOICE",
      label: "Invoice",
      desc: "Bill your clients",
      icon: FileText,
      styleClass: styles.invoiceIcon,
    },
    {
      type: "TAX_INVOICE",
      label: "Tax Invoice",
      desc: "For tax compliance",
      icon: ClipboardList,
      styleClass: styles.taxIcon,
    },
    {
      type: "QUOTATION",
      label: "Quotation",
      desc: "Propose a price",
      icon: FileClock,
      styleClass: styles.quoteIcon,
    },
    {
      type: "ESTIMATE",
      label: "Estimate",
      desc: "Approximate costs",
      icon: Calculator,
      styleClass: styles.estimateIcon,
    },
    {
      type: "RECEIPT",
      label: "Receipt",
      desc: "Proof of payment",
      icon: Receipt,
      styleClass: styles.receiptIcon,
    },
    {
      type: "CREDIT_NOTE",
      label: "Credit Note",
      desc: "Process refunds",
      icon: FileMinus,
      styleClass: styles.creditIcon,
    },
  ];

  return (
    <div className={styles.wrapper}>
      {/* --- Header / Nav --- */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Invo</span>

          <a
            href="https://forg.to/products/invo"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://forg.to/badges/badge-2-dark.svg"
              alt="Featured on Forg"
              width="170"
              height="48"
            />
          </a>
        </div>
      </nav>
      <div className={styles.container}>
        {/* --- Hero Section --- */}
        <div className={styles.hero}>
          <div className={styles.badge}>
            <Sparkles size={14} className="text-yellow-500" />
            <span>Free Invoice Generator</span>
          </div>
          <h1 className={styles.title}>
            Get paid faster,{" "}
            <span className={styles.highlight}>look professional.</span>
          </h1>
          <p className={styles.subtitle}>
            Create unlimited invoices, receipts, and quotes.
            <br className="hidden md:block" />
            <strong>100% Private</strong> (Local Storage) with PDF Export.
          </p>

          {/* --- Feature Pills (More Details) --- */}
          <div className={styles.featureRow}>
            <div className={styles.featureItem}>
              <ShieldCheck size={15} className="text-emerald-500" />
              <span>No Login Needed</span>
            </div>
            <div className={styles.featureItem}>
              <Download size={15} className="text-blue-500" />
              <span>PDF Export</span>
            </div>
            <div className={styles.featureItem}>
              <Palette size={15} className="text-purple-500" />
              <span>Add Your Logo</span>
            </div>
            <div className={styles.featureItem}>
              <Calculator size={15} className="text-orange-500" />
              <span>Auto-Tax Calc</span>
            </div>
          </div>
        </div>

        {/* --- Data Loss Warning / Info Box --- */}
        <div className={styles.infoBox}>
          <Info size={18} className={styles.infoIcon} />
          <p className={styles.infoText}>
            <strong>Privacy Note:</strong> Your data is saved locally in this
            browser. Always <strong>Export PDF</strong> to keep a permanent copy
            before clearing your cache.
          </p>
        </div>

        {/* --- Resume Card (Conditional) --- */}
        {hasUnsavedWork && (
          <div className={styles.resumeWrapper}>
            <div className={styles.resumeCard}>
              <div className={styles.resumeAccent}></div>
              <div className={styles.resumeContent}>
                <div className={styles.resumeIconBox}>
                  <History size={20} />
                </div>
                <div className={styles.resumeText}>
                  <h3>Unsaved Draft</h3>
                  <p>
                    {hasUserProfile
                      ? "Continue editing your file"
                      : "Finish setting up details"}
                  </p>
                </div>
              </div>
              <button onClick={handleContinue} className={styles.resumeButton}>
                Resume <ArrowRight size={16} />
              </button>
            </div>

            {/* Visual Separator */}
            <div className={styles.separator}>
              <div className={styles.line}></div>
              <span className={styles.separatorText}>Or Start New</span>
              <div className={styles.line}></div>
            </div>
          </div>
        )}

        {/* --- Document Grid --- */}
        <div className={styles.grid}>
          {docTypes.map((doc) => (
            <button
              key={doc.type}
              onClick={() => handleStartNew(doc.type)}
              className={styles.card}
            >
              <div className={`${styles.iconWrapper} ${doc.styleClass}`}>
                <doc.icon size={24} />
              </div>
              <span className={styles.cardLabel}>{doc.label}</span>
              <span className={styles.cardDesc}>{doc.desc}</span>
            </button>
          ))}
        </div>

        {/* --- Footer --- */}
        <footer className={styles.footer}>
          <a
            href="https://x.com/buildwithSud"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <Twitter size={16} />
            <span>@buildwithSud</span>
          </a>
          <a
            href="https://buymeacoffee.com/sudarshanhosalli"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <Coffee size={16} />
            <span>Buy me a coffee</span>
          </a>
        </footer>
      </div>
    </div>
  );
};
