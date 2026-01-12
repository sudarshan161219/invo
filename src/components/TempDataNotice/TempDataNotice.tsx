import { useState } from "react";
import { CircleX, CircleAlert } from "lucide-react";
import styles from "./index.module.css";

const STORAGE_KEY = "temp_notice_state";
const EXPIRE_DAYS = 5;

function isExpired(timestamp: number) {
  const days = EXPIRE_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp > days;
}

export const TempDataNotice = () => {
  // FIX: Read storage inside useState initializer (Lazy Initialization)
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false; // Safety for SSR contexts

    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      // If no key exists, show the notice (default true)
      if (!raw) return true;

      const data = JSON.parse(raw);

      // If dismissed and NOT expired, hide it (false)
      if (data.dismissed && !isExpired(data.timestamp)) {
        return false;
      }

      // Otherwise show it
      return true;
    } catch (e) {
      console.error("Error reading storage:", e);
      return true; // Default to showing on error
    }
  });

  const handleClose = () => {
    setOpen(false);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          dismissed: true,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.error("Failed to save notice preference", e);
    }
  };

  if (!open) return null;

  return (
    <div role="status" aria-live="polite" className={styles.container}>
      <div className={styles.card}>
        <div className={styles.contentWrapper}>
          <CircleAlert size={20} className={styles.icon} />
          <div className={styles.textContent}>
            <h3>No Sign-Up Required</h3>
            <p>
              Your data is saved locally in your browser.
              <strong> Export PDF</strong> to save permanently. (Clearing cache
              will delete data).
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          aria-label="Dismiss notice"
          className={styles.closeBtn}
        >
          <CircleX size={20} />
        </button>
      </div>
    </div>
  );
};
