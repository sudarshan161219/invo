// import React from "react";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { InputGroup } from "@/components/inputgroup/InputGroup";
// import { useDocumentStore } from "@/store/invoiceStore/useDocumentStore";
// import type { Currency } from "@/types/document_types/types";
// import styles from "./index.module.css";

// export const MathFieldsSection: React.FC = () => {
//   // 1. Destructure 'discountType' from the form state
//   const { form, updateForm, updateDocumentDetails } = useDocumentStore();
//   const { discountType } = form; // "amount" | "percentage"
//   const documentDetails = form.invoiceDetails;

//   const DISCOUNT_TYPES = ["amount", "percentage"] as const;

//   return (
//     <div className="mt-6 space-y-6 max-w-md">
//       {/* 3. CURRENCY SELECTOR */}
//       <div className="flex flex-col gap-1.5 w-full">
//         <Label htmlFor="curr" className={styles.label}>
//           Currency
//         </Label>
//         <Select
//           value={documentDetails.currency}
//           onValueChange={(v) =>
//             updateDocumentDetails({ currency: v as Currency })
//           }
//         >
//           <SelectTrigger id="curr" className="cursor-pointer w-full">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent className="cursor-pointer w-full">
//             {["INR", "USD", "EUR", "GBP", "AUD", "CAD"].map((c) => (
//               <SelectItem className="cursor-pointer w-full" key={c} value={c}>
//                 {c}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="rounded-lg border bg-card p-3 space-y-5">
//         <h3 className={styles.cardH3}>Adjustments</h3>
//         <InputGroup
//           id="tax"
//           label="Tax Rate (%)"
//           type="number"
//           value={form.tax}
//           onChange={(v) => updateForm("tax", Number(v))}
//         />

//         <div className="space-y-2">
//           <Label htmlFor="discount" className={styles.label}>
//             Discount
//           </Label>

//           {/* Type selector */}
//           <div className="inline-flex rounded-md border bg-muted/30 p-0.5">
//             {DISCOUNT_TYPES.map((type) => (
//               <button
//                 key={type}
//                 type="button"
//                 onClick={() => updateForm("discountType", type)}
//                 className={`px-3 py-1 text-sm rounded-md transition cursor-pointer ${
//                   discountType === type
//                     ? "bg-background shadow font-medium"
//                     : "text-muted-foreground"
//                 }`}
//               >
//                 {type === "amount" ? "Amount" : "Percentage"}
//               </button>
//             ))}
//           </div>

//           {/* Value input */}
//           <InputGroup
//             id="discount"
//             type="number"
//             placeholder={discountType === "percentage" ? "10" : "100"}
//             suffix={discountType === "percentage" ? "%" : documentDetails.currency}
//             value={form.discount}
//             max={discountType === "percentage" ? 100 : undefined}
//             onChange={(v) => updateForm("discount", Number(v))}
//           />

//           {/* Helper text */}
//           <p className="text-xs text-muted-foreground">
//             {discountType === "percentage"
//               ? "Applied on subtotal before tax"
//               : "Flat amount deducted from subtotal"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputGroup } from "@/components/inputgroup/InputGroup";
import { useShallow } from "zustand/react/shallow";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import type { Currency } from "@/types/document_types/types";
import styles from "./index.module.css";

export const MathFieldsSection: React.FC = () => {
  const {
    documentDetails,
    updateForm,
    updateDocumentDetails,
    discount,
    discountType,
    tax,
    taxType,
  } = useDocumentStore(
    useShallow((state) => ({
      documentDetails: state.form.documentDetails,
      updateForm: state.updateForm,
      updateDocumentDetails: state.updateDocumentDetails,
      discountType: state.form.discountType,
      discount: state.form.discount,
      taxType: state.form.taxType,
      tax: state.form.tax,
    }))
  );

  const DISCOUNT_TYPES = ["amount", "percentage"] as const;
  const TAX_TYPES = ["percentage", "fixed"] as const;

  return (
    <div className="mt-6 space-y-6 max-w-md">
      {/* --- CURRENCY SELECTOR --- */}
      <div className="flex flex-col gap-1.5 w-full">
        <Label htmlFor="curr" className={styles.label}>
          Currency
        </Label>
        <Select
          value={documentDetails.currency}
          onValueChange={(v) =>
            updateDocumentDetails({ currency: v as Currency })
          }
        >
          <SelectTrigger id="curr" className="cursor-pointer w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="cursor-pointer w-full">
            {["INR", "USD", "EUR", "GBP", "AUD", "CAD"].map((c) => (
              <SelectItem className="cursor-pointer w-full" key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card p-3 space-y-5">
        <h3 className={styles.cardH3}>Adjustments</h3>

        {/* --- TAX SECTION (UPDATED) --- */}
        <div className="space-y-2">
          <Label htmlFor="tax" className={styles.label}>
            Tax
          </Label>

          {/* Tax Type Selector (Segmented Control) */}
          <div className="inline-flex rounded-md border bg-muted/30 p-0.5">
            {TAX_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateForm("taxType", type)}
                className={`px-3 py-1 text-sm rounded-md transition cursor-pointer ${
                  taxType === type
                    ? "bg-background shadow font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {type === "percentage" ? "Percentage" : "Fixed"}
              </button>
            ))}
          </div>

          {/* Tax Input */}
          <InputGroup
            id="tax"
            type="number"
            // Dynamic placeholder and suffix based on type
            placeholder={taxType === "percentage" ? "10" : "100"}
            suffix={taxType === "percentage" ? "%" : documentDetails.currency}
            value={tax}
            onChange={(v) => updateForm("tax", Number(v))}
            // Optional: limit to 100 if it is a percentage
            max={taxType === "percentage" ? 100 : undefined}
          />
        </div>

        {/* --- DISCOUNT SECTION --- */}
        <div className="space-y-2">
          <Label htmlFor="discount" className={styles.label}>
            Discount
          </Label>

          {/* Discount Type Selector */}
          <div className="inline-flex rounded-md border bg-muted/30 p-0.5">
            {DISCOUNT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateForm("discountType", type)}
                className={`px-3 py-1 text-sm rounded-md transition cursor-pointer ${
                  discountType === type
                    ? "bg-background shadow font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {type === "amount" ? "Amount" : "Percentage"}
              </button>
            ))}
          </div>

          {/* Discount Value Input */}
          <InputGroup
            id="discount"
            type="number"
            placeholder={discountType === "percentage" ? "10" : "100"}
            suffix={
              discountType === "percentage" ? "%" : documentDetails.currency
            }
            value={discount}
            max={discountType === "percentage" ? 100 : undefined}
            onChange={(v) => updateForm("discount", Number(v))}
          />

          <p className="text-xs text-muted-foreground">
            {discountType === "percentage"
              ? "Applied on subtotal before tax"
              : "Flat amount deducted from subtotal"}
          </p>
        </div>
      </div>
    </div>
  );
};
