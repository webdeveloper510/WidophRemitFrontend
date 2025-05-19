import React from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import DownloadIcon from "../../assets/images/download.png";
import Button from "react-bootstrap/Button";

const TransferDetails = () => {
  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex">
          <a href="dashboard">
            <img src={Back} />
          </a>
          <h1>Transfer Details</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <Card className="receiver-card">
          <Card.Body>
            <div className="row">
              <div className="col-md-6">
                <div className="col-md-12">
                  <Container>
                    <Row>
                      <Col className="p-4 stripe1 mb-4">
                        <h2>
                          Exchange <br></br>Rate
                          <span>
                            <b>1</b> AUD = <b>1,000.99</b> NGN
                          </span>
                        </h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="p-4 stripe2 text-white">
                        <span>Amount Paid</span>
                        <h2>104.00 AUD</h2>
                      </Col>
                      <Col className="p-4 stripe3 text-white">
                        <span>Amount Received</span>
                        <h2>108,106.92 NGN</h2>
                      </Col>
                    </Row>
                  </Container>
                </div>
                <div className="col-md-12 mt-4">
                  <Card className="receiver-card">
                    <Card.Body>
                      <Container>
                        <Row>
                          <Col className="p-3 box">
                            <span>Date Created</span>
                            <h3>24-Mar-2025</h3>
                          </Col>
                          <Col className="p-3 box">
                            <span>Status</span>
                            <h3>Pending</h3>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="p-3 box">
                            <span>Transfer Id</span>
                            <h3>ADPFT20250</h3>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              variant="success"
                              className="float-end download-button"
                            >
                              <img src={DownloadIcon} /> Download Receipt
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              <div className="col-md-6">
                <div className="col-md-12">
                  <div className="table-column">
                    <h2>Receiver Details</h2>
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <th>Receiver Name</th>
                          <td>Albert Joseph</td>
                        </tr>
                        <tr>
                          <th>Bank Name</th>
                          <td>Advans La Fayette Microfinance Bank</td>
                        </tr>
                        <tr>
                          <th>Email ID</th>
                          <td>au612794@gmail.com</td>
                        </tr>
                        <tr>
                          <th>Phone No.</th>
                          <td>+6145285747</td>
                        </tr>
                        <tr>
                          <th>Account No.</th>
                          <td>000000000000000000000000000000</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
                <div className="col-md-12 mt-4">
                  <div className="table-column">
                    <h2>More Details</h2>
                    <Table striped bordered>
                      <tbody>
                        <tr>
                          <th>Payment mode:</th>
                          <td>PayID</td>
                        </tr>
                        <tr>
                          <th>Customer ID:</th>
                          <td>ADPFT20250</td>
                        </tr>
                        <tr>
                          <th>Transfer Reason:</th>
                          <td>Lorem Ipsum</td>
                        </tr>
                        <tr>
                          <th>PayID:</th>
                          <td>loremipsum@mydomain.com</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default TransferDetails;
