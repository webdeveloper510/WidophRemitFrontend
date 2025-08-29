import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import {
  userRegisterVerify,
  sendEmail,
  registerOtpResend,
  verifyEmail,
  resendOtp,
} from "../../services/Api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoginImage from "../../assets/images/login-image.png";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "signup";

  useEffect(() => {
    if (from === "signup") {
      const storedData = sessionStorage.getItem("signupData");
      if (storedData) {
        setUserData(JSON.parse(storedData));
      } else {
        toast.error("No signup data found. Please complete signup first.");
        navigate("/signup");
      }
    } else if (from === "login") {
      const loginOtpData = location.state?.otpData;
      if (loginOtpData) {
        setUserData({
          ...loginOtpData,
          account_type: "individual",
        });
      } else {
        toast.error("Missing login data. Please login again.");
        navigate("/login");
      }
    }
    else {
      toast.error("Invalid access. Please start again.");
      navigate("/login");
    }
  }, [from, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setIsProcessing(true);

    try {
      const payload = {
        ...userData,
        otp,
      };

      let response;

      if (from === "login") {
        response = await verifyEmail(payload);
      } else {
        response = await userRegisterVerify(payload);
      }

      if (response && response.code === "200") {
        if (response?.access_token) {
          sessionStorage.setItem("token", response.access_token);

          try {
            if (from === "signup")
              await sendEmail();
          } catch {
            toast.error("Email send error.");
          }
        }

        if (from === "signup") {
          toast.success("Registration successful");
          sessionStorage.removeItem("signupData");
          navigate("/kyc");
          return;
        }

        if (from === "login") {
          toast.success("Logged in successfully.");
          navigate("/dashboard");
          return;
        }
      } else {
        toast.error(response?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const handleResendOtp = async () => {
    setIsProcessing(true);
    setOtp("")

    try {
      const payload = {
        mobile: userData.mobile,
      };

      let response;

      if (from === "signup") {
        response = await registerOtpResend({ mobile: JSON.parse(sessionStorage.getItem("signupData")).mobile })

      } else {
        response = await resendOtp(payload);
      }

      if (response?.code === "200") {
        toast.success(response?.message || "OTP has been resent successfully!");
      } else {
        toast.error(response?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error("Something went wrong while resending OTP");
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <Container className="login-form-wrappe">
      <Row>
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title mb-4">
              OTP <br />
              Verification
              <span className="exchange_rate optTagLine">
                Please enter the verifcation code to Continue
              </span>
            </div>

            {isProcessing && (
              <div className="mb-3 text-info small">
                <div className="d-flex align-items-center">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  {from === "transfer"
                    ? "Processing payment..."
                    : "Processing your verification..."}
                </div>
              </div>
            )}

            <Form className="exchange-form" onSubmit={handleSubmit}>
              <Row className="mb-4">
                <Col className="inputBoxStyle">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    separator={<span style={{ margin: "0 6px" }}>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{
                      width: "3rem",
                      height: "3rem",
                      fontSize: "1.5rem",
                      borderRadius: "8px",
                      border: "1px solid #ced4da",
                      textAlign: "center",
                    }}
                    disabled={isProcessing}
                  />
                </Col>
              </Row>

              <Button
                type="submit"
                className="custom-signin-btn mb-3 btn btn-success"
                disabled={loading || !userData || isProcessing}
              >
                {loading
                  ? "Verifying..."
                  : isProcessing
                    ? from === "transfer"
                      ? "Processing Payment..."
                      : "Processing..."
                    : "Verify OTP"}
              </Button>

              <div className="small text-muted mt-3">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="btn btn-link text-success fw-semibold p-0 forgotpassword-text"
                  onClick={handleResendOtp}
                  disabled={loading || isProcessing}
                >
                  Resend
                </button>
              </div>

              <div className="mt-3">
                <Link
                  to={from === "signup" ? "/signup" : "/login"}
                  className="text-success fw-bold forgotpassword-text"
                  onClick={() => {
                    if (from === "signup") {
                      sessionStorage.removeItem("signupData");
                    }
                  }}
                >
                  ← Back to {from === "signup" ? "Signup" : "Login"}
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
export default OtpVerification;