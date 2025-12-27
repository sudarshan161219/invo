import React, { useEffect, useRef } from "react";
import styles from "./index.module.css";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { useDocumentRefStore } from "@/store/documentRefStore/useDocumentRefStore";
import { useDocumentInvoice } from "@/store/DownloadDocumentStore/useDocumentInvoice";
import { Totals } from "./Totals/Totals";
import { SignatureModal } from "@/components/modal/signatureModal/SignatureModal";
import { DownloadDocument } from "@/components/modal/downloadDocument/DownloadDocument";
import { useMediaQuery } from "@/hooks/useMediaQuery/useMediaQuery";
import { Button } from "@/components/button/Button";
import {
  ClientDetailsSection,
  MetaSection,
  ItemsTable,
  ShippingFieldsSection,
  MathFieldsSection,
  FooterNotesSection,
  BrandingOptionsSection,
  TemplatePreview,
} from "./export";

export const DocumentForm: React.FC = () => {
  const invoiceRef = useRef<HTMLElement | null>(null);
  const { setDocumentRef } = useDocumentRefStore();
  const { signatureModal } = useDocumentStore();
  const { isOpen, open } = useDocumentInvoice();
  const isDesktop = useMediaQuery("(min-width: 800px)");
  useEffect(() => {
    setDocumentRef(invoiceRef);
  }, [setDocumentRef]);

  return (
    <div className="relative">
      <form className={styles.form}>
        <ClientDetailsSection />

        <ShippingFieldsSection />

        <MetaSection />

        <ItemsTable />

        <MathFieldsSection />

        <FooterNotesSection />

        <BrandingOptionsSection />

        <Totals />

        <Button type="button" onClick={open} className={styles.submitBtn}>
          Download
        </Button>

        {signatureModal && <SignatureModal />}
        {isOpen && <DownloadDocument />}
      </form>

      {!isDesktop && <TemplatePreview ref={invoiceRef} />}
    </div>
  );
};
