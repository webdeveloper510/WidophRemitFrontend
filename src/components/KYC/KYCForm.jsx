import React, { useState } from "react";
import { Container, Row, Col, Nav, Tab, Form, Button } from "react-bootstrap";
import "./KYCForm.css";

const KYCForm = () => {
  const [activeKey, setActiveKey] = useState("step1");

  const goToNext = () => {
    if (activeKey === "step1") setActiveKey("step2");
    if (activeKey === "step2") setActiveKey("step3");
  };

  const goToPrevious = () => {
    if (activeKey === "step2") setActiveKey("step1");
    if (activeKey === "step3") setActiveKey("step2");
  };

  return (
    <Container fluid className="py-5">
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Row>
          <Col
            md={3}
            className="sidebar-steps d-flex justify-content-center align-items-center flex-column"
          >
            <Nav variant="pills" className="flex-column gap-4 w-100">
              {[1, 2, 3].map((num) => {
                const stepKey = `step${num}`;
                const currentStep = parseInt(activeKey.replace("step", ""));
                const isActive = activeKey === stepKey;
                const isCompleted = currentStep >= num;

                return (
                  <Nav.Item key={num} className="step-wrapper">
                    <div className="step-connector">
                      <div
                        className={`step-dot ${
                          isCompleted ? "completed" : ""
                        } ${isActive ? "active" : ""}`}
                      >
                        {isCompleted ? "✔" : ""}
                      </div>
                      {num !== 3 && <div className="step-line" />}
                    </div>
                    <Nav.Link
                      eventKey={stepKey}
                      className={`step-label ${isCompleted ? "active" : ""}`}
                    >
                      <div>
                        <strong className="steps-number">Step {num}</strong>
                      </div>
                      <div className="steps-name">
                        {num === 1
                          ? "Personal Details"
                          : num === 2
                          ? "Verify Your Id"
                          : "KYC Completed"}
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </Col>

          {/* Right side content */}
          <Col md={9} className="px-5">
            <Tab.Content>
              {/* Step 1 */}
              <Tab.Pane eventKey="step1">
                <h2 className="mb-1">Please complete KYC</h2>
                <p className="text-muted mb-4">
                  You are only three steps away from completing your KYC
                </p>

                <Form>
                  <h5>Personal Info</h5>
                  <Row className="mb-3">
                    <Col>
                      <Form.Control placeholder="First Name*" />
                    </Col>
                    <Col>
                      <Form.Control placeholder="Middle Name*" />
                    </Col>
                    <Col>
                      <Form.Control placeholder="Last Name*" />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Form.Control placeholder="Email*" />
                    </Col>
                    <Col>
                      <Form.Control placeholder="Phone*" />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Form.Control type="date" placeholder="DOB*" />
                    </Col>
                    <Col>
                      <Form.Select>
                        <option>Country of Birth*</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Control placeholder="Occupation*" />
                    </Col>
                  </Row>

                  <h5 className="mt-4">Address Info</h5>
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Select>
                        <option>Country*</option>
                      </Form.Select>
                    </Col>
                    <Col md={8}>
                      <Form.Control placeholder="Street Address*" />
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col>
                      <Form.Control placeholder="City*" />
                    </Col>
                    <Col>
                      <Form.Control placeholder="Postal Code*" />
                    </Col>
                    <Col>
                      <Form.Control placeholder="State*" />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between">
                    <Button variant="success" onClick={goToNext}>
                      NEXT STEP
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => setActiveKey("step3")}
                    >
                      SKIP
                    </Button>
                  </div>
                </Form>
              </Tab.Pane>

              {/* Step 2 */}
              <Tab.Pane eventKey="step2">
                <h2 className="mb-3">Verify Your ID</h2>
                <Form>
                  <Form.Group className="mb-4">
                    <Form.Label>Upload Passport / ID Card / License</Form.Label>
                    <Form.Control type="file" />
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={goToPrevious}>
                      Back
                    </Button>
                    <Button variant="success" onClick={goToNext}>
                      NEXT STEP
                    </Button>
                  </div>
                </Form>
              </Tab.Pane>

              {/* Step 3 */}
              <Tab.Pane eventKey="step3">
                <div className="text-center">
                  <h2 className="text-success">✅ KYC Completed!</h2>
                  <p>Your KYC data is under review.</p>
                  <Button variant="primary" className="mt-3">
                    Go to Dashboard
                  </Button>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default KYCForm;
