import { create } from "zustand";
import type { RefObject } from "react";

type DocumentRefStore = {
  documentRef: RefObject<HTMLElement | null> | null;
  setDocumentRef: (ref: RefObject<HTMLElement | null>) => void;
};

export const useDocumentRefStore = create<DocumentRefStore>((set) => ({
  documentRef: null,
  setDocumentRef: (ref) => set({ documentRef: ref }),
}));
