import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import SignupImage from "../assets/images/signup-image.png"; // Change path as needed

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", { email, password });
    // Add actual login logic here (API call etc.)
  };

  return (
    <div className="signup-page">
      <Container className="login-form-wrapper d-flex align-items-center justify-content-center min-vh-100">
        <Row className="vh-100">
          {/* Left Form Column */}
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="form-box w-100" style={{ maxWidth: "450px" }}>
              <h2 className="form-title mb-3">
                <span className="text-primary">Sign</span>
                <span className="text-success">In</span>
                <small className="text-muted ms-2">
                  To send money securely.
                </small>
              </h2>

              <Form>
                <Form.Group className="mb-3" controlId="formPhoneOrEmail">
                  <Form.Label>Email/Mobile Number*</Form.Label>
                  <div className="d-flex">
                    <Form.Select className="me-2" style={{ maxWidth: "100px" }}>
                      <option>+61</option>
                      <option>+91</option>
                      <option>+1</option>
                    </Form.Select>
                    <Form.Control
                      type="text"
                      placeholder="Enter Email or Phone..."
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Your Password*</Form.Label>
                  <Form.Control type="password" placeholder="Enter Password" />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check label="Remember me" />
                  <a
                    href="/forgot-password"
                    className="text-success fw-semibold small"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-100 custom-signin-btn mb-3">
                  SIGN IN
                </Button>

                <div className="text-center">
                  Don’t have any account?{" "}
                  <a href="/signup" className="text-success fw-bold">
                    Sign Up
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
              <img src={SignupImage} alt="Login Art" className="clipped-img" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
