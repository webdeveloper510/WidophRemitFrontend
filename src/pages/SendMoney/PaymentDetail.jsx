import { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import {
  Form,
  FloatingLabel,
  Col,
  Spinner,
  Modal,
  Row,
  Card,
  Button,
} from "react-bootstrap";
import Back from "../../assets/images/back.png";
import { RiFileCopyLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  createPayId,
  createAgreement,
  getAgreementList,
  getPayID,
} from "../../services/Api";
import { toast } from "react-toastify";
import { createTransaction } from "../../services/Api";

const PaymentDetail = () => {
  const [modalShowPayTo, setModalShowPayTo] = useState(false);
  const [modalShowPayId, setModalShowPayId] = useState(false);
  const [modalShowMonova, setModalShowMonova] = useState(false);
  const [modalShowPayToAgreement, setModalShowPayToAgreement] = useState(false);
  const [modalShowPayToLimit, setModalShowPayToLimit] = useState(false);
  const [isLoadingAgreement, setIsLoadingAgreement] = useState(false);
  const storedPaymentMethod = sessionStorage.getItem("selected_payment_method");
  const [otherReason, setOtherReason] = useState(sessionStorage.getItem("other_reason") || "");

  const [paymentType, setPaymentType] = useState(
    storedPaymentMethod === "monova" ? "bank_transfer" : storedPaymentMethod
  );
  const [amount, setAmount] = useState("0.00");
  const [currency, setCurrency] = useState("AUD");
  const [receiverName, setReceiverName] = useState("Receiver");
  const [isLoadingPayId, setIsLoadingPayId] = useState(false);
  const [payIdData, setPayIdData] = useState({ payId: "", transferId: "" });
  const temp = JSON.parse(sessionStorage.getItem("User data")).First_name + JSON.parse(sessionStorage.getItem("User data")).Last_name;
  const [monovaForm, setMonovaForm] = useState({
    bsb: "",
    accountNumber: "",
    accountName: temp,
    paymentMethod: "",
  });
  const [payToForm, setPayToForm] = useState({
    payIdType: "",
    payId: "",
    bsb: "",
    accountNumber: "",
  });
  const [payToLimitForm, setPayToLimitForm] = useState({
    payId: "",
    bsb: "",
    accountNumber: "",
    amountLimit: "",
    startDate: "",
  });
  const [payToFormErrors, setPayToFormErrors] = useState({});
  const [isCreatingAgreement, setIsCreatingAgreement] = useState(false);
  const [transferReason, setTransferReason] = useState(sessionStorage.getItem("transfer_reason") || "");

  const [reasonError, setReasonError] = useState("");
  const [monovaFormErrors, setMonovaFormErrors] = useState({});
  const [bsb, setbsb] = useState(0);
  const navigate = useNavigate();

  const transferData = JSON.parse(sessionStorage.getItem("transfer_data"));
  const finalReason = transferReason === "Other" ? otherReason : transferReason;
  transferData.amount.reason = finalReason;
  transferData.amount.receive_amount = transferData.amount.exchange_amt;
  transferData.amount.receive_currency = transferData.amount.to;
  transferData.amount.send_currency = transferData.amount.from;
  transferData.amount.send_amount = transferData.amount.send_amt;
  transferData.recipient_id = JSON.parse(sessionStorage.getItem("selected_receiver")).id;
  transferData.transaction_id = sessionStorage.getItem("transaction_id");
  transferData.amount.payout_partner = JSON.parse(sessionStorage.getItem("selected_receiver")).bank_name;

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

  const handlePayToFormChange = (field, value) => {
    setPayToForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMonovaFormChange = (field, value) => {
    setMonovaForm((prev) => ({ ...prev, [field]: value }));
  };

  const validatePayToForm = () => {
    const errors = {};

    const hasPayId = !!payToForm.payId;
    const hasBsb = !!payToForm.bsb;
    const hasAccountNumber = !!payToForm.accountNumber;

    if (hasPayId) {
      if (!payToForm.payIdType) {
        errors.payIdType = "Please select PayID type.";
      }
    }

    if (!hasPayId) {
      if (!hasBsb) {
        errors.bsb = "BSB is required.";
      }
      if (!hasAccountNumber) {
        errors.accountNumber = "Account number is required.";
      }
    }

    if (!hasPayId && !hasBsb && !hasAccountNumber) {
      errors.payId = "Please enter either PayID or BSB + Account Number.";
    }

    if (hasPayId && (hasBsb || hasAccountNumber)) {
      errors.payId = "Please use either PayID or BSB + Account Number — not both.";
      errors.bsb = "Clear PayID to enter BSB.";
      errors.accountNumber = "Clear PayID to enter Account Number.";
    }

    setPayToFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handlePayToContinue = () => {
    const isValid = validatePayToForm();
    if (isValid) {
      setModalShowPayTo(false);
      setModalShowPayToLimit(true);
      setPayToLimitForm({
        payId: payToForm.payId,
        bsb: payToForm.bsb,
        accountNumber: payToForm.accountNumber,
        amountLimit: "",
        startDate: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handlePayToLimitContinue = () => {
    if (!payToLimitForm.amountLimit) {
      toast.error("Please select an amount limit.");
      return;
    }
    setModalShowPayToLimit(false);
    setModalShowPayToAgreement(true);
  };

  const CancelMonovaContinue = () => {
    setMonovaForm({
      bsb: "",
      accountNumber: "",
      accountName: "",
      paymentMethod: "",
    });
    setMonovaFormErrors({});
    setModalShowMonova(false);
  };

  const handleMonovaContinue = async () => {
    const errors = {};
    if (!monovaForm.paymentMethod)
      errors.paymentMethod = "Please select payment method.";
    if (!monovaForm.bsb) errors.bsb = "BSB is required.";
    // if (!monovaForm.accountNumber)
    //   errors.accountNumber = "Account number is required.";
    if (!monovaForm.accountName)
      errors.accountName = "Account name is required.";

    if (!transferReason) {
      toast.error("Please select a transfer reason");
      setModalShowMonova(false);
      return;
    }

    // Check if "Other" is selected but no custom reason is provided
    if (transferReason === "Other" && !otherReason.trim()) {
      toast.error("Please specify the reason when selecting 'Other'");
      setModalShowMonova(false);
      return;
    }

    setMonovaFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        sessionStorage.setItem(
          "monova_payment_data",
          JSON.stringify(monovaForm)
        );
        sessionStorage.setItem("selected_payment_method", "monova");

        const temp = {
          amount: amount,
          bsbNumber: monovaForm.bsb,
          accountNumber: monovaForm.accountNumber,
          accountName: monovaForm.accountName,
          payment_mode: monovaForm.paymentMethod,
        };

        sessionStorage.setItem("monova_form_data", JSON.stringify(temp));

        // Use the final reason (either selected reason or custom "Other" reason)
        const finalReason = transferReason === "Other" ? otherReason : transferReason;

        // Create a fresh copy of transferData and update the reason
        const updatedTransferData = {
          ...transferData,
          amount: {
            ...transferData.amount,
            reason: finalReason
          }
        };

        const txResponse = await createTransaction(updatedTransferData);

        if (txResponse?.code === "200") {
          setModalShowMonova(false);
          navigate("/confirm-transfer");
        } else {
          toast.error(txResponse?.message || "Transaction creation failed.");
        }
      } catch (err) {
        console.error("Unexpected error during payment creation:", err);
      }
    }
  };
  const formatAmountLimit = (limit) => {
    if (!limit) return "Not specified";
    return `AUD ${parseInt(limit).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-AU");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard.");
      });
  };
  const handleContinue = async () => {
    // Check if transfer reason is selected
    if (!transferReason) {
      setReasonError("Please select a transfer reason.");
      return;
    }

    // Check if "Other" is selected but no custom reason is provided
    if (transferReason === "Other" && !otherReason.trim()) {
      setReasonError("Please specify the reason when selecting 'Other'.");
      return;
    }

    // Clear any previous errors
    setReasonError("");

    // Save the final reason to session storage and update transferData
    const finalReason = transferReason === "Other" ? otherReason : transferReason;
    sessionStorage.setItem("final_transfer_reason", finalReason);

    // Update transferData with the correct reason
    transferData.amount.reason = finalReason;

    // Rest of your existing handleContinue code...
    if (paymentType === "payto") {
      try {
        setIsLoadingAgreement(true);
        // ... rest of your existing code
      } catch (err) {
        // ... existing error handling
      }
    } else if (paymentType === "payid") {
      handleCreatePayId();
    } else if (paymentType === "monova" || paymentType === "bank_transfer") {
      setModalShowMonova(true);
    } else {
      toast.warning("Please select a payment type.");
    }
  };
  const handleCreatePayId = async () => {

    try {
      const transactionId = sessionStorage.getItem("transaction_id");
      if (!transactionId) {
        toast.error("Transaction ID not found.");
        return;
      }

      const existing = await getPayID();

      if (existing?.data?.payid) {
        setPayIdData({
          payId: existing.data.payid || "",
          transferId: sessionStorage.getItem("transaction_id"),
        });
        setModalShowPayId(true);
      } else {
        setIsLoadingPayId(true);

        const response = await createPayId({ transaction_id: transactionId });

        if (response?.code === "200" && response.data?.payid) {
          setPayIdData({
            payId: response.data.payid || "",
            transferId: response.data.transaction_id || "",
          });

          const txResponse = await createTransaction(transferData);

          if (txResponse?.code === "200") {
            setModalShowPayId(true);
          } else {
            toast.error(txResponse?.message || "Transaction creation failed.");
          }
        } else {
          toast.error(response?.message || "PayID generation failed.");
        }
      }
    } catch (err) {
      toast.error("Error generating PayID.");
    } finally {
      setIsLoadingPayId(false);
    }
  };

  const handlePayToAgreementContinue = async () => {
    setIsCreatingAgreement(true);
    try {
      let payload;

      if (payToLimitForm.payId) {
        payload = {
          pay_id: payToLimitForm.payId,
          payid_type: payToForm.payIdType || "EMAL",
        };
      } else {
        payload = {
          bsb: payToLimitForm.bsb,
          account_number: payToLimitForm.accountNumber,
        };
      }

      payload.start_date = payToLimitForm.startDate;
      payload.agreement_amount = payToLimitForm.amountLimit;

      // Add reason to payload - use custom reason if "Other" is selected
      payload.reason = transferReason === "Other" ? otherReason : transferReason;

      const agreementResponse = await createAgreement(payload);

      if (agreementResponse?.code === "200" || agreementResponse?.success) {
        sessionStorage.setItem("payto_limit_data", JSON.stringify(payToLimitForm));
        sessionStorage.setItem("payto_agreement_response", JSON.stringify(agreementResponse));

        const txResponse = await createTransaction(transferData);

        if (txResponse?.code === "200") {
          toast.success("PayTo agreement & transaction created successfully!");
          setModalShowPayToAgreement(false);
          navigate("/confirm-transfer");
        } else {
          toast.error(txResponse?.message || "Failed to create transaction.");
        }
      } else {
        toast.error(agreementResponse?.message || "Failed to create agreement.");
      }
    } catch (error) {
      toast.error("Error creating agreement.");
    } finally {
      setIsCreatingAgreement(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            className="p-0 border-0 bg-transparent"
            onClick={() => navigate("/review-transfer")}
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
                  <h4>
                    <b>{`${amount} ${currency}`}</b>
                  </h4>
                </div>
                <span className="divider"></span>
                <div>
                  <p>Sending To</p>
                  <h4>
                    <b>{receiverName}</b>
                  </h4>
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
                    <div className="d-flex mb-3 mt-3 align-items-center">
                      {/* <Form.Check
                        inline
                        className="paymentoptions"
                        label="Pay TO"
                        name="paymentType"
                        type="radio"
                        checked={paymentType === "payto"}
                        onChange={() => {
                          setPaymentType("payto");
                          sessionStorage.setItem(
                            "selected_payment_method",
                            "zai"
                          );
                          sessionStorage.removeItem("monova_payment_data");
                          sessionStorage.removeItem("payid_data");
                        }}
                      /> */}
                      <Form.Check
                        inline
                        label="Pay ID"
                        className="paymentoptions"
                        name="paymentType"
                        type="radio"
                        checked={paymentType === "payid"}
                        onChange={() => {
                          setPaymentType("payid");
                          sessionStorage.setItem(
                            "selected_payment_method",
                            "payid"
                          );
                          sessionStorage.removeItem("monova_payment_data");
                          sessionStorage.removeItem("payto_limit_data");
                          sessionStorage.removeItem("payto_agreement_response");
                        }}
                      />
                      <Form.Check
                        inline
                        label="Bank Transfer"
                        name="paymentType"
                        className="paymentoptions m-0"
                        type="radio"
                        checked={paymentType === "bank_transfer" || paymentType === "monova"}
                        onChange={() => {
                          setPaymentType("bank_transfer");
                          // Reset selected gateway
                          sessionStorage.removeItem("payto_limit_data");
                          sessionStorage.removeItem("payto_agreement_response");
                          sessionStorage.removeItem("payid_data");
                          sessionStorage.removeItem("monova_payment_data");
                        }}
                      />

                      {(paymentType === "bank_transfer" || paymentType === "monova") && (
                        <Form.Select
                          className="ms-3 payment-select"
                          style={{ width: "200px" }}
                          value={paymentType === "monova" ? "monova" : ""}
                          onChange={(e) => {
                            const selectedGateway = e.target.value;

                            if (selectedGateway === "monova") {
                              setPaymentType("monova");
                              sessionStorage.setItem("selected_payment_method", "monova");
                              // DO NOT open modal here
                            }
                          }}
                        >
                          <option value="">Select Gateway</option>
                          <option value="monova">Monoova</option>
                        </Form.Select>
                      )}
                    </div>
                  </Row>
                  <Row className="mt-5">
                    <FloatingLabel
                      controlId="floatingSelect"
                      as={Col}
                      label="Transfer Reason"
                      className="mb-3"
                    >
                      <Form.Select
                        value={transferReason}
                        onChange={(e) => {
                          setTransferReason(e.target.value);
                          setReasonError("");
                          sessionStorage.setItem("transfer_reason", e.target.value);

                          // Clear other reason if not selecting "Other"
                          if (e.target.value !== "Other") {
                            setOtherReason("");
                            sessionStorage.removeItem("other_reason");
                          }
                        }}
                        name="reason"
                        isInvalid={!!reasonError}
                      >
                        <option value="">Select a Reason</option>
                        {reasonOptions.map((reason, i) => (
                          <option key={i} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </Form.Select>
                      {reasonError && (
                        <Form.Control.Feedback type="invalid">
                          {reasonError}
                        </Form.Control.Feedback>
                      )}
                    </FloatingLabel>
                  </Row>

                  {/* Add this new row right after the Transfer Reason row for the "Other" text field */}
                  {transferReason === "Other" && (
                    <Row className="mt-3">
                      <FloatingLabel
                        controlId="otherReasonField"
                        as={Col}
                        label="Please specify the reason"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={otherReason}
                          onChange={(e) => {
                            setOtherReason(e.target.value);
                            setReasonError("");
                            sessionStorage.setItem("other_reason", e.target.value);
                          }}
                          placeholder="Enter your reason here"
                          isInvalid={transferReason === "Other" && !otherReason.trim() && !!reasonError}
                        />
                        {transferReason === "Other" && !otherReason.trim() && reasonError && (
                          <Form.Control.Feedback type="invalid">
                            Please specify the reason when selecting 'Other'.
                          </Form.Control.Feedback>
                        )}
                      </FloatingLabel>
                    </Row>
                  )}

                  <Row className="mt-4">
                    <Col>
                      <Button
                        variant="light"
                        className="cancel-btn float-start"
                        onClick={() => navigate("/review-transfer")}
                      >
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
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
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

        <Modal
          size="lg"
          centered
          show={modalShowPayTo}
          onHide={() => setModalShowPayTo(false)}
          className="profileupdate"
        >
          <Modal.Header closeButton className="payment-popup">
            PayTo
          </Modal.Header>
          <Modal.Body>
            <Form className="profile-form">
              {/* PayID Type */}
              <Row className="mb-3">
                <FloatingLabel
                  controlId="payid-type"
                  as={Col}
                  label="PayID Type"
                  className="mb-3"
                >
                  <Form.Select
                    value={payToForm.payIdType}
                    onChange={(e) =>
                      handlePayToFormChange("payIdType", e.target.value)
                    }
                    isInvalid={!!payToFormErrors.payIdType}
                    disabled={payToForm.accountNumber || payToForm.bsb}
                  >
                    <option value="">Select PayID Type</option>
                    <option value="EMAL">Email</option>
                    <option value="TEL">Telephone Number</option>
                    <option value="AUBN">Australian Business Number</option>
                    <option value="ORGN">Organisation Identifier</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {payToFormErrors.payIdType}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>

              {/* PayID */}
              <Row className="mb-3">
                <FloatingLabel
                  controlId="payid"
                  as={Col}
                  label="PayID"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={payToForm.payId}
                    onChange={(e) =>
                      handlePayToFormChange("payId", e.target.value)
                    }
                    isInvalid={!!payToFormErrors.payId}
                    disabled={payToForm.accountNumber || payToForm.bsb}

                  />
                  <Form.Control.Feedback type="invalid">
                    {payToFormErrors.payId}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>

              {/* OR divider */}
              <Row className="mb-3">
                <span className="Ortext">OR</span>
              </Row>

              {/* BSB */}
              <Row className="mb-3">
                <FloatingLabel
                  controlId="bsb"
                  as={Col}
                  label="BSB Number"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={payToForm.bsb}
                    onChange={(e) =>
                      handlePayToFormChange("bsb", e.target.value)
                    }
                    isInvalid={!!payToFormErrors.bsb}
                    disabled={payToForm.payIdType || payToForm.payId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {payToFormErrors.bsb}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>

              {/* Account Number */}
              <Row className="mb-3">
                <FloatingLabel
                  controlId="account-no"
                  as={Col}
                  label="Account Number"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={payToForm.accountNumber}
                    onChange={(e) =>
                      handlePayToFormChange("accountNumber", e.target.value)
                    }
                    isInvalid={!!payToFormErrors.accountNumber}
                    disabled={payToForm.payIdType || payToForm.payId}

                  />
                  <Form.Control.Feedback type="invalid">
                    {payToFormErrors.accountNumber}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>

              {/* Buttons */}
              <Row className="mb-3">
                <Col>
                  <Button
                    variant="light"
                    className="cancel-btn float-start"
                    onClick={() => setModalShowPayTo(false)}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="primary"
                    className="submit-btn float-end"
                    onClick={handlePayToContinue}
                  >
                    Continue
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        {/* PayID Modal */}
        <Modal
          size="lg"
          centered
          show={modalShowPayId}
          onHide={() => setModalShowPayId(false)}
          className="profileupdate"
        >
          <Modal.Header closeButton className="payment-popup">
            PayID
          </Modal.Header>
          <Modal.Body>
            <Form className="profile-form">
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="payid-field"
                  label="PayID"
                  className="position-relative mb-3"
                >
                  <Form.Control type="text" value={payIdData.payId} readOnly />
                  <span
                    className="copyText"
                    onClick={() => copyToClipboard(payIdData.payId)}
                    style={{ cursor: "pointer" }}
                  >
                    <RiFileCopyLine />
                  </span>
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="transfer-id"
                  label="Transfer ID"
                  className="position-relative"
                >
                  <Form.Control
                    type="text"
                    value={payIdData.transferId}
                    readOnly
                  />
                  <span
                    className="copyText"
                    onClick={() => copyToClipboard(payIdData.transferId)}
                    style={{ cursor: "pointer" }}
                  >
                    <RiFileCopyLine />
                  </span>
                </FloatingLabel>
              </Row>
              <p className="m-4">
                Use your PayID to transfer funds from your online banking
                platform. Include the transaction ID in the reference field.
              </p>
              <Row className="mb-3">
                <Col>
                  <Button
                    variant="light"
                    className="cancel-btn float-start"
                    onClick={() => setModalShowPayId(false)}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="primary"
                    className="submit-btn float-end"
                    onClick={() => {
                      navigate("/confirm-transfer");
                    }}
                  >
                    Continue
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Monova Modal */}
        <Modal
          size="lg"
          centered
          show={modalShowMonova}
          onHide={CancelMonovaContinue}
          className="profileupdate"
        >
          <Modal.Header closeButton className="payment-popup">
            Monoova
          </Modal.Header>
          <Modal.Body>
            <Form className="profile-form">
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="monova-payment-method"
                  label="Payment Method"
                  className="mb-3"
                >
                  <Form.Select
                    value={monovaForm.paymentMethod}
                    onChange={(e) =>
                      handleMonovaFormChange("paymentMethod", e.target.value)
                    }
                    isInvalid={!!monovaFormErrors.paymentMethod}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="debit">Direct Debit</option>
                    <option value="npp">NPP Credit Bank Account</option>
                  </Form.Select>
                  {monovaFormErrors.paymentMethod && (
                    <Form.Control.Feedback type="invalid">
                      {monovaFormErrors.paymentMethod}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="monova-bsb"
                  label="BSB Number"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={monovaForm.bsb}
                    onChange={(e) =>
                      handleMonovaFormChange("bsb", e.target.value)
                    }
                    isInvalid={!!monovaFormErrors.bsb}
                  />
                  {monovaFormErrors.bsb && (
                    <Form.Control.Feedback type="invalid">
                      {monovaFormErrors.bsb}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
              </Row>
              {/* <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="monova-account"
                  label="Account Number"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={monovaForm.accountNumber}
                    onChange={(e) =>
                      handleMonovaFormChange("accountNumber", e.target.value)
                    }
                    isInvalid={!!monovaFormErrors.accountNumber}
                  />
                  {monovaFormErrors.accountNumber && (
                    <Form.Control.Feedback type="invalid">
                      {monovaFormErrors.accountNumber}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
              </Row> */}
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="monova-name"
                  label="Account Name"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={monovaForm.accountName}
                    onChange={(e) =>
                      handleMonovaFormChange("accountName", e.target.value)
                    }
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
                  <Button
                    variant="light"
                    className="cancel-btn float-start"
                    onClick={CancelMonovaContinue}
                  >
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

        {/* PayTo Limit Modal */}
        <Modal
          size="lg"
          centered
          show={modalShowPayToLimit}
          onHide={() => setModalShowPayToLimit(false)}
          className="profileupdate"
        >
          <Modal.Header closeButton className="payment-popup">
            PayTo Limit Setup
          </Modal.Header>
          <Modal.Body>
            <Form className="profile-form">
              {payToLimitForm.payId && (
                <Row className="mb-3">
                  <FloatingLabel
                    as={Col}
                    controlId="payto-limit-payid"
                    label="PayID"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      value={payToLimitForm.payId}
                      readOnly
                    />
                  </FloatingLabel>
                </Row>
              )}

              {(payToLimitForm.bsb || payToLimitForm.accountNumber) && (
                <>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="payto-limit-bsb"
                      label="BSB Number"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        value={payToLimitForm.bsb}
                        readOnly
                      />
                    </FloatingLabel>
                  </Row>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="payto-limit-account"
                      label="Account Number"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        value={payToLimitForm.accountNumber}
                        readOnly
                      />
                    </FloatingLabel>
                  </Row>
                </>
              )}

              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="amount-limit"
                  label="Amount Per Transaction Limit"
                  className="mb-3"
                >
                  <Form.Select
                    value={payToLimitForm.amountLimit}
                    onChange={(e) =>
                      setPayToLimitForm({
                        ...payToLimitForm,
                        amountLimit: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Limit</option>
                    <option value="1000">Up to AUD 1k</option>
                    <option value="5000">Up to AUD 5k</option>
                    <option value="10000">Up to AUD 10k</option>
                    <option value="30000">Up to AUD 30k</option>
                  </Form.Select>
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="start-date"
                  label="Start Date"
                  className="mb-3"
                >
                  <Form.Control
                    type="date"
                    value={payToLimitForm.startDate}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa", color: "#6c757d" }}
                  />
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Button
                    variant="light"
                    className="cancel-btn float-start"
                    onClick={() => setModalShowPayToLimit(false)}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="primary"
                    className="submit-btn float-end"
                    onClick={handlePayToLimitContinue}
                  >
                    Continue
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        {/* PayTo Agreement Modal */}
        <Modal
          size="lg"
          centered
          show={modalShowPayToAgreement}
          onHide={() => setModalShowPayToAgreement(false)}
          className="profileupdate"
        >
          <Modal.Header closeButton className="payment-popup">
            PayTo Agreement Details
          </Modal.Header>
          <Modal.Body>
            <div className="agreement-details p-3">
              <h5 className="mb-4">
                Please review your PayTo agreement details:
              </h5>

              <div className="agreement-section mb-4">
                <h6 className="text-primary">Payment Details</h6>
                <hr />

                {payToLimitForm.payId && (
                  <div className="mb-2">
                    <strong>PayID:</strong> {payToLimitForm.payId}
                  </div>
                )}

                {payToForm.payIdType && (
                  <div className="mb-2">
                    <strong>PayID Type:</strong>{" "}
                    {payToForm.payIdType === "EMAL"
                      ? "Email"
                      : payToForm.payIdType}
                  </div>
                )}

                {payToLimitForm.bsb && payToLimitForm.accountNumber && (
                  <>
                    <div className="mb-2">
                      <strong>BSB Number:</strong> {payToLimitForm.bsb}
                    </div>
                    <div className="mb-2">
                      <strong>Account Number:</strong>{" "}
                      {payToLimitForm.accountNumber}
                    </div>
                  </>
                )}

                <div className="mb-2">
                  <strong>Maximum Amount:</strong>{" "}
                  {formatAmountLimit(payToLimitForm.amountLimit)} per
                  transaction
                </div>

                <div className="mb-2">
                  <strong>Agreement Start Date:</strong>{" "}
                  {formatDate(payToLimitForm.startDate)}
                </div>

              </div>
            </div>

            <Row className="mb-3">
              <Col>
                <Button
                  variant="light"
                  className="cancel-btn float-start"
                  onClick={() => setModalShowPayToAgreement(false)}
                >
                  Back
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="submit-btn float-end"
                  onClick={handlePayToAgreementContinue}
                >
                  Confirm & Continue
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    </AnimatedPage>
  );
};

export default PaymentDetail;
