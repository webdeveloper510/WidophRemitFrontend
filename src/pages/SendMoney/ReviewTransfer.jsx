import React, { useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
const ReviewTransfer = () => {
  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex">
          <a href="dashboard">
            <img src={Back} />
          </a>
          <h1>Review Your Transfer</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-4 bg-white">
              <Card.Body></Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ReviewTransfer;
