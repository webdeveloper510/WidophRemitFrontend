import React, { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Col, Row, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createTransaction,
  userProfile,
  recipientList,
} from "../../services/Api";
import { toast } from "react-toastify";

const ReviewTransfer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [receiver, setReceiver] = useState(null);
  const [sender, setSender] = useState({});
  const [transferData, setTransferData] = useState(null);
  const [loading, setLoading] = useState(false);
  const transactionId = sessionStorage.getItem("transaction_id") || "";
  const [list, setList] = useState({});
  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const response = await recipientList();
      if (
        response.code === "200" &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setList(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching list:", err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await userProfile();

        // Handle both string and numeric codes
        const statusCode = res?.code?.toString();

        if (statusCode === "200" && res?.data) {
          const user = res.data;
          setSender({
            fullName: `${user.First_name || ""} ${user.Middle_name || ""} ${user.Last_name || ""}`.trim(),
            email: user.email || "N/A",
            phone: user.mobile || "N/A",
          });
        }
        else {
          toast.error(res?.message || "Failed to fetch user profile");
        }

      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile");
      }
    };

    if (location.state && location.state.receiverData) {
      setReceiver(location.state.receiverData);
    } else {
      const storedReceiver = sessionStorage.getItem("selected_receiver");
      if (storedReceiver) {
        try {

          setReceiver(JSON.parse(storedReceiver));
        } catch (error) {
          console.error("Failed to parse selected_receiver:", error);
          navigate("/receivers-list");
        }
      } else {
        toast.error("No receiver selected. Please select a receiver first.");
        navigate("/receivers-list");
      }
    }
    const storedAmount = sessionStorage.getItem("transfer_data");
    if (storedAmount) {
      try {
        const parsedAmount = JSON.parse(storedAmount);
        setTransferData(parsedAmount?.amount || parsedAmount || {});
      } catch (error) {
        console.error("Failed to parse transfer_data:", error);
        toast.error("Invalid transfer data");
      }
    }

    fetchUserProfile();
  }, [navigate, location.state]);
  const fullName = `${list?.First_name || list?.first_name || ""} ${list?.Last_name || list?.last_name || ""
    }`.trim();
  const receiverFullName = receiver
    ? `${receiver.first_name || ""} ${receiver.middle_name || ""} ${receiver.last_name || ""
      }`.trim()
    : "";

  const handleSaveAndContinue = async () => {

    if (!receiver) {
      toast.error("No receiver selected");
      return;
    }

    if (!transferData) {
      toast.error("No transfer data available");
      return;
    }

    setLoading(true);

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
          state: { transaction_id: res?.data?.id || "", transferData },
        });
      } else {
        toast.error(res?.message || "Failed to create transaction.");
      }
    } catch (err) {
      console.error("Transaction API error:", err);
      toast.error("Something went wrong while creating transaction.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (location.state && location.state.receiverData) {
      navigate("/receivers-list");
    } else {
      navigate("/receivers-list");
    }
  };

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={handleBack}
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
                                ? `${transferData.send_amt} ${transferData.from || "AUD"
                                }`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Amount Exchanged</td>
                            <td>
                              {transferData?.exchange_amt
                                ? `${transferData.exchange_amt} ${transferData.to || "NGN"
                                }`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Total To Receiver</td>
                            <td>
                              {transferData?.exchange_amt
                                ? `${transferData.exchange_amt} ${transferData.to || "NGN"
                                }`
                                : "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Exchange Rate</td>
                            <td>
                              {transferData?.exchange_rate
                                ? `1 ${transferData.from || "AUD"} = ${transferData.exchange_rate
                                } ${transferData.to || "NGN"}`
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
                            <td>{sender?.fullName || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Email</td>
                            <td>{sender?.email || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Phone</td>
                            <td>{sender?.phone || "N/A"}</td>
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
                            <td>
                              {receiver?.account_name ||
                                receiverFullName ||
                                "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td>Bank Name</td>
                            <td>{receiver?.bank_name || "N/A"}</td>
                          </tr>
                          {receiver?.account_number && (
                            <tr>
                              <td>Account Number</td>
                              <td>{receiver.account_number}</td>
                            </tr>
                          )}
                          {receiver?.mobile && (
                            <tr>
                              <td>Mobile</td>
                              <td>{receiver.mobile}</td>
                            </tr>
                          )}
                          {receiver?.country && (
                            <tr>
                              <td>Country</td>
                              <td>{receiver.country}</td>
                            </tr>
                          )}
                          {receiver?.street_address && (
                            <tr>
                              <td>Address</td>
                              <td>
                                {receiver.street_address}
                                {receiver.city && `, ${receiver.city}`}
                                {receiver.state && `, ${receiver.state}`}
                                {receiver.post_code && ` ${receiver.post_code}`}
                              </td>
                            </tr>
                          )}
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
                  onClick={handleBack}
                  disabled={loading}
                >
                  Back
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="float-end updateform"
                  onClick={handleSaveAndContinue}
                  disabled={loading || !receiver || !transferData}
                >
                  {loading ? "Processing..." : "Save & Continue"}
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
