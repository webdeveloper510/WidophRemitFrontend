import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
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
                <a href="https://api.whatsapp.com/send/?phone=61480001611&text&type=phone_number&app_absent=0">+61480001611</a>
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

        <Nav className="mx-auto gap-3 align-items-center">
          <Nav.Link href="/" className="fw-bold text-dark">
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

          <Nav.Link href="https://widophremit.com/community-responsibility/" className="text-dark">
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
