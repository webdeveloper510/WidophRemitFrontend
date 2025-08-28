import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, Row, Alert } from "react-bootstrap";
import "react-phone-number-input/style.css";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getUserRecipient, updateUserRecipient } from "../../services/Api";
import { toast } from "react-toastify";
import allCountries from "../../utils/AllCountries";
import { v4 as uuidv4 } from 'uuid';

const UpdateReceiver = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [apiError, setApiError] = useState("");

  const countryOptions = allCountries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  const formik = useFormik({
    initialValues: {
      bank_name: "",
      account_number: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      mobile: "",
      country: "",
      state: "",
      city: "",
      post_code: "",
      address: "",
      swift_code: "",
      countryCode: "",
      company_name: ""
    },
    validationSchema: Yup.object({
      bank_name: Yup.string()
        .required("Bank name is required")
        .max(40, "Bank name is too big")
        .matches(
          /^[A-Za-z!@#\$%&'*+\-/=?^_`{|}~ ]+$/,
          "Bank name can only contain letters and allowed special characters"
        ),
      account_number: Yup.string()
        .required("Account number is required")
        .min(8, "Minimum 8 characters")
        .max(30, "Maximum 30 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only letters, numbers, spaces, and hyphens are allowed"),

      first_name: Yup.string()
        .required("First name is required")
        .max(30, "First name cannot exceed 30 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only letters, numbers, spaces, and hyphens are allowed"),

      middle_name: Yup.string()
        .max(30, "Middle name cannot exceed 30 characters")
        .matches(/^[a-zA-Z0-9 -]*$/, "Only letters, numbers, spaces, and hyphens are allowed"),

      last_name: Yup.string()
        .required("Last name is required")
        .max(30, "Last name cannot exceed 30 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only letters, numbers, spaces, and hyphens are allowed"),

      email: Yup.string().required("email is required!")
        .email("Please enter a valid email address"),

      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^\d{8,10}$/, "Mobile number must be between 8 and 10 digits"),

      country: Yup.string()
        .required("Country is required"),

      state: Yup.string()
        .required("State is required")
        .max(30, "State cannot exceed 30 characters")
        .matches(/^[a-zA-Z -]+$/, "Only letters, spaces, and hyphens are allowed"),

      city: Yup.string()
        .required("City is required")
        .max(35, "City cannot exceed 35 characters")
        .matches(/^[a-zA-Z -]+$/, "Only letters, spaces, and hyphens are allowed"),


      post_code: Yup.string()
        .required("Postal code is required")
        .max(9, "Postal code cannot exceed 9 digits")
        .matches(/^\d+$/, "Only numbers are allowed"),

      address: Yup.string()
        .required("Address is required"),

      swift_code: Yup.string()
        .required("Swift code is required")
        .max(15, "Swift code cannot exceed 15 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only letters, numbers, spaces, and hyphens are allowed"),

      company_name: Yup.string().required("Company name is required")
    }),


    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");

      try {
        const payload = {
          account_type: "individual",
          bank_name: values.bank_name,
          account_number: values.account_number,
          bank_identifier: "",
          first_name: values.first_name,
          middle_name: values.middle_name,
          last_name: values.last_name,
          email: values.email,
          mobile: `${values.countryCode}${values.mobile}`,
          city: values.city,
          postcode: values.post_code,
          state: values.state,
          country: values.country,
          country_code: values.countryCode,
          address: values.address,
          swift_code: values.swift_code,
          company_name: values.company_name
        };

        const response = await updateUserRecipient(id, payload);
        if (Number(response.code) === 200) {
          toast.success("Receiver updated successfully");
          navigate("/receivers");
        } else {
          setApiError(response.message || "Failed to update receiver.");
        }
      } catch (error) {
        console.error("Error:", error);
        setApiError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
  } = formik;

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const response = await getUserRecipient(id);
        if (Number(response.code) === 200) {
          const recipient = response.data;
          const initialValues = {
            bank_name: recipient.bank_name || "",
            account_number: recipient.account_number || "",
            first_name: recipient.first_name || "",
            middle_name: recipient.middle_name || "",
            last_name: recipient.last_name || "",
            email: recipient.email || "",
            mobile:
              recipient.mobile
                .slice(recipient.country_code.length) || "",
            country: recipient.country || "",
            state: recipient.state || "",
            city: recipient.city || "",
            post_code: recipient.postcode || "",
            address: recipient.address || "",
            swift_code: recipient.swift_code || "",
            countryCode: recipient.country_code || "",
            company_name: recipient.company_name || ""
          };

          setValues(initialValues);
        } else {
          console.warn("Non-200 response code:", response.code);
          setApiError(response.message || "Failed to load recipient data.");
        }
      } catch (error) {
        console.error("Error fetching recipient:", error);
        setApiError("Failed to load recipient data.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchRecipient();
  }, [id, setValues]);

  if (isFetching) {
    return (
      <AnimatedPage>
        <div className="text-center mt-5">Loading recipient data...</div>
      </AnimatedPage>
    );
  }

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
          <h1>Update Receiver</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <Form onSubmit={handleSubmit} className="profile-form">
          {apiError && <Alert variant="danger">{apiError}</Alert>}

          <Card className="receiver-card bg-white">
            <Card.Body>
              <Card.Title>Bank Information</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Bank Name *">
                  <Form.Control
                    type="text"
                    name="bank_name"
                    value={values.bank_name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z!@#\$%&'*+\-/=?^_`{|}~ ]+$/.test(value) || !value)
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.bank_name && errors.bank_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bank_name}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel as={Col} label="IBAN/Account Number*">
                  <Form.Control
                    type="text"
                    name="account_number"
                    value={values.account_number}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value || /^[a-zA-Z0-9 -]+$/.test(value))
                        handleChange(e)
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.account_number && errors.account_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.account_number}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel as={Col} label="BIC/BSC/Swift Number *">
                  <Form.Control
                    type="text"
                    name="swift_code"
                    value={values.swift_code}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value || /^[a-zA-Z0-9 -]+$/.test(value))
                        handleChange(e)
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.swift_code && errors.swift_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.swift_code}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>
            </Card.Body>
          </Card>

          <Card className="receiver-card mt-4 bg-white">
            <Card.Body>
              <Card.Title>Recipient Details</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="First Name *">
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={values.first_name}
                     onChange={(e) => {
                      const value = e.target.value;
                      if ((/^[a-zA-Z0-9 -]+$/.test(value) && value.length <= 30) || !value)
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.first_name && errors.first_name}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.first_name}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel as={Col} label="Middle Name">
                  <Form.Control
                    type="text"
                    name="middle_name"
                    value={values.middle_name}
                     onChange={(e) => {
                      const value = e.target.value;
                      if ((/^[a-zA-Z0-9 -]+$/.test(value) && value.length <= 30) || !value)
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.middle_name && errors.middle_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.middle_name}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel as={Col} label="Last Name *">
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={values.last_name}
                     onChange={(e) => {
                      const value = e.target.value;
                      if ((/^[a-zA-Z0-9 -]+$/.test(value) && value.length <= 30) || !value)
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.last_name && errors.last_name}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.last_name}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                {/* ...existing code... */}
                <FloatingLabel
                  as={Col}
                  controlId="CompanyName"
                  label={
                    <span>
                      Company Name
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="company_name"
                    value={values.company_name}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.company_name && errors.company_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.company_name}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  as={Col}
                  controlId="Email"
                  label={
                    <span>
                      Email
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  className="mb-3"
                >
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Row>

              <Row className="mb-3 mobile_numbero">
                <Col>
                  <FloatingLabel
                    label={
                      <span>
                        Mobile Number{" "}<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    className="mb-3"
                  >

                    <div className="d-flex align-items-stretch p-0">
                      <Form.Select
                        name="countryCode"
                        value={`${values.countryCode}-${values.country}`}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const [dialCode, countryName] = selectedValue.split("-");
                          setFieldValue("countryCode", dialCode);
                          setFieldValue("country", countryName);
                        }}
                        onBlur={handleBlur}
                        style={{
                          maxWidth: "140px",
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                      >
                        {allCountries.map((country) => (
                          <option key={uuidv4()} value={`${country.dial_code}-${country.name}`}>
                            {country.dial_code ? `${country.flag} ${country.dial_code}` : ''} {country.code ? `(${country.code})` : ''}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Enter mobile number"
                        value={values.mobile}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, "");
                          setFieldValue("mobile", numericValue);
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.phone && errors.phone}
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
                      value={countryOptions.find(
                        (opt) => opt.value === values.country
                      )}
                      onChange={(option) => {
                        setFieldValue("country", option.value);
                        const foundCountry = allCountries.find(c => c.name === option.value);
                        if (foundCountry) {
                          setFieldValue("countryCode", foundCountry.dial_code);
                        }
                      }
                      }
                    />
                    {touched.country && errors.country && (
                      <div className="text-danger small mt-1">
                        {errors.country}
                      </div>
                    )}
                  </div>
                </Col>

                <Col>
                  <FloatingLabel label="Address *" className="mb-3">
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

              <Row className="mb-3">
                <FloatingLabel as={Col} label="City *">
                  <Form.Control
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={(e) => {
                      const value = e.target.value;
                      if ((/^[a-zA-Z -]+$/.test(value) && value.length <= 35) || !value)
                        handleChange(e)
                    }
                    }
                    onBlur={handleBlur}
                    isInvalid={touched.city && errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel as={Col} label="Zip/Postal Code *">
                  <Form.Control
                    type="text"
                    name="post_code"
                    value={values.post_code}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 9 && /^\d+$/.test(value) || !value) {
                        handleChange(e);
                      }
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.post_code && errors.post_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.post_code}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel as={Col} label="State *">
                  <Form.Control
                    type="text"
                    name="state"
                    value={values.state}
                    onChange={(e) => {
                      const value = e.target.value;
                      if ((/^[a-zA-Z -]+$/.test(value) && value.length <= 30) || !value)
                        handleChange(e)
                    }
                    }
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
                    onClick={() => navigate("/receivers")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="submit"
                    className="float-end updateform"
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update"}
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

export default UpdateReceiver;
