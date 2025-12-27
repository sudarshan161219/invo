import { SignatureModal } from "./components/modal/signatureModal/SignatureModal";
import { AppRoutes } from "@/routes/AppRoutes";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";
import { Toaster } from "@/components/ui/sonner";
import { ClearDataModal } from "./components/clearDataModal/ClearDataModal";
import { TempDataNotice } from "./components/TempDataNotice/TempDataNotice";

export const App = () => {
  const { signatureModal } = useDocumentStore();

  return (
    <>
      <AppRoutes />
      {signatureModal && <SignatureModal />}
      <ClearDataModal />
      <TempDataNotice />
      <Toaster richColors />
    </>
  );
};
