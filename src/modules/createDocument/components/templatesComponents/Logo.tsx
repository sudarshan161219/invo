import type { BrandAsset } from "@/types/document_types/types";

// 1. Extend standard img attributes so you can pass style, id, etc. directly
interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  branding: {
    logoEnabled: boolean;
    logo?: BrandAsset | null;
    logoWidth?: number; // <--- Added support for the slider
  };
}

export function Logo({ branding, className, style, ...props }: LogoProps) {
  // 1. Safety Checks
  if (!branding.logoEnabled) return null;
  if (!branding.logo?.dataUrl) return null;

  // 2. Resolve Width (Default to 120px if undefined)
  const width = branding.logoWidth || 120;

  return (
    <img
      src={branding.logo.dataUrl}
      alt="Company Logo"
      className={className}
      // 3. Apply Dynamic Width while maintaining aspect ratio
      style={{
        width: `${width}px`,
        maxWidth: "100%", // Prevent overflowing the container
        height: "auto", // Maintain aspect ratio
        display: "block", // Removes weird bottom spacing in some layouts
        ...style, // Allow parent to override specific styles if needed
      }}
      {...props}
    />
  );
}
