import { Slider } from "@/components/ui/slider";
import styles from "./index.module.css";

interface InvoiceZoomControlsProps {
  finalScale: number;
  autoScale: number;
  manualZoom?: number;
  setManualZoom: React.Dispatch<React.SetStateAction<number>>;
  MAX_SCALE: number;
}

export function InvoiceZoomControls({
  finalScale,
  autoScale,
  setManualZoom,
  MAX_SCALE,
}: InvoiceZoomControlsProps) {
  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  return (
    <div className={styles.zoomControls}>
      <button
        className="px-2 py-1 border rounded cursor-pointer"
        onClick={() =>
          setManualZoom((z) => clamp(z - 0.1, 0.1, MAX_SCALE / autoScale))
        }
      >
        −
      </button>

      <Slider
        min={0.1}
        max={MAX_SCALE}
        step={0.01}
        value={[finalScale]}
        onValueChange={([s]) => setManualZoom(s / autoScale)}
        className="w-full cursor-pointer"
      />

      <button
        className="px-2 py-1 border rounded cursor-pointer"
        onClick={() =>
          setManualZoom((z) => clamp(z + 0.1, 0.1, MAX_SCALE / autoScale))
        }
      >
        +
      </button>

      <span className="text-sm font-medium">
        {Math.round((finalScale / MAX_SCALE) * 100)}%
      </span>
    </div>
  );
}
