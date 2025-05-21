import { Form, FloatingLabel, Col, InputGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import AnimatedPage from "../../components/AnimatedPage";
import PayID from "../../assets/images/payid.png";
import PayTo from "../../assets/images/payto.png";

const PaymentInfo = () => (
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
                    <p>loremipsum@mydomain.com</p>
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
                      <p>loremipsum@mydomain.com</p>
                    </Col>
                    <Col xs={4}>
                      <label>Account Limit</label>
                      <p>$2k</p>
                    </Col>
                    <Col xs={4}>
                      <label>BSB Code</label>
                      <p>AU2295</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4}>
                      <label>Account No.</label>
                      <p>0000000000000000</p>
                    </Col>
                    <Col xs={4}>
                      <label>Start Date</label>
                      <p>25-March-2025</p>
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
);

export default PaymentInfo;
