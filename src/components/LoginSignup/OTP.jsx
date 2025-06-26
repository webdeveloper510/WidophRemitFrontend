import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import {
  userRegisterVerify,
  sendEmail,
  registerOtpResend,
  verifyEmail,
  updateProfile,
  resendOtp
} from "../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";

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
    } else if (from === "profile") {
      const profileOtpData = location.state?.otpData;
      if (profileOtpData) {
        setUserData(profileOtpData);
      } else {
        toast.error("Missing profile data. Please try again.");
        navigate("/profile");
      }
    } else {
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
      } else if (from === "profile") {
        response = await resendOtp(payload);
      } else {
        response = await userRegisterVerify(payload);
      }
      console.log("OTP Verification response:", response);

      if (response && response.code === "200") {
        toast.success("OTP Verified Successfully!");

        if (from === "login") {
          if (response?.access_token) {
            sessionStorage.setItem("token", response.access_token);
          }
          return navigate("/dashboard");
        }
        if (from === "profile") {
  const updateData = JSON.parse(sessionStorage.getItem("pendingProfileUpdate"));

  try {
    const updateResponse = await updateProfile(updateData); // You must import this API
    if (updateResponse?.code === "200") {
      toast.success("Profile updated successfully!");
    } else {
      toast.warning(updateResponse?.message || "Failed to update profile.");
    }
  } catch (err) {
    console.error("Profile update failed:", err);
    toast.error("Error updating profile");
  }

  sessionStorage.removeItem("pendingProfileUpdate");
  return navigate("/profile-information");
}
        if (response?.access_token) {
          sessionStorage.setItem("token", response.access_token);

          const emailLoadingToast = toast.loading("Sending verification email...");
          try {
            const emailRes = await sendEmail();
            toast.dismiss(emailLoadingToast);

            if (emailRes?.code === "200") {
              toast.success("Verification email sent!");
            } else {
              toast.warning("Email failed to send.");
            }
          } catch {
            toast.error("Email send error.");
          }
        }

        sessionStorage.removeItem("signupData");
        navigate("/login");
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

    try {
      const payload = {
        mobile: userData.mobile,
      };

      const response = await registerOtpResend(payload);
      console.log("🚀 ~ handleResendOtp ~ response:", response);

      if (response?.code === "200") {
        toast.success("OTP has been resent successfully!");
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
    <Container className="login-form-wrapper min-vh-100">
      <Row className="vh-100">
        <Col md={7} className="d-flex align-items-center justify-content-start">
          <div className="login-form-wrapper w-100">
            <div className="exchange-title mb-4">
              OTP <br />
              Verification
              <span className="exchange_rate">
                Please enter the code sent to your phone/email.
              </span>
            </div>

            {userData && (
              <div className="mb-3 text-muted small">
                Code sent to: {userData.email} and {userData.mobile}
              </div>
            )}

            {isProcessing && (
              <div className="mb-3 text-info small">
                <div className="d-flex align-items-center">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Processing your verification...
                </div>
              </div>
            )}

            <Form className="exchange-form" onSubmit={handleSubmit}>
              <Row className="mb-4">
                <Col>
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
                  ? "Processing..."
                  : "Verify OTP"}
              </Button>

              <div className="small text-muted mt-3">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="btn btn-link text-success fw-semibold p-0"
                  onClick={handleResendOtp}
                  disabled={loading || isProcessing}
                >
                  Resend
                </button>
              </div>
              <div className="mt-3">
                <a
                  href="/signup"
                  className="text-success fw-bold"
                  onClick={() => sessionStorage.removeItem("signupData")}
                >
                  ← Back to Signup
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
            {/* You can place an image here */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OtpVerification;
