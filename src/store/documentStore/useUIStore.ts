import { create } from "zustand";
import { persist } from "zustand/middleware";

export const THEMES = [
  "modern",
  "minimal",
  "corporate",
  "fun",
  "compact",
] as const;
export type ThemeKey = (typeof THEMES)[number];

interface UIState {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "modern",
      setTheme: (t) => set({ theme: t }),
    }),
    { name: "ui-store" }
  )
);
