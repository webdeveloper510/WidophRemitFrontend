import React, { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import { Form, FloatingLabel, Col, Spinner, Modal } from "react-bootstrap";
import Back from "../../assets/images/back.png";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { RiFileCopyLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { createPayId, createMonovaPayment } from "../../services/Api";
import { toast } from "react-toastify";

const PaymentDetail = () => {
  const [modalShowPayTo, setModalShowPayTo] = useState(false);
  const [modalShowPayId, setModalShowPayId] = useState(false);
  const [modalShowMonova, setModalShowMonova] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState("0.00");
  const [currency, setCurrency] = useState("AUD");
  const [receiverName, setReceiverName] = useState("Receiver");
  const [isLoadingPayId, setIsLoadingPayId] = useState(false);
  const [payIdData, setPayIdData] = useState({ payId: "", transferId: "" });
  const [monovaForm, setMonovaForm] = useState({ 
    bsb: "", 
    accountNumber: "", 
    accountName: "",
    paymentMethod: ""
  });
  const [monovaFormErrors, setMonovaFormErrors] = useState({});

  const [transferReason, setTransferReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const navigate = useNavigate();

  const reasonOptions = [
    "Family Support",
    "Education",
    "Tax Payment",
    "Loan Payment",
    "Travel Payment",
    "Utility Payment",
    "Personal Use",
    "Other",
  ];

  useEffect(() => {
    const transferData = JSON.parse(sessionStorage.getItem("transfer_data"));
    const receiver = JSON.parse(sessionStorage.getItem("selected_receiver"));

    if (transferData?.amount) {
      setAmount(transferData.amount.send_amt || "0.00");
      setCurrency(transferData.amount.from || "AUD");
    }

    if (receiver?.account_name) {
      setReceiverName(receiver.account_name);
    }
  }, []);

  const handleCreatePayId = async () => {
    setIsLoadingPayId(true);
    try {
      const transactionId = sessionStorage.getItem("transaction_id");
      if (!transactionId) {
        toast.error("Transaction ID not found.");
        setIsLoadingPayId(false);
        return;
      }

      const response = await createPayId({ transaction_id: transactionId });

      if (response?.code === "200") {
        setPayIdData({
          payId: response.data.payid || "",
          transferId: response.data.transaction_id || "",
        });
        setModalShowPayId(true);
      } else {
        toast.error(response.message || "PayID generation failed.");
      }
    } catch (err) {
      toast.error("Error while generating PayID.");
    } finally {
      setIsLoadingPayId(false);
    }
  };

  const validateMonovaForm = () => {
    const errors = {};
    
    if (!monovaForm.paymentMethod) {
      errors.paymentMethod = "Please select a payment method.";
    }
    if (!monovaForm.bsb) {
      errors.bsb = "BSB number is required.";
    }
    if (!monovaForm.accountNumber) {
      errors.accountNumber = "Account number is required.";
    }
    if (!monovaForm.accountName) {
      errors.accountName = "Account name is required.";
    }

    setMonovaFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMonovaContinue = () => {
    if (!validateMonovaForm()) {
      return;
    }

    // Store Monova form data in sessionStorage for later use
    sessionStorage.setItem("monova_form_data", JSON.stringify(monovaForm));
    
    setModalShowMonova(false);
    navigate("/confirm-transfer");
  };

  const handleContinue = () => {
    if (!transferReason) {
      setReasonError("Please select a transfer reason.");
      return;
    }

    if (paymentType === "payto") {
      setModalShowPayTo(true);
    } else if (paymentType === "payid") {
      handleCreatePayId();
    } else if (paymentType === "monova") {
      setModalShowMonova(true);
    } else {
      toast.warning("Please select a payment type.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(console.error);
  };

  const handleMonovaFormChange = (field, value) => {
    setMonovaForm({ ...monovaForm, [field]: value });
    // Clear the error for this field when user starts typing
    if (monovaFormErrors[field]) {
      setMonovaFormErrors({ ...monovaFormErrors, [field]: "" });
    }
  };

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            className="p-0 border-0 bg-transparent"
            onClick={() => navigate("/receivers-list")}
          >
            <img src={Back} alt="Back" />
          </Button>
          <h1>Payment Details</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <div className="paymentdetail p-4">
              <div className="d-flex justify-content-center align-items-center">
                <div>
                  <p>Amount</p>
                  <h4><b>{`${amount} ${currency}`}</b></h4>
                </div>
                <span className="divider"></span>
                <div>
                  <p>Sending To</p>
                  <h4><b>{receiverName}</b></h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-4 bg-white p-3">
              <Card.Body>
                <Form>
                  <Row>
                    <label>Payment type</label>
                    <div className="d-flex mb-3 mt-3">
                      <Form.Check
                        inline
                        label="Pay TO"
                        name="paymentType"
                        type="radio"
                        checked={paymentType === "payto"}
                        onChange={() => setPaymentType("payto")}
                      />
                      <Form.Check
                        inline
                        label="Pay ID"
                        name="paymentType"
                        type="radio"
                        checked={paymentType === "payid"}
                        onChange={() => setPaymentType("payid")}
                      />
                      <Form.Check
                        inline
                        label="Monova"
                        name="paymentType"
                        type="radio"
                        checked={paymentType === "monova"}
                        onChange={() => setPaymentType("monova")}
                      />
                    </div>
                  </Row>

                  <Row className="mt-5">
                    <FloatingLabel controlId="floatingSelect" as={Col} label="Transfer Reason">
                      <Form.Select
                        value={transferReason}
                        onChange={(e) => {
                          setTransferReason(e.target.value);
                          setReasonError("");
                        }}
                        isInvalid={!!reasonError}
                      >
                        <option value="">Select a Reason</option>
                        {reasonOptions.map((reason, i) => (
                          <option key={i} value={reason}>{reason}</option>
                        ))}
                      </Form.Select>
                      {reasonError && (
                        <Form.Control.Feedback type="invalid">
                          {reasonError}
                        </Form.Control.Feedback>
                      )}
                    </FloatingLabel>
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      <Button variant="light" className="cancel-btn float-start" onClick={() => navigate("/review-transfer")}>
                        Back
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="primary"
                        className="submit-btn float-end"
                        onClick={handleContinue}
                        disabled={isLoadingPayId}
                      >
                        {isLoadingPayId ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Creating PayID...
                          </>
                        ) : (
                          "Continue"
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Pay TO Modal */}
        <Modal size="lg" centered show={modalShowPayTo} onHide={() => setModalShowPayTo(false)} className="profileupdate">
          <Modal.Header closeButton className="payment-popup">PayTo</Modal.Header>
          <Modal.Body>
            <Form className="profile-form">
              <Row className="mb-3">
                <FloatingLabel controlId="payid-type" as={Col} label="PayID Type">
                  <Form.Select>
                    <option value="1">AUD</option>
                    <option value="2">USD</option>
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="payid" as={Col} label="PayID">
                  <Form.Control type="text" placeholder="PayID" />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <span className="Ortext">OR</span>
              </Row>
              <Row className="mb-3">
                <FloatingLabel controlId="bsb" as={Col} label="BSB">
                  <Form.Control type="text" placeholder="BSB" />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel controlId="account-no" as={Col} label="Account No.">
                  <Form.Control type="text" placeholder="Account Number" />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Button variant="light" className="cancel-btn float-start" onClick={() => setModalShowPayTo(false)}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button variant="primary" className="submit-btn float-end" onClick={() => navigate("/confirm-transfer")}>
                    Continue
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        {/* PayID Modal */}
        <Modal size="lg" centered show={modalShowPayId} onHide={() => setModalShowPayId(false)} className="profileupdate">
          <Modal.Header closeButton className="payment-popup">PayID</Modal.Header>
          <Modal.Body>
            <Form className="profile-form">
              <Row className="mb-3">
                <FloatingLabel as={Col} controlId="payid-field" label="PayID" className="position-relative">
                  <Form.Control type="text" value={payIdData.payId} readOnly />
                  <span className="copyText" onClick={() => copyToClipboard(payIdData.payId)} style={{ cursor: 'pointer' }}>
                    <RiFileCopyLine />
                  </span>
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} controlId="transfer-id" label="Transfer ID" className="position-relative">
                  <Form.Control type="text" value={payIdData.transferId} readOnly />
                  <span className="copyText" onClick={() => copyToClipboard(payIdData.transferId)} style={{ cursor: 'pointer' }}>
                    <RiFileCopyLine />
                  </span>
                </FloatingLabel>
              </Row>
              <p className="m-4">Use your PayID to transfer funds from your online banking platform. Include the transaction ID in the reference field.</p>
              <Row className="mb-3">
                <Col>
                  <Button variant="light" className="cancel-btn float-start" onClick={() => setModalShowPayId(false)}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button variant="primary" className="submit-btn float-end" onClick={() => navigate("/confirm-transfer")}>
                    Continue
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Monova Modal */}
        <Modal size="lg" centered show={modalShowMonova} onHide={() => setModalShowMonova(false)} className="profileupdate">
          <Modal.Header closeButton className="payment-popup">Monova</Modal.Header>
          <Modal.Body>
            <Form className="profile-form">
              <Row className="mb-3">
                <FloatingLabel as={Col} controlId="monova-payment-method" label="Payment Method">
                  <Form.Select
                    value={monovaForm.paymentMethod}
                    onChange={(e) => handleMonovaFormChange('paymentMethod', e.target.value)}
                    isInvalid={!!monovaFormErrors.paymentMethod}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="directDebit">Direct Debit</option>
                    <option value="NppCreditBankAccount">NPP Credit Bank Account</option>
                  </Form.Select>
                  {monovaFormErrors.paymentMethod && (
                    <Form.Control.Feedback type="invalid">
                      {monovaFormErrors.paymentMethod}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} controlId="monova-bsb" label="BSB Number">
                  <Form.Control
                    type="text"
                    value={monovaForm.bsb}
                    onChange={(e) => handleMonovaFormChange('bsb', e.target.value)}
                    isInvalid={!!monovaFormErrors.bsb}
                  />
                  {monovaFormErrors.bsb && (
                    <Form.Control.Feedback type="invalid">
                      {monovaFormErrors.bsb}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} controlId="monova-account" label="Account Number">
                  <Form.Control
                    type="text"
                    value={monovaForm.accountNumber}
                    onChange={(e) => handleMonovaFormChange('accountNumber', e.target.value)}
                    isInvalid={!!monovaFormErrors.accountNumber}
                  />
                  {monovaFormErrors.accountNumber && (
                    <Form.Control.Feedback type="invalid">
                      {monovaFormErrors.accountNumber}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} controlId="monova-name" label="Account Name">
                  <Form.Control
                    type="text"
                    value={monovaForm.accountName}
                    onChange={(e) => handleMonovaFormChange('accountName', e.target.value)}
                    isInvalid={!!monovaFormErrors.accountName}
                  />
                  {monovaFormErrors.accountName && (
                    <Form.Control.Feedback type="invalid">
                      {monovaFormErrors.accountName}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Button variant="light" className="cancel-btn float-start" onClick={() => setModalShowMonova(false)}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button 
                    variant="primary" 
                    className="submit-btn float-end" 
                    onClick={handleMonovaContinue}
                  >
                    Continue
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </AnimatedPage>
  );
};

export default PaymentDetail;