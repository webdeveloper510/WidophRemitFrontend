import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-input-2/lib/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";

import LoginImage from "../../assets/images/login-image.png";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (inputValue, setFieldValue) => {
    setFieldValue("value", inputValue);
    if (!inputValue || inputValue.includes("@")) {
      setInputType("email");
    } else {
      setInputType("phone");
    }
  };

  return (
    <Container className="login-form-wrapper">
      <Row>
        {/* Left Form Column */}
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title">
              Reset <br /> Password
              <span className="exchange_rate optTagLine">
                {" "}
                To send money securely.
              </span>
            </div>

            <Formik>
              {({
                values,
                setFieldValue,
                errors,
                touched,
                isSubmitting,
                handleChange,
                handleBlur,
              }) => (
                <FormikForm className="exchange-form">
                  <Row className="mb-3">
                    <label className="form-label">
                      Password <span>*</span>
                    </label>
                    <div className="custom-password">
                      <Field name="password">
                        {({ field }) => (
                          <Form.Control
                            {...field}
                            placeholder="Password"
                            className={`passowrdinput ${
                              errors.password && touched.password
                                ? "is-invalid"
                                : ""
                            }`}
                            type={visibility.current ? "text" : "password"}
                          />
                        )}
                      </Field>
                      <span
                        onClick={() => toggleVisibility("current")}
                        className="password-eye"
                        style={{ cursor: "pointer" }}
                      >
                        {visibility.current ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </Row>
                  <Row className="mb-3">
                    <label className="form-label">
                      Confirm Password <span>*</span>
                    </label>
                    <div className="custom-password">
                      <Field name="password">
                        {({ field }) => (
                          <Form.Control
                            {...field}
                            placeholder="Confirm Password"
                            className={`passowrdinput ${
                              errors.password && touched.password
                                ? "is-invalid"
                                : ""
                            }`}
                            type={visibility.confirm ? "text" : "password"}
                          />
                        )}
                      </Field>
                      <span
                        onClick={() => toggleVisibility("confirm")}
                        className="password-eye"
                        style={{ cursor: "pointer" }}
                      >
                        {visibility.confirm ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </Row>

                  <Button
                    type="submit"
                    className="custom-signin-btn mb-3"
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting ? "Processing..." : "UPDATE"}
                  </Button>

                  <div>
                    Back to Login{" "}
                    <a
                      href="/login"
                      className="text-success fw-bold forgotpassword-text"
                    >
                      Go Back
                    </a>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </Col>

        <Col
          md={5}
          className="d-none d-md-flex align-items-center justify-content-end"
        >
          <div className="image-wrapper">
            <img src={LoginImage} alt="Login Art" className="clipped-img" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
