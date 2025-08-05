import React from "react";
import { Form, FloatingLabel, Col, Row, Button } from "react-bootstrap";
import { RiFileCopyLine } from "react-icons/ri";

const MonovaForm = ({
  monovaForm,
  monovaFormErrors,
  onChange,
  onContinue,
  onCancel,
  readOnly = false,
  showCopy = false,
}) => (
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
          onChange={(e) => onChange("paymentMethod", e.target.value)}
          isInvalid={!!monovaFormErrors.paymentMethod}
        >
          <option value="">Select Payment Method</option>
          {/* <option value="debit">Direct Debit</option> */}
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
          readOnly={readOnly}
          onChange={(e) => onChange("bsb", e.target.value)}
          isInvalid={!!monovaFormErrors.bsb}
        />
        {showCopy && (
          <span
            className="copyText"
            onClick={() => navigator.clipboard.writeText(monovaForm.bsb)}
            style={{ cursor: "pointer" }}
          >
            <RiFileCopyLine />
          </span>
        )}
        {monovaFormErrors.bsb && (
          <Form.Control.Feedback type="invalid">
            {monovaFormErrors.bsb}
          </Form.Control.Feedback>
        )}
      </FloatingLabel>
    </Row>
    {/* Account Number only for existing modal */}
    {readOnly && (
      <Row className="mb-3">
        <FloatingLabel
          as={Col}
          controlId="monova-account"
          label="Account Number"
          className="mb-3"
        >
          <Form.Control
            type="text"
            value={monovaForm.accountNumber}
            readOnly
            onChange={(e) => onChange("accountNumber", e.target.value)}
            isInvalid={!!monovaFormErrors.accountNumber}
          />
          {showCopy && (
            <span
              className="copyText"
              onClick={() => navigator.clipboard.writeText(monovaForm.accountNumber)}
              style={{ cursor: "pointer" }}
            >
              <RiFileCopyLine />
            </span>
          )}
          {monovaFormErrors.accountNumber && (
            <Form.Control.Feedback type="invalid">
              {monovaFormErrors.accountNumber}
            </Form.Control.Feedback>
          )}
        </FloatingLabel>
      </Row>
    )}
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
          readOnly={readOnly}
          onChange={(e) => onChange("accountName", e.target.value)}
          isInvalid={!!monovaFormErrors.accountName}
        />
        {showCopy && (
          <span
            className="copyText"
            onClick={() => navigator.clipboard.writeText(monovaForm.accountName)}
            style={{ cursor: "pointer" }}
          >
            <RiFileCopyLine />
          </span>
        )}
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
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Col>
      <Col>
        <Button
          variant="primary"
          className="submit-btn float-end"
          onClick={onContinue}
        >
          Continue
        </Button>
      </Col>
    </Row>
  </Form>
);

export default MonovaForm;
