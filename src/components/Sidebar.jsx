import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoFull from "../assets/images/logo.png";
import logoSmall from "../assets/images/mobile-logo.png";
import { VscDashboard } from "react-icons/vsc";
import { RiExchangeDollarFill } from "react-icons/ri";
import { TbCreditCard } from "react-icons/tb";
import { TbExchange } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { HiOutlineLogout } from "react-icons/hi";

const menuItems = [
  { path: "/dashboard", name: "Dashboard", icon: <VscDashboard /> },
  { path: "/send-money", name: "Send Money", icon: <RiExchangeDollarFill /> },
  { path: "/payment-info", name: "Payment Info", icon: <TbCreditCard /> },
  { path: "/transfers-list", name: "Transfers", icon: <TbExchange /> },
  { path: "/receivers", name: "Receivers", icon: <LuUsers /> },
  // { path: "/monoova", name: "Monoova", icon: <TbCreditCard /> },
];

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
 const handleLogout = () => {
  sessionStorage.clear(); 
  window.location.href = "/login"; 
};
  return (
    <div
      className={`p-3 ${collapsed ? "d-none d-md-block collapse-sidebar" : "col-2 col-md-3"
        } sidebar mr-3`}
      style={{ minHeight: "100%" }}
    >
      <h4 className="text-center mb-4 logo">
        <a href="/">
          <img
            src={collapsed ? logoSmall : logoFull}
            alt="logo"
            style={{ height: collapsed ? "auto" : "auto", transition: "0.3s" }}
          />
        </a>
      </h4>
      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`nav-item mb-2 ${location.pathname === item.path
              ? "bg-light text-dark rounded"
              : ""
              }`}
          >
            <Link
              to={item.path}
              className="nav-link  d-flex align-items-center gap-2"
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          </li>
        ))}
        <li className="mt-auto logout-row">
          <a
            className="nav-link  d-flex align-items-center gap-2"
            onClick={handleLogout} 
          >
            <button type="button" className="logout-btn nav-link  d-flex align-items-center" onClick={() => {
              sessionStorage.clear();
              navigate("/login")
            }}>
              <HiOutlineLogout /> <span>Logout</span>
            </button>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
