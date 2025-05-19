import AnimatedPage from "../../components/AnimatedPage";
import { Form, FloatingLabel, Col, InputGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const SendMoney = () => (
  <AnimatedPage>
    <div className="page-title">
      <h1>Amount & Delivery </h1>
    </div>
    <div className="page-content-section mt-3">
      <div className="row">
        <div className="col-md-12">
          <div className="exchangerate p-4">
            <p>Exchange Rate</p>
            <h4>
              <b>1 AUD = 1,000.99 NGN</b>
            </h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Card className="receiver-card mt-4 bg-white p-5">
            <Card.Body>
              <Form className="profile-form">
                <Row className="mb-4">
                  <FloatingLabel
                    controlId="floatingSelect"
                    as={Col}
                    label="Source"
                  >
                    <Form.Select aria-label="Floating label select example">
                      <option value="1">AUD</option>
                      <option value="2">USD</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingSelect"
                    as={Col}
                    label="Destination"
                  >
                    <Form.Select aria-label="Floating label select example">
                      <option value="1">NGN</option>
                      <option value="2">USA</option>
                    </Form.Select>
                  </FloatingLabel>
                </Row>
                <Row className="mb-3">
                  <FloatingLabel
                    as={Col}
                    controlId="floatingInput"
                    label="Amount Send"
                    className="mb-3"
                  >
                    <Form.Control type="text" placeholder="Amount Send" />
                  </FloatingLabel>
                  <FloatingLabel
                    as={Col}
                    controlId="floatingInput"
                    label="Exchange Amount"
                    className="mb-3"
                  >
                    <Form.Control type="text" placeholder="Exchange Amount" />
                  </FloatingLabel>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Button variant="light" className="cancel-btn float-start">
                      Cancel
                    </Button>
                  </Col>
                  <Col>
                    <a href="receivers-list">
                      <Button
                        variant="primary"
                        className="submit-btn float-end"
                      >
                        Continue
                      </Button>
                    </a>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  </AnimatedPage>
);

export default SendMoney;
