import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import styles from "./index.module.css";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useDocumentTabStore } from "@/store/useDocumentTabStore/useDocumentTabStore";
import { useDocumentInvoice } from "@/store/DownloadDocumentStore/useDocumentInvoice";
import { ArrowDown, Trash2 } from "lucide-react";
import { Button } from "../button/Button";
import { useModalStore } from "@/store/useModalStore";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { formatString } from "@/lib/formatString";

export const Nav = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { toggleSidebar } = useSidebarStore();
  const { activeTab } = useDocumentTabStore();
  const { open } = useDocumentInvoice();
  const { openClearDataModal } = useModalStore();
  const { form } = useDocumentStore();

  const { documentDetails } = form;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={styles.nav}>
      {/* Left Section */}
      {!isMobile && <h1>{formatString(documentDetails.documentType)}</h1>}
      {isMobile && (
        <div className={styles.left}>
          <Menu className="cursor-pointer" onClick={toggleSidebar} />
          {location.pathname === "/user-details" ? (
            <NavLink to="/">
              <h1 className={styles.logo}>Invo</h1>
            </NavLink>
          ) : (
            <h1>{formatString(documentDetails.documentType)}</h1>
          )}
        </div>
      )}

      {/* Right Section */}

      <div>
        {activeTab === "preview" && (
          <button className={styles.download} onClick={open}>
            <ArrowDown size={18} />
          </button>
        )}

        <Button
          onClick={openClearDataModal}
          size="md"
          variant="danger"
          className="flex items-center gap-1.5"
        >
          <Trash2 size={14} />
          Clear Data
        </Button>
      </div>
    </nav>
  );
};
