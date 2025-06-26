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
import SignupImage from "../../assets/images/signup-image.png";
import { userRegisterCheck } from "../../services/Api";
import { parsePhoneNumber } from "libphonenumber-js";
import { toast } from "react-toastify";

const Signup = () => {
  const [value, setValue] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let country_code = "";
    let phone_number = value;

    try {
      const phoneNumberParsed = parsePhoneNumber(value);
      country_code = phoneNumberParsed.countryCallingCode;
      phone_number = phoneNumberParsed.nationalNumber;
    } catch (error) {
      toast.error("Invalid phone number format");
      return;
    }

    const payload = {
      email,
      mobile: phone_number,
      country_code: `+${country_code}`,
      password,
      confirmPassword,
      location: "Australia",
    };

    const response = await userRegisterCheck(payload);
    console.log("Register response: ", response);

    if (response?.code === 200) {
      toast.success("Registration check successful");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Container className="login-form-wrapper  min-vh-100">
      <Row className="vh-100">
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title">
              Sign <br />
              Up
              <span className="exchange_rate">
                Where are you sending money from?
              </span>
            </div>

            <Form className="exchange-form" onSubmit={handleSubmit}>
              <Row className="mb-3">
                <FloatingLabel
                  controlId="floatingSelect"
                  as={Col}
                  label="Location"
                >
                  <Form.Select aria-label="Floating label select example">
                    <option value="Australia">Australia</option>
                  </Form.Select>
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="floatingInputPhone"
                  label="Mobile Number"
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
                  controlId="floatingInputEmail"
                  label="Email"
                  className="mb-3"
                >
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                type="submit"
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
