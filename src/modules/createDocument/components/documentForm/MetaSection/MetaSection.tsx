// import React from "react";
// import { InputGroup } from "@/components/inputgroup/InputGroup";
// import { DocumentTitle } from "@/components/documentTitle/DocumentTitle";
// import { DocumentTitleInput } from "@/components/documentTitleInput/DocumentTitleInput";
// import { Button } from "@/components/button/Button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { DatePicker } from "../DatePicker/DatePicker";
// import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
// import { DOCUMENT_DESCRIPTION_LABEL } from "@/lib/documentDescriptionLabels";
// import styles from "./index.module.css";
// import { useShallow } from "zustand/react/shallow";
// import type { DocumentDetails } from "@/types/document_types/types";

// // --- HELPER TO CALCULATE DATE ---
// const addDays = (iso: string, days: number): string => {
//   const d = new Date(iso);

//   return new Date(
//     Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days)
//   ).toISOString();
// };

// export const MetaSection: React.FC = () => {
//   const {
//     updateDocumentDetails,
//     updateForm,
//     generateNewDocumentNumber,
//     description,
//     documentDetails,
//   } = useDocumentStore(
//     useShallow((state) => ({
//       documentDetails: state.form.documentDetails,
//       updateDocumentDetails: state.updateDocumentDetails,
//       updateForm: state.updateForm,
//       generateNewDocumentNumber: state.generateNewDocumentNumber,
//       description: state.form.description,
//     }))
//   );

//   const { documentNumber, issueDate, dueDate, documentType, paymentTerms } =
//     documentDetails;
//   const label = DOCUMENT_DESCRIPTION_LABEL[documentType];

//   // 1. DYNAMIC LABELS
//   const dateLabel1 = documentType === "RECEIPT" ? "Payment Date" : "Issue Date";
//   const dateLabel2 =
//     documentType === "QUOTATION" || documentType === "ESTIMATE"
//       ? "Valid Until"
//       : "Due Date";

//   const showSecondDate = documentType !== "RECEIPT";
//   const showTerms = documentType !== "RECEIPT"; // Clean variable for readability

//   // --- SMART HANDLERS ---
//   const diffInDays = (startISO: string, endISO: string): number => {
//     const start = new Date(startISO);
//     const end = new Date(endISO);

//     const startUTC = Date.UTC(
//       start.getUTCFullYear(),
//       start.getUTCMonth(),
//       start.getUTCDate()
//     );

//     const endUTC = Date.UTC(
//       end.getUTCFullYear(),
//       end.getUTCMonth(),
//       end.getUTCDate()
//     );

//     const msPerDay = 24 * 60 * 60 * 1000;

//     return Math.ceil((endUTC - startUTC) / msPerDay);
//   };

//   const toUTCMidnightISO = (d: Date) =>
//     new Date(
//       Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
//     ).toISOString();

//   const handleIssueDateChange = (d?: Date) => {
//     if (!d) return;
//     const iso = toUTCMidnightISO(d);
//     if (!iso) return;

//     const updates: Partial<DocumentDetails> = {
//       issueDate: iso,
//     };

//     // CASE 1: Due date was manually edited → recompute terms
//     if (dueDate && documentDetails.dueDateManuallyEdited) {
//       updates.paymentTerms = diffInDays(iso, dueDate);
//     }
//     // CASE 2: Terms exist → recompute due date
//     else if (paymentTerms && paymentTerms >= 0) {
//       updates.dueDate = addDays(iso, paymentTerms);
//     }

//     updateDocumentDetails(updates);
//   };

//   const handleDueDateChange = (d?: Date) => {
//     if (!d) return;
//     const iso = toUTCMidnightISO(d);
//     if (!iso || !issueDate) return;

//     const terms = diffInDays(issueDate, iso);

//     updateDocumentDetails({
//       dueDate: iso,
//       paymentTerms: terms >= 0 ? terms : undefined,
//       dueDateManuallyEdited: true,
//     });
//   };

//   const handleTermsChange = (val: string) => {
//     if (val === "") {
//       updateDocumentDetails({
//         paymentTerms: undefined,
//         dueDateManuallyEdited: false,
//       });
//       return;
//     }

//     const days = Number(val);
//     if (!Number.isInteger(days) || days < 0) return;

//     updateDocumentDetails({
//       paymentTerms: days,
//       dueDate: issueDate ? addDays(issueDate, days) : undefined,
//       dueDateManuallyEdited: false,
//     });
//   };

//   // Grid Logic (Kept your existing logic, it works fine)
//   const gridCols = (() => {
//     if (documentType === "RECEIPT") {
//       return showSecondDate ? "lg:grid-cols-3" : "lg:grid-cols-2";
//     }
//     return showSecondDate ? "lg:grid-cols-4" : "lg:grid-cols-3";
//   })();

//   return (
//     <div className={styles.container}>
//       <h3 className="font-semibold text-muted-foreground mb-3">
//         Invoice Details
//       </h3>

//       <div className={styles.tabContainer}>
//         {/* ROW 1: Title & Doc Type */}
//         <div className={styles.doctype}>
//           <DocumentTitle />
//           <DocumentTitleInput />
//         </div>

//         {/* ROW 2: Invoice Number */}
//         <div className={styles.invoiceGenNumber}>
//           <InputGroup
//             id="documentNumber"
//             label="Invoice Number"
//             value={documentNumber}
//             onChange={(v) => updateDocumentDetails({ documentNumber: v })}
//             placeholder="e.g. INV-2025-001"
//             className="w-full"
//           />
//           <Button
//             type="button"
//             variant="outline"
//             size="md"
//             className="whitespace-nowrap cursor-pointer mb-0.5 items-end"
//             onClick={() => generateNewDocumentNumber()}
//           >
//             Generate
//           </Button>
//         </div>

//         {/* ROW 3: Description */}
//         <div className="flex flex-col gap-2 mb-6">
//           <Label className={styles.label} htmlFor="description">
//             {label}
//           </Label>
//           <Textarea
//             id="description"
//             className="resize-none h-20"
//             placeholder={
//               documentType === "QUOTATION" || documentType === "ESTIMATE"
//                 ? "Brief overview of the proposed work..."
//                 : "Brief summary of the work..."
//             }
//             value={description || ""}
//             onChange={(e) => updateForm("description", e.target.value)}
//           />
//         </div>

//         {/* ROW 4: Dates & PO/Payment */}
//         <div
//           className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-4 mb-6`}
//         >
//           {/* 1. Issue/Payment Date */}
//           <DatePicker
//             htmlFor="issueDate"
//             label={dateLabel1}
//             id="issueDate"
//             date={issueDate ? new Date(issueDate) : undefined}
//             // Use the smart handler here
//             onSelect={handleIssueDateChange}
//           />

//           {/* 2. Due Date / Valid Until */}
//           {showSecondDate && (
//             <DatePicker
//               htmlFor="dueDate"
//               label={dateLabel2}
//               id="dueDate"
//               date={dueDate ? new Date(dueDate) : undefined}
//               onSelect={handleDueDateChange}
//             />
//           )}

//           {/* 3. Payment Terms (Smart Input) */}
//           {showTerms && (
//             <InputGroup
//               id="paymentTerms"
//               label="Terms (Days)"
//               type="number"
//               value={paymentTerms || ""}
//               onChange={handleTermsChange}
//               placeholder="e.g. 30"
//               min={0}
//             />
//           )}

//           {/* 4. PO Number OR Payment Method */}
//           {documentType === "RECEIPT" ? (
//             <InputGroup
//               label="Payment Mode"
//               placeholder="e.g. Cash, Wire"
//               value={documentDetails.paymentMethod || ""}
//               onChange={(v) => updateDocumentDetails({ paymentMethod: v })}
//             />
//           ) : (
//             <InputGroup
//               label="PO Number / Ref"
//               placeholder="Optional"
//               value={documentDetails.poNumber || ""}
//               onChange={(v) => updateDocumentDetails({ poNumber: v })}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { InputGroup } from "@/components/inputgroup/InputGroup";
import { DocumentTitle } from "@/components/documentTitle/DocumentTitle";
import { DocumentTitleInput } from "@/components/documentTitleInput/DocumentTitleInput";
import { Button } from "@/components/button/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "../DatePicker/DatePicker";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { DOCUMENT_DESCRIPTION_LABEL } from "@/lib/documentDescriptionLabels";
import styles from "./index.module.css";
import { useShallow } from "zustand/react/shallow";
import type { DocumentDetails } from "@/types/document_types/types";

import {
  addDays,
  diffInDays,
  toUTCMidnightISO,
} from "@/lib/dateUtils/dateUtils";

import {
  getDateLabels,
  getMetaVisibility,
  getGridCols,
} from "@/lib/documentMetaUtils/documentMetaUtils";

export const MetaSection: React.FC = () => {
  const {
    updateDocumentDetails,
    updateForm,
    generateNewDocumentNumber,
    description,
    documentDetails,
  } = useDocumentStore(
    useShallow((state) => ({
      documentDetails: state.form.documentDetails,
      updateDocumentDetails: state.updateDocumentDetails,
      updateForm: state.updateForm,
      generateNewDocumentNumber: state.generateNewDocumentNumber,
      description: state.form.description,
    }))
  );

  const { documentNumber, issueDate, dueDate, documentType, paymentTerms } =
    documentDetails;

  const label = DOCUMENT_DESCRIPTION_LABEL[documentType];

  const { dateLabel1, dateLabel2 } = getDateLabels(documentType);
  const { showSecondDate, showTerms } = getMetaVisibility(documentType);
  const gridCols = getGridCols(documentType, showSecondDate);

  // --- Handlers ---

  const handleIssueDateChange = (d?: Date) => {
    if (!d) return;

    const iso = toUTCMidnightISO(d);

    const updates: Partial<DocumentDetails> = { issueDate: iso };

    if (dueDate && documentDetails.dueDateManuallyEdited) {
      updates.paymentTerms = diffInDays(iso, dueDate);
    } else if (paymentTerms !== undefined) {
      updates.dueDate = addDays(iso, paymentTerms);
    }

    updateDocumentDetails(updates);
  };

  const handleDueDateChange = (d?: Date) => {
    if (!d || !issueDate) return;

    const iso = toUTCMidnightISO(d);
    const terms = diffInDays(issueDate, iso);

    updateDocumentDetails({
      dueDate: iso,
      paymentTerms: terms >= 0 ? terms : undefined,
      dueDateManuallyEdited: true,
    });
  };

  const handleTermsChange = (val: string) => {
    if (val === "") {
      updateDocumentDetails({
        paymentTerms: undefined,
        dueDateManuallyEdited: false,
      });
      return;
    }

    const days = Number(val);
    if (!Number.isInteger(days) || days < 0) return;

    updateDocumentDetails({
      paymentTerms: days,
      dueDate: issueDate ? addDays(issueDate, days) : undefined,
      dueDateManuallyEdited: false,
    });
  };

  return (
    <div className={styles.container}>
      <h3 className="font-semibold text-muted-foreground mb-3">
        Invoice Details
      </h3>

      <div className={styles.tabContainer}>
        <div className={styles.doctype}>
          <DocumentTitle />
          <DocumentTitleInput />
        </div>

        <div className={styles.invoiceGenNumber}>
          <InputGroup
            id="documentNumber"
            label="Invoice Number"
            value={documentNumber}
            onChange={(v) => updateDocumentDetails({ documentNumber: v })}
          />
          <Button
            type="button"
            variant="outline"
            onClick={generateNewDocumentNumber}
          >
            Generate
          </Button>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <Label>{label}</Label>
          <Textarea
            value={description || ""}
            onChange={(e) => updateForm("description", e.target.value)}
          />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-4`}>
          <DatePicker
            id="issueDate"
            htmlFor="issueDate"
            label={dateLabel1}
            date={issueDate ? new Date(issueDate) : undefined}
            onSelect={handleIssueDateChange}
          />

          {showSecondDate && (
            <DatePicker
              id="dueDate"
              htmlFor="dueDate"
              label={dateLabel2}
              date={dueDate ? new Date(dueDate) : undefined}
              onSelect={handleDueDateChange}
            />
          )}

          {showTerms && (
            <InputGroup
              label="Terms (Days)"
              type="number"
              value={paymentTerms || ""}
              onChange={handleTermsChange}
            />
          )}

          {documentType === "RECEIPT" ? (
            <InputGroup
              label="Payment Mode"
              value={documentDetails.paymentMethod || ""}
              onChange={(v) => updateDocumentDetails({ paymentMethod: v })}
            />
          ) : (
            <InputGroup
              label="PO Number / Ref"
              value={documentDetails.poNumber || ""}
              onChange={(v) => updateDocumentDetails({ poNumber: v })}
            />
          )}
        </div>
      </div>
    </div>
  );
};
