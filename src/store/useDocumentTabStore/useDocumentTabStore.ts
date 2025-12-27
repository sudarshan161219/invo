import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Tab = "create" | "preview";

type DocumentTabState = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
};

const STORAGE_KEY = "invoice-tab";
const WIDTH_KEY = `${STORAGE_KEY}-width-category`;

function widthCategory(width: number) {
  if (width < 768) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}

/**
 * Clear only keys related to your app or clear entire sessionStorage.
 * Right now it clears the entire sessionStorage (as you asked). If you
 * prefer to only remove the invoice-tab key, change the implementation.
 */
function clearSessionStorage() {
  try {
    sessionStorage.clear();
    // Or to only remove the store key:
    // sessionStorage.removeItem(STORAGE_KEY);
    // sessionStorage.removeItem(WIDTH_KEY);
  } catch (e) {
    console.log(e);
    // ignore — sessionStorage might be unavailable in some environments
    // (e.g. during SSR). This code runs only on client.
  }
}

if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
  // read stored width category (if any)
  const stored = sessionStorage.getItem(WIDTH_KEY) as string | null;
  const current = widthCategory(window.innerWidth);

  // If a previous category exists and it differs from current category, clear storage.
  if (stored && stored !== current) {
    clearSessionStorage();
  }

  // Always set current category so future checks have a baseline
  try {
    sessionStorage.setItem(WIDTH_KEY, current);
  } catch (e) {
    console.log(e);
    /* ignore */
  }

  // Add a resize listener that clears sessionStorage only when category changes.
  let resizeTimer: number | null = null;
  function handleResize() {
    // debounce to avoid excessive work while the user is resizing
    if (resizeTimer !== null) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
      const prev = sessionStorage.getItem(WIDTH_KEY);
      const now = widthCategory(window.innerWidth);
      if (prev && prev !== now) {
        // category crossed -> clear storage and update stored category
        clearSessionStorage();

        // After clearing, write the new category so we don't clear repeatedly.
        try {
          sessionStorage.setItem(WIDTH_KEY, now);
        } catch (e) {
          console.log(e);
          /* ignore */
        }
      } else {
        // update stored category if not present
        try {
          sessionStorage.setItem(WIDTH_KEY, now);
        } catch (e) {
          console.log(e);
          /* ignore */
        }
      }
      resizeTimer = null;
    }, 150); // 150ms debounce — adjust if you like
  }

  window.addEventListener("resize", handleResize, { passive: true });

  // cleanup on unload so handler doesn't leak across SPA navs (optional)
  window.addEventListener("beforeunload", () => {
    try {
      window.removeEventListener("resize", handleResize);
    } catch (e) {
      console.log(e);
      /* ignore */
    }
  });
}

export const useDocumentTabStore = create<DocumentTabState>()(
  persist(
    (set) => ({
      activeTab: "create",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
