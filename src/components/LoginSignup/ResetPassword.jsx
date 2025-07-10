import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-input-2/lib/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import LoginImage from "../../assets/images/login-image.png";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      console.log("Form Submitted:", values);
      // API call here
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container className="login-form-wrapper">
      <Row>
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title">
              Reset <br /> Password
              <span className="exchange_rate optTagLine">
                {" "}
                To send money securely.
              </span>
            </div>

            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <FormikForm className="exchange-form">
                  {/* Password */}
                  <Row className="mb-3">
                    <label className="form-label">
                      Password <span>*</span>
                    </label>
                    <div className="custom-password">
                      <Field name="password">
                        {({ field }) => (
                          <Form.Control
                            {...field}
                            type={visibility.password ? "text" : "password"}
                            placeholder="Password"
                            className={`passowrdinput ${
                              errors.password && touched.password
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                        )}
                      </Field>
                      <span
                        onClick={() => toggleVisibility("password")}
                        className="password-eye"
                        style={{ cursor: "pointer" }}
                      >
                        {visibility.password ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </Row>

                  {/* Confirm Password */}
                  <Row className="mb-3">
                    <label className="form-label">
                      Confirm Password <span>*</span>
                    </label>
                    <div className="custom-password">
                      <Field name="confirmPassword">
                        {({ field }) => (
                          <Form.Control
                            {...field}
                            type={visibility.confirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className={`passowrdinput ${
                              errors.confirmPassword && touched.confirmPassword
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                        )}
                      </Field>
                      <span
                        onClick={() => toggleVisibility("confirmPassword")}
                        className="password-eye"
                        style={{ cursor: "pointer" }}
                      >
                        {visibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="invalid-feedback"
                    />
                  </Row>

                  {/* Submit Button */}
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
