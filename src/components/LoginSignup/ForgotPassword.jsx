import { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { parsePhoneNumber } from "libphonenumber-js";

import LoginImage from "../../assets/images/login-image.png";
import { resetEmail } from "../../services/Api";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      mobile: "",
      countryCode: "61" // default for Australia
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .required("Mobile number is required")
        .test(
          "is-valid-mobile",
          "Mobile number must be between 8 and 10 digits",
          function (value) {
            if (!value) return false;
            const digitsOnly = value.replace(/\D/g, "");
            return /^\d{8,10}$/.test(digitsOnly);
          }
        ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);

      const fullPhone = `+${values.countryCode}${values.mobile}`;
      let parsedMobile = fullPhone;

      try {
        const parsed = parsePhoneNumber(fullPhone);
        parsedMobile = parsed.number;
      } catch (error) {
        toast.error("Invalid phone number format");
        setLoading(false);
        setSubmitting(false);
        return;
      }

      try {
        const response = await resetEmail({ mobile: parsedMobile });

        if (response?.data?.code === "200") {
          toast.success(response.data.message || "Reset link sent!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
          });

          localStorage.setItem("token_forgot", response.data.token);
          navigate("/reset-password", {
            state: { customer_id: response.data.data.customer_id },
          });
        } else {
          toast.error(response?.data?.message || "Something went wrong", {
            position: "top-right",
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

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, "");

    formik.setFieldValue(name, digitsOnly);
    formik.setFieldTouched(name, true);
  };

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
              <Row className="mb-3 mobile_numbero">
                <Col className="mb-3">
                  <Form.Label>
                    Your Mobile Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <div className="d-flex align-items-stretch p-0">
                    <Form.Select
                      name="countryCode"
                      value={formik.values.countryCode}
                      onChange={handleCustomChange}
                      onBlur={formik.handleBlur}
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
                      name="mobile"
                      placeholder="Enter mobile number"
                      value={formik.values.mobile}
                      onChange={handleCustomChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.mobile && formik.errors.mobile}
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                    />
                  </div>
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.mobile}
                    </div>
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
                <Link
                  to={"/login"}
                  className="text-success fw-bold forgotpassword-text"
                >
                  Back to Login{" "}
                </Link>
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