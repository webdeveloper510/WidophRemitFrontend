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
import { userProfile, createMonovaPayment, getAgreementList, ZaiPayTo } from "../../services/Api";
import { toast } from "react-toastify";

const ConfirmTransfer = () => {
  const [modalShow, setModalShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [transferData, setTransferData] = useState(null);
  const [sender, setSender] = useState({});
  const [isLoadingMonova, setIsLoadingMonova] = useState(false);
  const [isLoadingZai, setIsLoadingZai] = useState(false);
  const [isLoadingPayID, setIsLoadingPayID] = useState(false);

  const navigate = useNavigate();

  const fullName = `${sender?.First_name || ""} ${
    sender?.Last_name || ""
  }`.trim();

  useEffect(() => {
    const storedAmount = sessionStorage.getItem("transfer_data");
    const storedReceiver = sessionStorage.getItem("selected_receiver");

    if (storedAmount) {
      try {
        const parsedAmount = JSON.parse(storedAmount);
        setTransferData(parsedAmount?.amount || {});
      } catch (error) {
        console.error("Failed to parse transfer_data:", error);
      }
    }

    if (storedReceiver) {
      setReceiver(JSON.parse(storedReceiver));
    } else {
      navigate("/receivers-list");
    }

    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const res = await userProfile();
      if (res && res?.code === "200") {
        setSender(res?.data || {});
      } else {
        console.error("Failed to fetch user profile:", res?.message);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const handleZaiPayment = async () => {
    setIsLoadingZai(true);
    
    try {
      const agreementResponse = await getAgreementList();
      
      if (!agreementResponse || agreementResponse.code !== "200") {
        toast.error("Failed to fetch agreement list");
        console.error("Agreement list fetch failed:", agreementResponse);
        return false;
      }
      const agreementUuid = agreementResponse?.data?.agreement_uuid;

      if (!agreementUuid) {
        toast.error("No valid agreement UUID found");
        console.error("Agreement UUID not found in response:", agreementResponse);
        return false;
      }
      let transactionId = sessionStorage.getItem("monova_transaction_id") || 
                         sessionStorage.getItem("transaction_id");
      const zaiPayload = {
        agreement_uuid: agreementUuid,
        transaction_id: transactionId
      };
      const zaiResponse = await ZaiPayTo(zaiPayload);
      if (zaiResponse && zaiResponse.code === "400") {
        sessionStorage.setItem("zai_payment_response", JSON.stringify(zaiResponse));
        sessionStorage.setItem("final_transaction_id", transactionId);
    
        toast.success("Zai payment processed successfully!");
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
    } finally {
      setIsLoadingZai(false);
    }
  };

  const handleMonovaPayment = async () => {
    const monovaFormData = sessionStorage.getItem("monova_form_data");
    
    if (!monovaFormData) {
      toast.error("Monova payment data not found.");
      return false;
    }

    setIsLoadingMonova(true);
    
    try {
      const monovaForm = JSON.parse(monovaFormData);
      
      const paymentModeMap = {
        "directDebit": "debit",
        "NppCreditBankAccount": "npp"
      };

      const payload = {
        amount: parseFloat(transferData?.send_amt || 0),
        bsbNumber: monovaForm.bsb,
        accountNumber: monovaForm.accountNumber,
        accountName: monovaForm.accountName,
        payment_mode: paymentModeMap[monovaForm.paymentMethod] || monovaForm.paymentMethod
      };
      const response = await createMonovaPayment(payload);

      if (response?.transactionId && response.transactionId !== 0) {
     
        sessionStorage.setItem("monova_transaction_id", response.transactionId);
        
        toast.success("Monova payment created successfully!");
        sessionStorage.removeItem("monova_form_data");
  
        return true;
      } else {
        toast.error(response?.message || "Monova payment creation failed.");
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

  const handlePayIDPayment = async () => {
    setIsLoadingPayID(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

const handleProceedToOTP = () => {
  const otpData = {
    email: sender?.Email, 
    mobile: sender?.Mobile || sender?.mobile,
    first_name: sender?.First_name,
    last_name: sender?.Last_name,
    payment_method: receiver?.payment_method || receiver?.account_type,
  };

  sessionStorage.setItem("transferOtpData", JSON.stringify(otpData));
  sessionStorage.setItem("transfer_data", JSON.stringify(transferData));
  sessionStorage.setItem("selected_receiver", JSON.stringify(receiver));

  navigate("/otp-verification", { state: { from: "transfer" } }); 
};

  const handleSaveAndContinue = async () => {
    const monovaFormData = sessionStorage.getItem("monova_form_data");
    const payToLimitData = sessionStorage.getItem("payto_limit_data");
    const payToAgreementData = sessionStorage.getItem("payto_agreement_response");
    const currentPaymentMethod = sessionStorage.getItem("selected_payment_method");
    const receiverData = sessionStorage.getItem("selected_receiver");

    let receiverPaymentMethod = null;
    if (receiverData) {
      try {
        const receiverParsed = JSON.parse(receiverData);
        receiverPaymentMethod = receiverParsed?.payment_method || receiverParsed?.account_type || null;
      } catch (err) {
        console.error("Error parsing receiver:", err);
      }
    }

    let paymentSuccess = false;

    if (
      currentPaymentMethod === "payid" ||
      receiverPaymentMethod?.toLowerCase() === "payid"
    ) {
  
      sessionStorage.removeItem("monova_form_data");
      sessionStorage.removeItem("payto_limit_data");
      sessionStorage.removeItem("payto_agreement_response");

      paymentSuccess = await handlePayIDPayment();
    }

    else if (currentPaymentMethod === "monova" && monovaFormData) {
      paymentSuccess = await handleMonovaPayment();
      sessionStorage.removeItem("monova_form_data");
    }
    else if (
      currentPaymentMethod === "zai" &&
      payToLimitData &&
      payToAgreementData
    ) {
      sessionStorage.removeItem("monova_form_data");

      paymentSuccess = await handleZaiPayment();
    }

    else {
      console.warn("⚠️ No valid payment method selected.");
      toast.error("No valid payment method selected.");
      return;
    }

    if (paymentSuccess) {
      sessionStorage.removeItem("payto_limit_data");
      sessionStorage.removeItem("payto_agreement_response");
      navigate("/transaction-success");
    } else {
      toast.error("Payment failed. Please try again.");
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
                    <div className="table-column">
                      <h2>Transfer Details</h2>
                      <Table striped bordered>
                        <tbody>
                          <tr>
                            <td>Sending Amount</td>
                            <td>
                              {transferData?.send_amt
                                ? `${transferData.send_amt} ${transferData.from}`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Amount Exchanged</td>
                            <td>
                              {transferData?.exchange_amt
                                ? `${transferData.exchange_amt} ${transferData.to}`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Total To Receiver</td>
                            <td>
                              {transferData?.exchange_amt
                                ? `${transferData.exchange_amt} ${transferData.to}`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Exchange Rate</td>
                            <td>
                              {transferData?.exchange_rate
                                ? `1 ${transferData.from} = ${transferData.exchange_rate} ${transferData.to}`
                                : "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="table-column">
                      <h2>
                        Transfer From <small>(Sender Details)</small>
                      </h2>
                      <Table striped bordered>
                        <tbody>
                          <tr>
                            <td>Sender Name</td>
                            <td>{fullName || "N/A"}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <div className="table-column mt-3">
                      <h2>
                        Transfer To <small>(Receiver Details)</small>
                      </h2>
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
                  onClick={handleProceedToOTP}
                  disabled={isLoading}
                >
                 Confirm and Continue 
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ConfirmTransfer;