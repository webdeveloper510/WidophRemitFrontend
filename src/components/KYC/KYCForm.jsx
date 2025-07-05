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
import { useNavigate } from "react-router-dom";

const KYCForm = () => {
  const navigate=useNavigate()
  const [activeKey, setActiveKey] = useState("step1");
  const [value, setValue] = useState();
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    countryOfBirth: "",
    occupation: "",
    country: "",
    address: "",
    city: "",
    zip: "",
    state: "",
  });

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const goToNext = () => {
    if (activeKey === "step1") {
      const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        countryOfBirth,
        occupation,
        country,
        address,
        city,
        zip,
        state,
      } = formData;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !dob ||
        !countryOfBirth ||
        !occupation ||
        !country ||
        !address ||
        !city ||
        !zip ||
        !state
      ) {
        alert("Please fill all required fields.");
        return;
      }

      setActiveKey("step2");
    } else if (activeKey === "step2") {
      if (!selectedFileName) {
        alert("Please upload your ID to continue.");
        return;
      }
      setActiveKey("step3");
    }
  };

  const goToPrevious = () => {
    if (activeKey === "step2") setActiveKey("step1");
    if (activeKey === "step3") setActiveKey("step2");
  };

  return (
    <Container fluid className="py-5">
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Row>
          <Col md={3} className="sidebar-steps d-flex justify-content-center align-items-center flex-column">
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
                        className={`step-dot ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
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
                <p className="text-muted mb-4">You are only three steps away from completing your KYC</p>

                <Form className="profile-form">
                  <Row className="mb-3 mt-3">
                    <h3>Personal Details</h3>
                    <FloatingLabel as={Col} label="First Name" className="mb-3">
                      <Form.Control
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </FloatingLabel>
                    <FloatingLabel as={Col} label="Middle Name" className="mb-3">
                      <Form.Control
                        type="text"
                        value={formData.middleName}
                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      />
                    </FloatingLabel>
                    <FloatingLabel as={Col} label="Last Name" className="mb-3">
                      <Form.Control
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3">
                    <FloatingLabel as={Col} label="Email" className="mb-3">
                      <Form.Control
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </FloatingLabel>

                    <FloatingLabel as={Col} label="Mobile" className="mb-3 mobileinput">
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="AU"
                        value={value}
                        onChange={(val) => {
                          setValue(val);
                          setFormData({ ...formData, phone: val });
                        }}
                      />
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3">
                    <FloatingLabel as={Col} label="Date of Birth" className="mb-3">
                      <Form.Control
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      />
                    </FloatingLabel>

                    <FloatingLabel as={Col} label="Country of Birth" className="mb-3">
                      <Form.Control
                        type="text"
                        value={formData.countryOfBirth}
                        onChange={(e) => setFormData({ ...formData, countryOfBirth: e.target.value })}
                      />
                    </FloatingLabel>

                    <FloatingLabel as={Col} label="Occupation" className="mb-3">
                      <Form.Control
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      />
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3 mt-3">
                    <h3>Your Address</h3>
                    <FloatingLabel as={Col} label="Country" className="mb-3">
                      <Form.Control
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </FloatingLabel>

                    <FloatingLabel as={Col} label="Address">
                      <Form.Control
                        as="textarea"
                        style={{ height: "50px" }}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3">
                    <FloatingLabel as={Col} label="City" className="mb-3">
                      <Form.Control
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </FloatingLabel>

                    <FloatingLabel as={Col} label="Zip/Postal Code*" className="mb-3">
                      <Form.Control
                        type="number"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      />
                    </FloatingLabel>

                    <FloatingLabel as={Col} label="State" className="mb-3">
                      <Form.Control
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Button variant="success" className="nextbtn" onClick={goToNext}>
                        NEXT STEP
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Tab.Pane>

              {/* Step 2 */}
              <Tab.Pane eventKey="step2">
                <div className="kyc-complete-wrapper">
                  <div>
                    <h2 className="mb-3">Please complete KYC</h2>
                    <p>You are only three steps away from completing your KYC</p>
                  </div>

                  <div className="verify-container">
                    <button className="verify-btn" type="button" onClick={handleClick}>
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
                      <strong>Veriff</strong> is an identity verification provider that helps companies connect with customers.
                    </p>
                  </div>

                  <div className="d-flex gap-2 justify-content-start">
                    <Button variant="secondary" className="prevbtn" onClick={goToPrevious}>
                      Previous
                    </Button>
                    <Button variant="success" className="nextbtn" onClick={goToNext}>
                      NEXT STEP
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
                    <img src={KYCImage} alt="KYC success" className="kyc-image" />
                  </div>
                  <div className="kyc-complete-footer">
                    <Button variant="success" className="nextbtn" onClick={()=>navigate("/dashboard")}>
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
