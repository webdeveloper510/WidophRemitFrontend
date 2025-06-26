import React, { useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, InputGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import Bank_list from "../../utils/Bank_list";
import { createRecipient } from "../../services/Api";

const AddReceiver = () => {

  const initialValues = {
    bank_name: "",
    account_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    country: "",
    street_address: "",
    state: "",
    mobile: "",
    city: "",
    post_code: ""
  }

  const countryList = [
    { name: "Australia", code: "AU", dialCode: "61" },
    { name: "Brazil", code: "BR", dialCode: "55" },
    { name: "China", code: "CN", dialCode: "86" },
    { name: "Ghana", code: "GH", dialCode: "233" },
    { name: "Kenya", code: "KE", dialCode: "254" },
    { name: "New Zealand", code: "NZ", dialCode: "64" },
    { name: "Nigeria", code: "NG", dialCode: "234" },
    { name: "Philippines", code: "PH", dialCode: "63" },
    { name: "Thailand", code: "TH", dialCode: "66" },
    { name: "Vietnam", code: "VN", dialCode: "84" }
  ]

  const { values, touched, handleChange, handleBlur, handleSubmit, errors } = useFormik({
    initialValues,
    onSubmit: async (values) => {
      let payload = { ...values };
      payload.account_type = "individual";
      const response = await createRecipient(payload);
      if (response.code === "200") {
        navigate("/receivers")
      }
    }
  })

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <a href="receivers">
            <img src={Back} />
          </a>
          <h1>Add Receivers</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <Form className="profile-form" onSubmit={handleSubmit}>
              <Card className="receiver-card bg-white">
                <Card.Body>
                  <Card.Title>Bank Information</Card.Title>
                  <Row className="mb-3">
                    <FloatingLabel
                      controlId="floatingSelect"
                      as={Col}
                      label="Bank Name"
                    >
                      <Form.Select aria-label="Floating label select example" name="bank_name" onChange={handleChange} value={values.bank_name}>
                        {
                          Bank_list.map((bank) => {
                            return <option id={bank.label} value={bank.value}>{bank.label}</option>
                          })
                        }
                      </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Account Number"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Account Number" name="account_number" value={values.account_number} onChange={handleChange} />
                    </FloatingLabel>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <Card.Title>Receiver Details</Card.Title>

                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="First Name"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="First Name" name="first_name" value={values.first_name} onChange={handleChange} />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Middle Name"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Middle Name" name="middle_name" value={values.middle_name} onChange={handleChange} />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Last Name"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Last Name" name="last_name" value={values.last_name} onChange={handleChange} />
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Mobile"
                      className="mb-3 mobileinput"
                    >
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="AU"
                        value={values.mobile}
                        onChange={(val) => {
                          handleChange({ target: { name: "mobile", value: val } })
                        }}
                      />
                    </FloatingLabel>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <Card.Title>Address</Card.Title>
                  <Row className="mb-3">
                    <FloatingLabel
                      controlId="floatingSelect"
                      as={Col}
                      label="Country"
                    >
                      <Form.Select aria-label="Floating label select example" name="country" value={values.country} onChange={handleChange}>
                        {
                          countryList.map((coun) => (
                            <option value={coun.name}>{coun.name}</option>
                          ))
                        }
                      </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingTextarea2"
                      label="Address"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Street Address"
                        style={{ height: "50px" }}
                        name="street_address"
                        value={values.street_address}
                        onChange={handleChange}
                      />
                    </FloatingLabel>
                  </Row>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="City"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="City" name="city" value={values.city} onChange={handleChange} />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Zip/Postal Code*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        placeholder="Zip/Postal Code*"
                        name="post_code"
                        value={values.post_code}
                        onChange={handleChange}
                      />
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="State"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="State" name="state" value={values.state} onChange={handleChange} />
                    </FloatingLabel>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <a href="receivers">
                        <Button
                          variant="light"
                          className="cancel-btn float-start"
                        >
                          Back
                        </Button>
                      </a>
                    </Col>
                    <Col>
                      <a href="review-transfer">
                        <Button
                          variant="primary"
                          className="float-end updateform"
                        >
                          Create Receiver
                        </Button>
                      </a>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AddReceiver;
