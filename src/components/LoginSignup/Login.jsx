import React, { useState, useRef, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import LoginImage from "../../assets/images/login-image.png";
import { userLogin } from "../../services/Api";

const Login = () => {
  const [visibility, setVisibility] = useState({ current: false });
  const [inputType, setInputType] = useState("email");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const mobileInputRef = useRef(null);

  useEffect(() => {
    if (inputType === "phone" && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [inputType]);

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (inputValue, setFieldValue) => {
    setFieldValue("value", inputValue);
    const likelyEmail =
      /[a-zA-Z]/.test(inputValue) && !/^\d+$/.test(inputValue);

    if (!inputValue || likelyEmail) {
      setInputType("email");
    } else {
      setInputType("phone");
    }
  };

  // Validation schema
  const validationSchema = Yup.object({
    value: Yup.string()
      .required("Email or phone number is required")
      .test(
        "email-or-phone",
        "Enter a valid email or Mobile number must be at most 10 digits",
        function (value) {
          const { countryCode } = this.parent;

          if (!value) return false;

          if (value.includes("@")) {
            return Yup.string().email().isValidSync(value);
          } else {
            const digitsOnly = value.replace(/\D/g, "");
            return digitsOnly.length <= 10;
          }
        }
      ),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    rememberMe: Yup.boolean(),
    countryCode: Yup.string().required(),
  });


  const initialValues = {
    value: "",
    password: "",
    rememberMe: false,
    countryCode: "61",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    const payload = {
      password: values.password,
    };

    if (inputType === "email") {
      payload.email = values.value;
    } else {
      const fullMobile = `+${values.countryCode}${values.value}`;
      payload.mobile = fullMobile;
    }
    try {
      const response = await userLogin(payload);
      if (response?.code === 200 || response?.code === "200") {
        navigate("/otp-verification", {
          state: {
            from: "login",
            otpData: {
              email: payload.email || "",
              mobile: payload.mobile || "",
              country_code: "AU",
            },
          },
        });
      } else {
        toast.error(response?.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container className="login-form-wrapper">
      <Row>
        {/* Left Form Column */}
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title">
              Sign <br /> In
              <span className="exchange_rate">To send money securely.</span>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
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

                      {inputType === "email" ? (
                        <Field name="value">
                          {({ field }) => (
                            <Form.Control
                              {...field}
                              type="text"
                              placeholder="Email / Mobile Number"
                              className={`form-control ${errors.value && touched.value
                                ? "is-invalid"
                                : ""
                                }`}
                              onChange={(e) =>
                                handleInputChange(e.target.value, setFieldValue)
                              }
                            />
                          )}
                        </Field>
                      ) : (
                        <div className="d-flex align-items-stretch">
                          <Form.Select
                            name="countryCode"
                            value={values.countryCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{
                              maxWidth: "100px",
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          >
                            <option value="61">+61(AU)</option>
                            <option value="64">+64(NZ)</option>
                          </Form.Select>

                          <Form.Control
                            type="text"
                            name="value"
                            placeholder="Enter mobile number"
                            value={values.value}
                            ref={mobileInputRef} // 👈 attach ref here
                            onChange={(e) =>
                              handleInputChange(e.target.value, setFieldValue)
                            }
                            onBlur={handleBlur}
                            isInvalid={touched.value && errors.value}
                            style={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                          />
                        </div>
                      )}

                      <ErrorMessage
                        name="value"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <label className="form-label">
                      Your Password<span>*</span>
                    </label>
                    <div className="custom-password">
                      <Field name="password">
                        {({ field }) => (
                          <Form.Control
                            {...field}
                            placeholder="Password"
                            className={`passowrdinput ${errors.password && touched.password
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

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Field name="rememberMe">
                      {({ field }) => (
                        <Form.Check
                          {...field}
                          type="checkbox"
                          label="Remember me"
                          checked={values.rememberMe}
                        />
                      )}
                    </Field>
                    <Link
                      to={"/forgot-password"}
                      className="text-success fw-semibold small forgotpassword-text"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="custom-signin-btn mb-3"
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting ? "Processing..." : "SIGN IN"}
                  </Button>

                  <div>
                    Don't have any account?{" "}
                    <a
                      href="/signup"
                      className="text-success fw-bold forgotpassword-text"
                    >
                      Sign Up
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

export default Login;
