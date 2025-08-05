import { Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import AnimatedPage from "../../components/AnimatedPage";
import PayID from "../../assets/images/payid.png";
import PayTo from "../../assets/images/payto.png";
import loaderlogo from "../../assets/images/logo.png";
import { useState, useEffect } from "react";
import { getAgreementList, GetAutoMatcher, getPayID } from "../../services/Api";



const PaymentInfo = () => {
  const [payIdDetail, setPayIdDetail] = useState(null);
  const [payToDetail, setPayToDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Loader, setLoader] = useState(true);
  const [AutoMatcherData, setAutoMatcherData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [payIdRes, agreementRes, AutoMatcherRes] = await Promise.all([
          getPayID(),
          getAgreementList(),
          GetAutoMatcher()
        ]);

        if (payIdRes.code === "200" && payIdRes.data?.payid) {
          setPayIdDetail(payIdRes.data);
        }

        if (
          AutoMatcherRes?.code === "200" &&
          AutoMatcherRes.data.bankAccountNumber
        ) {
          setAutoMatcherData({
            bankAccountName: AutoMatcherRes.data.bankAccountName,
            bankAccountNumber: AutoMatcherRes.data.bankAccountNumber,
            bsb: AutoMatcherRes.data.bsb
          })
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
    const timer = setTimeout(() => setLoader(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <img src={loaderlogo} alt="Logo" className="loader-logo" />
        <div className="spinner"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loader-wrapper">
        <img src={loaderlogo} alt="Logo" className="loader-logo" />
        <div className="spinner"></div>
      </div>
    );
  }


  if (Loader) {
    return (
      <div className="loader-wrapper">
        <img src={loaderlogo} alt="Logo" className="loader-logo" />
        <div className="spinner"></div>
      </div>
    );
  }

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

        {AutoMatcherData && (
          <div className="row">
            <div className="col-md-12">
              <Card className="receiver-card mt-3 bg-white p-2 payment-types">
                <Card.Body>
                  <h5>Auto Matcher Detail</h5>
                  <Row className="mb-3 mt-4">
                    <Col xs={3}>
                      <img src={PayID} alt="Pay ID" />
                    </Col>
                    <Col>
                      <label>Bank Account Name</label>
                      <p>{AutoMatcherData.bankAccountName || "—"}</p>
                    </Col>
                    <Col>
                      <label>Bank Account Number</label>
                      <p>{AutoMatcherData.bankAccountNumber || "—"}</p>
                    </Col><Col>
                      <label>BSB Number</label>
                      <p>{AutoMatcherData.bsb || "—"}</p>
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

        {/* No Data */}
        {!payIdDetail && !payToDetail && !AutoMatcherData && (
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
