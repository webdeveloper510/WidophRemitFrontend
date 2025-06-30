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
import { userProfile, createMonovaPayment } from "../../services/Api";
import { toast } from "react-toastify";

const ConfirmTransfer = () => {
  const [modalShow, setModalShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [transferData, setTransferData] = useState(null);
  const [sender, setSender] = useState({});
  const [isLoadingMonova, setIsLoadingMonova] = useState(false);

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

    // ✅ Fetch sender data
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

const handleMonovaPayment = async () => {
  const monovaFormData = sessionStorage.getItem("monova_form_data");
  
  if (!monovaFormData) {
    toast.error("Monova payment data not found.");
    return;
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
      // Store the transaction ID returned by Monova API
      sessionStorage.setItem("monova_transaction_id", response.transactionId);
      
      toast.success("Monova payment created successfully!");
      sessionStorage.removeItem("monova_form_data");
      
      // You can now use response.transactionId for any further operations
      console.log("Monova Transaction ID:", response.transactionId);
      
      navigate("/transaction-success");
    } else {
      toast.error(response?.message || "Monova payment creation failed.");
    }
  } catch (err) {
    toast.error("Error while creating Monova payment.");
    console.error("Monova payment error:", err);
  } finally {
    setIsLoadingMonova(false);
  }
};
  const handleSaveAndContinue = () => {
    const monovaFormData = sessionStorage.getItem("monova_form_data");
    
    if (monovaFormData) {
      handleMonovaPayment();
    } else {
      sessionStorage.setItem(
        "transferOtpData",
        JSON.stringify({
          mobile: sender?.mobile,
          email: sender?.email,
        })
      );
      navigate("/otp-verification", {
        state: { from: "transfer" },
      });
    }
  };

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
                  onClick={handleSaveAndContinue}
                  disabled={isLoadingMonova}
                >
                  {isLoadingMonova ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing Monova Payment...
                    </>
                  ) : (
                    "Save & Continue"
                  )}
                </Button>
              </Col>
            </Row>
          </div>
        </div>

        {/* OTP Modal */}
        {/* <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={modalShow}
          onHide={() => setModalShow(false)}
          className="profileupdate"
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <h4>Verify your account by entering the code</h4>
            <p className="m-4 text-center">
              <img src={OtpImage} alt="OTP" />
            </p>
            <div className="d-flex justify-content-center">
              <OtpInput
                value={otp}
                inputStyle="inputBoxStyle"
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <div className="text-center mt-3">
              <a href="#" className="resendOTP">
                Resend OTP
              </a>
            </div>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Row className="mb-3 w-100">
              <Col>
                <Button
                  variant="light"
                  className="cancel-btn w-100"
                  onClick={() => setModalShow(false)}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    setModalShow(false);
                    navigate("/payment-processed");
                  }}
                  variant="primary"
                  className="submit-btn w-100"
                >
                  Continue
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal> */}
      </div>
    </AnimatedPage>
  );
};

export default ConfirmTransfer;