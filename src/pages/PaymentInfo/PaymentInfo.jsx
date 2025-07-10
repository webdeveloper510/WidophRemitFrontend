import { Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import AnimatedPage from "../../components/AnimatedPage";
import PayID from "../../assets/images/payid.png";
import PayTo from "../../assets/images/payto.png";
import { useState, useEffect } from "react";
import { getAgreementList, getPayID } from "../../services/Api";

const PaymentInfo = () => {
  const [payIdDetail, setPayIdDetail] = useState(null);
  const [payToDetail, setPayToDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [payIdRes, agreementRes] = await Promise.all([
          getPayID(),
          getAgreementList(),
        ]);

        if (payIdRes.code === "200" && payIdRes.data?.payid) {
          setPayIdDetail(payIdRes.data);
        }

        if (
          agreementRes.code === "200" &&
          (agreementRes.data?.account_number || agreementRes.data?.bsb_code)
        ) {
          setPayToDetail(agreementRes.data);
        }
      } catch (err) {
        console.error("Error fetching payId or agreement:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AnimatedPage>
      <div className="page-title">
        <h1>Payment Info</h1>
      </div>

      <div className="page-content-section">
        {/* Pay ID Card */}
        {payIdDetail && (
          <div className="row">
            <div className="col-md-12">
              <Card className="receiver-card mt-3 bg-white p-2 payment-types">
                <Card.Body>
                  <h5>Pay ID Detail</h5>
                  <Row className="mb-3 mt-4">
                    <Col xs={3}>
                      <img src={PayID} alt="Pay ID" />
                    </Col>
                    <Col>
                      <label>Pay ID</label>
                      <p>{payIdDetail.payid || "—"}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {/* Pay To Card */}
        {payToDetail && (
          <div className="row">
            <div className="col-md-12">
              <Card className="receiver-card mt-4 bg-white p-2 payment-types">
                <Card.Body>
                  <h5>Pay To Detail</h5>
                  <Row className="mb-3 mt-4">
                    <Col xs={3}>
                      <img src={PayTo} alt="Pay To" />
                    </Col>
                    <Col>
                      <Row>
                        <Col xs={4}>
                          <label>Account No.</label>
                          <p>{payToDetail.account_number || "—"}</p>
                        </Col>
                        <Col xs={4}>
                          <label>BSB Code</label>
                          <p>{payToDetail.bsb_code || "—"}</p>
                        </Col>
                        <Col xs={4}>
                          <label>Status</label>
                          <p>{payToDetail.status || "—"}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={4}>
                          <label>PayID</label>
                          <p>{payToDetail.payid || "—"}</p>
                        </Col>
                        <Col xs={4}>
                          <label>PayID Type</label>
                          <p>{payToDetail.payid_type || "—"}</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {/* No Data Card */}
        {!payIdDetail && !payToDetail && !loading && (
          <div className="row">
            <div className="col-md-12">
              <Card className="receiver-card mt-4 bg-white p-2 payment-types">
                <Card.Body className="text-center">No records found.</Card.Body>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default PaymentInfo;
