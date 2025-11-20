import { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import MonovaForm from "../../components/MonovaForm";
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
import { useLocation, useNavigate } from "react-router-dom";
import {
  createPayId,
  getPayID,
  GetAutoMatcher,
  createTransaction,
  createAutoMatcher,
  GetBudRedirectUrl,
} from "../../services/Api";
import { toast } from "react-toastify";

const PaymentDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState(null);
  const [amount, setAmount] = useState("0.00");
  const [currency, setCurrency] = useState("AUD");
  const [receiverName, setReceiverName] = useState("Receiver");
  const [recipientId, setRecipientId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [payIdData, setPayIdData] = useState({ payId: "", transferId: "" });
  const [modalShowPayId, setModalShowPayId] = useState(false);
  const [modalShowMonova, setModalShowMonova] = useState(false);
  const [ModalShowMonovaExisting, setModalShowMonovaExisting] = useState(false);
  const [isLoadingPayId, setIsLoadingPayId] = useState(false);
  const [reasonError, setReasonError] = useState("");
  const [monovaFormErrors, setMonovaFormErrors] = useState({});
  const userData = JSON.parse(sessionStorage.getItem("user_data") || "{}");
  const [monovaForm, setMonovaForm] = useState({
    bsb: "",
    accountNumber: "",
    accountName: `${userData.First_name || ""} ${userData.Last_name || ""}`,
    paymentMethod: "",
  });

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

  const comingFromConfirmTransferOrReviewTransfer =
    location.state?.from === "/confirm-transfer" ||
    location.state?.from === "/review-transfer";

  useEffect(() => {
    if (!comingFromConfirmTransferOrReviewTransfer) {
      navigate("/send-money");
    }
  }, [comingFromConfirmTransferOrReviewTransfer, navigate]);

  useEffect(() => {
    const storedTransferData = JSON.parse(
      sessionStorage.getItem("transfer_data") || "null"
    );
    const receiver = JSON.parse(
      sessionStorage.getItem("selected_receiver") || "null"
    );
    const txnId = sessionStorage.getItem("transaction_id") || "";
    const reason = sessionStorage.getItem("transfer_reason") || "";
    const other = sessionStorage.getItem("other_reason") || "";
    const method = sessionStorage.getItem("selected_payment_method") || "";

    if (!storedTransferData || !storedTransferData.amount) return;

    const finalReason = reason === "Other" ? other : reason;

    const updatedTransferData = {
      ...storedTransferData,
      amount: {
        ...storedTransferData.amount,
        reason: finalReason,
        receive_amount: storedTransferData.amount.exchange_amt || "",
        receive_currency: storedTransferData.amount.to || "",
        send_currency: storedTransferData.amount.from || "",
        send_amount: storedTransferData.amount.send_amt || "",
        payout_partner: receiver?.bank_name || "",
      },
      recipient_id: receiver?.id || "",
      transaction_id: txnId,
    };

    setTransferData(updatedTransferData);
    setAmount(updatedTransferData.amount.send_amt || "0.00");
    setCurrency(updatedTransferData.amount.from || "AUD");
    setReceiverName(receiver?.account_name || "Receiver");
    setRecipientId(receiver?.id || "");
    setTransactionId(txnId);
    setTransferReason(reason);
    setOtherReason(other);
    setPaymentType(method === "monova" ? "monova" : method);
  }, []);

  const handleMonovaFormChange = (field, value) => {
    setMonovaForm((prev) => ({ ...prev, [field]: value }));
  };

  const CancelMonovaContinue = () => {
    setMonovaForm({
      bsb: "",
      accountNumber: "",
      accountName: `${
        JSON.parse(sessionStorage.getItem("user_data")).First_name
      } ${JSON.parse(sessionStorage.getItem("user_data")).Last_name}`,
      paymentMethod: "",
    });
    setMonovaFormErrors({});
    setModalShowMonova(false);
    setModalShowMonovaExisting(false);
  };

  const handleBudContinue = async () => {
    try {
      const finalReason =
        transferReason === "Other" ? otherReason : transferReason;
      const transactionId = sessionStorage.getItem("transaction_id");

      const res = await createTransaction({
        amount: {
          reason: finalReason,
          send_amt: amount,
          from: currency,
          receive_method: "Bank transfer",
          payout_partner:
            JSON.parse(sessionStorage.getItem("selected_receiver")).bank_name ||
            "",
          send_currency: JSON.parse(sessionStorage.getItem("transfer_data"))
            ?.amount.from,
          send_amount: amount,
          receive_amount:
            JSON.parse(sessionStorage.getItem("transfer_data"))?.amount
              .exchange_amt || "",
          receive_currency:
            JSON.parse(sessionStorage.getItem("transfer_data"))?.amount.to ||
            "",
          exchange_rate:
            JSON.parse(sessionStorage.getItem("transfer_data"))?.amount
              .exchange_rate || "",
        },
        recipient_id: recipientId,
        transaction_id: transactionId,
      });

      const urlRes = await GetBudRedirectUrl({
        amount: amount,
        transaction_id: res.data.transaction_id,
      });

      if (urlRes?.code === "200" && urlRes?.data?.data?.authorization_url) {
        window.location.href = urlRes.data.data.authorization_url;
      } else {
        toast.error("Failed to get BudPay redirect URL.");
      }
    } catch (error) {
      console.error("Error in handleBudContinue:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleMonovaContinue = async (formData = null) => {
    const currentForm = modalShowMonova ? monovaForm : formData;
    const errors = {};
    if (!currentForm.bsb) errors.bsb = "BSB is required.";
    if (!currentForm.accountName)
      errors.accountName = "Account name is required.";
    if (!transferReason) {
      toast.error("Please select a transfer reason");
      setModalShowMonova(false);
      return;
    }

    setMonovaFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      let res;
      try {
        if (modalShowMonova) {
          try {
            const receiver = JSON.parse(
              sessionStorage.getItem("selected_receiver") || "null"
            );

            if (!receiver || !receiver.first_name || !receiver.last_name) {
              toast.error("Receiver information is incomplete.");
              return;
            }

            toast.info("Creating bank matcher...");

            res = await createAutoMatcher({
              akaNames: [
                receiver.first_name,
                `${receiver.first_name} ${receiver.last_name}`,
                `${receiver.first_name} ${receiver.last_name} ${
                  receiver.middle_name || ""
                }`.trim(),
              ],
              bankAccountName: `${receiver.first_name} ${receiver.last_name}`,
              bsb: currentForm.bsbNumber || currentForm.bsb || "",
            });

            if (!res?.data) {
              toast.error("Failed to create automatcher.");
              return;
            }

            sessionStorage.setItem(
              "monova_automatcher",
              JSON.stringify(res.data)
            );
            toast.success(
              "Your Auto-Matcher account has been successfully created."
            );
          } catch (automatcherErr) {
            console.error("Automatcher creation failed:", automatcherErr);
            toast.error("Failed to create automatcher. Please try again.");
            return;
          }
        }

        sessionStorage.setItem(
          "monova_payment_data",
          JSON.stringify(currentForm)
        );
        sessionStorage.setItem("selected_payment_method", "monova");

        const temp = {
          amount: amount,
          bsbNumber: currentForm.bsb,
          accountNumber: modalShowMonova
            ? res.data.bankAccountNumber
            : currentForm.accountNumber,
          accountName: modalShowMonova
            ? res.data.bankAccountName
            : currentForm.accountName,
          clientUniqueId: modalShowMonova
            ? res?.data?.clientUniqueId
            : currentForm.clientUniqueId,
        };

        const monoovaformdata = JSON.parse(
          sessionStorage.getItem("monova_form_data")
        );
        sessionStorage.setItem(
          "monova_form_data",
          JSON.stringify({
            ...monoovaformdata,
            ...temp,
          })
        );
        const finalReason =
          transferReason === "Other" ? otherReason : transferReason;

        const updatedTransferData = {
          ...transferData,
          amount: {
            ...transferData.amount,
            reason: finalReason,
          },
        };

        try {
          const txResponse = await createTransaction(updatedTransferData);

          if (txResponse?.code === "200") {
            setModalShowMonova(false);
            navigate("/virtual-account-detail", {
              state: { from: "Payment-Detail" },
            });
          } else {
            toast.error(txResponse?.message || "Transaction creation failed.");
          }
        } catch (txErr) {
          console.error("Transaction creation failed:", txErr);
          toast.error("Failed to create transaction. Please try again.");
        }
      } catch (err) {
        console.error("Unexpected error during Monova flow:", err);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
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

  const handleCreatePayId = async () => {
    try {
      const transactionId = sessionStorage.getItem("transaction_id");
      if (!transactionId) {
        toast.error("Transaction ID not found.");
        return;
      }

      let payId = null;
      let transferId = transactionId;

      const existing = await getPayID();

      if (existing?.data?.payid) {
        payId = existing.data.payid;
      } else {
        setIsLoadingPayId(true);

        const response = await createPayId({ transaction_id: transactionId });

        if (response?.code !== "200" || !response.data?.payid) {
          toast.error(response?.message || "PayID generation failed.");
          return;
        }

        payId = response.data.payid;
        transferId = response.data.transaction_id || transactionId;
      }

      setPayIdData({ payId, transferId });

      const finalReason =
        transferReason === "Other" ? otherReason : transferReason;
      const updatedTransferData = transferData
        ? {
            ...transferData,
            amount: {
              ...transferData.amount,
              reason: finalReason,
            },
          }
        : null;
      const txResponse = await createTransaction(updatedTransferData);

      if (txResponse?.code === "200") {
        setModalShowPayId(true);
      } else {
        toast.error(txResponse?.message || "Transaction creation failed.");
      }
    } catch (err) {
      toast.error("Error during PayID or transaction process.");
    } finally {
      setIsLoadingPayId(false);
    }
  };

  const handleContinue = async () => {
    if (!transferReason) {
      setReasonError("Please select a transfer reason.");
      return;
    }

    if (transferReason === "Other" && !otherReason.trim()) {
      toast.error("Please specify the reason when selecting 'Other'.");
      return;
    }

    setReasonError("");

    const finalReason =
      transferReason === "Other" ? otherReason : transferReason;
    sessionStorage.setItem("final_transfer_reason", finalReason);

    if (transferData) {
      setTransferData((prev) => ({
        ...prev,
        amount: {
          ...prev.amount,
          reason: finalReason,
        },
      }));
    }

    if (paymentType === "payto") {
      try {
        // setIsLoadingAgreement(true);
        // ... rest of your existing code
      } catch (err) {
        // ... existing error handling
      }
    } else if (paymentType === "payid") {
      handleCreatePayId();
    } else if (paymentType === "monova") {
      let AutoMatcherRes = await GetAutoMatcher();
      let matcher = null;
      const receiver = JSON.parse(
        sessionStorage.getItem("selected_receiver") || "null"
      );
      const monovaFormData = sessionStorage.getItem("monova_form_data");
      let monovaFormParsed = {};
      if (monovaFormData) {
        try {
          monovaFormParsed = JSON.parse(monovaFormData);
        } catch {}
      }
      if (
        !AutoMatcherRes?.code ||
        AutoMatcherRes?.code !== "200" ||
        !AutoMatcherRes.data.bankAccountNumber
      ) {
        setMonovaForm({
          bsb: "",
          accountNumber: "",
          accountName: `${userData.First_name || ""} ${
            userData.Last_name || ""
          }`,
          paymentMethod: "",
        });
        setModalShowMonova(true);
      } else if (
        AutoMatcherRes?.code === "200" &&
        AutoMatcherRes.data.bankAccountNumber
      ) {
        const bankDetails = AutoMatcherRes.data;
        const updatedMonovaForm = {
          paymentMethod: "",
          accountName: bankDetails.bankAccountName,
          accountNumber: bankDetails.bankAccountNumber,
          bsb: bankDetails.bsb,
          clientUniqueId: bankDetails.clientUniqueId,
        };
        setMonovaForm(updatedMonovaForm);

        sessionStorage.setItem(
          "monova_automatcher",
          JSON.stringify(bankDetails)
        );
        // setModalShowMonovaExisting(true);
        await handleMonovaContinue(updatedMonovaForm);
      } else {
        toast.error("Some Error while creating account number.");
      }
    } else if (paymentType === "budpay") {
      handleBudContinue();
    } else {
      toast.warning("Please select a payment type.");
    }
  };

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            className="p-0 border-0 bg-transparent"
            onClick={() =>
              navigate("/review-transfer", {
                state: {
                  from: "Payment-Detail",
                },
              })
            }
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
                        checked={
                          paymentType === "bank_transfer" ||
                          paymentType === "monova" ||
                          paymentType === "budpay"
                        }
                        onChange={() => {
                          setPaymentType("monova");
                          sessionStorage.removeItem("payto_limit_data");
                          sessionStorage.removeItem("payto_agreement_response");
                          sessionStorage.removeItem("payid_data");
                          sessionStorage.removeItem("monova_payment_data");
                          sessionStorage.removeItem("budpay_payment_data");
                          sessionStorage.setItem(
                            "selected_payment_method",
                            "monova"
                          );
                        }}
                      />

                      {
                        // (paymentType === "bank_transfer" ||
                        //   paymentType === "monova" ||
                        //   paymentType === "budpay") && (
                        //     <Form.Select
                        //       className="ms-3 payment-select"
                        //       style={{ width: "200px" }}
                        //       value={paymentType === "monova" ? "monova" : paymentType === "budpay" ? "budpay" : ""}
                        //       onChange={(e) => {
                        //         const selectedGateway = e.target.value;
                        //         if (selectedGateway === "monova") {
                        //           setPaymentType("monova");
                        //           sessionStorage.setItem("selected_payment_method", "monova");
                        //           sessionStorage.removeItem("budpay_payment_data");
                        //         } else if (selectedGateway === "budpay") {
                        //           setPaymentType("budpay");
                        //           sessionStorage.setItem("selected_payment_method", "budpay");
                        //           sessionStorage.removeItem("monova_payment_data");
                        //         } else {
                        //           setPaymentType("bank_transfer");
                        //           sessionStorage.setItem("selected_payment_method", "bank_transfer");
                        //           sessionStorage.removeItem("monova_payment_data");
                        //           sessionStorage.removeItem("budpay_payment_data");
                        //         }
                        //       }}
                        //     >
                        //       <option value="">Select Gateway</option>
                        //       <option value="monova">Monoova</option>
                        //       {/* <option value="budpay">BudPay</option> */}
                        //     </Form.Select>
                        //   )
                      }
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
                          sessionStorage.setItem(
                            "transfer_reason",
                            e.target.value
                          );

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
                            sessionStorage.setItem(
                              "other_reason",
                              e.target.value
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent form submission
                            }
                          }}
                          placeholder="Enter your reason here"
                          isInvalid={
                            transferReason === "Other" &&
                            !otherReason.trim() &&
                            !!reasonError
                          }
                        />
                        {transferReason === "Other" &&
                          !otherReason.trim() &&
                          reasonError && (
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
                        onClick={() =>
                          navigate("/review-transfer", {
                            state: {
                              from: "Payment-Detail",
                            },
                          })
                        }
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
                <br />
                <small className="text-muted">
                  For any queries, please feel free to contact us at{" "}
                  <span>
                    <a href="tel:+61480001611">+61480001611</a>
                  </span>
                  .
                </small>
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
                      navigate("/confirm-transfer", {
                        state: { from: "Payment-Detail" },
                      });
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
            Bank transfer
          </Modal.Header>
          <Modal.Body>
            <MonovaForm
              monovaForm={monovaForm}
              monovaFormErrors={monovaFormErrors}
              onChange={handleMonovaFormChange}
              onContinue={handleMonovaContinue}
              onCancel={CancelMonovaContinue}
              readOnly={false}
              showCopy={false}
            />
          </Modal.Body>
        </Modal>

        <Modal
          size="lg"
          centered
          show={ModalShowMonovaExisting}
          onHide={CancelMonovaContinue}
          className="profileupdate"
        >
          <Modal.Header closeButton className="payment-popup">
            Bank transfer
          </Modal.Header>
          <Modal.Body>
            <MonovaForm
              monovaForm={monovaForm}
              monovaFormErrors={monovaFormErrors}
              onChange={handleMonovaFormChange}
              onContinue={handleMonovaContinue}
              onCancel={CancelMonovaContinue}
              readOnly={true}
              showCopy={true}
            />
          </Modal.Body>
        </Modal>
      </div>
    </AnimatedPage>
  );
};

export default PaymentDetail;
