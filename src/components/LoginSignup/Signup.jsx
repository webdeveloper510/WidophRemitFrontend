import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SignupImage from "../../assets/images/signup-image.png";
import { userRegisterCheck } from "../../services/Api";
import { parsePhoneNumber } from "libphonenumber-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object({
  location: Yup.string().required("Location is required"),

  phone: Yup.string()
    .required("Mobile number is required")
    .matches(/^\d{8,10}$/, "Mobile number must be between 8 and 10 digits"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});



const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const initialValues = {
    location: "Australia",
    phone: "",
    email: "",
    password: "",
    countryCode: "61", // default for Australia
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    const fullPhone = `+${values.countryCode}${values.phone}`;
    let parsedMobile = fullPhone;
    let country_code = values.countryCode === "61" ? "AU" : "NZ";

    try {
      const parsed = parsePhoneNumber(fullPhone);
      parsedMobile = parsed.number;
      country_code = parsed.country || "AU";
    } catch (error) {
      toast.error("Invalid phone number format");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    const payload = {
      account_type: "individual",
      location: values.location,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      mobile: parsedMobile,
      promo_marketing: "0",
      country_code: country_code,
    };

    try {
      const response = await userRegisterCheck(payload);
      if (response?.code === "200") {
        sessionStorage.setItem("signupData", JSON.stringify(payload));
        navigate("/otp-verification", { state: { from: "signup" } });
      } else {
        toast.error(response?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Network error. Please try again.");
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
              Sign <br />
              Up
              <span className="exchange_rate">
                Where are you sending money from?
              </span>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
              }) => {
                const handleCustomChange = (e) => {
                  const { name, value } = e.target;
                  setFieldValue(name, value);
                  setFieldTouched(name, true);

                  if (name === "location") {
                    if (value === "Australia") {
                      setFieldValue("countryCode", "61");
                    } else if (value === "New Zealand") {
                      setFieldValue("countryCode", "64");
                    }
                  } else if (name === "countryCode") {
                    if (value === "61") {
                      setFieldValue("location", "Australia");
                    } else if (value === "64") {
                      setFieldValue("location", "New Zealand");
                    }
                  }
                };

                return (
                  <Form className="exchange-form" onSubmit={handleSubmit}>
                    {/* Location */}
                    <Row className="mb-3">
                      <label className="form-label">
                        Location<span>*</span>
                      </label>
                      <Form.Select
                        name="location"
                        value={values.location}
                        onChange={handleCustomChange}
                        onBlur={handleBlur}
                        isInvalid={touched.location && errors.location}
                      >
                        <option value="Australia">Australia</option>
                        <option value="New Zealand">New Zealand</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.location}
                      </Form.Control.Feedback>
                    </Row>

                    {/* Phone Number */}
                    <Row className="mb-3 mobile_numbero">
                      <label className="form-label">
                        Mobile Number<span>*</span>
                      </label>
                      <div className="d-flex align-items-stretch p-0">
                        <Form.Select
                          name="countryCode"
                          value={values.countryCode}
                          onChange={handleCustomChange}
                          onBlur={handleBlur}
                          style={{
                            maxWidth: "110px",
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                          }}
                        >
                          <option value="61">+61 (AU)</option>
                          <option value="64">+64 (NZ)</option>
                        </Form.Select>

                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Enter mobile number"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.phone && errors.phone}
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }}
                        />
                      </div>
                      {touched.phone && errors.phone && (
                        <div className="invalid-feedback d-block">
                          {errors.phone}
                        </div>
                      )}
                    </Row>

                    <Row className="mb-3">
                      <label className="form-label">
                        Email Address<span>*</span>
                      </label>

                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Row>
                    {/* Passwords */}
                    <Row className="mb-3">
                      <Col>
                        <label className="form-label">
                          Password<span>*</span>
                        </label>
                        <div className="custom-password">
                          <Form.Control
                            placeholder="Password"
                            className="passowrdinput"
                            type={visibility.current ? "text" : "password"}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.password && errors.password}
                          />
                          <span
                            onClick={() => toggleVisibility("current")}
                            className="password-eye"
                          >
                            {visibility.current ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        {touched.password && errors.password && (
                          <div className="invalid-feedback d-block">{errors.password}</div>
                        )}
                      </Col>

                      <Col>
                        <label className="form-label">
                          Confirm Password<span>*</span>
                        </label>
                        <div className="custom-password">
                          <Form.Control
                            placeholder="Confirm Password"
                            className="passowrdinput"
                            type={visibility.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.confirmPassword && errors.confirmPassword
                            }
                          />
                          <span
                            onClick={() => toggleVisibility("confirm")}
                            className="password-eye"
                          >
                            {visibility.confirm ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                        {touched.confirmPassword && errors.confirmPassword && (
                          <div className="invalid-feedback d-block">
                            {errors.confirmPassword}
                          </div>
                        )}

                      </Col>
                    </Row>

                    {/* Submit */}
                    <Button
                      variant="success"
                      className="custom-signin-btn mb-3 btn btn-primary"
                      type="submit"
                      disabled={loading || isSubmitting}
                    >
                      {loading || isSubmitting ? "Processing..." : "SIGN UP"}
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
            <img src={SignupImage} alt="Login Art" className="clipped-img" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
