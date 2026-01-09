import { useLocation } from "react-router-dom"; 
import footerlogo from "../../src/assets/images/footer-logo.png";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaRss,
  FaRegEnvelope,
  FaPhoneVolume,
  FaWhatsapp,
} from "react-icons/fa6";


const Footer = () => {
  const location = useLocation();
  const isKYC = location.pathname === "/kyc";

  return (
    <footer
      className="footer"
      style={{
        backgroundColor: "#c6dc0e",
        paddingTop: "4rem",
        paddingBottom: "2rem",
      }}
    >
      <Container>
        <Row className="mb-4">
          <Col md={3}>
            <img src={footerlogo} alt="image" />
            <p style={{ fontSize: "14px" }} className="mt-2">
              In publishing and graphic design, Lorem Ipsum is a placeholder
              text commonly...
            </p>
            <div className="d-flex gap-2 social-icons">
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

          {/* ⬇️ Conditionally hide this on /kyc */}
          {!isKYC && (
            <Col md={3}>
              <h6>
                <strong>Quick Links</strong>
              </h6>
              <ul className="list-unstyled">
                <li>
                  <a href="https://widophremit.com/">Home</a>
                </li>
                {/* <li>
                  <a href="https://widophremit.com/notify-me/">
                    International Money Transfer
                  </a>
                </li> */}
                <li>
                  <a href="https://widophremit.com/blog/">Blog</a>
                </li>
                <li>
                  <a href="https://widophremit.com/transfer-money-online-from-australia-to-nigeria/">
                    Transfer Money online from Australia to overseas
                  </a>
                </li>
                <li>
                  <a href="https://widophremit.com/community-responsibility/">
                    Social Responsibility
                  </a>
                </li>
              </ul>
            </Col>
          )}

          <Col md={3}>
            <h6>
              <strong>Contact</strong>
            </h6>
            <ul className="list-unstyled" style={{ fontSize: "14px" }}>
              <li>
                <FaRegEnvelope />{" "}
                <a href="mailto:support@widophremit.com">
                  support@widophremit.com
                </a>
              </li>
              <li>
                <FaPhoneVolume />
                <a href="tel:02 8001 6495"> 02 8001 6495, 0480 001 611</a>
              </li>
              <li>
                <FaWhatsapp /> <a href="https://api.whatsapp.com/send/?phone=61480001611&text&type=phone_number&app_absent=0">+61480001611</a>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6>
              <strong>Join Our Newsletter</strong>
            </h6>
            <Form className="d-flex mb-2">
              <Form.Control
                type="email"
                placeholder="Email Address"
                className="me-2"
              />
              <Button variant="dark">Subscribe</Button>
            </Form>
            <div style={{ fontSize: "14px" }}>
              <h6 className="mt-4">
                <strong>Address</strong>
              </h6>
              <p>
                Level 14, 275 Alfred Street North
                <br />
                Sydney, NEW SOUTH WALES, 2060
                <br />
                Australia
              </p>
            </div>
          </Col>
        </Row>

        <hr />

        <Row
          className="justify-content-between align-items-center sitelinks"
          style={{ fontSize: "14px" }}
        >
          <Col md="auto">
            © Copyright Widoph Remit 2026. All Rights Reserved
          </Col>
          <Col md="auto">
            <a href="https://widophremit.com/widophremit-terms-and-conditions/">
              Terms
            </a>
            &nbsp; | &nbsp;
            <a href="https://widophremit.com/privacy-policy/">
              Privacy
            </a>
            &nbsp; | &nbsp;
            <a href="https://widophremit.com/contact-us/">Contact</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};


export default Footer;
