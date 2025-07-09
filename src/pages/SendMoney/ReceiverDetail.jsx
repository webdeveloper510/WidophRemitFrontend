import React, { useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, InputGroup, Alert } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Bank_list from "../../utils/Bank_list";
import { createRecipient } from "../../services/Api";
import { useNavigate } from "react-router-dom";

const ReceiverDetail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const initialValues = {
    bank_name: "",
    account_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    country: "",
    building_no: "",
    street_name: "",
    state: "",
    city: "",
    post_code: "",
    address: "",
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

  // Validation schema
  const validationSchema = Yup.object({
    bank_name: Yup.string().required("Bank name is required"),
    account_number: Yup.string()
      .required("Account number is required")
      .min(8, "Account number must be at least 8 characters")
      .matches(/^[0-9]+$/, "Account number must contain only numbers"),
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .matches(/^[A-Za-z\s]+$/, "First name must contain only letters"),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .matches(/^[A-Za-z\s]+$/, "Last name must contain only letters"),
    email: Yup.string().email("Please enter a valid email address"),
    country: Yup.string().required("Country is required"),
    building_no: Yup.string().required("Building number is required"),
    street_name: Yup.string().required("Street name is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    post_code: Yup.string()
      .required("Postal code is required")
      .matches(/^[0-9]+$/, "Postal code must contain only numbers"),
    address: Yup.string().required("Address is required"),
  });

  const {
    values,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");

      try {
        // Find the selected country to get country code
        const selectedCountry = countryList.find(
          (country) => country.name === values.country
        );
        const countryCode = selectedCountry ? selectedCountry.code : "";

        let payload = {
          account_type: "individual",
          bank_name: values.bank_name,
          account_number: values.account_number,
          bank_identifier: "",
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
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

        if (response.code === "200") {
          // Create a recipient object that matches the expected format in ReviewTransfer
          const newRecipient = {
            id: response.data?.id || response.data?.recipient_id, // Use the ID from API response
            account_name: `${values.first_name} ${values.last_name}`.trim(),
            bank_name: values.bank_name,
            account_number: values.account_number,
            email: values.email,
            country: values.country,
            country_code: countryCode,
            first_name: values.first_name,
            last_name: values.last_name,
            address: values.address,
            building: values.building_no,
            street: values.street_name,
            city: values.city,
            state: values.state,
            postcode: values.post_code,
            // Add any other fields that might be needed
            ...response.data, // Include any additional data from the API response
          };

          // Store the newly created recipient in session storage
          sessionStorage.setItem(
            "selected_receiver",
            JSON.stringify(newRecipient)
          );

          navigate("/review-transfer");
        } else {
          setApiError(
            response.message || "Failed to create receiver. Please try again."
          );
        }
      } catch (error) {
        setApiError(
          "An error occurred while creating the receiver. Please try again."
        );
        console.error("Error creating receiver:", error);
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
            onClick={() => navigate("/review-transfer")}
            className="p-0 border-0 bg-transparent"
          >
            <img src={Back} alt="Back" />
          </Button>
          <h1>Add Recipient </h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            {apiError && (
              <Alert variant="danger" className="mb-3">
                {apiError}
              </Alert>
            )}

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
                      <Form.Select
                        aria-label="Floating label select example"
                        name="bank_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.bank_name}
                        isInvalid={touched.bank_name && errors.bank_name}
                      >
                        <option value="">Select Bank</option>
                        {Bank_list.map((bank, index) => (
                          <option key={index} value={bank.value}>
                            {bank.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.bank_name}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Account Number"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="account_number"
                        value={values.account_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.account_number && errors.account_number
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.account_number}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="receiver-card mt-4 bg-white">
                <Card.Body>
                  <Card.Title>Recipient Details</Card.Title>

                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="First Name"
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
                      controlId="floatingInput"
                      label="Middle Name"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="middle_name"
                        value={values.middle_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Last Name"
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
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Email"
                      className="mb-3"
                    >
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
                      <Form.Select
                        aria-label="Floating label select example"
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.country && errors.country}
                      >
                        <option value="">Select Country</option>
                        {countryList.map((country, index) => (
                          <option key={index} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.country}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Building Number"
                      className="mb-3"
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
                  </Row>

                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Street Name"
                      className="mb-3"
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
                  </Row>

                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="City"
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
                      controlId="floatingInput"
                      label="Zip/Postal Code*"
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
                      controlId="floatingInput"
                      label="State"
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
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Address"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        rows={3}
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
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Button
                        variant="light"
                        className="cancel-btn float-start"
                        disabled={isLoading}
                        onClick={() => navigate("/review-transfer")}
                      >
                        Back
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="submit"
                        variant="primary"
                        className="float-end updateform"
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
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ReceiverDetail;
