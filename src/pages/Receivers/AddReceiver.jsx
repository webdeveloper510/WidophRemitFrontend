import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import CountrySelect from "react-bootstrap-country-select";

const AddReceiver = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState(null);

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
    post_code: "",
  };

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
    { name: "Vietnam", code: "VN", dialCode: "84" },
  ];

  const { values, touched, handleChange, handleBlur, handleSubmit, errors } =
    useFormik({
      initialValues,
      onSubmit: async (values) => {
        setIsSubmitting(true);
        try {
          let payload = {
            ...values,
            building: "test",
            street: "test",
            country_code: "152123",
          };
          payload.account_type = "individual";
          const response = await createRecipient(payload);
          if (response.code === "200") {
            navigate("/receivers");
          }
        } catch (error) {
          console.error("Error creating receiver:", error);
        } finally {
          setIsSubmitting(false);
        }
      },
    });

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
                      label={
                        <span>
                          Bank Name <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="bank_name"
                        value={values.bank_name}
                        onChange={handleChange}
                      />
                      {/* <Form.Select
                        aria-label="Floating label select example"
                        name="bank_name"
                        onChange={handleChange}
                        value={values.bank_name}
                      >
                        <option value="">Select a bank</option>
                        {Bank_list.map((bank, index) => {
                          return (
                            <option key={index} value={bank.value}>
                              {bank.label}
                            </option>
                          );
                        })}
                      </Form.Select> */}
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label={
                        <span>
                          Account Number <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="account_number"
                        value={values.account_number}
                        onChange={handleChange}
                      />
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
                      label={
                        <span>
                          First Name <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={values.first_name}
                        onChange={handleChange}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label={
                        <span>
                          Middle Name <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="middle_name"
                        value={values.middle_name}
                        onChange={handleChange}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label={
                        <span>
                          Last Name <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={values.last_name}
                        onChange={handleChange}
                      />
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
                          handleChange({
                            target: { name: "mobile", value: val },
                          });
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
                      label={
                        <span>
                          Country <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      className="mb-3 selectcountry"
                    >
                      <CountrySelect
                        name="country"
                        value={value}
                        onChange={setValue}
                        flags
                        //placeholder="Select country..."
                      />
                    </FloatingLabel>
                    {/* <Form.Select
                        aria-label="Floating label select example"
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                      >
                        <option value="">Select a country</option>
                        {countryList.map((coun, index) => (
                          <option key={index} value={coun.name}>
                            {coun.name}
                          </option>
                        ))}
                      </Form.Select> */}

                    <FloatingLabel
                      as={Col}
                      controlId="floatingTextarea2"
                      label="Address"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
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
                      label={
                        <span>
                          City <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Zip/Postal Code"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        name="post_code"
                        value={values.post_code}
                        onChange={handleChange}
                      />
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label={
                        <span>
                          State <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="state"
                        value={values.state}
                        onChange={handleChange}
                      />
                    </FloatingLabel>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Button
                        variant="light"
                        className="cancel-btn float-start"
                        onClick={() => navigate("/receivers")}
                        type="button"
                      >
                        Back
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="primary"
                        className="float-end updateform"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating..." : "Create Receiver"}
                      </Button>
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
