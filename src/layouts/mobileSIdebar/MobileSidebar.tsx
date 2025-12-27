import { User, PenLine, Sun, Moon, CircleX } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Nav } from "@/components/nav/Nav";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import styles from "./index.module.css";
import { Tabs } from "@/components/tab/Tab";
import { useThemeStore } from "@/store/useThemeStore";
import { useSidebarStore } from "@/store/useSidebarStore";

export const MobileSidebar = () => {
  const location = useLocation();
  const { collapsed, toggleSidebar } = useSidebarStore();
  const { theme, toggleLight, toggleDark } = useThemeStore();

  const themeTabs = [
    { id: "light", label: "Light", icon: <Sun size={18} />, content: null },
    { id: "dark", label: "Dark", icon: <Moon size={18} />, content: null },
  ];

  const handleThemeChange = (id: string | number) => {
    if (id === "light") toggleLight();
    if (id === "dark") toggleDark();
  };
  const mainMenuItems = [
    {
      label: "User Details",
      icon: <User size={18} />,
      path: "/user-details",
    },
    {
      label: "Create Invoice",
      icon: <PenLine size={18} />,
      path: "/create",
    },
  ];

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`border-r ${styles.sidebar} transition-all duration-300 ${
          collapsed ? "w-0" : "w-70"
        }`}
      >
        <div
          className={`items-center justify-between p-4 ${styles.header} ${
            collapsed ? "hidden" : "flex"
          }`}
        >
          <NavLink to="/" className={styles.logo}>
            {collapsed ? "IN" : "Invo"}
          </NavLink>
          <button
            className={`cursor-pointer z-10 ${collapsed ? "hidden" : "inline"}`}
            onClick={toggleSidebar}
          >
            <CircleX className="cursor-pointer" />
          </button>
        </div>
        {/* Main Menu */}
        <div
          className={`flex flex-col gap-1 mt-4 p-2 ${
            collapsed ? "hidden" : "flex"
          }`}
        >
          <span className=" mb-1 text-sm text-(--label)">menu</span>
          {mainMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start gap-2 w-full"
                onClick={toggleSidebar}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>

        <div
          className={`${
            collapsed ? "hidden" : "flex"
          }  flex-col gap-2.5 absolute bottom-0 p-2 cursor-pointer w-full`}
        >
          <div
            className={`flex flex-col gap-1 ${collapsed ? "hidden" : "flex"}`}
          >
            <span className="ml-4 mb-1 text-sm text-(--label)">Theme</span>
            <Tabs
              tabs={themeTabs}
              activeId={theme}
              onTabChange={handleThemeChange}
              variant="default"
            />
          </div>
        </div>
      </div>

      <div className={styles.appcontainer}>
        <Nav />

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <div
        onClick={toggleSidebar}
        className={`${styles.backdrop} ${
          collapsed ? "hidden" : "inline"
        } transition-all duration-300`}
      ></div>
    </div>
  );
};
