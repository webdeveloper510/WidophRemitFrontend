import React, { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import processedImg from "../../assets/images/payment-processed-image.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { paymentSummary } from "../../services/Api";

const TransactionSuccess = () => {
  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const monovaTransactionId = sessionStorage.getItem("monova_transaction_id");
    const regularTransactionId = sessionStorage.getItem("transaction_id");

    const transferData = JSON.parse(sessionStorage.getItem("transfer_data") || "{}");

    let transaction_id = monovaTransactionId || regularTransactionId;
    if (!transaction_id || !transferData) {
      setLoading(false);
      return;
    }

    setTransaction({
      transaction_id: transaction_id,
      final_amount: transferData.amount.send_amt || "N/A",
      status: "Success",
    });

    async function GetTransactionDetails() {
      setLoading(true);
      try {
        const result = await paymentSummary(transaction_id);
        if (result?.code === "200") {
          setStatus(result.data.payment_status)
        } else {
          setError("Transaction not found.");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    GetTransactionDetails();


    setLoading(false);
  }, []);


  const handleBackToDashboard = () => {
    sessionStorage.removeItem("monova_transaction_id");
    sessionStorage.removeItem("monova_form_data");
    sessionStorage.removeItem("monova_payment_data");
    sessionStorage.removeItem("monova_payment_response");
    sessionStorage.removeItem("payload");
    sessionStorage.removeItem("selected_payment_method");
    sessionStorage.removeItem("selected_receiver");
    sessionStorage.removeItem("transaction_id");
    sessionStorage.removeItem("transfer_data");
    sessionStorage.removeItem("transfer_reason");
    navigate("/dashboard");
  };

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          {/* <button className="btn btn-link p-0 me-2" onClick={handleBackToDashboard}>
            <img src={Back} alt="Back" />
          </button> */}
          <h1>Your transfer is being processed</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
            <p>Loading transaction details...</p>
          </div>
        ) : transaction ? (
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
                              <td>{transaction.transaction_id || "N/A"}</td>
                            </tr>
                            <tr>
                              <td>Transfer Amount</td>
                              <td>{transaction.final_amount ? `${transaction.final_amount} AUD` : "N/A"}</td>
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
                  <Button variant="primary" className="float-end updateform" onClick={handleBackToDashboard}>
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

export default TransactionSuccess;