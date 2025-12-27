import type { SignatureData } from "@/types/document_types/types";

interface SignatureProps {
  branding: {
    signatureEnabled: boolean;
    signature?: SignatureData | null;
  };
  // Context props
  issuerType?: "individual" | "business"; // Added to handle label nuance
  isQuote?: boolean;
  isReceipt?: boolean;

  /** Styling hooks controlled by template */
  containerClassName?: string;
  textClassName?: string;
  imageClassName?: string;
  labelClassName?: string;
}

export function Signature({
  branding,
  issuerType = "business", // Default to business if not passed
  isQuote,
  isReceipt,
  containerClassName,
  textClassName,
  imageClassName,
  labelClassName,
}: SignatureProps) {
  // 1. Safety Check
  if (!branding.signatureEnabled || !branding.signature) return null;

  const sig = branding.signature;

  // 2. Determine Label Logic
  let label = "Authorized Signatory"; // Default Business Standard

  if (isQuote) {
    label = "Proposed By";
  } else if (isReceipt) {
    label = "Received By";
  } else if (issuerType === "individual") {
    label = "Signed By"; // Freelancer Standard
  }

  return (
    <div className={containerClassName}>
      {/* RENDER SIGNATURE (Image or Text) */}
      {sig.type === "typed" && sig.typedData ? (
        <div
          className={textClassName}
          style={{
            fontFamily: sig.typedData.font,
            color: sig.typedData.color,
            lineHeight: "1", // Ensure tight spacing for signatures
          }}
        >
          {sig.typedData.text}
        </div>
      ) : (
        <img
          src={sig.dataUrl}
          alt="Signature"
          className={imageClassName}
          style={{ display: "block" }} // Prevents weird inline gaps
        />
      )}

      {/* RENDER LABEL */}
      <span
        className={labelClassName}
        style={{ display: "block", marginTop: "4px" }}
      >
        {label}
      </span>
    </div>
  );
}
