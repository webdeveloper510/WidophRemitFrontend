import { Form, FloatingLabel, Col, InputGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import AnimatedPage from "../../components/AnimatedPage";
import PayID from "../../assets/images/payid.png";
import PayTo from "../../assets/images/payto.png";
import { useState, useEffect } from "react";
import { getAgreementList, getPayID } from "../../services/Api";

const PaymentInfo = () => {

  const [payIdDetail, setPayIdDetail] = useState({ payid: null });
  const [payToDetail, setPayToDetail] = useState({
    agreement_uuid: null,
    account_number: "",
    agreement_start_date: "",
    bsb_code: "",
    max_amount: ""
  });

  useEffect(() => {
    (async () => {
      try {
        const [payIdRes, agreementRes] = await Promise.all([
          getPayID(),
          getAgreementList()
        ]);

        if (payIdRes.code === "200") {
          setPayIdDetail(payIdRes.data);
        }

        if (agreementRes.code === "200") {
          setPayToDetail(agreementRes.data);
        }

      } catch (err) {
        console.error("Error fetching payId or agreement:", err);
      }
    })();
  }, []);

  return (
    <AnimatedPage>
      <div className="page-title">
        <h1>Payment Info </h1>
      </div>
      <div className="page-content-section">
        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-3 bg-white p-2 payment-types">
              <Card.Body>
                <h5>Pay ID Detail</h5>

                <Row className="mb-3 mt-4">
                  <Col xs={3}>
                    <img src={PayID} alt="image" />
                  </Col>
                  <Col>
                    <div>
                      <label>Pay ID</label>
                      <p>{payIdDetail.payid}</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-4 bg-white p-2 payment-types">
              <Card.Body>
                <h5>Pay To Detail</h5>

                <Row className="mb-3 mt-4">
                  <Col xs={3}>
                    <img src={PayTo} alt="image" />
                  </Col>
                  <Col>
                    <Row>
                      <Col xs={4}>
                        <label>Mandate ID</label>
                        <p>{payToDetail.agreement_uuid}</p>
                      </Col>
                      <Col xs={4}>
                        <label>Account Limit</label>
                        <p>{payToDetail.max_amount}</p>
                      </Col>
                      <Col xs={4}>
                        <label>BSB Code</label>
                        <p>{payToDetail.bsb_code}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={4}>
                        <label>Account No.</label>
                        <p>{payToDetail.account_number}</p>
                      </Col>
                      <Col xs={4}>
                        <label>Start Date</label>
                        <p>{payToDetail.agreement_start_date}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default PaymentInfo;
