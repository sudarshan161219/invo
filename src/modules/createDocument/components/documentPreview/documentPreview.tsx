import { useEffect, useRef } from "react";
import { useInvoiceZoomAndDrag } from "@/hooks/useInvoiceZoomAndDrag/useInvoiceZoomAndDrag";
import { InvoiceZoomControls } from "@/components/InvoiceZoomControls/InvoiceZoomControls";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUIStore, type ThemeKey } from "@/store/documentStore/useUIStore";
import { ActiveTemplate } from "@/components/activeTemplate/ActiveTemplate";
import { useDocumentRefStore } from "@/store/documentRefStore/useDocumentRefStore";
import styles from "./index.module.css";
import { DownloadDocument } from "@/components/modal/downloadDocument/DownloadDocument";
import { useDocumentInvoice } from "@/store/DownloadDocumentStore/useDocumentInvoice";

export const DocumentPreview = () => {
  const documentRef = useRef<HTMLElement | null>(null);
  const { theme, setTheme } = useUIStore();
  const { isOpen } = useDocumentInvoice();
  const { setDocumentRef } = useDocumentRefStore();
  const {
    containerRef,
    position,
    finalScale,
    autoScale,
    manualZoom,
    setManualZoom,
    MAX_SCALE,
    handleMouseDown,
    handleTouchStart,
  } = useInvoiceZoomAndDrag();

  useEffect(() => {
    setDocumentRef(documentRef);
  }, [setDocumentRef]);

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.nav}>
        <div className={styles.selectContainer}>
          <Select value={theme} onValueChange={(v) => setTheme(v as ThemeKey)}>
            <SelectTrigger className="w-full md:w-[200px] cursor-pointer">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Preview Themes</SelectLabel>
                <SelectItem className="cursor-pointer" value="modern">
                  Modern
                </SelectItem>
                <SelectItem className="cursor-pointer" value="minimal">
                  Minimal
                </SelectItem>
                <SelectItem className="cursor-pointer" value="corporate">
                  Corporate
                </SelectItem>
                <SelectItem className="cursor-pointer" value="fun">
                  Fun
                </SelectItem>
                <SelectItem className="cursor-pointer" value="compact">
                  Compact
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className={styles.zoomControl}>
          <InvoiceZoomControls
            finalScale={finalScale}
            autoScale={autoScale}
            manualZoom={manualZoom}
            setManualZoom={setManualZoom}
            MAX_SCALE={MAX_SCALE}
          />
        </div>
      </div>

      {/* Template container */}
      <div className={styles.templateContainer} ref={containerRef}>
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={styles.templateScaler}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${finalScale})`,
            transformOrigin: "top center",
            cursor: "grab",
          }}
        >
          <ActiveTemplate ref={documentRef} />
        </div>
      </div>

      {isOpen && <DownloadDocument />}
    </div>
  );
};
