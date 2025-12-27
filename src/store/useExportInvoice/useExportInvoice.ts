// import { useCallback } from "react";
// import { toPng } from "html-to-image";
// import jsPDF from "jspdf";

// type UseExportInvoiceReturn = {
//   downloadPDF: (filename?: string) => Promise<void>;
//   downloadPNG: (filename?: string) => Promise<void>;
//   downloadJSON: (data: unknown, filename?: string) => void;
//   downloadCSV: (rows: string[][], filename?: string) => void;
//   printInvoice: () => void;
// };

// export function useExportInvoice(
//   invoiceRef: React.RefObject<HTMLElement | null>,
//   defaultFilename = "invoice"
// ): UseExportInvoiceReturn {
//   // ---------------- PNG (html-to-image) ----------------
//   const downloadPNG = useCallback(
//     async (filename = `${defaultFilename}.png`) => {
//       const node = invoiceRef.current;
//       if (!node) return;

//       try {
//         const dataUrl = await toPng(node, {
//           cacheBust: true,
//           quality: 1,
//           pixelRatio: 2, // High resolution
//         });

//         const link = document.createElement("a");
//         link.href = dataUrl;
//         link.download = filename;
//         link.click();
//       } catch (err) {
//         console.error("PNG export failed:", err);
//       }
//     },
//     [invoiceRef, defaultFilename]
//   );

//   // ---------------- PDF (html-to-image + jsPDF) ----------------
//   const downloadPDF = useCallback(
//     async (filename = `${defaultFilename}.pdf`) => {
//       const node = invoiceRef.current;
//       if (!node) return;

//       try {
//         const dataUrl = await toPng(node, {
//           cacheBust: true,
//           pixelRatio: 2,
//         });

//         const pdf = new jsPDF({
//           orientation: "portrait",
//           unit: "mm",
//           format: "a4",
//         });

//         // A4 size
//         const width = 210;
//         const height = 297;

//         pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
//         pdf.save(filename);
//       } catch (err) {
//         console.error("PDF export failed:", err);
//       }
//     },
//     [invoiceRef, defaultFilename]
//   );

//   // ---------------- JSON ----------------
//   const downloadJSON = useCallback(
//     (data: unknown, filename = `${defaultFilename}.json`) => {
//       const blob = new Blob([JSON.stringify(data, null, 2)], {
//         type: "application/json",
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       a.click();
//       URL.revokeObjectURL(url);
//     },
//     [defaultFilename]
//   );

//   // ---------------- CSV ----------------
//   const downloadCSV = useCallback(
//     (rows: string[][], filename = `${defaultFilename}.csv`) => {
//       const csv = rows
//         .map((r) =>
//           r
//             .map((cell) => {
//               const s = String(cell ?? "");
//               return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
//             })
//             .join(",")
//         )
//         .join("\n");

//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       a.click();
//       URL.revokeObjectURL(url);
//     },
//     [defaultFilename]
//   );

//   // ---------------- PRINT ----------------
//   // const printInvoice = useCallback(() => {
//   //   const el = invoiceRef.current;
//   //   if (!el) return;

//   //   const printWindow = window.open("", "_blank", "noopener,noreferrer");
//   //   if (!printWindow) return;

//   //   const doc = printWindow.document;

//   //   // Copy styles
//   //   const styles = Array.from(document.styleSheets)
//   //     .map((s) => {
//   //       try {
//   //         return Array.from(s.cssRules)
//   //           .map((r) => r.cssText)
//   //           .join("\n");
//   //       } catch {
//   //         return ""; // ignore CORS sheets
//   //       }
//   //     })
//   //     .join("\n");

//   //   doc.head.innerHTML = `<style>${styles}</style>`;

//   //   const clone = el.cloneNode(true) as HTMLElement;
//   //   doc.body.appendChild(clone);

//   //   setTimeout(() => {
//   //     printWindow.print();
//   //     printWindow.close();
//   //   }, 250);
//   // }, [invoiceRef]);

//   const printInvoice = useCallback(() => {
//     const el = invoiceRef.current;
//     if (!el) return;

//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     // Clone invoice
//     const clone = el.cloneNode(true) as HTMLElement;

//     // Capture styles
//     const styles = Array.from(document.styleSheets)
//       .map((sheet) => {
//         try {
//           return Array.from(sheet.cssRules)
//             .map((rule) => rule.cssText)
//             .join("\n");
//         } catch {
//           return "";
//         }
//       })
//       .join("\n");

//     // Write FULL HTML instantly (important!)
//     printWindow.document.open();
//     printWindow.document.write(`
//     <html>
//       <head>
//         <title>Invoice</title>
//         <style>${styles}</style>
//       </head>
//       <body>${clone.outerHTML}</body>
//     </html>
//   `);
//     printWindow.document.close();

//     // Wait for layout + print
//     printWindow.onload = () => {
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     };
//   }, [invoiceRef]);

//   return { downloadPDF, downloadPNG, downloadJSON, downloadCSV, printInvoice };
// }

import { useCallback, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

type UseExportInvoiceReturn = {
  // Actions
  downloadPDF: (filename?: string) => Promise<void>;
  downloadPNG: (filename?: string) => Promise<void>;
  downloadJSON: (data: unknown, filename?: string) => void;
  downloadCSV: (rows: string[][], filename?: string) => void;
  printInvoice: () => void;
  resetExportState: () => void;

  // UI State
  isExporting: boolean;
  exportError: string | null;
  successMessage: string | null;
};

export function useExportInvoice(
  invoiceRef: React.RefObject<HTMLElement | null>,
  defaultFilename = "invoice"
): UseExportInvoiceReturn {
  // State
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper to clear state
  const resetExportState = useCallback(() => {
    setExportError(null);
    setSuccessMessage(null);
    setIsExporting(false);
  }, []);

  // Helper to handle async operations safely
  const handleAsyncExport = useCallback(
    async (task: () => Promise<void>, successMsg: string) => {
      if (isExporting) return; // Prevent double clicks

      setIsExporting(true);
      setExportError(null);
      setSuccessMessage(null);

      try {
        await task();
        setSuccessMessage(successMsg);
      } catch (err) {
        console.error(err);
        setExportError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsExporting(false);
      }
    },
    [isExporting] // ✅ minimal and correct dependency
  );

  // ---------------- PNG (html-to-image) ----------------
  const downloadPNG = useCallback(
    async (filename = `${defaultFilename}.png`) => {
      await handleAsyncExport(async () => {
        const node = invoiceRef.current;
        if (!node) throw new Error("Invoice element not found");

        // Small delay to ensure styles/fonts load if just rendered
        await new Promise((resolve) => setTimeout(resolve, 100));

        const dataUrl = await toPng(node, {
          cacheBust: true,
          quality: 1,
          pixelRatio: 2, // High resolution
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        link.click();
      }, "Image downloaded successfully");
    },
    [defaultFilename, handleAsyncExport, invoiceRef]
  );

  // ---------------- PDF (html-to-image + jsPDF) ----------------
  const downloadPDF = useCallback(
    async (filename = `${defaultFilename}.pdf`) => {
      await handleAsyncExport(async () => {
        const node = invoiceRef.current;
        if (!node) throw new Error("Invoice element not found");

        await new Promise((resolve) => setTimeout(resolve, 100));

        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio: 2,
        });

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const width = 210;
        const height = 297;

        pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
        pdf.save(filename);
      }, "PDF downloaded successfully");
    },
    [defaultFilename, handleAsyncExport, invoiceRef]
  );

  // ---------------- JSON ----------------
  const downloadJSON = useCallback(
    (data: unknown, filename = `${defaultFilename}.json`) => {
      try {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setSuccessMessage("JSON exported successfully");
        setExportError(null);
      } catch (err) {
        setExportError(`Failed to generate JSON: ${err}`);
      }
    },
    [defaultFilename]
  );

  // ---------------- CSV ----------------
  const downloadCSV = useCallback(
    (rows: string[][], filename = `${defaultFilename}.csv`) => {
      try {
        const csv = rows
          .map((r) =>
            r
              .map((cell) => {
                const s = String(cell ?? "");
                return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
              })
              .join(",")
          )
          .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setSuccessMessage("CSV exported successfully");
        setExportError(null);
      } catch (err) {
        setExportError(`Failed to generate CSV ${err}`);
      }
    },
    [defaultFilename]
  );

  // ---------------- PRINT ----------------
  const printInvoice = useCallback(() => {
    setIsExporting(true);
    setExportError(null);

    try {
      const el = invoiceRef.current;
      if (!el) throw new Error("Invoice element not found");

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Popup blocked. Please allow popups for printing.");
      }

      // Clone invoice
      const clone = el.cloneNode(true) as HTMLElement;

      // Capture styles
      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch {
            return "";
          }
        })
        .join("\n");

      printWindow.document.open();
      printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>${styles}</style>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${clone.outerHTML}</body>
      </html>
    `);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        // Give a tiny delay for images/fonts to render in new window
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          // Printing doesn't really have a "success" callback we can trust,
          // but if we got here, we launched the dialog.
          setIsExporting(false);
        }, 500);
      };
    } catch (err) {
      console.error(err);
      setExportError(
        err instanceof Error ? err.message : "Failed to prepare print"
      );
      setIsExporting(false);
    }
  }, [invoiceRef]);

  return {
    downloadPDF,
    downloadPNG,
    downloadJSON,
    downloadCSV,
    printInvoice,
    resetExportState, // Call this to close toasts
    isExporting,
    exportError,
    successMessage,
  };
}
