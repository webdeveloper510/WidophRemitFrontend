import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import DownloadIcon from "../../assets/images/download.png";
import Button from "react-bootstrap/Button";
import { paymentSummary } from "../../services/Api";

const TransferDetails = () => {
  const { id } = useParams();
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function GetTransactionDetails() {
      setLoading(true);
      try {
        const result = await paymentSummary(id);
        if (result?.code === "200") {
          setTransactionData(result.data);
          setError(null);
        } else {
          setError("Transaction not found.");
        }
      } catch (err) {
        setError("Failed to fetch transaction details.");
      } finally {
        setLoading(false);
      }
    }
    GetTransactionDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Link to="/dashboard">
            <img src={Back} alt="Back" />
          </Link>
          <h1>Transfer Details</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <Card className="receiver-card">
          <Card.Body>
            <div className="row">
              <div className="col-md-6">
                <Container>
                  <Row>
                    <Col className="p-4 stripe1 mb-4">
                      <h2>
                        Exchange <br />
                        Rate
                        <span>
                          <b>1</b> {transactionData?.send_currency} ={" "}
                          <b>{transactionData?.exchange_rate}</b>{" "}
                          {transactionData?.receive_currency}
                        </span>
                      </h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="p-4 stripe2 text-white">
                      <span>Amount Paid</span>
                      <h2>
                        {transactionData?.send_amount}{" "}
                        {transactionData?.send_currency}
                      </h2>
                    </Col>
                    <Col className="p-4 stripe3 text-white">
                      <span>Amount Received</span>
                      <h2>
                        {transactionData?.receive_amount}{" "}
                        {transactionData?.receive_currency}
                      </h2>
                    </Col>
                  </Row>
                </Container>

                <div className="col-md-12 mt-4">
                  <Card className="receiver-card">
                    <Card.Body>
                      <Container>
                        <Row>
                          <Col className="p-3 box">
                            <span>Date Created</span>
                            <h3>{transactionData?.date}</h3>
                          </Col>
                          <Col className="p-3 box">
                            <span>Status</span>
                            <h3>{transactionData?.payment_status}</h3>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="p-3 box">
                            <span>Transfer Id</span>
                            <h3>{transactionData?.transaction_id}</h3>
                          </Col>
                        </Row>
                        {transactionData.payment_status !== "In progress" &&
                          <Row>
                            <Col>
                              <Button
                                variant="success"
                                className="float-end download-button"
                              >
                                <img src={DownloadIcon} alt="Download Receipt" />{" "}
                                Download Receipt
                              </Button>
                            </Col>
                          </Row>}
                      </Container>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <div className="col-md-6">
                <div className="col-md-12">
                  <div className="table-column">
                    <h2>Receiver Details</h2>
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <th>Receiver Name</th>
                          <td>{transactionData?.recipient_name}</td>
                        </tr>
                        <tr>
                          <th>Bank Name</th>
                          <td>{transactionData?.bank_name}</td>
                        </tr>
                        <tr>
                          <th>Account No.</th>
                          <td>{transactionData?.account_number}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>

                <div className="col-md-12 mt-4">
                  <div className="table-column">
                    <h2>More Details</h2>
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <th>Payment Mode</th>
                          <td>{transactionData?.send_method}</td>
                        </tr>
                        <tr>
                          <th>Customer ID</th>
                          <td>{transactionData?.customer_id}</td>
                        </tr>
                        <tr>
                          <th>Transfer Reason</th>
                          <td>{transactionData?.reason}</td>
                        </tr>
                        <tr>
                          <th>PayID</th>
                          <td>
                            {transactionData?.send_method_details?.payid ||
                              "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default TransferDetails;
