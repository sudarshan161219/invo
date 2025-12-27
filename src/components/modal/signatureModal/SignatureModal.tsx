import React, { useRef, useState } from "react";
import { SignaturePadComponent } from "@/components/signaturePad/SignaturePad";
import { toPng } from "html-to-image";
import { Button } from "@/components/button/Button";
import { Label } from "@/components/ui/label";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import styles from "./index.module.css";
import { ColorDropdown } from "@/components/colorDropdown/ColorDropdown";
import { FontDropDown } from "@/components/fontDropdown/FontDropDown";

const TABS = ["draw", "upload", "typed"] as const;

export const SignatureModal = () => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("draw");
  const [typedText, setTypedText] = useState("");
  const [fontFamily, setFontFamily] = useState("Caveat");
  const [fontColor, setFontColor] = useState("#000000");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const typedRef = useRef<HTMLDivElement | null>(null);

  const closeModal = useDocumentStore((s) => s.closeSignatureModal);
  const setSignature = useDocumentStore((s) => s.setUserSignature);

  // ----------------------
  // Upload Handler
  // ----------------------
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveUploadedSignature = () => {
    if (!filePreview) return;
    setSignature({ type: "upload", dataUrl: filePreview });
    closeModal();
  };

  // ----------------------
  // Typed Handler
  // ----------------------
  const saveTypedSignature = async () => {
    if (!typedText.trim() || !typedRef.current) return;

    try {
      await document.fonts.ready;

      const dataUrl = await toPng(typedRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: undefined,
      });

      setSignature({
        type: "typed",
        dataUrl,
        typedData: {
          text: typedText,
          font: fontFamily,
          color: fontColor,
        },
      });
      closeModal();
    } catch (error) {
      console.error("Signature export failed:", error);
    }
  };

  // ----------------------
  // UI
  // ----------------------
  return (
    <div className={styles.container}>
      <div className={styles.bg} onClick={closeModal} />

      <div className={styles.card}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Add Signature</h3>
          <Button onClick={closeModal} variant="ghost">
            Close
          </Button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-4 ">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-2 rounded cursor-pointer ${styles.tabBtn} ${
                activeTab === tab ? "bg-muted" : ""
              }`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Draw */}
        {activeTab === "draw" && <SignaturePadComponent />}

        {/* Upload */}
        {activeTab === "upload" && (
          <div className="flex flex-col gap-3">
            <Label>Upload signature (PNG recommended)</Label>
            <input type="file" accept="image/*" onChange={handleUpload} />

            {filePreview && (
              <img
                src={filePreview}
                alt="Signature preview"
                className="h-24 object-contain border rounded"
              />
            )}

            <div className="flex justify-end gap-2">
              <Button onClick={saveUploadedSignature} disabled={!filePreview}>
                Save
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Typed */}
        {activeTab === "typed" && (
          <div className="flex flex-col gap-4">
            <div>
              <Label>Name</Label>
              <input
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="John Doe"
              />
            </div>
            <div className={styles.fontColorDropDown}>
              <div className={styles.fontContainer}>
                <Label>Font</Label>
                <FontDropDown value={fontFamily} onChange={setFontFamily} />
              </div>

              <div className={styles.colorContainer}>
                <Label>Color</Label>
                <ColorDropdown
                  selectedColor={fontColor}
                  onChange={(color) => setFontColor(color)}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 border rounded bg-white">
              <div
                ref={typedRef}
                style={{
                  color: fontColor,
                  fontFamily,
                  fontSize: "2.5rem",
                  display: "inline-block",
                  padding: 6,
                }}
              >
                {typedText || "Your name here"}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={saveTypedSignature} disabled={!typedText.trim()}>
                Save
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
