import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button, Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import OtpImage from "../../assets/images/Otp-image.png";
import { useNavigate } from "react-router-dom";
import {
  createMonovaPayment,
  ZaiPayTo,
  ZaiPayId,
  verifyEmail,
  resendOtp,
  createTransaction,
} from "../../services/Api";
import { toast } from "react-toastify";

const ConfirmTransfer = () => {
  const [modalShow, setModalShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [transferData, setTransferData] = useState({});
  const [sender, setSender] = useState({});
  const [isLoadingMonova, setIsLoadingMonova] = useState(false);
  const [isLoadingZai, setIsLoadingZai] = useState(false);
  const [isLoadingPayID, setIsLoadingPayID] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);


  const navigate = useNavigate();

  const fullName = `${sender?.First_name || ""} ${sender?.Last_name || ""}`.trim();

  useEffect(() => {
    const storedAmount = sessionStorage.getItem("transfer_data");
    const storedReceiver = sessionStorage.getItem("selected_receiver");
    const storedUser = sessionStorage.getItem("User data");

    if (storedAmount) {
      try {
        setTransferData(JSON.parse(storedAmount));
      } catch (error) {
        console.error("Failed to parse transfer_data:", error);
      }
    }

    if (storedReceiver) {
      setReceiver(JSON.parse(storedReceiver));
    } else {
      navigate("/receivers-list");
    }

    if (storedUser) {
      try {
        setSender(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse User data:", error);
      }
    } else {
      console.error("User data not found in session.");
      navigate("/dashboard");
    }
  }, [navigate]);


  // const fetchUserProfile = async () => {
  //   try {
  //     const res = await userProfile();
  //     if (res?.code === "200") {
  //       setSender(res.data);
  //     } else {
  //       console.error("Failed to fetch user profile:", res?.message);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching user profile:", err);
  //   }
  // };

  const handleMonovaPayment = async () => {
    const monovaFormData = sessionStorage.getItem("monova_form_data");
    const selectedReceiver = sessionStorage.getItem("selected_receiver");
    const storedPayload = sessionStorage.getItem("payload"); // Contains amounts

    if (!monovaFormData || !selectedReceiver || !storedPayload) {
      toast.error("Required data not found in session.");
      return false;
    }

    setIsLoadingMonova(true);
    try {
      const monovaForm = JSON.parse(monovaFormData);
      const receiverData = JSON.parse(selectedReceiver);
      const payloadData = JSON.parse(storedPayload);

      const payload = {
        amount: parseFloat(monovaForm?.amount || 0),
        bsbNumber: monovaForm.bsbNumber,
        accountNumber: monovaForm.accountNumber,
        accountName: monovaForm.accountName,
        payment_mode: monovaForm.payment_mode,
      };

      const response = await createMonovaPayment(payload);

      if (response?.transactionId && response.transactionId !== 0) {
        sessionStorage.setItem("monova_transaction_id", response.transactionId);
        sessionStorage.setItem("monova_payment_response", JSON.stringify(response));

        await createTransaction({
          transaction_id: sessionStorage.getItem("transaction_id"),
          newTransaction_id: response.transactionId,
          monoova_payment: true,
          recipient_id: receiverData.id,
          amount: {
            send_amount: payloadData.amount.send_amount,
            receive_amount: payloadData.amount.receive_amount,
            send_currency: payloadData.amount.send_currency,
            receive_currency: payloadData.amount.receive_currency,
            receive_method: payloadData.amount.receive_method,
            payout_partner: JSON.parse(sessionStorage.getItem("selected_receiver")).bank_name,
            reason: sessionStorage.getItem("transfer_reason"),
            exchange_rate: payloadData.amount.exchange_rate,
          },
        });

        toast.success("Monova payment created successfully!");
        return true;
      } else {
        toast.error(response?.statusDescription || "Monova payment creation failed.");
        return false;
      }
    } catch (err) {
      toast.error("Error while creating Monova payment.");
      console.error("Monova payment error:", err);
      return false;
    } finally {
      setIsLoadingMonova(false);
    }
  };



  const handleZaiPayment = async () => {
    setIsLoadingZai(true);
    try {
      const agreementData = sessionStorage.getItem("payto_agreement_response");
      if (!agreementData) {
        toast.error("No valid agreement UUID found");
        return false;
      }

      const agreementUuid = JSON.parse(agreementData).data.agreement_uuid;
      const transactionId =
        sessionStorage.getItem("monova_transaction_id") ||
        sessionStorage.getItem("transaction_id");

      const zaiPayload = {
        agreement_uuid: agreementUuid,
        transaction_id: transactionId,
      };

      const zaiResponse = await ZaiPayTo(zaiPayload);

      if (zaiResponse?.code === "400") {
        sessionStorage.setItem("zai_payment_response", JSON.stringify(zaiResponse));
        toast.success("Zai payment processed successfully!");
        return true;
      } else {
        toast.error(zaiResponse?.message || "Zai payment failed.");
        return false;
      }
    } catch (error) {
      console.error("Zai payment error:", error);
      toast.error("Error processing Zai payment");
      return false;
    } finally {
      setIsLoadingZai(false);
    }
  };

  const handlePayIDPayment = async () => {
    setIsLoadingPayID(true);
    try {
      await ZaiPayId({ transaction_id: sessionStorage.getItem("transaction_id") });
      toast.success("PayID payment processed successfully!");
      return true;
    } catch (error) {
      console.error("PayID payment error:", error);
      toast.error("Error processing PayID payment");
      return false;
    } finally {
      setIsLoadingPayID(false);
    }
  };

  const handleSaveAndContinue = () => {
    setModalShow(true);
    const payload = {
      mobile: sender?.mobile,
    };
    resendOtp(payload);
  };

  const verifyOtpHandler = async () => {
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    const otpPayload = {
      email: sender?.email,
      mobile: sender?.Mobile || sender?.mobile,
      first_name: sender?.First_name,
      last_name: sender?.Last_name,
      payment_method: receiver?.payment_method || receiver?.account_type,
      otp: otp,
    };

    try {
      const response = await verifyEmail(otpPayload);

      if (response?.code === "200") {
        setIsProcessingPayment(true);
        await processTransferPayments();
      } else {
        toast.error(response?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      toast.error("Error verifying OTP");
    }
  };

  const processTransferPayments = async () => {
    const currentPaymentMethod = sessionStorage.getItem("selected_payment_method");
    let paymentSuccess = false;

    try {
      if (currentPaymentMethod === "payid") {
        paymentSuccess = await handlePayIDPayment();
      } else if (currentPaymentMethod === "monova") {
        paymentSuccess = await handleMonovaPayment();
      } else if (currentPaymentMethod === "zai") {
        paymentSuccess = await handleZaiPayment();
      } else {
        toast.error("No valid payment method selected.");
        return;
      }

      if (paymentSuccess) {
        setModalShow(false);
        setIsProcessingPayment(false);
        navigate("/transaction-success");
      } else {
        setIsProcessingPayment(false);
        toast.error("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment Processing Error:", err);
      toast.error("Unexpected error occurred during payment.");
    }
  };


  const handleResendOtp = async () => {
    try {
      const payload = {
        mobile: sender?.mobile,
        type: "email"
      };
      const response = await resendOtp(payload);
      if (response?.code === "200") {
        toast.success(response?.message || "OTP resent successfully!");
      } else {
        toast.error(response?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error("Something went wrong while resending OTP");
    }
  };

  const isLoading = isLoadingMonova || isLoadingZai || isLoadingPayID;

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={() => navigate("/payment-detail")}
            className="p-0 border-0 bg-transparent"
          >
            <img src={Back} alt="Back" />
          </Button>
          <h1>Confirm Your Transfer</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-4 bg-white">
              <Card.Body>
                <div className="row">
                  <div className="col-md-6">
                    <h2>Transfer Details</h2>
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <td>Sending Amount</td>
                          <td>
                            {transferData?.amount?.send_amt
                              ? `${transferData.amount.send_amt} ${transferData.amount.from}`
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>Amount Exchanged</td>
                          <td>
                            {transferData?.amount?.exchange_amt
                              ? `${transferData.amount.exchange_amt} ${transferData.amount.to}`
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>Total To Receiver</td>
                          <td>
                            {transferData?.amount?.exchange_amt
                              ? `${transferData.amount.exchange_amt} ${transferData.amount.to}`
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>Exchange Rate</td>
                          <td>
                            {transferData?.amount?.exchange_rate
                              ? `1 ${transferData.amount.from} = ${transferData.amount.exchange_rate} ${transferData.amount.to}`
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </Table>

                  </div>

                  <div className="col-md-6">
                    <h2>Sender Details</h2>
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <td>Sender Name</td>
                          <td>{fullName || "N/A"}</td>
                        </tr>
                      </tbody>
                    </Table>

                    <h2 className="mt-3">Receiver Details</h2>
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <td>Beneficiary Name</td>
                          <td>{receiver?.account_name || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Bank Name</td>
                          <td>{receiver?.bank_name || "N/A"}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Row className="mt-5">
              <Col>
                <Button
                  variant="light"
                  className="cancel-btn float-start"
                  onClick={() => navigate("/payment-detail")}
                >
                  Back
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="float-end updateform"
                  onClick={handleSaveAndContinue}
                  disabled={isLoading}
                >
                  Confirm and Continue
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <Modal
        size="md"
        centered
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setOtp("");
          setIsProcessingPayment(false);
        }}
        className="profileupdate"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {isProcessingPayment ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
              <p className="mt-3">Processing your payment, please wait...</p>
            </div>
          ) : (
            <>
              <h4>Verify your account by entering the code</h4>
              <p className="m-4">
                <img src={OtpImage} alt="image" />
              </p>
              <Col className="inputBoxStyle">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
              </Col>
              <Button variant="link" onClick={handleResendOtp} className="resendOTP">
                Resend OTP
              </Button>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center align-items-center">
          <Row className="mb-3">
            <Col>
              <Button
                variant="light"
                className="cancel-btn float-start"
                onClick={() => setModalShow(false)}
                disabled={isProcessingPayment}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                onClick={verifyOtpHandler}
                variant="primary"
                className="submit-btn float-end"
                disabled={isProcessingPayment}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Modal.Footer>

      </Modal>
    </AnimatedPage>
  );
};

export default ConfirmTransfer;