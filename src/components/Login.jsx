import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoginImage from "../assets/images/login-image.png"; // Change path as needed

const Login = () => {
  const [value, setValue] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [visibility, setVisibility] = useState({
    current: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Container className="login-form-wrapper  min-vh-100">
      <Row className="vh-100">
        {/* Left Form Column */}
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title">
              Sign <br></br>In
              <span className="exchange_rate">To send money securely.</span>
            </div>
            {/* <h2 className="form-title mb-3">
                Sign In
                <small className="text-muted ms-2">
                  To send money securely.
                </small>
              </h2> */}

            <Form className="exchange-form">
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="floatingInput"
                  label="Email/Mobile Number"
                  className="mb-3 mobileinput"
                >
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="AU"
                    value={value}
                    onChange={setValue}
                  />
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="floatingCurrentPassword"
                  label="Current Password"
                  className="mb-3 position-relative"
                >
                  <Form.Control
                    placeholder="Current Password"
                    className="passowrdinput"
                    type={visibility.current ? "text" : "password"}
                  />
                  <span
                    onClick={() => toggleVisibility("current")}
                    className="password-eye"
                  >
                    {visibility.current ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </FloatingLabel>
              </Row>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check label="Remember me" />
                <a
                  href="/forgot-password"
                  className="text-success fw-semibold small forgotpassword-text"
                >
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="custom-signin-btn mb-3">
                SIGN IN
              </Button>

              <div>
                Don’t have any account?{" "}
                <a
                  href="/signup"
                  className="text-success fw-bold forgotpassword-text "
                >
                  Sign Up
                </a>
              </div>
            </Form>
          </div>
        </Col>
        {/* Right Image Column */}
        <Col
          md={5}
          className="d-none d-md-flex align-items-center justify-content-end bg-light"
        >
          <div className="image-wrapper">
            <img src={LoginImage} alt="Login Art" className="clipped-img" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
