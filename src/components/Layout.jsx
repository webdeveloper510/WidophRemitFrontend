import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="p-3 d-flex flex-row">
        <Sidebar collapsed={collapsed} />

        <div className="flex-grow-1 d-flex flex-column right-side-content">
          <TopNavbar onToggleSidebar={() => setCollapsed(!collapsed)} />
          <main className="flex-grow-1 p-3 mt-3 overflow-auto">
            <AnimatePresence mode="wait">
              <Outlet key={location.pathname} />
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
