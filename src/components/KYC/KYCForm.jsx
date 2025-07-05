import React, { useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Tab,
  Form,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import PhoneInput from "react-phone-number-input";

import KYCImage from "../../assets/images/kyc-image.png";

import "./KYCForm.css";

const KYCForm = () => {
  const [activeKey, setActiveKey] = useState("step1");
  const [value, setValue] = useState();
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      // Handle the file as needed
    }
  };
  const goToNext = () => {
    if (activeKey === "step1") setActiveKey("step2");
    if (activeKey === "step2") setActiveKey("step3");
  };

  const goToPrevious = () => {
    if (activeKey === "step2") setActiveKey("step1");
    if (activeKey === "step3") setActiveKey("step2");
  };

  return (
    <Container fluid className="py-5 pt-2">
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
                        {isCompleted ? "●" : ""}
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

          <Col md={9} className="px-5">
            <Tab.Content className="kyc-content-form">
              {/* Step 1 */}
              <Tab.Pane eventKey="step1">
                <h2 className="mb-1">Please complete KYC</h2>
                <p className="text-muted mb-4">
                  You are only three steps away from completing your KYC
                </p>

                <div className="page-content-section mt-3">
                  <div className="row">
                    <div className="col-md-12">
                      <Form className="profile-form">
                        <Row className="mb-3 mt-3">
                          <h3>Personal Details</h3>
                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="First Name"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              placeholder="First Name"
                            />
                          </FloatingLabel>
                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Middle Name"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Middle Name"
                            />
                          </FloatingLabel>
                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Last Name"
                            className="mb-3"
                          >
                            <Form.Control type="text" placeholder="Last Name" />
                          </FloatingLabel>
                        </Row>
                        <Row className="mb-3">
                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Email"
                            className="mb-3"
                          >
                            <Form.Control
                              type="email"
                              placeholder="Enter email"
                            />
                          </FloatingLabel>

                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Mobile"
                            className="mb-3 mobileinput"
                          >
                            <PhoneInput
                              international
                              countryCallingCodeEditable={false}
                              defaultCountry="AU"
                              value={value}
                              onChange={setValue}
                            />
                          </FloatingLabel>
                        </Row>
                        <Row className="mb-3">
                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Date of Birth"
                            className="mb-3"
                          >
                            <Form.Control
                              type="date"
                              placeholder="Select Date"
                            />
                          </FloatingLabel>

                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Country of Birth"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Customer ID"
                            />
                          </FloatingLabel>

                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Occupation"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Occupation"
                            />
                          </FloatingLabel>
                        </Row>

                        <Row className="mb-3 mt-3">
                          <h3>Your Address</h3>
                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Country"
                            className="mb-3"
                          >
                            <Form.Control type="text" placeholder="Country" />
                          </FloatingLabel>
                          <FloatingLabel
                            as={Col}
                            controlId="floatingTextarea2"
                            label="Address"
                          >
                            <Form.Control
                              as="textarea"
                              placeholder="Street Address"
                              style={{ height: "50px" }}
                            />
                          </FloatingLabel>
                        </Row>

                        <Row className="mb-3">
                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="City"
                            className="mb-3"
                          >
                            <Form.Control type="text" placeholder="City" />
                          </FloatingLabel>
                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="Zip/Postal Code*"
                            className="mb-3"
                          >
                            <Form.Control
                              type="number"
                              placeholder="Zip/Postal Code*"
                            />
                          </FloatingLabel>

                          <FloatingLabel
                            as={Col}
                            controlId="floatingInput"
                            label="State"
                            className="mb-3"
                          >
                            <Form.Control type="text" placeholder="State" />
                          </FloatingLabel>
                        </Row>

                        <Row className="mb-3">
                          <Col>
                            <Button
                              variant="success"
                              className="nextbtn"
                              onClick={goToNext}
                            >
                              NEXT STEP
                            </Button>
                            <Button
                              variant="link"
                              className="skipbtn"
                              onClick={() => setActiveKey("step3")}
                            >
                              SKIP
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              {/* Step 2 */}
              <Tab.Pane eventKey="step2">
                <div className="kyc-complete-wrapper">
                  <div>
                    <h2 className="mb-3">Please complete KYC</h2>
                    <p>
                      You are only three steps away from completing your KYC
                    </p>
                  </div>

                  <div className="verify-container">
                    <button
                      className="verify-btn"
                      type="button"
                      onClick={handleClick}
                    >
                      VERIFY YOUR ID
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />

                    {selectedFileName && (
                      <p className="selected-file-name mt-3">
                        <b>Selected file: </b>
                        {selectedFileName}
                      </p>
                    )}
                    <p className="verify-description">
                      <strong>Veriff</strong> is an identity verification
                      provider that helps companies connect with customers.
                    </p>
                  </div>

                  <div className="d-flex gap-2 justify-content-start">
                    <Button
                      variant="secondary"
                      className="prevbtn"
                      onClick={goToPrevious}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="success"
                      className="nextbtn"
                      onClick={goToNext}
                    >
                      NEXT STEP
                    </Button>
                    <Button
                      variant="link"
                      className="skipbtn"
                      onClick={() => setActiveKey("step3")}
                    >
                      SKIP
                    </Button>
                  </div>
                </div>
              </Tab.Pane>

              {/* Step 3 */}
              <Tab.Pane eventKey="step3">
                <div className="kyc-complete-wrapper">
                  <div className="kyc-complete-content">
                    <h2>KYC Completed!</h2>
                    <p>Request has been submitted. It may take some time.</p>
                  </div>

                  <div>
                    <img
                      src={KYCImage}
                      alt="KYC success"
                      className="kyc-image"
                    />
                  </div>

                  <div className="kyc-complete-footer">
                    <Button variant="success" className="nextbtn">
                      Go to Dashboard
                    </Button>
                    <p className="redirect-msg">
                      You will be redirected in <span>10 Seconds</span>
                    </p>
                  </div>
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
