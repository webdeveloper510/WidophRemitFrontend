import React, { useState } from "react";

import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import processedImg from "../../assets/images/payment-processed-image.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button } from "react-bootstrap";

const PaymentProcessed = () => {
  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <a href="confirm-transfer">
            <img src={Back} />
          </a>
          <h1>Your transfer is being processed</h1>
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
                        <h2>Details</h2>
                        <Table striped bordered>
                          <tbody>
                            <tr>
                              <td>Transfer ID</td>
                              <td>ADPFT20250</td>
                            </tr>
                            <tr>
                              <td>Transfer Amount</td>
                              <td>1,000.00 AUD</td>
                            </tr>
                            <tr>
                              <td>Transfer Status</td>
                              <td>IN process</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                    <div className="row mt-4 mb-4">
                      <div className=" col-md-12">
                        <Button
                          variant="primary"
                          className="float-start download-button btn btn-success"
                        >
                          VIEW RECEIPT
                        </Button>
                      </div>
                    </div>
                    <div className="col-md-12 mt-5 processing-info-text">
                      <h4>
                        <b>Thank you for choosing us,</b>
                      </h4>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                      </p>
                      <ul>
                        <li>
                          Lorem Ipsum is simply dummy. Lorem Ipsum is simply
                        </li>
                        <li>
                          Lorem Ipsum is dummy text of the printing and. Lorem
                          Ipsum is simply
                        </li>
                        <li>
                          Lorem Ipsum is dummy text of the printing and
                          typesetting industry.
                        </li>
                        <li>
                          Lorem Ipsum is simply dummy text of the printing
                          typesetting industry. Lorem Ipsum is simply.
                        </li>
                      </ul>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="col-md-12">
                      <img
                        src={processedImg}
                        className="processing-vector"
                        alt="img"
                        width="400px"
                      />
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Row className="mt-5">
              {/* <Col>
                <a href="confirm-transfer">
                  <Button variant="light" className="cancel-btn float-start">
                    Back
                  </Button>
                </a>
              </Col> */}
              <Col>
                <a href="dashboard">
                  <Button variant="primary" className="float-end updateform">
                    Go to Dashboard
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

export default PaymentProcessed;
