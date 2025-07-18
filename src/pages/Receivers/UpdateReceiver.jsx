import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getUserRecipient, updateUserRecipient } from "../../services/Api";
import { toast } from "react-toastify";

const UpdateReceiver = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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
    },
    validationSchema: Yup.object({
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
      mobile: Yup.string().required("Mobile number is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      post_code: Yup.string()
        .required("Postal code is required")
        .matches(/^[0-9]+$/, "Only numbers allowed"),
      address: Yup.string().required("Address is required"),
    }),
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
          middle_name: values.middle_name,
          last_name: values.last_name,
          email: values.email,
          mobile: values.mobile,
          city: values.city,
          postcode: values.post_code,
          state: values.state,
          country: values.country,
          country_code: countryCode,
          address: values.address,
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
              "+" +
              recipient.mobile?.replace(/[^\d]/g, "").replace(/^(\d{10,15}).*/, "$1") ||
              "",
            country: recipient.country || "",
            state: recipient.state || "",
            city: recipient.city || "",
            post_code: recipient.postcode || "",
            address: recipient.address || "",
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.bank_name && errors.bank_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bank_name}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel as={Col} label="Account Number *">
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

          <Card className="receiver-card mt-4 bg-white">
            <Card.Body>
              <Card.Title>Recipient Details</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="First Name *">
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

                <FloatingLabel as={Col} label="Middle Name">
                  <Form.Control
                    type="text"
                    name="middle_name"
                    value={values.middle_name}
                    onChange={handleChange}
                  />
                </FloatingLabel>

                <FloatingLabel as={Col} label="Last Name *">
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

              <Col className="col-4 mb-3">
                <FloatingLabel label="Mobile *" className="mobileinput">
                  <PhoneInput
                    international
                    defaultCountry="AU"
                    countryCallingCodeEditable={false}
                    value={values.mobile}
                    onChange={(val) => setFieldValue("mobile", val)}
                    onBlur={() => formik.setFieldTouched("mobile", true)}
                  />
                  {touched.mobile && errors.mobile && (
                    <div className="text-danger small mt-1">
                      {errors.mobile}
                    </div>
                  )}
                </FloatingLabel>
              </Col>
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
                      onChange={(option) =>
                        setFieldValue("country", option.value)
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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