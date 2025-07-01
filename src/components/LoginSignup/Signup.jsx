import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SignupImage from "../../assets/images/signup-image.png"; // Change path as needed

const Signup = () => {
  const [value, setValue] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [visibility, setVisibility] = useState({
    current: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Container className="login-form-wrapper">
      <Row>
        {/* Left Form Column */}
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title">
              Sign <br></br>Up
              <span className="exchange_rate">
                Where are you sending money from?
              </span>
            </div>
            {/* <h2 className="form-title">
                <span className="text-primary">Sign</span>
                <span className="text-success">Up</span>
                <span className="small text-muted">
                  {" "}
                  Where are you sending money from?
                </span>
              </h2> */}
            <Form className="exchange-form">
              <Row className="mb-3">
                <FloatingLabel
                  controlId="floatingSelect"
                  as={Col}
                  label="Location"
                >
                  <Form.Select aria-label="Floating label select example">
                    <option value="1">AUD</option>
                    <option value="2">USD</option>
                  </Form.Select>
                </FloatingLabel>
              </Row>

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
                <FloatingLabel
                  as={Col}
                  controlId="floatingInput"
                  label="Email"
                  className="mb-3"
                >
                  <Form.Control type="email" placeholder="Enter email" />
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                {/* Current Password */}
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

                {/* Confirm Password */}
                <FloatingLabel
                  as={Col}
                  controlId="floatingConfirmPassword"
                  label="Confirm Password"
                  className="position-relative"
                >
                  <Form.Control
                    placeholder="Confirm Password"
                    className="passowrdinput"
                    type={visibility.confirm ? "text" : "password"}
                  />
                  <span
                    onClick={() => toggleVisibility("confirm")}
                    className="password-eye"
                  >
                    {visibility.confirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </FloatingLabel>
              </Row>

              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check />
                <span className="ms-2 small">
                  Reference site about Lorem Ipsum, giving info on its origins.
                </span>
              </Form.Group>

              <Button
                variant="success"
                className="custom-signin-btn mb-3 btn btn-primary"
              >
                SIGN UP
              </Button>

              <div className="mt-3">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-success fw-bold forgotpassword-text"
                >
                  Sign in
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
            <img src={SignupImage} alt="Login Art" className="clipped-img" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
