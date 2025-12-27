import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/button/Button";
import { toast } from "sonner";
import styles from "./index.module.css";

export const ClearDataModal: React.FC = () => {
  const navigate = useNavigate();
  const { clearAllData } = useDocumentStore();
  const { isClearDataModalOpen, closeClearDataModal } = useModalStore();

  if (!isClearDataModalOpen) return null;

  const handleConfirm = () => {
    clearAllData();
    closeClearDataModal();
    navigate("/");
    toast.success("All data cleared successfully");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.header}>
          <div className="flex items-center gap-2 ">
            <AlertTriangle className="text-red-600" size={20} />
            <h2 className={styles.h2}>Clear All Data?</h2>
          </div>
          <button onClick={closeClearDataModal} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className={styles.bodyHeading}>
            This action will permanently delete:
          </p>
          <ul className={styles.list}>
            <li>Your Business Profile & Logo</li>
            <li>Client Details</li>
            <li>All Invoice Items</li>
            <li>Saved Preferences</li>
          </ul>
          <p className={styles.redirectmsg}>
            You will be redirected to the Welcome Screen.
          </p>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="outline" onClick={closeClearDataModal}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            Yes, Clear Everything
          </Button>
        </div>
      </div>
    </div>
  );
};
