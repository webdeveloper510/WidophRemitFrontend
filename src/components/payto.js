//   createAgreement,
//   getAgreementList,
const [modalShowPayTo, setModalShowPayTo] = useState(false);
const [modalShowPayToAgreement, setModalShowPayToAgreement] = useState(false);
const [modalShowPayToLimit, setModalShowPayToLimit] = useState(false);
const [isLoadingAgreement, setIsLoadingAgreement] = useState(false);
const [payToForm, setPayToForm] = useState({ payIdType: "", payId: "", bsb: "", accountNumber: "" });
const [payToLimitForm, setPayToLimitForm] = useState({ payId: "", bsb: "", accountNumber: "", amountLimit: "", startDate: "" });
const [payToFormErrors, setPayToFormErrors] = useState({});
const [isCreatingAgreement, setIsCreatingAgreement] = useState(false);
const [bsb, setbsb] = useState(0);

const handlePayToFormChange = (field, value) => {
    setPayToForm((prev) => ({ ...prev, [field]: value }));
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

{/* <Modal
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
          </Modal> */}

{/* PayTo Limit Modal */ }
{/* <Modal
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
        </Modal> */}

{/* PayTo Agreement Modal */ }
{/* <Modal
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
        </Modal> */}