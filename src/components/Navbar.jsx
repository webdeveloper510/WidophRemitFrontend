import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import openToggle from "../assets/images/Left.png";
import closeToggle from "../assets/images/Right.png";
import LoggedUser from "../assets/images/loggeduser.png";

const TopNavbar = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
    onToggleSidebar();
  };
  return (
    <div className="d-flex align-items-center">
      {/* <button className="btn toggle-btn" onClick={onToggleSidebar}>
        <img src={openToggle} alt="toggle" />
      </button> */}
      <button className="btn toggle-btn" onClick={handleToggle}>
        <img src={collapsed ? openToggle : closeToggle} alt="toggle" />
      </button>
      <Navbar expand="lg" className="flex-grow-1">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="">
              <NavLink to="/" className="nav-link fw-bold">
                Home
              </NavLink>
              <NavLink to="/" className="nav-link">
                International Money Transfer
              </NavLink>

              <NavDropdown title="How To" id="how-to-dropdown">
                <NavDropdown.Item as={NavLink} to="/">
                  Send Money
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/">
                  Receive Money
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Blog" id="blog-dropdown">
                <NavDropdown.Item as={NavLink} to="/">
                  Tips
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/">
                  Guides
                </NavDropdown.Item>
              </NavDropdown>

              <NavLink to="/" className="nav-link">
                SR
              </NavLink>
            </Nav>

            <Nav className="ms-auto">
              <Nav.Link
                href="#"
                className="d-flex align-items-center gap-2 logged_user"
              >
                <img src={LoggedUser} alt="user" />
                <div
                  className="d-none d-sm-block"
                  style={{ fontFamily: "Lufga-regular" }}
                >
                  <h5>Peter Willson</h5>

                  <span>View Profile</span>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default TopNavbar;
