import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { DOCUMENT_LABELS } from "@/lib/documentConfig";
import { useShallow } from "zustand/react/shallow";
import styles from "./index.module.css";

export const DocumentTitleInput = () => {
  const { updateDocumentDetails, documentType, title } = useDocumentStore(
    useShallow((state) => ({
      updateDocumentDetails: state.updateDocumentDetails,
      updateForm: state.updateForm,
      title: state.form.documentDetails.title,
      documentType: state.form.documentDetails.documentType,
    }))
  );

  // Default suggestion based on document type
  const defaultTitle =
    DOCUMENT_LABELS[documentType]?.numberLabel.replace(" No", "") || "Document";

  return (
    <div className="space-y-1 w-full">
      <Label className={styles.label} htmlFor="document-title">
        Document Title
      </Label>

      <Input
        className="w-full"
        id="document-title"
        placeholder={defaultTitle}
        value={title}
        onChange={(e) => updateDocumentDetails({ title: e.target.value })}
      />

      {/* <p className="text-xs text-muted-foreground">
        This title appears on the document. Changing it will not affect document
        type or totals.
      </p> */}
    </div>
  );
};
