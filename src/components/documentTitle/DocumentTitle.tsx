import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DOCUMENT_TITLES } from "@/lib/constants";
import type { DocumentType } from "@/types/document_types/types";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { useShallow } from "zustand/react/shallow";
import styles from "./index.module.css";

export const DocumentTitle = () => {
  const { updateDocumentDetails, currentTitle } = useDocumentStore(
    useShallow((state) => ({
      updateDocumentDetails: state.updateDocumentDetails,
      updateForm: state.updateForm,
      currentTitle: state.form.documentDetails.documentType,
    }))
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={styles.label} htmlFor="title">
        Document
      </Label>
      <Select
        value={currentTitle}
        onValueChange={(value: DocumentType) =>
          updateDocumentDetails({ documentType: value })
        }
      >
        <SelectTrigger id="title" className="w-full cursor-pointer">
          <SelectValue placeholder="Select Document Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Document Title</SelectLabel>
            {DOCUMENT_TITLES.map((title) => (
              <SelectItem key={title} value={title} className="cursor-pointer">
                {title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
