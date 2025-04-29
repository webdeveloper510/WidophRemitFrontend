import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";

const TopNavbar = ({ onToggleSidebar }) => {
  return (
    <nav className="navbar navbar-expand-lg px-3 menus">
      {/* <button
        className="btn btn-outline-light me-3 toggle-btn"
        onClick={onToggleSidebar}
      >
        <RxHamburgerMenu />
      </button> */}
      <a className="navbar-brand me-auto" href="/">
        Home
      </a>
      <div className="text-white d-flex align-items-center gap-2">
        <a className="navbar-brand me-auto" href="/">
          <FaUserCircle size={24} />
          <div
            className="d-none d-sm-block"
            style={{ fontFamily: "Lufga-regular" }}
          >
            Peter Willson
          </div>
        </a>
      </div>
    </nav>
  );
};

export default TopNavbar;
