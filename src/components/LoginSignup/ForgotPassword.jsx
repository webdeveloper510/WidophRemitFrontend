import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-input-2/lib/style.css";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";

import LoginImage from "../../assets/images/login-image.png";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Container className="login-form-wrapper">
      <Row>
        {/* Left Form Column */}
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title">
              Forgot <br /> Password
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
                    <Col className="mb-3">
                      <label className="form-label">
                        Email / Mobile Number
                      </label>
                      <Field name="value">
                        {({ field }) => (
                          <Form.Control
                            {...field}
                            type="text"
                            placeholder="Email / Mobile Number"
                            className="form-control"
                          />
                        )}
                      </Field>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="custom-signin-btn mb-3"
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting ? "Processing..." : "RESET"}
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

export default ForgotPassword;
