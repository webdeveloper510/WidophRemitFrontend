import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-input-2/lib/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LoginImage from "../../assets/images/login-image.png";
import { resetPassword } from "../../services/Api";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const { customer_id } = useLocation().state || {};
  const navigate = useNavigate();

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validationSchema = Yup.object().shape({
    reset_password_otp: Yup.string()
      .length(6, "OTP must be of 6 digits")
      .required("OTP is required"),
    password: Yup.string()
      .required("Password is required")                          
      .min(8, "Password must be at least 8 characters long")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords did not match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);
    try {
      const res = await resetPassword({
        customer_id,
        password: values.password,
        reset_password_otp: values.reset_password_otp,
      });

      if (res.code === "200") {
        toast.success("Password Reset Successfully, please login to continue", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
        resetForm();
        navigate("/login");
      } else if (res.code === "400") {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      const errRes = error?.response;
      toast.error(
        errRes?.message || errRes?.data?.message || errRes?.non_field_errors || "Error occurred",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
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
              <span className="exchange_rate optTagLine">To send money securely.</span>
            </div>

            <Formik
              initialValues={{
                reset_password_otp: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              validateOnMount
              onSubmit={async (values, actions) => {
                const errors = await actions.validateForm();
                if (Object.keys(errors).length > 0) {
                  actions.setTouched({
                    reset_password_otp: true,
                    password: true,
                    confirmPassword: true,
                  });
                  return;
                }

                handleSubmit(values, actions);
              }}
            >
              {({ errors, touched, isSubmitting, values, setFieldValue }) => {

                return (
                  <FormikForm className="exchange-form">
                    {/* OTP Field */}
                    <Row className="mb-3">
                      <label className="form-label">
                        Reset Password OTP <span>*</span>
                      </label>
                      <Field name="reset_password_otp">
                        {({ field }) => (
                          <Form.Control
                            {...field}
                            type="text"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={values.reset_password_otp}
                            onChange={(e) => {
                              const filtered = e.target.value.replace(/[^0-9]/g, "");
                              setFieldValue("reset_password_otp", filtered);
                            }}
                            className={`${errors.reset_password_otp && touched.reset_password_otp
                              ? "is-invalid"
                              : ""
                              }`}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="reset_password_otp"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Row>

                    {/* Password Field */}
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
                              className={`passowrdinput ${errors.password && touched.password ? "is-invalid" : ""
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
                      <div className="w-100">
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback d-block"
                        />
                      </div>

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
                              className={`passowrdinput ${errors.confirmPassword && touched.confirmPassword
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
                      <div className="w-100">
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="invalid-feedback d-block"
                        />
                      </div>

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
                      <Link to="/login" className="text-success fw-bold forgotpassword-text">
                        Go Back
                      </Link>
                    </div>
                  </FormikForm>
                );
              }}
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
