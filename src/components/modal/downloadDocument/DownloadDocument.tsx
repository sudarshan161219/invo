import { useDocumentInvoice } from "@/store/DownloadDocumentStore/useDocumentInvoice";
import {
  FileText,
  FileImage,
  Braces,
  Table,
  Printer,
  
} from "lucide-react"; // Added Loader2
import styles from "./index.module.css";
import { useExportInvoice } from "@/store/useExportInvoice/useExportInvoice";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { useDocumentRefStore } from "@/store/documentRefStore/useDocumentRefStore";
import { Button } from "@/components/button/Button";
import { toast } from "sonner";
import { useEffect } from "react";

export const DownloadDocument = () => {
  const { documentRef } = useDocumentRefStore();
  const { close } = useDocumentInvoice();
  const { form } = useDocumentStore();

  // Safety check: ensure ref object exists
  const safeRef = documentRef || { current: null };

  const {
    downloadPDF,
    downloadPNG,
    downloadJSON,
    downloadCSV,
    printInvoice,
    isExporting,
    exportError,
    successMessage,
    resetExportState,
  } = useExportInvoice(
    safeRef,
    `invoice-${form.documentDetails.documentNumber}`
  );

  // Handle Toasts (Success/Error)
  useEffect(() => {
    if (exportError) {
      toast.error(exportError);
      resetExportState();
    }
    if (successMessage) {
      toast.success(successMessage);
      resetExportState();
      // Optional: Close modal on success if you prefer
      // close();
    }
  }, [exportError, successMessage, resetExportState]);

  return (
    <div className={styles.container}>
      {/* Click outside to close (disabled while exporting) */}
      <div
        className={styles.bg}
        onClick={isExporting ? undefined : close}
      ></div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Download Invoice</h2>
          {isExporting && <span className={styles.status}>Processing...</span>}
        </div>

        <div className={styles.grid}>
          {/* PDF BUTTON */}
          <Button
            size="md"
            disabled={isExporting} // 1. Disable button
            onClick={() => downloadPDF()}
            className={styles.btn}
          >
            {/* 2. Show spinner if busy, else show icon */}
            <FileText size={18} />
            <span>PDF</span>
          </Button>

          {/* PNG BUTTON */}
          <Button
            size="md"
            disabled={isExporting}
            onClick={() => downloadPNG()}
            className={styles.btn}
          >
            <FileImage size={18} />
            <span>PNG</span>
          </Button>

          {/* JSON BUTTON */}
          <Button
            size="md"
            disabled={isExporting}
            onClick={() => downloadJSON(form)}
            className={styles.btn}
          >
            <Braces size={18} />
            <span>JSON</span>
          </Button>

          {/* CSV BUTTON */}
          <Button
            size="md"
            disabled={isExporting}
            onClick={() =>
              downloadCSV([
                ["Description", "Qty", "Rate", "Amount"],
                ...form.items.map((i) => [
                  i.description || "",
                  String(i.quantity),
                  String(i.rate),
                  String(i.amount),
                ]),
              ])
            }
            className={styles.btn}
          >
            <Table size={18} />
            <span>CSV</span>
          </Button>

          {/* PRINT BUTTON */}
          <Button
            size="md"
            disabled={isExporting}
            onClick={() => printInvoice()}
            className={styles.btn}
          >
            <Printer size={18} />
            <span>Print</span>
          </Button>
        </div>

        <Button
          size="md"
          variant="outline"
          disabled={isExporting}
          onClick={close}
          className={styles.closeBtn}
        >
          Close
        </Button>
      </div>
    </div>
  );
};
