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

  return (
    <div className="top-navbar">
      {/* Top Contact Info Strip */}
      <div className="top-strip py-2 text-black">
        <Container>
          <Row className="align-items-center justify-content-between login-header">
            <Col
              xs={12}
              md={6}
              className="d-flex flex-wrap gap-4 align-items-center"
            >
              <span className="d-flex flex-wrap align-items-center">
                <FaPhoneVolume />
                <a href="tel:02 8001 6495">02 8001 6495</a>
              </span>
              <span className="d-flex flex-wrap align-items-center">
                <FaWhatsapp />
                <a href="https://api.whatsapp.com/send/?phone=61480001611&text&type=phone_number&app_absent=0">
                  +61480001611
                </a>
              </span>
            </Col>
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-md-end gap-4 mt-2 mt-md-0 align-items-center"
            >
              <span className="d-flex flex-wrap align-items-center">
                <FaRegEnvelope />
                <a href="mailto:support@widophremit.com">
                  support@widophremit.com
                </a>
              </span>
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
            </Col>
          </Row>
        </Container>
      </div>

      {/* Logo Section */}
      <Container className="d-flex justify-content-between align-items-center pt-3 pb-3">
        <Navbar.Brand href="https://widophremit.com/">
          <img src={logo} alt="WidophRemit" className="logo-img" height="40" />
        </Navbar.Brand>

        <Nav className="mx-auto gap-1 align-items-center nav_main">
          <Nav.Link href="https://widophremit.com/" className="text-dark">
            Home
          </Nav.Link>

          {/* <Nav.Link
            href="https://widophremit.com/notify-me/"
            className="text-dark"
          >
            International Money Transfer
          </Nav.Link> */}

          {/* How To Dropdown (on hover) */}
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
              Update Your Profile, Check Rate And View History With The Widoph
              Remit App
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

          {/* Blog Dropdown (on hover) */}
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

          <Nav.Link
            href="https://widophremit.com/community-responsibility/"
            className="text-dark"
          >
            SR
          </Nav.Link>
        </Nav>

        <div className="d-flex align-items-center gap-3">
          <Link
            to="/signup"
            variant="primary"
            className="px-4 text-dark signup"
          >
            SIGN UP
          </Link>
          <Link
            to="/login"
            variant="primary"
            className="px-4 rounded-pill login"
          >
            LOG IN
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default TopNavbar;
