import { useRef, useState, useEffect } from "react";
import { X, Upload, Image as RefreshCw } from "lucide-react";
import { Button } from "@/components/button/Button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";

export const ImageAdjuster = () => {
  const { form, updateUserDetails } = useDocumentStore();
  const userDetails = form.userDetails;
  const { branding } = userDetails;
  const image = branding.logo;
  const imageWidth = branding.logoWidth || 120;
  const [localWidth, setLocalWidth] = useState(imageWidth);

  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setLocalWidth(imageWidth);
  }, [imageWidth]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validation
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      toast.error("Image must be smaller than 2MB.");
      return;
    }

    // 2. Read File
    const reader = new FileReader();
    reader.onload = () => {
      updateUserDetails({
        branding: {
          ...userDetails.branding,
          logo: {
            dataUrl: reader.result as string,
            filename: file.name,
            type: file.type,
          },
        },
      });
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again if needed
    e.target.value = "";
  };

  const handleRemove = () => {
    updateUserDetails({
      branding: { ...userDetails.branding, logo: null, logoWidth: 120 },
    });
  };

  return (
    <div className={`space-y-3`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Upload Logo</Label>
        {image && (
          <Button
            variant="ghost"
            size="md"
            className="h-6 px-2 text-destructive hover:text-destructive/90 text-xs"
            onClick={() => handleRemove()}
          >
            <X className="w-3 h-3 mr-1" /> Remove
          </Button>
        )}
      </div>

      {!image ? (
        // --- UPLOAD STATE ---
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors group"
        >
          <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-gray-200 transition">
            <Upload className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-700">Click to upload</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
        </div>
      ) : (
        // --- PREVIEW & ADJUST STATE ---
        <div className="bg-card border rounded-lg p-4 space-y-4">
          {/* Preview Area */}
          <div className="w-full flex justify-center py-4 bg-gray-50/50 rounded border border-dashed border-gray-200 overflow-hidden relative">
            {/* Checkerboard background for transparency */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            ></div>

            <img
              src={image.dataUrl}
              alt="Preview"
              style={{
                width: `${localWidth}px`,
                maxWidth: "100%",
              }}
              className="h-auto object-contain z-10 shadow-sm will-change-transform"
            />
          </div>

          {/* Controls */}
          <div className="grid gap-4">
            {/* Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-label">Size</span>
                <span className="font-mono ">{localWidth}px</span>
              </div>

              <Slider
                min={60}
                max={280}
                step={1}
                value={[localWidth]}
                onValueChange={([v]) => setLocalWidth(v)}
                onValueCommit={([v]) =>
                  updateUserDetails({
                    branding: { ...userDetails.branding, logoWidth: v },
                  })
                }
                className="w-full cursor-pointer"
              />
            </div>

            {/* Replace Button */}
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <RefreshCw className="w-3 h-3 mr-2" /> Replace Image
            </Button>
          </div>
        </div>
      )}

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
