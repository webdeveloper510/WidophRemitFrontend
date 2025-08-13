import React from "react";
import { useSearchParams } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import processedImg from "../../assets/images/payment-processed-image.png";


const BudPaySuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const status = searchParams.get("status");
  const transferData = JSON.parse(sessionStorage.getItem("transfer_data") || "{}");
  const amount = transferData.amount?.send_amt || "102"


  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <h1>Your transfer is being processed</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        {true ? (
          <div className="row">
            <div className="col-md-12">
              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="table-column">
                        <h2>Details</h2>
                        <Table striped bordered>
                          <tbody>
                            <tr>
                              <td>Transfer ID</td>
                              <td>{reference || "N/A"}</td>
                            </tr>
                            <tr>
                              <td>Transfer Amount</td>
                              <td>{amount}</td>
                            </tr>
                            <tr>
                              <td>Transfer Status</td>
                              <td className="text-primary">{status}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>

                      <div className="mt-4 mb-4">
                        {/* <Button variant="success" className="download-button">
                          VIEW RECEIPT  
                        </Button> */}
                      </div>

                      <div className="processing-info-text mt-5">
                        <h4>
                          <b>Thank you for choosing us,</b>
                        </h4>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        <ul>
                          <li>Lorem Ipsum is simply dummy. Lorem Ipsum is simply</li>
                          <li>Lorem Ipsum is dummy text of the printing and. Lorem Ipsum is simply</li>
                          <li>Lorem Ipsum is dummy text of the printing and typesetting industry.</li>
                          <li>Lorem Ipsum is simply dummy text of the printing typesetting industry. Lorem Ipsum is simply.</li>
                        </ul>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                    </div>
                    <div className="col-md-6 text-center">
                      <img
                        src={processedImg}
                        className="processing-vector"
                        alt="Processing"
                        width="400px"
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Row className="mt-5">
                <Col>
                  <Button variant="primary" className="float-end updateform">
                    Go to Dashboard
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        ) : (
          <div className="text-center text-danger">
            <p>⚠️ Unable to load transaction details.</p>
            <Button variant="secondary" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default BudPaySuccess;
