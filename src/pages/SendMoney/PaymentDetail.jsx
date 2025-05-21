import React from "react";
import AnimatedPage from "../../components/AnimatedPage";
import { Form, FloatingLabel, Col, InputGroup } from "react-bootstrap";
import Back from "../../assets/images/back.png";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { RiFileCopyLine } from "react-icons/ri";

const PaymentDetail = () => {
  const [modalShowPayTo, setModalShowPayTo] = React.useState(false);
  const [modalShowPayId, setModalShowPayId] = React.useState(false);

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <a href="receivers-list">
            <img src={Back} />
          </a>
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
                    <b>1,000.99 AUD</b>
                  </h4>
                </div>
                <span className="divider"></span>
                <div>
                  <p>Sending To</p>
                  <h4>
                    <b>Patrick</b>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-4 bg-white p-3">
              <Card.Body>
                <Form>
                  <Row>
                    <label>Payment type</label>
                    {["radio"].map((type) => (
                      <div key={`inline-${type}`} className="d-flex mb-3 mt-3">
                        <Form.Check
                          onClick={() => setModalShowPayTo(true)}
                          className="payment-options"
                          inline
                          label="Pay TO"
                          //defaultChecked
                          name="group1"
                          type={type}
                          id={`inline-${type}-1`}
                        />
                        <Form.Check
                          onClick={() => setModalShowPayId(true)}
                          className="payment-options"
                          inline
                          label="Pay ID"
                          name="group1"
                          type={type}
                          id={`inline-${type}-2`}
                        />
                      </div>
                    ))}
                  </Row>
                  <Row className="mt-5">
                    <FloatingLabel
                      controlId="floatingSelect"
                      as={Col}
                      label="Transfer Reason"
                    >
                      <Form.Select aria-label="Floating label select example">
                        <option>Select a Reason</option>
                        <option value="1">Don't want to send</option>
                        <option value="2">Other</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      <a href="review-transfer">
                        <Button
                          variant="light"
                          className="cancel-btn float-start"
                        >
                          Back
                        </Button>
                      </a>
                    </Col>
                    {/* <Col>
                      
                      <a href="confirm-transfer">
                        <Button
                          variant="primary"
                          className="float-end updateform"
                        >
                          Save & Continue
                        </Button>
                      </a>
                    </Col> */}
                  </Row>
                </Form>
                <Modal
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  show={modalShowPayTo}
                  onHide={() => setModalShowPayTo(false)}
                  className="profileupdate"
                >
                  <Modal.Header closeButton className="payment-popup">
                    PayTo
                  </Modal.Header>
                  <Modal.Body>
                    <p className="m-4">
                      Lorem ipsum,placeholder or dummy text used in typesetting
                      and graphic design for previewing layouts.
                    </p>

                    <Form className="profile-form">
                      <Row className="mb-3">
                        <FloatingLabel
                          controlId="floatingSelect"
                          as={Col}
                          label="PayID Type"
                        >
                          <Form.Select aria-label="Floating label select example">
                            <option value="1">AUD</option>
                            <option value="2">USD</option>
                          </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel
                          as={Col}
                          controlId="floatingInput"
                          label="PayID"
                          className="mb-3"
                        >
                          <Form.Control type="text" placeholder="PayID" />
                        </FloatingLabel>
                      </Row>
                      <Row className="mb-3">
                        <span className="Ortext">OR</span>
                      </Row>
                      <Row className="mb-3">
                        <FloatingLabel
                          as={Col}
                          controlId="floatingInput"
                          label="BSB"
                          className="mb-3"
                        >
                          <Form.Control type="text" placeholder="BSB" />
                        </FloatingLabel>
                      </Row>
                      <Row className="mb-3">
                        <FloatingLabel
                          as={Col}
                          controlId="floatingInput"
                          label="Account No."
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Account Number"
                          />
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
                          <a href="confirm-transfer">
                            <Button
                              variant="primary"
                              className="submit-btn float-end"
                            >
                              Continue
                            </Button>
                          </a>
                        </Col>
                      </Row>
                    </Form>
                  </Modal.Body>
                </Modal>

                <Modal
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
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
                          controlId="floatingInput"
                          label="PayID"
                          className="mb-3 position-relative"
                        >
                          <Form.Control type="text" placeholder="PayID" />
                          <span className="copyText">
                            <RiFileCopyLine />
                          </span>
                        </FloatingLabel>
                      </Row>
                      <Row className="mb-3">
                        <FloatingLabel
                          as={Col}
                          controlId="floatingInput"
                          label="Transfer ID"
                          className="mb-3 position-relative"
                        >
                          <Form.Control type="text" placeholder="Transfer ID" />
                          <span className="copyText">
                            <RiFileCopyLine />
                          </span>
                        </FloatingLabel>
                      </Row>
                      <p className="m-4">
                        Lorem ipsum,placeholder or dummy text used in
                        typesetting and graphic design for previewing layouts.
                      </p>

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
                          <a href="confirm-transfer">
                            <Button
                              variant="primary"
                              className="submit-btn float-end"
                            >
                              Continue
                            </Button>
                          </a>
                        </Col>
                      </Row>
                    </Form>
                  </Modal.Body>
                </Modal>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PaymentDetail;
