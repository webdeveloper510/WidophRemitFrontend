import React, { useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, InputGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const AddReceiver = () => {
  const [value, setValue] = useState();

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <a href="receivers">
            <img src={Back} />
          </a>
          <h1>Add Receivers</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <Form className="profile-form">
              <Card className="receiver-card bg-white">
                <Card.Body>
                  <Card.Title>Bank Information</Card.Title>
                  <Row className="mb-3">
                    <FloatingLabel
                      controlId="floatingSelect"
                      as={Col}
                      label="Bank Name"
                    >
                      <Form.Select aria-label="Floating label select example">
                        <option value="1">Bank Of USA</option>
                        <option value="2">Bank Of America</option>
                      </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Account Number"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Account Number" />
                    </FloatingLabel>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <Card.Title>Receiver Details</Card.Title>

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
                </Card.Body>
              </Card>

              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <Card.Title>Address</Card.Title>
                  <Row className="mb-3">
                    <FloatingLabel
                      controlId="floatingSelect"
                      as={Col}
                      label="Country"
                    >
                      <Form.Select aria-label="Floating label select example">
                        <option value="1">Australia</option>
                        <option value="2">Nigeria</option>
                      </Form.Select>
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
                      <a href="receivers">
                        <Button
                          variant="light"
                          className="cancel-btn float-start"
                        >
                          Back
                        </Button>
                      </a>
                    </Col>
                    <Col>
                      <a href="review-transfer">
                        <Button
                          variant="primary"
                          className="float-end updateform"
                        >
                          Create Receiver
                        </Button>
                      </a>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AddReceiver;
