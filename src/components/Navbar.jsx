import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import openToggle from "../assets/images/Left.png";
import closeToggle from "../assets/images/Right.png";
import LoggedUser from "../assets/images/loggeduser.png";

const TopNavbar = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
    onToggleSidebar();
  };

  return (
    <div className="d-flex align-items-center">
      <button className="btn toggle-btn" onClick={handleToggle}>
        <img src={collapsed ? openToggle : closeToggle} alt="toggle" />
      </button>
      <Navbar expand="lg" className="flex-grow-1">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="">
              <Nav.Link as="a" href="https://widophremit.com/" className="fw-bold">
                Home
              </Nav.Link>
              <Nav.Link as="a" href="https://widophremit.com/notify-me/">
                International Money Transfer
              </Nav.Link>

              <NavDropdown title="How To" id="how-to-dropdown">
                <NavDropdown.Item as="a" href="https://widophremit.com/how-to-send-and-receive-money-with-the-widoph-transfer-app/">
                  Send Money
                </NavDropdown.Item>
                <NavDropdown.Item as="a" href="https://widophremit.com/how-to-send-and-receive-money-with-the-widoph-transfer-app/">
                  Receive Money
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Blog" id="blog-dropdown">
                <NavDropdown.Item as="a" href="/">
                  Tips
                </NavDropdown.Item>
                <NavDropdown.Item as="a" href="/">
                  Guides
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as="a" href="https://widophremit.com/community-responsibility/">
                SR
              </Nav.Link>
            </Nav>

            <Nav className="ms-auto">
              <Nav.Link
                as={NavLink}
                to="/profile-information"
                className="d-flex align-items-center gap-2 logged_user"
              >
                <img src={LoggedUser} alt="user" />
                <div
                  className="d-none d-sm-block"
                  style={{ fontFamily: "Lufga-regular" }}
                >
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
