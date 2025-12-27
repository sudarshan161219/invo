import { forwardRef } from "react";
import styles from "../index.module.css";
import { ActiveTemplate } from "@/components/activeTemplate/ActiveTemplate";

export const TemplatePreview = forwardRef<HTMLElement | null>((_props, ref) => {
  return (
    <div
      className={styles.templateScaler}
      style={{
        transform: `translate(${0}px, ${0}px) scale(${0.1})`,
        transformOrigin: "top center",
      }}
    >
      <ActiveTemplate ref={ref} />
    </div>
  );
});
TemplatePreview.displayName = "TemplatePreview";
