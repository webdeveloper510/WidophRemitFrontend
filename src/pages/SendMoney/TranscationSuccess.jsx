import React, { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import processedImg from "../../assets/images/payment-processed-image.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { paymentSummary } from "../../services/Api";
import { clearSessionStorageData } from "../../utils/sessionUtils";

const TransactionSuccess = () => {
  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from !== "confirm-transfer") {
      navigate("/send-money");
      return;
    }
  }, [location])

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('pageIsReloading', 'true');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("web_exchange_data");
    };
  }, []);

  // Handle browser back button - override browser history and clear session storage
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);

    const handlePopState = (event) => {
      window.history.pushState(null, null, window.location.pathname);
      clearSessionStorageData();
      navigate('/dashboard', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Check if page was reloaded and redirect to dashboard
  useEffect(() => {
    const checkIfReloaded = () => {
      if (sessionStorage.getItem('pageIsReloading') === 'true') {
        sessionStorage.removeItem('pageIsReloading');
        clearSessionStorageData();
        navigate('/dashboard');
      }
    };
    checkIfReloaded();
  }, [navigate]);

  useEffect(() => {
    const selectedMethod = sessionStorage.getItem("selected_payment_method");
    const transaction_id = selectedMethod === "monova"
      ? sessionStorage.getItem("monova_transaction_id")
      : sessionStorage.getItem("transaction_id");

    const transferData = JSON.parse(sessionStorage.getItem("transfer_data") || "{}");

    setTransaction({
      transaction_id: transaction_id,
      final_amount: transferData.amount?.send_amt || "N/A",
      status: "Success",
    });

    async function GetTransactionDetails() {
      setLoading(true);
      try {
        const result = await paymentSummary(transaction_id);
        if (result?.code === "200") {
          setStatus(result.data.payment_status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    GetTransactionDetails();
  }, []);


  const handleBackToDashboard = () => {
    clearSessionStorageData();
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="page-title">
          <h1>Loading Transaction Details</h1>
        </div>
        <div className="page-content-section mt-3">
          <div className="text-center mt-5">
            <Spinner animation="border" />
            <p></p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <h1>Your transfer is being processed</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        {transaction ? (
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