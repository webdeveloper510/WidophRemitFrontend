import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../assets/images/login-logo.png"; // Make sure this path is correct

const TopNavbar = () => {
  return (
    <div className="top-navbar">
      {/* Top Contact Info Strip */}
      <div className="top-strip py-2 text-black">
        <Container>
          <Row className="align-items-center justify-content-between">
            <Col xs={12} md={6} className="d-flex flex-wrap gap-4">
              <span>
                <i className="bi bi-telephone"></i> 02 8001 6495
              </span>
              <span>
                <i className="bi bi-whatsapp"></i> +61480001611
              </span>
            </Col>
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-md-end gap-4 mt-2 mt-md-0"
            >
              <span>
                <i className="bi bi-envelope"></i> support@widophremit.com
              </span>
              <span className="d-flex gap-2">
                <i className="bi bi-info-circle"></i>
                <i className="bi bi-x-circle"></i>
                <i className="bi bi-instagram"></i>
                <i className="bi bi-skype"></i>
              </span>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Logo Section */}
      <Container>
        <div className="logo-strip  py-3">
          <img src={logo} alt="WidophRemit" className="logo-img" />
        </div>
      </Container>
    </div>
  );
};

export default TopNavbar;
