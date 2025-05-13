import React from "react";
import AnimatedPage from "../components/AnimatedPage";
import Back from "../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const ProfileInformation = () => {
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
        <Card className="receiver-card">
          <Card.Body>
            <div className="row">
              <div className="col-md-12">
                <Form>
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
                      className="mb-3"
                    >
                      <Form.Control type="number" placeholder="Enter Mobile" />
                    </FloatingLabel>
                  </Row>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Mobile"
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
                </Form>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ProfileInformation;
