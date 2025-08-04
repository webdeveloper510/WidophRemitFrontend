import { Link, useLocation, useNavigate } from "react-router-dom";
import logoFull from "../assets/images/logo.png";
import logoSmall from "../assets/images/mobile-logo.png";
import { VscDashboard } from "react-icons/vsc";
import { RiExchangeDollarFill } from "react-icons/ri";
import { TbCreditCard, TbExchange } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { HiOutlineLogout } from "react-icons/hi";
import { useEffect } from "react";

const menuItems = [
  { path: "/dashboard", name: "Dashboard", icon: <VscDashboard /> },
  { path: "/send-money", name: "Send Money", icon: <RiExchangeDollarFill /> },
  { path: "/payment-info", name: "Payment Info", icon: <TbCreditCard /> },
  { path: "/transfers-list", name: "Transfers", icon: <TbExchange /> },
  { path: "/receivers", name: "Receivers", icon: <LuUsers /> },
];

const Sidebar = ({ collapsed, disabled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/kyc") {
    return null;
  }

  function clearSessionStorageData() {
    sessionStorage.removeItem("monova_transaction_id");
    sessionStorage.removeItem("monova_form_data");
    sessionStorage.removeItem("monova_payment_data");
    sessionStorage.removeItem("monova_payment_response");
    sessionStorage.removeItem("payload");
    sessionStorage.removeItem("selected_payment_method");
    sessionStorage.removeItem("selected_receiver");
    sessionStorage.removeItem("transaction_id");
    sessionStorage.removeItem("transfer_data");
    sessionStorage.removeItem("transfer_reason");
    sessionStorage.removeItem("final_transfer_reason");
    sessionStorage.removeItem("other_reason");
    sessionStorage.removeItem("pageIsReloading");
  }

  const handleLinkClick = () => {
    if (location.pathname === "/transaction-success") {
      clearSessionStorageData();
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    sessionStorage.setItem("collapsed", collapsed)
  }, [collapsed])


  return (
    <div
      className={`p-3 ${collapsed ? "d-none d-md-block collapse-sidebar" : "col-2 col-md-3"
        } sidebar mr-3`}
      style={{ minHeight: "100%" }}
    >
      <h4 className="text-center mb-4 logo">
        <Link to="/dashboard" onClick={handleLinkClick}>
          <img
            src={collapsed ? logoSmall : logoFull}
            alt="logo"
            style={{ height: "auto", transition: "0.3s" }}
          />
        </Link>
      </h4>

      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`nav-item mb-2 ${location.pathname === item.path ? "bg-light text-dark rounded" : ""
              }`}
          >
            <Link
              to={(!disabled || item.path === "/dashboard") && item.path}
              className="nav-link d-flex align-items-center gap-2"
              onClick={handleLinkClick}
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          </li>
        ))}

        <li className="mt-auto logout-row">
          <button
            type="button"
            className="logout-btn nav-link d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <HiOutlineLogout /> <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;