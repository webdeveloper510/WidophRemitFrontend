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
    // setCollapsed((prev) => !prev);
    onToggleSidebar();
  };

   const OurCoverages = [
    {
      "title": "Austria",
      "link": "https://widophremit.com/send-money-to-austria/"
    },
    {
      "title": "Bangladesh",
      "link": "https://widophremit.com/send-money-online-to-the-bangladesh-from-australia/"
    },
    {
      "title": "Belgium",
      "link": "https://widophremit.com/send-money-to-belgium/"
    },
    {
      "title": "Cameroon",
      "link": "https://widophremit.com/australia-to-cameroon/"
    },
    {
      "title": "Canada",
      "link": "https://widophremit.com/australia-to-canada/"
    },
    {
      "title": "Central African Republic",
      "link": "https://widophremit.com/send-money-from-australia-to-the-central-african-republic/"
    },
    {
      "title": "Dr Congo",
      "link": "https://widophremit.com/send-money-from-australia-to-dr-congo-widoph-remit/"
    },
    {
      "title": "Ghana",
      "link": "https://widophremit.com/australia-to-ghana/"
    },
    {
      "title": "India",
      "link": "https://widophremit.com/australia-to-india/"
    },
    {
      "title": "Indonesia",
      "link": "https://widophremit.com/send-money-from-australia-to-indonesia-widoph-remit/"
    },
    {
      "title": "Ivory Coast",
      "link": "https://widophremit.com/senegal-2/"
    },
    {
      "title": "Kenya",
      "link": "https://widophremit.com/australia-to-kenya/"
    },
    {
      "title": "Malawi",
      "link": "https://widophremit.com/australia-to-malawi/"
    },
    {
      "title": "Maritius",
      "link": "https://widophremit.com/australia-to-mauritius/"
    },
    {
      "title": "Mozambique",
      "link": "https://widophremit.com/send-money-from-australia-to-mozambique-widoph-remit/"
    },
    {
      "title": "Namibia",
      "link": "https://widophremit.com/australia-to-namibia/"
    },
    {
      "title": "Nepal",
      "link": "https://widophremit.com/australia-to-nepal/"
    },
    {
      "title": "Nigeria",
      "link": "https://widophremit.com/australia-to-nigeria/"
    },
    {
      "title": "Philipines",
      "link": "https://widophremit.com/send-money-from-australia-to-philipines/"
    },
    {
      "title": "Rwanda",
      "link": "https://widophremit.com/australia-to-rwanda/"
    },
    {
      "title": "Senegal",
      "link": "https://widophremit.com/send-money-online-to-senegal-from-australia/"
    },
    {
      "title": "South Africa",
      "link": "https://widophremit.com/send-money-online-to-south-africa-from-australia/"
    },
    {
      "title": "Sri Lanka",
      "link": "https://widophremit.com/send-money-from-austrakia-to-sri-lanka/"
    },
    {
      "title": "Tanzania",
      "link": "https://widophremit.com/send-money-from-australia-to-tanzania/"
    },
    {
      "title": "Uganda",
      "link": "https://widophremit.com/send-money-from-australia-to-uganda-fast-transfers-widoph-remit/"
    },
    {
      "title": "United Kingdom",
      "link": "https://widophremit.com/send-money-from-australia-to-united-kingdom/"
    },
    {
      "title": "USA",
      "link": "https://widophremit.com/usa/"
    },
    {
      "title": "Vietnam",
      "link": "https://widophremit.com/send-money-from-australia-to-vietnam-widoph-remit/"
    },
    {
      "title": "West Africa CFA",
      "link": "https://widophremit.com/send-money-from-australia-to-west-africa-cfa-widoph-remit/"
    },
    {
      "title": "Zambia",
      "link": "https://widophremit.com/australia-to-zambia/"
    }
  ]

  return (
    <div className="d-flex align-items-center top-navbar">
      <button className="btn toggle-btn" onClick={handleToggle}>
        <img src={collapsed ? openToggle : closeToggle} alt="toggle" />
      </button>
      <Navbar expand="lg" className="flex-grow-1 nav_mobile">
        <Container fluid>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
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
                  {OurCoverages.map(e=>(<NavDropdown.Item href={e.link}>
                 Send Money from Australia to {e.title}
                </NavDropdown.Item>))}
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
                Social Responsibility
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
