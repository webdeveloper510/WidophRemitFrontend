import React, { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import processedImg from "../../assets/images/payment-processed-image.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ZaiPayId } from "../../services/Api";

const TransactionSuccess = () => {
  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [isMonovaTransaction, setIsMonovaTransaction] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransaction = async () => {
      const monovaTransactionId = sessionStorage.getItem("monova_transaction_id");
      const regularTransactionId = sessionStorage.getItem("transaction_id");

      let transaction_id = null;
      let isMonova = false;

      if (monovaTransactionId) {
        transaction_id = monovaTransactionId;
        isMonova = true;
        setIsMonovaTransaction(true);
      } else if (regularTransactionId) {
        transaction_id = regularTransactionId;
        isMonova = false;
        setIsMonovaTransaction(false);
      }

      if (!transaction_id) {
        setLoading(false);
        return;
      }

      try {
        if (isMonova) {
          const transferData = JSON.parse(sessionStorage.getItem("transfer_data") || "{}");
          setTransaction({
            transaction_id: transaction_id,
            final_amount: transferData?.amount?.send_amt || "N/A",
            status: "In Process",
          });
          setStatus("Success");
        } else {
          const payload = { transaction_id };
          const response = await ZaiPayId(payload);

          if (response?.code === "200") {
            setTransaction(response.data);
            setStatus(response.message || "Pending");
          } else {
            console.error("Error:", response?.message);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, []);

  const handleBackToDashboard = () => {
    if (isMonovaTransaction) {
      sessionStorage.removeItem("monova_transaction_id");
      sessionStorage.removeItem("monova_form_data");
    }
    sessionStorage.removeItem("transfer_data");
    sessionStorage.removeItem("selected_receiver");

    navigate("/dashboard");
  };
  console.log(transaction);
  

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <button className="btn btn-link p-0 me-2" onClick={() => navigate(-1)}>
            <img src={Back} alt="Back" />
          </button>
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
                        <Button variant="success" className="download-button">
                          VIEW RECEIPT
                        </Button>
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
