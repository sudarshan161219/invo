import { Label } from "../ui/label";
import { Input } from "@/components/ui/input";
import styles from "./index.module.css";

export const InputGroup = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className,
  required = false,
  max,
  min,
  suffix,
}: {
  id?: string;
  label?: string;
  type?: string;
  className?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  max?: number | undefined;
  min?: number | undefined;
  suffix?: string;
}) => (
  <div className="grid gap-1.5 w-full">
    <Label htmlFor={id} className={styles.label}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        max={max}
        min={min}
        className={`pr-10 ${className ?? ""}`}
      />

      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  </div>
);
