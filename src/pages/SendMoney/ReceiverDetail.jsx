import { useEffect, useState } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, Alert, Row } from "react-bootstrap";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createRecipient,
  GetBudpayBanks,
  GetFlutterBanks,
  GetSamsaraBanks,
} from "../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { parsePhoneNumber } from "libphonenumber-js";
import allCountries from "../../utils/AllCountries";
import { CountrySelector } from "../../components/CountrySelector";
const ReceiverDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bankNames, setbankNames] = useState([]);

  const countryOptions = allCountries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  useEffect(() => {
    if (location?.state?.from !== "receivers-list") navigate("/send-money");
  }, [location]);

  useEffect(() => {
    (async () => {
      const SamsaraBanks = await GetSamsaraBanks();
      const banks = await GetBudpayBanks();
      setbankNames(banks.data);
      const res = await GetFlutterBanks();
      const all = [
        ...banks.data,
        ...SamsaraBanks.data.locationDetail.map((bank) => ({
          bank_code: bank.locationId,
          bank_name: bank.locationName,
        })),
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
        a.bank_name
          .trim()
          .toLowerCase()
          .localeCompare(b.bank_name.trim().toLowerCase())
      );

      setbankNames(uniqueBanks);
    })();
  }, []);

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
    swift_code: "",
    company_name: "",
  };

  const validationSchema = Yup.object({
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
        const fullPhone = `${values.countryCode}${values.mobile}`;
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
          middle_name: values.middle_name,
          last_name: values.last_name,
          email: values.email,
          mobile: parsedMobile,
          building: values.building_no,
          street: values.street_name,
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
              bankNames.find(
                (bank) =>
                  bank.bank_name.trim().toLowerCase() ===
                  values.bank_name.trim().toLowerCase()
              ) || {}
            ).bank_code || "",
        };

        // console.log('bank_code',bankNames.find((bank) => bank.bank_name.trim().toLowerCase() === values.bank_name.trim().toLowerCase()));

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
            country_code: values.countryCode,
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
              from: "receivers-list",
            },
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

  const filteredSuggestions = values.bank_name
    ? bankNames.filter((bank) =>
        bank.bank_name.toLowerCase().includes(values.bank_name.toLowerCase())
      )
    : [];

  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={() =>
              navigate("/receivers-list", {
                state: {
                  from: "receiver-add",
                },
              })
            }
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
                    {/* <FloatingLabel
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
                          if ((/^[A-Za-z!@#\$%&'*+\-/=?^_`{|}~ ]+$/.test(value) && value.length <= 40) || !value)
                            handleChange(e);
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.bank_name && errors.bank_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bank_name}
                      </Form.Control.Feedback>
                    </FloatingLabel> */}
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
                              (/^[A-Za-z!@#\$%&'*+\-/=?^_`{|}~ ]+$/.test(
                                value
                              ) &&
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
                      controlId="floatingAccountNumber"
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
                            (/^[a-zA-Z0-9 -]+$/.test(value) &&
                              value.length <= 30)
                          )
                            handleChange(e);
                        }}
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
                      label={<span>BIC/BSC/Swift Number</span>}
                    >
                      <Form.Control
                        type="text"
                        name="swift_code"
                        value={values.swift_code}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            !value ||
                            (/^[a-zA-Z0-9 -]+$/.test(value) &&
                              value.length <= 15)
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
                          if (
                            (/^[a-zA-Z0-9 -]+$/.test(value) &&
                              value.length <= 30) ||
                            !value
                          )
                            handleChange(e);
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
                          const value = e.target.value;
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
                            Mobile Number{" "}
                            <span style={{ color: "red" }}> *</span>
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
                            name="mobile"
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
                          value={countryOptions.find(
                            (opt) => opt.value === values.country
                          )}
                          onChange={(option) => {
                            setFieldValue("country", option.value);
                            const foundCountry = allCountries.find(
                              (c) => c.name === option.value
                            );
                            if (foundCountry) {
                              setFieldValue(
                                "countryCode",
                                foundCountry.dial_code
                              );
                            }
                          }}
                          onBlur={() =>
                            setFieldValue("country", values.country)
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
                      <FloatingLabel
                        as={Col}
                        controlId="floatingAddress"
                        label={
                          <span>
                            Address
                            <span style={{ color: "red" }}> *</span>
                          </span>
                        }
                        className="mb-3 textarea-label"
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            (/^[a-zA-Z -]+$/.test(value) &&
                              value.length <= 35) ||
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            (/^[a-zA-Z -]+$/.test(value) &&
                              value.length <= 30) ||
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
                        disabled={isLoading}
                        onClick={() =>
                          navigate("/receivers-list", {
                            state: {
                              from: "receiver-add",
                            },
                          })
                        }
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
