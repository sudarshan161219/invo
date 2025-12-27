import { useEffect, useState } from "react";
import { DocumentForm } from "../components/documentForm/DocumentForm";
import { DocumentPreview } from "../components/documentPreview/documentPreview";
import { useDocumentTabStore } from "@/store/useDocumentTabStore/useDocumentTabStore";
import styles from "./index.module.css";

export const CreateDocument = () => {
  const { activeTab, setActiveTab } = useDocumentTabStore();
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 800;
  });

  useEffect(() => {
    const onResize = () => {
      setIsSmallScreen(window.innerWidth < 800);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="w-full p-2">
      {isSmallScreen ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={() => setActiveTab("create")}
              style={{
                padding: "8px 16px",
                background:
                  activeTab === "create" ? "var(--card)" : "transparent",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              style={{
                padding: "8px 16px",
                background:
                  activeTab === "preview" ? "var(--card)" : "transparent",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Preview
            </button>
          </div>

          {activeTab === "create" ? <DocumentForm /> : <DocumentPreview />}
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.form}>
            <DocumentForm />
          </div>
          <div className={styles.preview}>
            <DocumentPreview />
          </div>
        </div>
      )}
    </div>
  );
};
