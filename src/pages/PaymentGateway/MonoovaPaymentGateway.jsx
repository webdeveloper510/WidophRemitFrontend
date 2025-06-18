import React, { useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const Monoova = () => {
  const [value, setValue] = useState();

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <h1>Payment Method</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <Form className="profile-form">
              <Card className="receiver-card bg-white">
                <Card.Body>
                  <Card.Title>Sender Details</Card.Title>
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
                </Card.Body>
              </Card>

              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <Card.Title>Payment Details</Card.Title>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Payment Source"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="PaymentSource" />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="BSB  Number"
                    >
                      <Form.Control type="text" placeholder="bsbNumber" />
                    </FloatingLabel>
                  </Row>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Account Number"
                    >
                      <Form.Control type="text" placeholder="accountNumber" />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Account Name "
                    >
                      <Form.Control type="text" placeholder="accountName" />
                    </FloatingLabel>
                  </Row>
                </Card.Body>
              </Card>
              <Row className="mb-3 mt-3">
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
            </Form>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Monoova;
