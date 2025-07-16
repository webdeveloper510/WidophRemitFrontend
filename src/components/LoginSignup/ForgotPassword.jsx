import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { Link, useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";

import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import LoginImage from "../../assets/images/login-image.png";
import { resetEmail } from "../../services/Api";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handlePhone = (val, country) => {
    const localNumber = val.substring(country.dialCode.length);
    const formattedMobile = country.dialCode + localNumber;
    formik.setFieldValue("mobile", formattedMobile);
    formik.setFieldTouched("mobile", true);
  };

  const formik = useFormik({
    initialValues: { mobile: "" },
    validationSchema: Yup.object().shape({
      mobile: Yup.string().min(11).max(18).required("Mobile number is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const response = await resetEmail({ mobile: "+" + values.mobile });

        if (response?.data?.code === "200") {
          toast.success(response.data.message || "Reset link sent!", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
          });

          localStorage.setItem("token_forgot", response.data.token);
          navigate("/reset-password", {
            state: { customer_id: response.data.data.customer_id },
          });
        } else {
          toast.error(response?.data?.message || "Something went wrong", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
          });
        }
      } catch (err) {
        toast.error("Request failed. Please try again.");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

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

            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Col className="mb-3">
                  <Form.Label>Your Mobile Number <span style={{ color: "red" }}>*</span></Form.Label>
                  <PhoneInput
                    onlyCountries={["au", "nz"]}
                    country={"au"}
                    name="mobile"
                    inputStyle={{ border: "none" }}
                    inputClass="userPhone w-100"
                    countryCodeEditable={false}
                    onChange={handlePhone}
                    className={`form-control form-control-sm bg-transparent ${formik.touched.mobile && formik.errors.mobile
                      ? "is-invalid"
                      : formik.touched.mobile && !formik.errors.mobile
                        ? "is-valid"
                        : ""
                      }`}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="text-danger">{formik.errors.mobile}</div>
                  )}
                </Col>
              </Row>

              <Button
                type="submit"
                className="custom-signin-btn mb-3"
                disabled={loading || formik.isSubmitting}
              >
                {loading || formik.isSubmitting ? "Processing..." : "RESET"}
              </Button>

              <div>
                <Link to={"/login"}
                  className="text-success fw-bold forgotpassword-text">
                  Back to Login{" "}

                </Link >
                Go Back
              </div>
            </Form>
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
