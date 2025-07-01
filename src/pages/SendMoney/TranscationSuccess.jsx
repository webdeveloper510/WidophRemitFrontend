import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import AnimatedPage from "../../components/AnimatedPage";
import { useNavigate } from "react-router-dom";
import { ZaiPayId } from "../../services/Api";

const TransactionSuccess = () => {
  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [isMonovaTransaction, setIsMonovaTransaction] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionStatus = async () => {
      // Check for Monova transaction ID first
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
        console.error("No transaction ID found.");
        setLoading(false);
        return;
      }

      try {
        if (isMonova) {
          const transferData = JSON.parse(sessionStorage.getItem("transfer_data") || "{}");
          const monovaFormData = JSON.parse(sessionStorage.getItem("monova_form_data") || "{}");
          
          setTransaction({
            transaction_id: monovaTransactionId,
            final_amount: transferData?.amount?.send_amt || "N/A",
            payment_method: "Monova",
          });
          setStatus("Success");
        } else {
          const payload = { transaction_id };
          const response = await ZaiPayId(payload);

          if (response?.code === "200") {
            setTransaction(response.data);
            setStatus(response.message || "Pending");
          } else {
            console.error("Error fetching transaction:", response?.message);
          }
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionStatus();
  }, []);

  const handleBackToDashboard = () => {
    // Clean up session storage
    if (isMonovaTransaction) {
      sessionStorage.removeItem("monova_transaction_id");
      sessionStorage.removeItem("monova_form_data");
    }
    sessionStorage.removeItem("transfer_data");
    sessionStorage.removeItem("selected_receiver");
    
    navigate("/dashboard");
  };

  return (
    <AnimatedPage>
      <div className="page-title text-center">
        <h1>Transaction Status</h1>
      </div>

      <div className="page-content-section mt-4">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p className="mt-2">Loading transaction details...</p>
          </div>
        ) : transaction ? (
          <Card className="p-4 text-center shadow-sm">
            <h3 className="text-success">✅ Payment Processed</h3>
            <hr />
            <Row className="mb-2">
              <Col><strong>Transaction ID:</strong></Col>
              <Col>{transaction.transaction_id || "N/A"}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Amount:</strong></Col>
              <Col>{transaction.final_amount ? `${transaction.final_amount} AUD` : "N/A"}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Status:</strong></Col>
              <Col className="text-primary">{status}</Col>
            </Row>
          

            <Button className="mt-4" onClick={handleBackToDashboard}>
              Go to Dashboard
            </Button>
          </Card>
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