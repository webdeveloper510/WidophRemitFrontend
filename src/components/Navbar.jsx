import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import openToggle from "../assets/images/Left.png";
import closeToggle from "../assets/images/Right.png";
import LoggedUser from "../assets/images/loggeduser.png";

const TopNavbar = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = sessionStorage.getItem("collapsed");
    return stored === "true";
  });

  const [howToOpen, setHowToOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [ourCoverage, setOurCoverage] = useState(false);

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
            <Nav className="nav_main">
              <Nav.Link
                as="a"
                href="https://widophremit.com"
                className={`fw-bold`}
                style={{ backgroundColor: "transparent" }}
              >
                Home
              </Nav.Link>
              {/* 
              <Nav.Link as="a" href="https://widophremit.com/notify-me/">
                International Money Transfer
              </Nav.Link> */}

              {/* <NavDropdown title="How To" id="how-to-dropdown">
                <NavDropdown.Item as="a" href="/">
                  Send Money
                </NavDropdown.Item>
                <NavDropdown.Item as="a" href="/">
                  Receive Money
                </NavDropdown.Item>
              </NavDropdown> */}

              <NavDropdown
                title="FAQ"
                id="how-to-dropdown"
                className="text-dark"
                show={howToOpen}
                onMouseEnter={() => setHowToOpen(true)}
                onMouseLeave={() => setHowToOpen(false)}
              >
                <NavDropdown.Item href="https://widophremit.com/how-to-download-signup-order-on-the-widoph-remit-app/">
                  Download, Signup & Order on the Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-send-and-receive-money-with-the-widoph-remit-app/">
                  Send And Receive Money With The Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-update-your-profile-check-rate-and-view-history-with-the-widoph-remit-app/">
                  Update Your Profile, Check Rate And View History With The
                  Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-reset-password-on-the-widoph-remit-app/">
                  Reset Your Password on The Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-change-your-password-with-widoph-remit-app/">
                  How to Change Your Password With Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-check-rate-with-widoph-remit/">
                  How To Check rate With Widoph Remit
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-contact-widoph-remit-support-via-phone-or-whatsapp/">
                  How to Contact Widoph Remit Support via Phone or WhatsApp
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-view-transaction-history-on-widoph-remit-app/">
                  How to View Transaction History on Widoph Remit App
                </NavDropdown.Item>
              </NavDropdown>

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

              <NavDropdown
                title="Our Coverage"
                id="how-to-dropdown"
                className="text-dark"
                show={ourCoverage}
                onMouseEnter={() => setOurCoverage(true)}
                onMouseLeave={() => setOurCoverage(false)}
              >
                <NavDropdown.Item href="https://widophremit.com/send-money-from-australia-to-burkina-faso/">
                  Send Money from Australia to Burkina Faso
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-from-australia-to-cameroon/">
                  Send Money from Australia to Cameroon
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-from-australia-to-ethiopia/">
                  Send Money from Australia to Ethiopia
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-from-australia-to-the-central-african-republic/">
                  Send Money from Australia to the Central African Republic
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-from-australia-to-togo/">
                  Send Money from Australia to Togo
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-online-to-senegal-from-australia/">
                  Send money from Australia to Senegal
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-online-to-south-africa-from-australia/">
                  Send Money From Australia to South Africa
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-to-andorra/">
                  Send money from Australia to Andorra
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-to-austria/">
                  Send money from Australia to Austria
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-to-bailiwick-of-guernsey/">
                  Send Money from Australia to Bailiwick of Guernsey
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-online-to-the-bangladesh-from-australia/">
                  Send Money from Australia to Bangladesh
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-to-belgium/">
                  Send Money from Australia to Belgium
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-online-to-botswana-from-australia/">
                  Send Money from Australia to Botswana
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-to-brazil-from-australia/">
                  Send Money from Australia To Brazil
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-to-bulgaria/">
                  Send Money from Australia to Bulgaria
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/send-money-to-cambodia-from-australia/">
                  Send Money from Australia to Cambodia
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

              <Nav.Link
                as="a"
                href="https://widophremit.com/community-responsibility/"
              >
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
