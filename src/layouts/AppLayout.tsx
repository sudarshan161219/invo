import { useEffect, useState } from "react";
import { MobileSidebar } from "./mobileSIdebar/MobileSidebar";
import { DesktopSidebar } from "./desktopSideber/DesktopSidebar";

export const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileSidebar /> : <DesktopSidebar />;
};
