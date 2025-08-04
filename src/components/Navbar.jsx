import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import openToggle from "../assets/images/Left.png";
import closeToggle from "../assets/images/Right.png";
import LoggedUser from "../assets/images/loggeduser.png";

const TopNavbar = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(() => {
  const stored = sessionStorage.getItem("collapsed");
  return stored === "true";
});
;
  const location = useLocation();
  const [howToOpen, setHowToOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);



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
              <Nav.Link
                as={NavLink}
                to="/dashboard"
                className="fw-bold"
                style={{ backgroundColor: "transparent" }}
              >
                Home
              </Nav.Link>

              <Nav.Link as="a" href="https://widophremit.com/notify-me/">
                International Money Transfer
              </Nav.Link>

              {/* <NavDropdown title="How To" id="how-to-dropdown">
                <NavDropdown.Item as="a" href="/">
                  Send Money
                </NavDropdown.Item>
                <NavDropdown.Item as="a" href="/">
                  Receive Money
                </NavDropdown.Item>
              </NavDropdown> */}

              <NavDropdown
                title="How To"
                id="how-to-dropdown"
                className="text-dark"
                show={howToOpen}
                onMouseEnter={() => setHowToOpen(true)}
                onMouseLeave={() => setHowToOpen(false)}
              >
                <NavDropdown.Item href="https://widophremit.com/how-to-download-signup-order-on-the-widoph-transfer-app/">
                  Download, Signup & Order on the Widoph Transfer App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-send-and-receive-money-with-the-widoph-transfer-app/">
                  Send and Receive Money With the Widoph Transfer App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-update-your-profile-check-rate-and-view-history-with-the-widoph-transfer-app/">
                  Update Profile, Check Rate & View History
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-reset-password-on-the-widoph-transfer-app/">
                  Reset Your Password
                </NavDropdown.Item>
              </NavDropdown>

              {/* <NavDropdown title="Blog" id="blog-dropdown">
                <NavDropdown.Item as="a" href="/">
                  Tips
                </NavDropdown.Item>
                <NavDropdown.Item as="a" href="/">
                  Guides
                </NavDropdown.Item>
              </NavDropdown> */}

              <NavDropdown
                title="Blog"
                id="blog-dropdown"
                className="text-dark"
                show={blogOpen}
                onMouseEnter={() => setBlogOpen(true)}
                onMouseLeave={() => setBlogOpen(false)}
              >
                <NavDropdown.Item href="https://widophremit.com/category/money-transfer/">
                  Money Transfer
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/education/">
                  Education
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/personal-finance/">
                  Personal Finance
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/investment/">
                  Investment
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/culture/">
                  Culture
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/cost-of-living/">
                  Cost of Living
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/money-management/">
                  Money Management
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/online-transactions/">
                  Online Transactions
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/business-investment/">
                  Business & Investment
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/category/work-life-integration/">
                  Work-Life Integration
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
