import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { parsePhoneNumber } from "libphonenumber-js";

import LoginImage from "../../assets/images/login-image.png";
import { userLogin } from "../../services/Api";

const Login = () => {
  const [value, setValue] = useState(""); 
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState({ current: false });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      password,
    };

    if (value.includes("@")) {
      payload.email = value;
    } else {
      try {
        const phone = parsePhoneNumber(value);
        payload.mobile = phone.nationalNumber;
        payload.country_code = `+${phone.countryCallingCode}`;
      } catch (err) {
        toast.error("Invalid mobile number");
        return;
      }
    }

    const response = await userLogin(payload);
    console.log("Login response:", response);

    if (response?.status === 200) {
      toast.success("Login successful");
      // localStorage.setItem("token", response.token); // if needed
      // navigate("/dashboard"); // if using react-router
    } else {
      toast.error(response?.data?.message || "Login failed");
    }
  };

  return (
    <Container className="login-form-wrapper min-vh-100">
      <Row className="vh-100">
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title">
              Sign <br /> In
              <span className="exchange_rate">To send money securely.</span>
            </div>

            <Form className="exchange-form" onSubmit={handleSubmit}>
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="floatingInput"
                  label="Email / Mobile Number"
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
                  label="Password"
                  className="mb-3 position-relative"
                >
                  <Form.Control
                    placeholder="Password"
                    className="passowrdinput"
                    type={visibility.current ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  className="text-success fw-bold forgotpassword-text"
                >
                  Sign Up
                </a>
              </div>
            </Form>
          </div>
        </Col>

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
