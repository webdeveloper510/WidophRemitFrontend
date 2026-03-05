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
              className="social-box d-flex justify-content-md-end gap-1 mt-2 mt-md-0"
            >
<<<<<<< HEAD
              

              <div className="d-flex social-icons gap-0">
=======
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
>>>>>>> 69d27e3e6274ca27b0fefd3cdcedb3ddbba139cb
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
<<<<<<< HEAD
              <a href="https://widophremit.com/#app-section" className="download_btn">Download App</a>
=======

              <button className="download-btn">
                <a href="https://widophremit.com/#app-section">Download App</a>
              </button>
>>>>>>> 69d27e3e6274ca27b0fefd3cdcedb3ddbba139cb
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
                <NavDropdown.Item href="https://widophremit.com/how-to-download-signup-order-on-the-widoph-remit-app/">
<<<<<<< HEAD
              Download, Signup & Order on the Widoph Remit App
            </NavDropdown.Item>
            <NavDropdown.Item href="https://widophremit.com/how-to-send-and-receive-money-with-the-widoph-remit-app/">
              Send And Receive Money With The Widoph Remit App
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
            <NavDropdown.Item href="https://widophremit.com/how-to-update-your-profile-check-rate-and-view-history-with-the-widoph-remit-app/">
              Update Your Profile, Check Rate And View History With The Widoph
              Remit App
            </NavDropdown.Item>
=======
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
>>>>>>> 69d27e3e6274ca27b0fefd3cdcedb3ddbba139cb
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
