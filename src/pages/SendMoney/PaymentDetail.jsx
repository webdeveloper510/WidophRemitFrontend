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
  Collapse,
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
  createAgreement,
  CreateMonoovaPayid,
  GetExistingMonoovaPayid,
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
  const [modalShowPayTo, setModalShowPayTo] = useState(false);
  const [modalShowPayToAgreement, setModalShowPayToAgreement] = useState(false);
  const [modalShowPayToLimit, setModalShowPayToLimit] = useState(false);
  const [isLoadingAgreement, setIsLoadingAgreement] = useState(false);
  const [payToForm, setPayToForm] = useState({ payIdType: "", payId: "", bsb: "", accountNumber: "" });
  const [payToLimitForm, setPayToLimitForm] = useState({ payId: "", bsb: "", accountNumber: "", amountLimit: "", startDate: "" });
  const [payToFormErrors, setPayToFormErrors] = useState({});
  const [isCreatingAgreement, setIsCreatingAgreement] = useState(false);
  const [bsb, setbsb] = useState(0);
  const [openPayId, setOpenPayId] = useState(false);
  const [openBank, setOpenBank] = useState(false);
  const [monovaForm, setMonovaForm] = useState({
    bsb: "802-985",
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
      sessionStorage.getItem("transfer_data") || "null",
    );
    const receiver = JSON.parse(
      sessionStorage.getItem("selected_receiver") || "null",
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

  const handlePayToFormChange = (field, value) => {
    setPayToForm((prev) => ({ ...prev, [field]: value }));
  };

  const CancelMonovaContinue = () => {
    setMonovaForm({
      bsb: "802-985",
      accountNumber: "",
      accountName: `${JSON.parse(sessionStorage.getItem("user_data")).First_name
        } ${JSON.parse(sessionStorage.getItem("user_data")).Last_name}`,
      paymentMethod: "",
    });
    setMonovaFormErrors({});
    setModalShowMonova(false);
    setModalShowMonovaExisting(false);
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
      errors.payId =
        "Please use either PayID or BSB + Account Number — not both.";
      errors.bsb = "Clear PayID to enter BSB.";
      errors.accountNumber = "Clear PayID to enter Account Number.";
    }

    setPayToFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatAmountLimit = (limit) => {
    if (!limit) return "Not specified";
    return `AUD ${parseInt(limit).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-AU");
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

  const handlePayToAgreementContinue = async () => {
    setIsCreatingAgreement(true);
    try {
      let payload;
      console.log(payToLimitForm);

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
      payload.reason =
        transferReason === "Other" ? otherReason : transferReason;

      const agreementResponse = await createAgreement(payload);

      if (agreementResponse?.code === "200" || agreementResponse?.success) {
        sessionStorage.setItem(
          "payto_limit_data",
          JSON.stringify(payToLimitForm)
        );
        sessionStorage.setItem(
          "payto_agreement_response",
          JSON.stringify(agreementResponse)
        );

        const txResponse = await createTransaction(transferData);

        if (txResponse?.code === "200") {
          toast.success("PayTo agreement & transaction created successfully!");
          setModalShowPayToAgreement(false);
          navigate("/confirm-transfer", { state: { from: "Payment-Detail" } });
        } else {
          toast.error(txResponse?.message || "Failed to create transaction.");
        }
      } else {
        toast.error(
          agreementResponse?.message || "Failed to create agreement."
        );
      }
    } catch (error) {
      toast.error("Error creating agreement.");
    } finally {
      setIsCreatingAgreement(false);
    }
  };

  async function handleMonoovaPayId() {
    let AutoMatcherRes = await GetAutoMatcher();
    let MonoovaPayidResponse, NewpayIdresponse = null;
    if (
      !AutoMatcherRes?.code ||
      AutoMatcherRes?.code !== "200" ||
      !AutoMatcherRes.data.bankAccountNumber
    ) {
      const receiver = JSON.parse(
        sessionStorage.getItem("selected_receiver") || "null",
      );

      if (!receiver || !receiver.first_name || !receiver.last_name) {
        toast.error("Receiver information is incomplete.");
        return;
      }

      let res = await createAutoMatcher({
        akaNames: [
          receiver.first_name,
          `${receiver.first_name} ${receiver.last_name}`,
          `${receiver.first_name} ${receiver.last_name} ${receiver.middle_name || ""
            }`.trim(),
        ],
        bankAccountName: `${receiver.first_name} ${receiver.last_name}`,
        bsb: "802-985",
      });

      if (!res?.data) {
        toast.error("Failed.");
        return;
      } else {
        AutoMatcherRes = await GetAutoMatcher();
      }

    }
    MonoovaPayidResponse = await GetExistingMonoovaPayid();

    if (
      !MonoovaPayidResponse?.data?.id) {
      NewpayIdresponse = await CreateMonoovaPayid();
      console.log(NewpayIdresponse);
    }

    const temp = {
      amount: amount,
      bsbNumber: "802-985",
      accountNumber: MonoovaPayidResponse?.data?.id ? MonoovaPayidResponse?.data?.bankAccountNumber : NewpayIdresponse?.data?.PayIdDetails?.BankAccountNumber,
      accountName: "Widoph Remit Pty Ltd",
      clientUniqueId: AutoMatcherRes?.data?.clientUniqueId
    };


    sessionStorage.setItem(
      "monova_form_data",
      JSON.stringify({
        ...temp,
      }),
    );
    sessionStorage.setItem("monova_automatcher", JSON.stringify(AutoMatcherRes.data),);
    sessionStorage.setItem("MonoovaPayid", MonoovaPayidResponse?.data?.id ? MonoovaPayidResponse.data.PayId : NewpayIdresponse?.data?.PayIdDetails?.PayId);

    const finalReason =
      transferReason === "Other" ? otherReason : transferReason;

    const updatedTransferData = {
      ...transferData,
      amount: {
        ...transferData.amount,
        reason: finalReason,
      },
    };

    const txResponse = await createTransaction({...updatedTransferData,monova_payment:"payid"});

    if (txResponse?.code === "200") {
      navigate("/virtual-account-detail", {
        state: { from: "Payment-Detail" },
      });
    }
  }
  const handleMonovaContinue = async (formData = null, newuser = false) => {
    const currentForm = newuser ? monovaForm : formData;
    const errors = {};
    // if (!currentForm.bsb) errors.bsb = "BSB is required.";
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
        if (newuser) {
          try {
            const receiver = JSON.parse(
              sessionStorage.getItem("selected_receiver") || "null",
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
                `${receiver.first_name} ${receiver.last_name} ${receiver.middle_name || ""
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
              JSON.stringify(res.data),
            );
            toast.success(
              "Your account number account has been successfully created.",
            );
          } catch (automatcherErr) {
            console.error("Automatcher creation failed:", automatcherErr);
            toast.error("Failed to create account number. Please try again.");
            return;
          }
        }

        sessionStorage.setItem(
          "monova_payment_data",
          JSON.stringify(currentForm),
        );
        sessionStorage.setItem("selected_payment_method", "monova");

        const temp = {
          amount: amount,
          bsbNumber: currentForm.bsb,
          accountNumber: newuser
            ? res.data.bankAccountNumber
            : currentForm.accountNumber,
          accountName: newuser
            ? res.data.bankAccountName
            : currentForm.accountName,
          clientUniqueId: newuser
            ? res?.data?.clientUniqueId
            : currentForm.clientUniqueId,
        };

        const monoovaformdata = JSON.parse(
          sessionStorage.getItem("monova_form_data"),
        );
        sessionStorage.setItem(
          "monova_form_data",
          JSON.stringify({
            ...monoovaformdata,
            ...temp,
          }),
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
          const txResponse = await createTransaction({...updatedTransferData,monova_payment:"payin"});

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
        setIsLoadingAgreement(true);
        setModalShowPayTo(true)
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
        sessionStorage.getItem("selected_receiver") || "null",
      );
      const monovaFormData = sessionStorage.getItem("monova_form_data");
      let monovaFormParsed = {};
      if (monovaFormData) {
        try {
          monovaFormParsed = JSON.parse(monovaFormData);
        } catch { }
      }
      if (
        !AutoMatcherRes?.code ||
        AutoMatcherRes?.code !== "200" ||
        !AutoMatcherRes.data.bankAccountNumber
      ) {
        setMonovaForm({
          bsb: "802-985",
          accountNumber: "",
          accountName: `${userData.First_name || ""} ${userData.Last_name || ""
            }`,
          paymentMethod: "",
        });

        await handleMonovaContinue(
          {
            bsb: "802-985",
            accountNumber: "",
            accountName: `${userData.First_name || ""} ${userData.Last_name || ""
              }`,
            paymentMethod: "",
          },
          true,
        );
        // setModalShowMonova(true);
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
          JSON.stringify(bankDetails),
        );
        // setModalShowMonovaExisting(true);
        await handleMonovaContinue(updatedMonovaForm, false);
      } else {
        toast.error("Some Error while creating account number.");
      }
    } else if (paymentType === "monoovaPayId") {
      handleMonoovaPayId();
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

                    <Row className="mt-2">
                      {/* PAYID COLUMN */}
                      <Col md={4}>
                        <div
                          style={{ cursor: "pointer" }}
                          className="fw-bold"
                          onClick={() => setOpenPayId(!openPayId)}
                        >
                          PayID {openPayId ? "▲" : "▼"}
                        </div>


                        <Collapse in={openPayId}>
                          <div className="mt-2">
                            <Form.Check
                              className="paymentoptions"
                              label="Monoova (PayID)"
                              name="paymentType"
                              type="radio"
                              checked={paymentType === "monoovaPayId"}
                              onChange={() => {
                                setPaymentType("monoovaPayId");
                                sessionStorage.setItem("selected_payment_method", "monoovaPayId");
                                sessionStorage.removeItem("monova_payment_data");
                                sessionStorage.removeItem("payid_data");
                                sessionStorage.removeItem("payto_limit_data");
                                sessionStorage.removeItem("payto_agreement_response");
                              }}
                            />

                            {/* <Form.Check
                              className="paymentoptions"
                              label="Zai (PayID)"
                              name="paymentType"
                              type="radio"
                              checked={paymentType === "payid"}
                              onChange={() => {
                                setPaymentType("payid");
                                sessionStorage.setItem("selected_payment_method", "payid");
                                sessionStorage.removeItem("monova_payment_data");
                                sessionStorage.removeItem("payto_limit_data");
                                sessionStorage.removeItem("payto_agreement_response");
                              }}
                            /> */}
                          </div>
                        </Collapse>
                      </Col>

                      {/* BANK TRANSFER COLUMN */}
                      <Col md={4}>
                        <div
                          style={{ cursor: "pointer" }}
                          className="fw-bold"
                          onClick={() => setOpenBank(!openBank)}
                        >
                          Bank Transfer {openBank ? "▲" : "▼"}
                        </div>

                        <Collapse in={openBank}>
                          <div className="mt-2">
                            <Form.Check
                              className="paymentoptions"
                              label="Monoova (Bank Transfer)"
                              name="paymentType"
                              type="radio"
                              checked={paymentType === "monova"}
                              onChange={() => {
                                setPaymentType("monova");
                                sessionStorage.removeItem("payto_limit_data");
                                sessionStorage.removeItem("payto_agreement_response");
                                sessionStorage.removeItem("payid_data");
                                sessionStorage.removeItem("monova_payment_data");
                                sessionStorage.removeItem("budpay_payment_data");
                                sessionStorage.setItem("selected_payment_method", "monova");
                              }}
                            />

                            {/* <Form.Check
                              className="paymentoptions"
                              label="Pay To"
                              name="paymentType"
                              type="radio"
                              checked={paymentType === "payto"}
                              onChange={() => {
                                setPaymentType("payto");
                                sessionStorage.setItem("selected_payment_method", "zai");
                                sessionStorage.removeItem("monova_payment_data");
                                sessionStorage.removeItem("payid_data");
                              }}
                            /> */}
                          </div>
                        </Collapse>
                      </Col>
                    </Row>
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
                            e.target.value,
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
                              e.target.value,
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

              <Row className="mb-3">
                <span className="Ortext">OR</span>
              </Row>

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
