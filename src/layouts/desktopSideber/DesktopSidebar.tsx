import { User, PenLine, Sun, Moon, Columns2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Nav } from "@/components/nav/Nav";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/tab/Tab";
import { useThemeStore } from "@/store/useThemeStore";
import styles from "./index.module.css";
import { useSidebarStore } from "@/store/useSidebarStore";
import { CustomTooltip } from "@/components/customTooltip/CustomTooltip";

export const DesktopSidebar = () => {
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

  const menuItems = [
    {
      label: "User Details",
      icon: <User size={18} />,
      path: "/user-details",
    },
    {
      label: "Create",
      icon: <PenLine size={18} />,
      path: "/create",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${styles.sideBar} border-r ${
          collapsed ? `${styles.sideBarClose}` : `${styles.sideBarOpen}`
        }`}
      >
        <div className={styles.myHeader}>
          {/* {!collapsed && <h1 className={styles.logo}>Invo</h1>} */}
          <NavLink to="/" className={styles.logo}>
            {collapsed ? "IN" : "Invo"}
          </NavLink>
          <button className={styles.btn} onClick={toggleSidebar}>
            {/* {!collapsed && <ChevronLeft />} */}
            <Columns2 size={22} className="cursor-pointer text-label" />
          </button>
        </div>

        {/* Sidebar Items */}
        {collapsed ? (
          <nav className={" flex flex-col gap-2 w-full p-2 "}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <CustomTooltip
                  key={item.path}
                  label={item.label}
                  position="left"
                  className={styles.tooltip}
                >
                  <Link
                    key={item.path}
                    className={`${styles.collapsedBtn} 
                    ${
                      isActive
                        ? `${styles.collapsedBtnsecondary}`
                        : `${styles.collapsedBtnghost}`
                    }`}
                    to={item.path}
                  >
                    {item.icon}
                  </Link>
                </CustomTooltip>
              );
            })}
          </nav>
        ) : (
          <nav className={"flex flex-col gap-1 w-full p-2"}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className="justify-start gap-2 w-full"
                  asChild
                >
                  <Link to={item.path}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        )}

        <div
          className={`${
            collapsed ? "hidden" : "flex"
          }  flex-col gap-1 absolute bottom-0 p-4 cursor-pointer w-full `}
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

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Nav />

        {/* Page Content */}
        <main className="flex-1 p-2 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
