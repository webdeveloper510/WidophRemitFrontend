import { useState } from "react";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import logo from "../../assets/images/login-logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaRss,
  FaRegEnvelope,
  FaPhoneVolume,
  FaWhatsapp,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const TopNavbar = () => {
  const [howToOpen, setHowToOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [ourCoverage, setOurCoverage] = useState(false);

  const isDesktop = () => window.innerWidth > 991;

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
    <div className="top-navbar">
      {/* ================= TOP STRIP ================= */}
      <div className="top-strip py-2 text-black">
        <Container>
          <Row className="align-items-center justify-content-between login-header">
            <Col
              xs={12}
              md={6}
              className="d-flex flex-wrap gap-4 align-items-center"
            >
              <span className="d-flex align-items-center gap-0">
                <FaPhoneVolume />
                <a href="tel:02 8001 6495">02 8001 6495</a>
              </span>

              <span className="d-flex align-items-center gap-0">
                <FaWhatsapp />
                <a href="https://api.whatsapp.com/send/?phone=61480001611">
                  +61480001611
                </a>
              </span>
              <span className="d-flex align-items-center gap-0">
                <FaRegEnvelope />
                <a href="mailto:support@widophremit.com">
                  support@widophremit.com
                </a>
              </span>
            </Col>

            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-md-end gap-4 mt-2 mt-md-0 align-items-center"
            >
              <div className="d-flex social-icons">
                <a href="https://www.facebook.com/widophRemit">
                  <FaFacebookF />
                </a>
                <a href="https://x.com/WidophRemit">
                  <FaXTwitter />
                </a>
                <a href="https://www.instagram.com/widophremit/">
                  <FaInstagram />
                </a>
                <a href="https://widophremit.com/feed/">
                  <FaRss />
                </a>
              </div>
              <a
                href="https://widophremit.com/#app-section"
                className="download_btn"
              >
                Download App
              </a>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <Navbar expand="lg" className="pt-3 pb-3">
        <Container>
          <Navbar.Brand href="https://widophremit.com/">
            <img src={logo} alt="WidophRemit" height="40" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar-nav" />

          {/* ✅ MOBILE LOGIN/SIGNUP BELOW TOGGLE */}
          <div className="w-100 d-lg-none mt-3 mobile_btns">
            <Link to="/signup" className="btn mb-2 sign_up">
              SIGN UP
            </Link>
            <Link to="/login" className="btn login-btn">
              LOG IN
            </Link>
          </div>

          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="mx-auto gap-lg-3 nav_main mt-3 mt-lg-0">
              <Nav.Link href="https://widophremit.com/" className="text-dark">
                Home
              </Nav.Link>

              {/* FAQ */}
              <NavDropdown
                title="FAQ"
                id="faq-dropdown"
                show={howToOpen}
                onMouseEnter={() => isDesktop() && setHowToOpen(true)}
                onMouseLeave={() => isDesktop() && setHowToOpen(false)}
                onClick={() => !isDesktop() && setHowToOpen(!howToOpen)}
              >
                <NavDropdown.Item href="https://widophremit.com/how-to-sign-up-on-widoph-remit-app-using-veriff/">
                  How To Sign Up On Widoph Remit App Using Veriff
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-send-and-receive-money-with-the-widoph-remit-app/">
                  Send And Receive Money With The Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-change-your-password-with-widoph-remit-app/">
                  How to Change Your Password With Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-view-transaction-history-on-widoph-remit-app/">
                  How to View Transaction History on Widoph Remit App
                </NavDropdown.Item>

                <NavDropdown.Item href="https://widophremit.com/how-to-update-your-profile-check-rate-and-view-history-with-the-widoph-remit-app/">
                  Update Your Profile, Check Rate And View History With The
                  Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-reset-password-on-the-widoph-remit-app/">
                  Reset Your Password on The Widoph Remit App
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-contact-widoph-remit-support-via-phone-or-whatsapp/">
                  How to Contact Widoph Remit Support via Phone or WhatsApp
                </NavDropdown.Item>
                <NavDropdown.Item href="https://widophremit.com/how-to-check-rate-with-widoph-remit/">
                  How To Check rate With Widoph Remit
                </NavDropdown.Item>
              </NavDropdown>

              {/* Blog */}
              <NavDropdown
                title="Blog"
                id="blog-dropdown"
                show={blogOpen}
                onMouseEnter={() => isDesktop() && setBlogOpen(true)}
                onMouseLeave={() => isDesktop() && setBlogOpen(false)}
                onClick={() => !isDesktop() && setBlogOpen(!blogOpen)}
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

              {/* Coverage */}
              <NavDropdown
                title="Our Coverage"
                id="coverage-dropdown"
                show={ourCoverage}
                onMouseEnter={() => isDesktop() && setOurCoverage(true)}
                onMouseLeave={() => isDesktop() && setOurCoverage(false)}
                onClick={() => !isDesktop() && setOurCoverage(!ourCoverage)}
              >
                {OurCoverages.map(e=>(<NavDropdown.Item href={e.link}>
                 Send Money from Australia to {e.title}
                </NavDropdown.Item>))}
              </NavDropdown>

              <Nav.Link
                href="https://widophremit.com/community-responsibility/"
                className="text-dark"
              >
                Social Responsibility
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* Desktop Buttons */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <Link to="/signup" className="px-4 text-dark signup">
              SIGN UP
            </Link>
            <Link to="/login" className="px-4 rounded-pill login">
              LOG IN
            </Link>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default TopNavbar;
