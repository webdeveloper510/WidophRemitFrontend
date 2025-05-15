import React, { useState } from "react";
import AnimatedPage from "../components/AnimatedPage";
import Back from "../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, InputGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import UpdatePopup from "../assets/images/profilepopup.png";

const ProfileInformation = () => {
  const [value, setValue] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);

  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex">
          <a href="dashboard">
            <img src={Back} />
          </a>
          <h1>Profile Information</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <Form className="profile-form">
              <Card className="receiver-card bg-white">
                <Card.Body>
                  <Card.Title>Personal Details</Card.Title>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="First Name"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="First Name" />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Middle Name"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Middle Name" />
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
                      label="Customer ID"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Customer ID" />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Email"
                      className="mb-3"
                    >
                      <Form.Control type="email" placeholder="Enter email" />
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
                      <Form.Control type="date" placeholder="Select Date" />
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Country of Birth"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Customer ID" />
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Occupation"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Occupation" />
                    </FloatingLabel>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <Card.Title>Your Address</Card.Title>
                  <Row className="mb-3">
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
                </Card.Body>
              </Card>

              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <Card.Title>Change Password</Card.Title>
                  <Row className="mb-3">
                    {/* Current Password */}
                    <FloatingLabel
                      as={Col}
                      controlId="floatingCurrentPassword"
                      label="Current Password"
                      className="mb-3 position-relative"
                    >
                      <Form.Control
                        placeholder="Current Password"
                        className="passowrdinput"
                        type={visibility.current ? "text" : "password"}
                      />
                      <span
                        onClick={() => toggleVisibility("current")}
                        className="password-eye"
                      >
                        {visibility.current ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </FloatingLabel>

                    {/* New Password */}
                    <FloatingLabel
                      as={Col}
                      controlId="floatingNewPassword"
                      label="New Password"
                      className="mb-3 position-relative"
                    >
                      <Form.Control
                        placeholder="New Password"
                        className="passowrdinput"
                        type={visibility.new ? "text" : "password"}
                      />
                      <span
                        onClick={() => toggleVisibility("new")}
                        className="password-eye"
                      >
                        {visibility.new ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </FloatingLabel>

                    {/* Confirm Password */}
                    <FloatingLabel
                      as={Col}
                      controlId="floatingConfirmPassword"
                      label="Confirm Password"
                      className="position-relative"
                    >
                      <Form.Control
                        placeholder="Confirm Password"
                        className="passowrdinput"
                        type={visibility.confirm ? "text" : "password"}
                      />
                      <span
                        onClick={() => toggleVisibility("confirm")}
                        className="password-eye"
                      >
                        {visibility.confirm ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Button
                        variant="primary"
                        className="float-end updateform"
                        onClick={() => setModalShow(true)}
                      >
                        Update
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Form>

            <Modal
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={modalShow}
              onHide={() => setModalShow(false)}
              className="profileupdate"
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <h4>Profile information Updated Successfully</h4>
                <p className="m-4">
                  <img src={UpdatePopup} alt="image" width="250px" />
                </p>
              </Modal.Body>
              <Modal.Footer className="PopupButton">
                <Button onClick={() => setModalShow(false)}>
                  Go Back to Dashboard
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ProfileInformation;
