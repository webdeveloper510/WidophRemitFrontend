import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = sessionStorage.getItem("collapsed");
    return stored === "true";
  });

  const location = useLocation();
  const sidebarRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    const isMobile = window.innerWidth < 768;

    if (
      isMobile &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      setCollapsed(true);
      sessionStorage.setItem("collapsed", "true");
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  return (
    <>
      <div className="p-3 d-flex flex-row customdashboardheight">
        <div className="d-flex w-100">
        <div ref={sidebarRef}>
           <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
       </div>

          <div className="flex-grow-1 d-flex flex-column right-side-content">
            <TopNavbar onToggleSidebar={() => setCollapsed(!collapsed)} />
            <main className="flex-grow-1 p-3 mt-3">
              <AnimatePresence mode="wait">
                <Outlet key={location.pathname} />
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
