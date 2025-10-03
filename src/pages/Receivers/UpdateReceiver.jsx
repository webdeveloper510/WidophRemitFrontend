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
import {
  GetBudpayBanks,
  getUserRecipient,
  updateUserRecipient,
  GetFlutterBanks,
} from "../../services/Api";
import { toast } from "react-toastify";
import allCountries from "../../utils/AllCountries";
import { CountrySelector } from "../../components/CountrySelector";

const UpdateReceiver = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [apiError, setApiError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bankNames, setbankNames] = useState([]);

  const countryOptions = allCountries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  useEffect(() => {
    (async () => {
      const banks = await GetBudpayBanks();
      setbankNames(banks.data);
      const res = await GetFlutterBanks();
      const all = [
        ...banks.data,
        ...res.data.data.map((bank) => {
          return {
            bank_code: bank.code,
            bank_name: bank.name,
          };
        }),
      ];
      const uniqueBanks = Object.values(
      all.reduce((acc, bank) => {
        acc[bank.bank_code] = bank; // overwrite if duplicate
        return acc;
      }, {})
    );

    // ✅ Sort lexicographically (case-insensitive, trimmed)
    uniqueBanks.sort((a, b) =>
      a.bank_name.trim().toLowerCase().localeCompare(b.bank_name.trim().toLowerCase())
    );

    setbankNames(uniqueBanks);
    })();
  }, []);

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
      company_name: "",
    },
    validationSchema: Yup.object({
      bank_name: Yup.string().trim().required("Bank name is required"),
      // .matches(
      //   /^[A-Za-z!@#\$%&'*+\-/=?^_`{|}~ ]+$/,
      //   "Bank name can only contain letters and allowed special characters"
      // ),
      account_number: Yup.string()
        .trim()
        .required("IBAN/Account Number is required")
        .min(8, "Minimum 8 characters")
        .max(30, "Maximum 30 characters")
        .matches(
          /^[a-zA-Z0-9 -]+$/,
          "Only letters, numbers, spaces, and hyphens are allowed"
        ),

      first_name: Yup.string()
        .trim()
        .required("First name is required")
        .max(30, "First name cannot exceed 30 characters")
        .matches(
          /^[a-zA-Z0-9 -]+$/,
          "Only letters, numbers, spaces, and hyphens are allowed"
        ),

      middle_name: Yup.string()
        .trim()
        .max(30, "Middle name cannot exceed 30 characters")
        .matches(
          /^[a-zA-Z0-9 -]*$/,
          "Only letters, numbers, spaces, and hyphens are allowed"
        ),

      last_name: Yup.string()
        .trim()
        .required("Last name is required")
        .max(30, "Last name cannot exceed 30 characters")
        .matches(
          /^[a-zA-Z0-9 -]+$/,
          "Only letters, numbers, spaces, and hyphens are allowed"
        ),

      email: Yup.string()
        .required("email is required!")
        .email("Please enter a valid email address"),

      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^\d{8,10}$/, "Mobile number must be between 8 and 10 digits"),

      country: Yup.string().trim().required("Country is required"),

      state: Yup.string()
        .trim()
        .required("State is required")
        .max(30, "State cannot exceed 30 characters")
        .matches(
          /^[a-zA-Z -]+$/,
          "Only letters, spaces, and hyphens are allowed"
        ),

      city: Yup.string()
        .trim()
        .required("City is required")
        .max(35, "City cannot exceed 35 characters")
        .matches(
          /^[a-zA-Z -]+$/,
          "Only letters, spaces, and hyphens are allowed"
        ),

      post_code: Yup.string()
        .trim()
        .required("Postal code is required")
        .max(9, "Postal code cannot exceed 9 digits")
        .matches(/^\d+$/, "Only numbers are allowed"),

      address: Yup.string().trim().required("Address is required"),

      swift_code: Yup.string()
        .trim()
        .max(15, "Swift code cannot exceed 15 characters")
        .matches(
          /^[a-zA-Z0-9 -]+$/,
          "Only letters, numbers, spaces, and hyphens are allowed"
        ),

      company_name: Yup.string(),
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
          country_code: allCountries.find((c) => {
            return (
              c.name === values.country && c.dial_code === values.countryCode
            );
          }).code,
          address: values.address,
          swift_code: values.swift_code,
          company_name: values.company_name,
          bank_code:
            (
              bankNames.find((bank) => bank.bank_name === values.bank_name) ||
              {}
            ).bank_code || "",
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

  const filteredSuggestions = values.bank_name
    ? bankNames.filter((bank) =>
        bank.bank_name.toLowerCase().includes(values.bank_name.toLowerCase())
      )
    : [];

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
              recipient.mobile.slice(
                allCountries.find((c) => {
                  return c.name === recipient.country;
                }).dial_code.length
              ) || "",
            country: recipient.country || "",
            state: recipient.state || "",
            city: recipient.city || "",
            post_code: recipient.postcode || "",
            address: recipient.address || "",
            swift_code: recipient.swift_code || "",
            countryCode: allCountries.find((c) => {
              return c.name === recipient.country;
            }).dial_code,
            company_name: recipient.company_name || "",
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
                <Col style={{ position: "relative" }}>
                  <FloatingLabel
                    as={Col}
                    controlId="bankName"
                    label={
                      <span>
                        Bank Name<span style={{ color: "red" }}> *</span>
                      </span>
                    }
                  >
                    <Form.Control
                      type="text"
                      name="bank_name"
                      autoComplete="off"
                      value={values.bank_name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          (/^[A-Za-z!@#\$%&'*+\-/=?^_`{|}~ ]+$/.test(value) &&
                            value.length <= 40) ||
                          !value
                        ) {
                          handleChange(e);
                          setShowSuggestions(true);
                        }
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      onFocus={() => {
                        if (values.bank_name) setShowSuggestions(true);
                      }}
                      isInvalid={touched.bank_name && errors.bank_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.bank_name}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div
                      className="suggestions-dropdown"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 2px)",
                        zIndex: 1000,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderTop: "none",
                        borderRadius: "0 0 .25rem .25rem",
                        maxHeight: "200px",
                        overflowY: "auto",
                        width: "90%",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {filteredSuggestions.map((bank, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setFieldValue("bank_name", bank.bank_name);
                            setShowSuggestions(false);
                          }}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {bank.bank_name}
                        </div>
                      ))}
                    </div>
                  )}
                </Col>

                <FloatingLabel
                  as={Col}
                  label={
                    <span>
                      IBAN/Account Number
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  <Form.Control
                    type="text"
                    name="account_number"
                    value={values.account_number}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        !value ||
                        (/^[a-zA-Z0-9 -]+$/.test(value) && value.length <= 30)
                      )
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.account_number && errors.account_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.account_number}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel as={Col} label="BIC/BSC/Swift Number">
                  <Form.Control
                    type="text"
                    name="swift_code"
                    value={values.swift_code}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        !value ||
                        (/^[a-zA-Z0-9 -]+$/.test(value) && value.length <= 15)
                      )
                        handleChange(e);
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
                <FloatingLabel
                  as={Col}
                  label={
                    <span>
                      First Name
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={values.first_name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        (/^[a-zA-Z0-9 -]+$/.test(value) &&
                          value.length <= 30) ||
                        !value
                      )
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
                      if (
                        (/^[a-zA-Z0-9 -]+$/.test(value) &&
                          value.length <= 30) ||
                        !value
                      )
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.middle_name && errors.middle_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.middle_name}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  as={Col}
                  label={
                    <span>
                      Last Name
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={values.last_name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        (/^[a-zA-Z0-9 -]+$/.test(value) &&
                          value.length <= 30) ||
                        !value
                      )
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
                  label={<span>Company Name</span>}
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
                        Mobile Number <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    className="mb-3"
                  >
                    <div className="d-flex align-items-stretch p-0">
                      <CountrySelector
                        value={`${values.countryCode}-${values.country}`}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const [dialCode, countryName] =
                            selectedValue.split("-");
                          setFieldValue("countryCode", dialCode);
                          setFieldValue("country", countryName);
                        }}
                        onBlur={handleBlur}
                        countries={allCountries}
                        name="countryCode"
                      />

                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Enter mobile number"
                        value={values.mobile}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          if (numericValue.length <= 10 || !numericValue)
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
                        const foundCountry = allCountries.find(
                          (c) => c.name === option.value
                        );
                        if (foundCountry) {
                          setFieldValue("countryCode", foundCountry.dial_code);
                        }
                      }}
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

              <Row className="mb-3">
                <FloatingLabel
                  as={Col}
                  label={
                    <span>
                      City
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  <Form.Control
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        (/^[a-zA-Z -]+$/.test(value) && value.length <= 35) ||
                        !value
                      )
                        handleChange(e);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.city && errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  as={Col}
                  label={
                    <span>
                      Zip/Postal Code
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  <Form.Control
                    type="text"
                    name="post_code"
                    value={values.post_code}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        (value.length <= 9 && /^\d+$/.test(value)) ||
                        !value
                      ) {
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

                <FloatingLabel
                  as={Col}
                  label={
                    <span>
                      State
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  <Form.Control
                    type="text"
                    name="state"
                    value={values.state}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        (/^[a-zA-Z -]+$/.test(value) && value.length <= 30) ||
                        !value
                      )
                        handleChange(e);
                    }}
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
