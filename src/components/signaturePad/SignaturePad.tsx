import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import { Button } from "@/components/button/Button";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { useThemeStore } from "@/store/useThemeStore";

export const SignaturePadComponent = () => {
  const { theme } = useThemeStore();
  const setSignature = useDocumentStore((s) => s.setUserSignature);
  const closeSignatureModal = useDocumentStore((s) => s.closeSignatureModal);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const cssWidth = canvas.offsetWidth;
      const cssHeight = canvas.offsetHeight;

      canvas.width = Math.floor(cssWidth * ratio);
      canvas.height = Math.floor(cssHeight * ratio);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(ratio, ratio);

      if (padRef.current) {
        padRef.current.off();
        padRef.current = null;
      }

      const penColor = theme === "dark" ? "white" : "black";
      const backgroundColor = theme === "dark" ? "#737373" : "#B3B3B3";

      padRef.current = new SignaturePad(canvas, {
        backgroundColor,
        penColor,
        minWidth: 0.8,
        maxWidth: 2.5,
        velocityFilterWeight: 0.7,
        minDistance: 0.5,
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [theme]);

  const handleClear = () => padRef.current?.clear();

  const handleSave = () => {
    if (!padRef.current) {
      alert("Signature pad not ready");
      return;
    }
    if (padRef.current.isEmpty()) {
      alert("Please sign first");
      return;
    }
    // export with transparent background; you can change to "image/png" as needed
    const dataUrl = padRef.current.toDataURL("image/png");
    setSignature({ type: "draw", dataUrl });
    console.log(dataUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-48 border rounded-md bg-card p-1">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ touchAction: "none" }}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button onClick={handleClear} variant="ghost">
          Clear
        </Button>
        <Button onClick={handleSave}>Save</Button>

        <Button onClick={closeSignatureModal} variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};
