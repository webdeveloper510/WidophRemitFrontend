import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, Row, Alert } from "react-bootstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import { getNames } from "country-list";
import { useFormik } from "formik";
import * as Yup from "yup";
import Bank_list from "../../utils/Bank_list";
import { createRecipient } from "../../services/Api";
import CountrySelect from "react-bootstrap-country-select";

const AddReceiver = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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

  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));

  const initialValues = {
    bank_name: "",
    account_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile: "",
    country: "",
    building_no: "",
    street_name: "",
    state: "",
    city: "",
    post_code: "",
    address: "",
  };

  const validationSchema = Yup.object({
    bank_name: Yup.string().required("Bank name is required"),
    account_number: Yup.string()
      .required("Account number is required")
      .min(8, "Minimum 8 digits")
      .matches(/^[0-9]+$/, "Only numbers allowed"),
    first_name: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters allowed"),
    last_name: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters allowed"),
    email: Yup.string().email("Invalid email"),
    mobile: Yup.string().required("Mobile number is required").test(
      "is-10-digits",
      "Mobile number must be at most 10 digits",
      (value) => {
        if (!value) return false;
        const digits = value.replace(/\D/g, ""); // remove non-numeric characters
        return digits.length <= 10;
      }
    ),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    post_code: Yup.string()
      .required("Postal code is required")
      .matches(/^[0-9]+$/, "Only numbers allowed"),
    address: Yup.string().required("Address is required"),
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");

      try {
        const selectedCountry = countryList.find(
          (country) => country.name === values.country
        );
        const countryCode = selectedCountry ? selectedCountry.code : "";

        const payload = {
          account_type: "individual",
          bank_name: values.bank_name,
          account_number: values.account_number,
          bank_identifier: "",
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          mobile: values.mobile,
          building: values.building_no,
          street: values.street_name,
          city: values.city,
          postcode: values.post_code,
          state: values.state,
          country: values.country,
          country_code: countryCode,
          address: values.address,
        };

        const response = await createRecipient(payload);

        if (Number(response.code) === 200) {
          const newRecipient = {
            id: response.data?.id || response.data?.recipient_id,
            account_name: `${values.first_name} ${values.last_name}`.trim(),
            ...payload,
            ...response.data,
          };

          sessionStorage.setItem(
            "selected_receiver",
            JSON.stringify(newRecipient)
          );
          navigate("/receivers");
        } else {
          setApiError(response.message || "Failed to create receiver.");
        }
      } catch (error) {
        console.error("Error:", error);
        setApiError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={() => navigate("/receivers")}
            className="p-0 border-0 bg-transparent"
          >
            <img src={Back} alt="Back" />
          </Button>
          <h1>Add Receiver</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <Form onSubmit={handleSubmit} className="profile-form">
          {apiError && <Alert variant="danger">{apiError}</Alert>}

          {/* Bank Info */}
          <Card className="receiver-card bg-white">
            <Card.Body>
              <Card.Title>Bank Information</Card.Title>
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="bankName"
                  label={
                    <span>
                      Bank Name
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  <Form.Control
                    type="text"
                    name="bank_name"
                    value={values.bank_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.bank_name && errors.bank_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bank_name}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  as={Col}
                  controlId="accountNumber"
                  label={
                    <span>
                      Account Number
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  <Form.Control
                    type="text"
                    name="account_number"
                    value={values.account_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.account_number && errors.account_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.account_number}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>
            </Card.Body>
          </Card>

          {/* Recipient Info */}
          <Card className="receiver-card mt-4 bg-white">
            <Card.Body>
              <Card.Title>Recipient Details</Card.Title>
              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="firstName"
                  label={
                    <span>
                      First Name
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.first_name && errors.first_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.first_name}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  as={Col}
                  controlId="middleName"
                  label="Middle Name"
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
                  controlId="lastName"
                  label={
                    <span>
                      Last Name
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={values.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.last_name && errors.last_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.last_name}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                {/* <FloatingLabel as={Col} controlId="email" label="Email">
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FloatingLabel> */}

                <Col className="col-4">
                  <FloatingLabel
                    as={Col}
                    controlId="floatingMobile"
                    label={
                      <span>
                        Mobile
                        <span style={{ color: "red" }}> *</span>
                      </span>
                    }
                    className="mobileinput mb-3"
                  >
                    <PhoneInput
                      international
                      defaultCountry="AU"
                      countryCallingCodeEditable={false}
                      value={values.mobile}
                      onChange={(val) => setFieldValue("mobile", val)}
                    />
                    {touched.mobile && errors.mobile && (
                      <div className="text-danger small mt-1">
                        {errors.mobile}
                      </div>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Address Info */}
          <Card className="receiver-card mt-4 bg-white">
            <Card.Body>
              <Card.Title>Address</Card.Title>
              <Row className="mb-3">
                <Col>
                  <div className="floating-label-wrapper kyc-country">
                    <label>
                      Country <span style={{ color: "red" }}>*</span>
                    </label>

                    <Select
                      options={countryOptions}
                      name="country"
                      value={countryOptions.find(opt => opt.value === values.country)}
                      onChange={(option) => setFieldValue("country", option.value)}
                      onBlur={() => setFieldValue("country", values.country)}
                    />


                    {/* <CountrySelect
                        name="country"
                        value={countryList.find(
                          (c) => c.name === values.country
                        )}
                        onChange={(val) =>
                          setFieldValue("country", val?.name || "")
                        }
                        flags
                      /> */}
                    {touched.country && errors.country && (
                      <div className="text-danger small mt-1">
                        {errors.country}
                      </div>
                    )}
                  </div>
                </Col>

                <Col>
                  <FloatingLabel
                    as={Col}
                    controlId="address"
                    label={
                      <span>
                        Address
                        <span style={{ color: "red" }}> *</span>
                      </span>
                    }
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.address && errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Row>

              {/* <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="building_no"
                  label="Building Number *"
                >
                  <Form.Control
                    type="text"
                    name="building_no"
                    value={values.building_no}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.building_no && errors.building_no}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.building_no}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  as={Col}
                  controlId="street_name"
                  label="Street Name *"
                >
                  <Form.Control
                    type="text"
                    name="street_name"
                    value={values.street_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.street_name && errors.street_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.street_name}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row> */}

              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  controlId="city"
                  label={
                    <span>
                      City
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.city && errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  as={Col}
                  controlId="post_code"
                  label={
                    <span>
                      Zip/Postal Code
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="post_code"
                    value={values.post_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.post_code && errors.post_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.post_code}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  as={Col}
                  controlId="state"
                  label={
                    <span>
                      State
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.state && errors.state}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Button
                    variant="light"
                    className="cancel-btn float-start"
                    onClick={() => navigate("/review-transfer")}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="submit"
                    className="float-end updateform"
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Save & Continue"}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>

      </div>
    </AnimatedPage>
  );
};

export default AddReceiver;
