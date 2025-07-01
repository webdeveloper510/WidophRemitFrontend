import React, { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createTransaction, userProfile } from "../../services/Api";
import { toast } from "react-toastify";

const ReviewTransfer = () => {
  const navigate = useNavigate();
  const [receiver, setReceiver] = useState(null);
  const [sender, setSender] = useState({});
  const [transferData, setTransferData] = useState(null);
  const transactionId = sessionStorage.getItem("transaction_id") || "";

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await userProfile({});
      if (res?.code === "200" && res?.data) {
        setSender(res.data);
      } else {
        toast.error(res?.message || "Failed to fetch user profile");
      }
    };

    const storedAmount = sessionStorage.getItem("transfer_data");
    const storedReceiver = sessionStorage.getItem("selected_receiver");

    if (storedAmount) {
      try {
        const parsedAmount = JSON.parse(storedAmount);
        setTransferData(parsedAmount?.amount || {});
      } catch (error) {
        console.error("Failed to parse transfer_data:", error);
      }
    }

    if (storedReceiver) {
      setReceiver(JSON.parse(storedReceiver));
    } else {
      navigate("/receivers-list");
    }

    fetchUserProfile();
  }, [navigate]);

  const fullName = `${sender?.First_name || ""} ${sender?.Last_name || ""}`.trim();

  const handleSaveAndContinue = async () => {
    const transactionPayload = {
      transaction_id: transactionId,
      amount: {
        send_amount: transferData?.send_amt || "0.00",
        receive_amount: transferData?.exchange_amt || "0.00",
        send_currency: transferData?.from || "AUD",
        receive_currency: transferData?.to || "NGN",
        receive_method: "Bank transfer",
        reason: "none",
        payout_partner: "test",
        exchange_rate: transferData?.exchange_rate || "1,000.00",
      },
      recipient_id: receiver?.id?.toString() || "0",
    };

    try {
      const res = await createTransaction(transactionPayload);

      if (res?.code === "200") {
        navigate("/payment-detail", {
          state: { transaction_id: res?.data?.id || "" },
        });
      } else {
        toast.error(res?.message || "Failed to create transaction.");
      }
    } catch (err) {
      console.error("Transaction API error:", err);
      toast.error("Something went wrong while creating transaction.");
    }
  };

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={() => navigate("/receivers-list")}
            className="p-0 border-0 bg-transparent"
          >
            <img src={Back} alt="Back" />
          </Button>
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
                    <div className="table-column">
                      <h2>Transfer Details</h2>
                      <Table striped bordered>
                        <tbody>
                          <tr>
                            <td>Sending Amount</td>
                            <td>
                              {transferData?.send_amt
                                ? `${transferData.send_amt} ${transferData.from}`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Amount Exchanged</td>
                            <td>
                              {transferData?.exchange_amt
                                ? `${transferData.exchange_amt} ${transferData.to}`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Total To Receiver</td>
                            <td>
                              {transferData?.exchange_amt
                                ? `${transferData.exchange_amt} ${transferData.to}`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Exchange Rate</td>
                            <td>
                              {transferData?.exchange_rate
                                ? `1 ${transferData.from} = ${transferData.exchange_rate} ${transferData.to}`
                                : "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="table-column">
                      <h2>
                        Transfer From <small>(Sender Details)</small>
                      </h2>
                      <Table striped bordered>
                        <tbody>
                          <tr>
                            <td>Sender Name</td>
                            <td>{fullName || "N/A"}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <div className="table-column mt-3">
                      <h2>
                        Transfer To <small>(Receiver Details)</small>
                      </h2>
                      <Table striped bordered>
                        <tbody>
                          <tr>
                            <td>Beneficiary Name</td>
                            <td>{receiver?.account_name || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Bank Name</td>
                            <td>{receiver?.bank_name || "N/A"}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Row className="mt-5">
              <Col>
                <Button
                  variant="light"
                  className="cancel-btn float-start"
                  onClick={() => navigate("/receivers-list")}
                >
                  Back
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="float-end updateform"
                  onClick={handleSaveAndContinue}
                >
                  Save & Continue
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ReviewTransfer;
