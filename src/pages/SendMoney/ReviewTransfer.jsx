import React, { useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button } from "react-bootstrap";

const ReviewTransfer = () => {
  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <a href="receivers-list">
            <img src={Back} />
          </a>
          <h1>Review Your Transfer</h1>
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
                <a href="receivers-list">
                  <Button variant="light" className="cancel-btn float-start">
                    Back
                  </Button>
                </a>
              </Col>
              <Col>
                <a href="payment-detail">
                  <Button variant="primary" className="float-end updateform">
                    Save & Continue
                  </Button>
                </a>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ReviewTransfer;
