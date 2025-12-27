import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ModalState {
  isClearDataModalOpen: boolean;
  openClearDataModal: () => void;
  closeClearDataModal: () => void;
}

export const useModalStore = create<ModalState>()(
  persist(
    (set) => ({
      isClearDataModalOpen: false,
      openClearDataModal: () => set({ isClearDataModalOpen: true }),
      closeClearDataModal: () => set({ isClearDataModalOpen: false }),
    }),
    {
      name: "ui-modal-storage", // Unique key for session storage
      storage: createJSONStorage(() => sessionStorage),
      // Optional: Only persist 'isOpen' if you really want it to survive refresh
      partialize: (state) => ({ isClearDataModalOpen: state.isClearDataModalOpen }),
    }
  )
);