import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import loginImage from "../assets/images/login-image.png"; // Change path as needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", { email, password });
    // Add actual login logic here (API call etc.)
  };

  return (
    <div className="login-page">
      <Container fluid>
        <Row className="vh-100">
          {/* Left Form Column */}
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="login-form-wrapper">
              <h2 className="form-title">
                <span className="text-primary">Sign</span>
                <span className="text-success">Up</span>
                <span className="small text-muted">
                  {" "}
                  Where are you sending money from?
                </span>
              </h2>
              <Form>
                <Form.Group controlId="formLocation" className="mb-3">
                  <Form.Label>Location*</Form.Label>
                  <Form.Select>
                    <option>Australia</option>
                    <option>India</option>
                    <option>USA</option>
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Phone*</Form.Label>
                      <Form.Control type="tel" placeholder="+61..." />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Email*</Form.Label>
                      <Form.Control type="email" placeholder="Enter Email Id" />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Password*</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter Password"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password*</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3 d-flex align-items-center">
                  <Form.Check />
                  <span className="ms-2 small">
                    Reference site about Lorem Ipsum, giving info on its
                    origins.
                  </span>
                </Form.Group>

                <Button variant="success" className="w-100 custom-signup-btn">
                  SIGN UP
                </Button>

                <div className="text-center mt-3">
                  Already have an account?{" "}
                  <a href="/login" className="text-success fw-bold">
                    Sign in
                  </a>
                </div>
              </Form>
            </div>
          </Col>

          {/* Right Image Column */}
          <Col
            md={6}
            className="d-none d-md-flex align-items-center justify-content-center bg-light"
          >
            <div className="image-wrapper">
              <img src={loginImage} alt="Login Art" className="clipped-img" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
