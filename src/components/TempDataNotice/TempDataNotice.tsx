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
  const [open, setOpen] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return true;

      const data = JSON.parse(raw);

      if (data.dismissed && !isExpired(data.timestamp)) {
        return false; // keep hidden
      }
    } catch {
      console.log("");
    }
    return true; // show it
  });

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dismissed: true,
        timestamp: Date.now(),
      })
    );
  };

  if (!open) return null;

  return (
    <div role="status" aria-live="polite" className={styles.container}>
      {/* Added border-l-4 for a standard 'warning' card look */}
      <div className={`${styles.card} border-l-4 border-amber-500 bg-amber-50`}>
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* Icon fixed width prevents squishing */}
            <CircleAlert
              size={20}
              className="text-amber-600 shrink-0  mt-0.5"
            />

            <div>
              <h3 className="font-medium text-amber-900">
                No Sign-Up Required
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                Your data is saved locally in your browser while you work.
                <span className="font-semibold ml-1">
                  Closing this tab will lose your progress.
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Dismiss notice"
            className="text-amber-500 cursor-pointer hover:text-amber-700 hover:bg-amber-100 rounded-full p-1 transition-colors ml-4"
          >
            <CircleX size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
