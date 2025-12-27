import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { type ButtonProps, type Variant, type Size } from "@/types/buttonProps";
import styles from "./index.module.css";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "default",
      size = "md",
      type = "button",
      isLoading = false,
      loadingText,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center  transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:ring-offset-0.5 disabled:opacity-50 disabled:pointer-events-none md:cursor-pointer";

    const variants: Record<Variant, string> = {
      default:
        "bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--muted-foreground)]",
      outline:
        "border border-[var(--input)] text-[var(--foreground)] hover:bg-accent",
      ghost: "bg-transparent text-[var(--foreground)] hover:bg-muted ",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes: Record<Size, string> = {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className, styles.btn)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? loadingText : children}
      </button>
    );
  }
);
