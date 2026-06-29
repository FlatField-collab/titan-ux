import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";

const getActive = (pathname: string): "Home" | "Team" | "Chat" | "More" => {
  // Home
  if (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/news")
  ) {
    return "Home";
  }
  // Team
  if (
    pathname === "/team" ||
    pathname.startsWith("/tech/") ||
    pathname.startsWith("/visit/") ||
    pathname.startsWith("/visits") ||
    pathname === "/competencies" ||
    pathname.startsWith("/map") ||
    pathname.startsWith("/docs") ||
    pathname === "/techlocation"
  ) {
    return "Team";
  }
  // Chat
  if (pathname.startsWith("/chat")) return "Chat";
  // More
  if (
    pathname === "/performance" ||
    pathname === "/vride" ||
    pathname === "/research"
  ) {
    return "More";
  }
  console.warn(`[AppLayout] Unmatched pathname in getActive(): "${pathname}" — defaulting to "Team". Add it to the explicit mapping.`);
  return "Team";
};

export const AppLayout = () => {
  const { pathname } = useLocation();
  return (
    <>
      <Outlet />
      <BottomNav active={getActive(pathname)} />
    </>
  );
};

export default AppLayout;
