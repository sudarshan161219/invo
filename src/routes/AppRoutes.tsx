import { Routes, Route } from "react-router-dom";
import { UserDetailsPage } from "@/modules/userdetails/UserDetailsPage";
import { CreateDocument } from "@/modules/createDocument/pages/CreateDocument";
import { WelcomePage } from "@/modules/welcomePage/WelcomePage";
import { AppLayout } from "@/layouts/AppLayout";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Page (Full screen, no sidebar) */}
      <Route path="/" element={<WelcomePage />} />

      {/* App Layout Pages */}
      <Route element={<AppLayout />}>
        <Route path="/user-details" element={<UserDetailsPage />} />
        <Route path="/create" element={<CreateDocument />} />
      </Route>
    </Routes>
  );
};
