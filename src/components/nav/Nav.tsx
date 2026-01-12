import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, ArrowDown, Trash2 } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useDocumentTabStore } from "@/store/useDocumentTabStore/useDocumentTabStore";
import { useDocumentInvoice } from "@/store/DownloadDocumentStore/useDocumentInvoice";
import { useModalStore } from "@/store/useModalStore";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { formatString } from "@/lib/formatString";
import styles from "./index.module.css";

export const Nav = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { toggleSidebar } = useSidebarStore();
  const { activeTab } = useDocumentTabStore();
  const { open } = useDocumentInvoice();
  const { openClearDataModal } = useModalStore();
  const { form } = useDocumentStore();

  const { documentDetails } = form;

  // Is the user currently on the setup/home page or the editor?
  const isEditor =
    location.pathname !== "/user-details" && location.pathname !== "/";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={styles.nav}>
      {/* --- LEFT: Context --- */}
      <div className={styles.leftSection}>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className={styles.menuBtn}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Dynamic Title Logic */}
        {isEditor ? (
          <div className={styles.titleWrapper}>
            <span className={styles.docType}>
              {formatString(documentDetails.documentType)}
            </span>
            <span className={styles.docId}>
              #{documentDetails.documentNumber || "001"}
            </span>
          </div>
        ) : (
          <NavLink to="/" className={styles.logo}>
            Invo
          </NavLink>
        )}
      </div>

      {/* --- RIGHT: Actions --- */}
      <div className={styles.rightSection}>
        {/* Clear Data (Subtle) */}
        <button
          onClick={openClearDataModal}
          className={styles.clearBtn}
          title="Clear all data"
        >
          <Trash2 size={16} />
          <span>Clear</span>
        </button>

        {/* Download (Primary - Only if Preview is active) */}
        {activeTab === "preview" && (
          <button onClick={open} className={styles.downloadBtn}>
            <ArrowDown size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}
      </div>
    </nav>
  );
};
