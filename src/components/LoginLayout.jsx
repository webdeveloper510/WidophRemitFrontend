import React from "react";
import TopNavbar from "./TopNavbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <TopNavbar />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LoginLayout;
