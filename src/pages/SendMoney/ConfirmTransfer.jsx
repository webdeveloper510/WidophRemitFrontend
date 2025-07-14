import React, { useState } from "react";
import OtpInput from "react-otp-input";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import OtpImage from "../../assets/images/Otp-image.png";

const ConfirmTransfer = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [otp, setOtp] = useState("");
  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <a href="payment-detail">
            <img src={Back} />
          </a>
          <h1>Confirm Your Transfer</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-4 bg-white">
              <Card.Body>
                <div className="row">
                  <div className="col-md-6">
                    <div className="col-md-12">
                      <div className="table-column">
                        <h2>Sender Details</h2>
                        <Table striped bordered>
                          <tbody>
                            <tr>
                              <td>Sending Amount</td>
                              <td>104.00 AUD</td>
                            </tr>
                            <tr>
                              <td>Amount Exchanged</td>
                              <td>NGN 1,000,000.00</td>
                            </tr>
                            <tr>
                              <td>Total To Receiver</td>
                              <td>NGN 1,000,000.00</td>
                            </tr>
                            <tr>
                              <td>Exchange Rate</td>
                              <td>1 AUD = 1,000.99 NGN</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="col-md-12">
                      <div className="table-column">
                        <h2>
                          Transfer From <small>(Sender Details)</small>
                        </h2>
                        <Table striped bordered>
                          <tbody>
                            <tr>
                              <td>Sender Name</td>
                              <td>Albert Joseph</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>

                    <div className="col-md-12 mt-3">
                      <div className="table-column">
                        <h2>
                          Transfer To <small>(Receiver Details)</small>
                        </h2>
                        <Table striped bordered>
                          <tbody>
                            <tr>
                              <td>Beneficiary Name</td>
                              <td>Albert Joseph</td>
                            </tr>
                            <tr>
                              <td>Bank Name</td>
                              <td>Advans La Fayette Microfinance Bank</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Row className="mt-5">
              <Col>
                <a href="payment-detail">
                  <Button variant="light" className="cancel-btn float-start">
                    Back
                  </Button>
                </a>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="float-end updateform"
                  onClick={() => setModalShow(true)}
                >
                  Save & Continue
                </Button>
              </Col>
            </Row>
          </div>
        </div>
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
            <h4>Verify your account by entering the code</h4>
            <p className="m-4">
              <img src={OtpImage} alt="image" />
            </p>
            <Col className="inputBoxStyle">
              <OtpInput
                value={otp}
                inputStyle="inputBoxStyle"
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
            </Col>
            <a href="#" className="resendOTP">
              Resend OTP
            </a>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Row className="mb-3">
              <Col>
                <Button
                  variant="light"
                  className="cancel-btn float-start"
                  onClick={() => setModalShow(false)}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <a href="payment-processed">
                  <Button
                    onClick={() => setModalShow(false)}
                    variant="primary"
                    className="submit-btn float-end"
                  >
                    Continue
                  </Button>
                </a>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </div>
    </AnimatedPage>
  );
};

export default ConfirmTransfer;
