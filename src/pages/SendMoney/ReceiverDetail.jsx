import { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, Alert, Row } from "react-bootstrap";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createRecipient } from "../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { parsePhoneNumber } from "libphonenumber-js";
import allCountries from "../../utils/AllCountries";
import { v4 as uuidv4 } from 'uuid';
const ReceiverDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const countryOptions = allCountries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  useEffect(() => {
    if (location?.state?.from !== "receivers-list")
      navigate("/send-money")
  }, [location])

  const initialValues = {
    bank_name: "",
    account_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile: "",
    countryCode: "+61",
    country: "Australia",
    building_no: "",
    street_name: "",
    state: "",
    city: "",
    post_code: "",
    address: "",
    swift_code: ""
  };

  const validationSchema = Yup.object({
    bank_name: Yup.string()
      .required("Bank name is required"),

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

    email: Yup.string()
      .email("Please enter a valid email address"),

    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d{8,10}$/, "Mobile number must be between 8 and 10 digits"),

    country: Yup.string()
      .required("Country is required"),

    state: Yup.string()
      .required("State is required"),

    city: Yup.string()
      .required("City is required"),

    post_code: Yup.string()
      .required("Postal code is required")
      .matches(/^[0-9]+$/, "Postal code must contain only numbers"),

    address: Yup.string()
      .required("Address is required"),

    swift_code: Yup.string()
      .required("Swift code is required")
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

        const fullPhone = `+${values.countryCode}${values.mobile}`;
        let parsedMobile = fullPhone;

        try {
          const parsed = parsePhoneNumber(fullPhone);
          parsedMobile = parsed.number;
        } catch (error) {
          setApiError("Invalid phone number format");
          setIsLoading(false);
          return;
        }

        const payload = {
          account_type: "individual",
          bank_name: values.bank_name,
          account_number: values.account_number,
          bank_identifier: "",
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          mobile: parsedMobile,
          building: values.building_no,
          street: values.street_name,
          city: values.city,
          postcode: values.post_code,
          state: values.state,
          country: values.country,
          country_code: values.countryCode,
          address: values.address,
          swift_code: values.swift_code
        };

        const response = await createRecipient(payload);

        if (Number(response.code) === 200) {
          const newRecipient = {
            id: response.data?.id || response.data?.recipient_id,
            account_name: `${values.first_name} ${values.last_name}`.trim(),
            bank_name: values.bank_name,
            account_number: values.account_number,
            email: values.email,
            mobile: parsedMobile,
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
            ...response.data,
          };

          sessionStorage.setItem(
            "selected_receiver",
            JSON.stringify(newRecipient)
          );
          navigate("/review-transfer", {
            state: {
              from: "receivers-list"
            }
          });
        } else {
          setApiError(response.message || "Failed to create receiver.");
        }
      } catch (error) {
        console.error("Error creating receiver:", error);
        setApiError("An error occurred while creating the receiver.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);

    if (name === "countryCode") {
      // Update country based on country code selection if needed
      // This logic can be expanded based on your requirements
    }
  };

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={() => navigate("/receivers-list", {
              state: {
                from: "receiver-add"
              }
            })}
            className="p-0 border-0 bg-transparent"
          >
            <img src={Back} alt="Back" />
          </Button>
          <h1>Add Receiver</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            {apiError && <Alert variant="danger">{apiError}</Alert>}

            <Form onSubmit={handleSubmit} className="profile-form">
              {/* Bank Info */}
              <Card className="receiver-card bg-white">
                <Card.Body>
                  <Card.Title>Bank Information</Card.Title>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingBankName"
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s\-.]*$/.test(value)) {
                            handleChange(e); // Only allow valid characters
                          }
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.bank_name && errors.bank_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bank_name}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingAccountNumber"
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
                        isInvalid={
                          touched.account_number && errors.account_number
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.account_number}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingAccountNumber"
                      label={
                        <span>
                          Swift Code
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                    >
                      <Form.Control
                        type="text"
                        name="swift_code"
                        value={values.swift_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.swift_code && errors.swift_code
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.swift_code}
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
                      controlId="floatingFirstName"
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.first_name && errors.first_name}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.first_name}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingMiddleName"
                      label="Middle Name"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="middle_name"
                        value={values.middle_name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        onBlur={handleBlur}
                      />

                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="floatingLastName"
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.last_name && errors.last_name}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3 mobile_numbero">
                    <Col>
                      <FloatingLabel
                        label={<span>Mobile Number <span style={{ color: "red" }}> *</span></span>}
                        className="mb-3"
                      >
                        <div className="d-flex align-items-stretch p-0">
                          <Form.Select
                            name="countryCode"
                            value={values.countryCode}
                            onChange={(e) => {
                              const selectedDialCode = e.target.value;
                              setFieldValue("countryCode", selectedDialCode);
                              const foundCountry = allCountries.find(c => c.dial_code === selectedDialCode);
                              if (foundCountry) {
                                setFieldValue("country", foundCountry.name);
                              }
                            }}
                            onBlur={handleBlur}
                            style={{
                              maxWidth: "110px",
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          >
                            {allCountries.map((country) => (
                              <option key={uuidv4()} value={country.dial_code}>
                                {country.dial_code ? `${country.flag} ${country.dial_code}` : ''} {country.code ? `(${country.code})` : ''}
                              </option>
                            ))}
                          </Form.Select>

                          <Form.Control
                            type="text"
                            name="mobile"
                            placeholder="Enter mobile number"
                            value={values.mobile}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/\D/g, "");
                              setFieldValue("mobile", numericValue);
                            }}
                            onBlur={handleBlur}
                            isInvalid={touched.mobile && errors.mobile}
                            style={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                          />
                        </div>
                      </FloatingLabel>
                      {touched.mobile && errors.mobile && (
                        <div className="invalid-feedback d-block">
                          {errors.mobile}
                        </div>
                      )}
                    </Col>
                  </Row>

                </Card.Body>
              </Card>

              {/* Address */}
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
                          onChange={(option) => {
                            setFieldValue("country", option.value);
                            const foundCountry = allCountries.find(c => c.name === option.value);
                            if (foundCountry) {
                              setFieldValue("countryCode", foundCountry.dial_code);
                            }
                          }}
                          onBlur={() => setFieldValue("country", values.country)}
                        />

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
                        controlId="floatingAddress"
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
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingCity"
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
                      controlId="floatingPostCode"
                      label={
                        <span>
                          Zip/Postal Code
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
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
                      controlId="floatingState"
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
                        disabled={isLoading}
                        onClick={() => navigate("/receivers-list", {
                          state: {
                            from: "receiver-add"
                          }
                        })}
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