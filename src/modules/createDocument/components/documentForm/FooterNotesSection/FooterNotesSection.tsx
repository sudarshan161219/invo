import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useShallow } from "zustand/react/shallow";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";

export const FooterNotesSection: React.FC = () => {
  const { updateDocumentDetails, invoice } = useDocumentStore(
    useShallow((state) => ({
      updateDocumentDetails: state.updateDocumentDetails,
      invoice: state.form.documentDetails,
    }))
  );

  return (
    <div className="mt-8 grid gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="footerNote">Invoice Footer Note</Label>
        <Textarea
          id="footerNote"
          placeholder="Thank you for your business! (Overrides default payment notes)"
          className="h-20"
          value={invoice.footerNote || ""}
          onChange={(e) =>
            updateDocumentDetails({ footerNote: e.target.value })
          }
        />
      </div>
    </div>
  );
};
