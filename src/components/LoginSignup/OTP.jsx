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
  resendOtp,
  createMonovaPayment,
  getAgreementList,
  ZaiPayTo,
} from "../../services/Api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoginImage from "../../assets/images/login-image.png";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferData, setTransferData] = useState(null);
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
    } else if (from === "transfer") {
      const transferOtpData = sessionStorage.getItem("transferOtpData");
      const storedTransferData = sessionStorage.getItem("transfer_data");

      if (transferOtpData) {
        try {
          setUserData(JSON.parse(transferOtpData));
        } catch (error) {
          console.error("Failed to parse transferOtpData:", error);
          toast.error("Invalid transfer data. Please try again.");
          navigate("/payment-detail");
          return;
        }
      } else {
        toast.error("Transfer data not found. Please try again.");
        navigate("/payment-detail");
        return;
      }

      if (storedTransferData) {
        try {
          const parsedTransferData = JSON.parse(storedTransferData);
          setTransferData(parsedTransferData?.amount || {});
        } catch (error) {// todo what payload needed on zai agreement
          console.error("Failed to parse transfer_data:", error);
        }
      }
    } else {
      toast.error("Invalid access. Please start again.");
      navigate("/login");
    }
  }, [from, location.state, navigate]);

  const handleZaiPayment = async () => {
    try {
      const agreementResponse = await getAgreementList(transferData.amount.send_amt);

      if (!agreementResponse || agreementResponse.code !== "200") {
        toast.error("Failed to fetch agreement list");
        console.error("Agreement list fetch failed:", agreementResponse);
        return false;
      }

      const agreementUuid = agreementResponse?.data?.agreement_uuid;

      if (!agreementUuid) {
        toast.error("No valid agreement UUID found");
        console.error(
          "Agreement UUID not found in response:",
          agreementResponse
        );
        return false;
      }
      let transactionId =
        sessionStorage.getItem("monova_transaction_id") ||
        sessionStorage.getItem("transaction_id");
      const zaiPayload = {
        agreement_uuid: agreementUuid,
        transaction_id: transactionId,
      };

      const zaiResponse = await ZaiPayTo(zaiPayload);
      if (zaiResponse && zaiResponse.code === "200") {
        sessionStorage.setItem(
          "zai_payment_response",
          JSON.stringify(zaiResponse)
        );
        sessionStorage.setItem("final_transaction_id", transactionId);
        return true;
      } else {
        toast.error(zaiResponse?.message || "Zai payment processing failed");
        console.error("Zai payment failed:", zaiResponse);
        return false;
      }
    } catch (error) {
      console.error("Zai payment error:", error);
      toast.error("Error processing Zai payment");
      return false;
    }
  };

  const handleMonovaPayment = async () => {
    const monovaFormData = sessionStorage.getItem("monova_payment_data");

    if (!monovaFormData) {
      toast.error("Monova payment data not found.");
      return false;
    }

    try {
      const monovaForm = JSON.parse(monovaFormData);

      const paymentModeMap = {
        directDebit: "debit",
        NppCreditBankAccount: "npp",
      };

      const payload = {
        amount: parseFloat(transferData?.send_amt || 0),
        bsbNumber: monovaForm.bsb,
        accountNumber: monovaForm.accountNumber,
        accountName: monovaForm.accountName,
        payment_mode:
          paymentModeMap[monovaForm.paymentMethod] || monovaForm.paymentMethod,
      };

      const response = await createMonovaPayment(payload);

      if (response?.transactionId && response.transactionId !== 0) {
        sessionStorage.setItem("monova_transaction_id", response.transactionId);
        toast.success("Monova payment created successfully!");
        sessionStorage.removeItem("monova_payment_data");

        return true;
      } else {
        toast.error(response?.message || "Monova payment creation failed.");
        return false;
      }
    } catch (err) {
      toast.error("Error while creating Monova payment.");
      console.error("Monova payment error:", err);
      return false;
    }
  };

  const processTransferPayments = async () => {
    const monovaFormData = sessionStorage.getItem("monova_payment_data");
    const payToLimitData = sessionStorage.getItem("payto_limit_data");
    const payToAgreementData = sessionStorage.getItem(
      "payto_agreement_response"
    );
    const selectedPaymentMethod = sessionStorage.getItem(
      "selected_payment_method"
    );
    const receiverData = sessionStorage.getItem("selected_receiver");

    let receiverPaymentMethod = null;
    if (receiverData) {
      try {
        const receiver = JSON.parse(receiverData);
        receiverPaymentMethod =
          receiver?.payment_method || receiver?.account_type;
      } catch (error) {
        console.error("Error parsing receiver data:", error);
      }
    }

    if (selectedPaymentMethod === "monova" && monovaFormData) {
      const monovaSuccess = await handleMonovaPayment();
      if (monovaSuccess) {
        sessionStorage.removeItem("monova_payment_data");
        return true;
      }
      return false;
    } else if (
      selectedPaymentMethod === "zai" ||
      (payToLimitData && payToAgreementData)
    ) {
      const zaiSuccess = await handleZaiPayment();

      if (zaiSuccess) {
        sessionStorage.removeItem("payto_limit_data");
        sessionStorage.removeItem("payto_agreement_response");
        return true;
      }
      return false;
    } else if (selectedPaymentMethod === "payid") {
      return true;
    }
    return true;
  };

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
      } else if (from === "transfer") {
        response = await verifyEmail(payload);

        if (response?.code === "200") {
          toast.success("OTP Verified Successfully!");

          const paymentSuccess = await processTransferPayments();

          if (paymentSuccess) {
            sessionStorage.removeItem("transferOtpData");
            sessionStorage.removeItem("transfer_data");
            sessionStorage.removeItem("selected_receiver");
            navigate("/transaction-success");
          } else {
            toast.error("Payment processing failed. Please try again.");
          }
        } else {
          toast.error(response?.message || "Invalid OTP");
        }

        return;
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
                Please enter the code sent to your phone
              </span>
            </div>

            {userData && (
              <div className="mb-3 text-muted small">
                Code sent to: {userData.mobile}
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
                  to={from === "transfer" ? "/payment-detail" : "/signup"}
                  className="text-success fw-bold forgotpassword-text"
                  onClick={() => {
                    if (from === "signup") {
                      sessionStorage.removeItem("signupData");
                    } else if (from === "transfer") {
                      sessionStorage.removeItem("transferOtpData");
                    }
                  }}
                >
                  ← Back to {from === "transfer" ? "Payment Details" : "Signup"}
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
