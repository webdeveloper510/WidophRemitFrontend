import React from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";

const TopNavbar = ({ onToggleSidebar }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <button className="btn btn-outline-light me-3" onClick={onToggleSidebar}>
        <FaBars />
      </button>
      <a className="navbar-brand me-auto" href="/">
        Home
      </a>
      <div className="text-white d-flex align-items-center gap-2">
        <FaUserCircle size={24} />
        <div
          className="d-none d-sm-block"
          style={{ fontFamily: "Lufga-regular" }}
        >
          Peter Willson
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
