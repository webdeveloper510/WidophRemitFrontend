import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Tab,
  Form,
  Button,
  FloatingLabel,
  Alert,
  Spinner,
} from "react-bootstrap";
import Select from "react-select";
import { getNames } from "country-list";
import "./KYCForm.css";
import { useNavigate } from "react-router-dom";
import {
  getVeriffStatus,
  updateProfile,
  userProfile,
} from "../../services/Api";
import TopNavbar from "../LoginSignup/TopNavbar";
import Footer from "../Footer";
import KYCimage from "../../assets/images/kyc-image.png";
import { Veriff } from "@veriff/js-sdk";
import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";
import { toast } from "react-toastify";

const KYCForm = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("step1");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [idVerified, setIdVerified] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [verifyingID, setVerifyingID] = useState(false);
  const [VeriffMessage, setVeriffMessage] = useState("");
  const [customer_id, setcustomer_id] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "61",
    dob: "",
    countryOfBirth: "",
    occupation: "",
    country: "",
    address: "",
    buildingNo: "",
    streetName: "",
    city: "",
    zip: "",
    state: "",
  });

  useEffect(() => {
    if (activeKey === "step2" && !idVerified && !verifyingID) {
      handleVeriffClick();
    }
  }, [activeKey, idVerified, verifyingID]);

  const extractCountryCode = (mobile) => {
    if (!mobile) return "61";
    const match = mobile.match(/^\+(\d{1,3})/);
    return match ? match[1] : "61";
  };

  const extractPhoneNumber = (mobile) => {
    if (!mobile) return "";
    return mobile.replace(/^\+\d{2}/, "");
  };


  useEffect(() => {
    const fetchAndVerifyUser = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await userProfile();
        if (res?.code === '200') {
          const userData = res.data;
          setcustomer_id(userData.customer_id);
          setFormData((prev) => (
            {
              ...prev,
              firstName: userData.First_name || "",
              middleName: userData.Middle_name || "",
              lastName: userData.Last_name || "",
              countryOfBirth: userData.Country_of_birth || "",
              dob: userData.Date_of_birth || "",
              email: userData.email || "",
              occupation: userData.occupation || "",
              buildingNo: userData.building || "",
              streetName: userData.street || "",
              zip: userData.postcode || "",
              city: userData.city || "",
              address: userData.address,
              state: userData.state,
              country: userData.country || "",
              phone: extractPhoneNumber(userData.mobile),
              countryCode: userData.mobile.substring(1, 3)
            }

          ))

        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    }
    fetchAndVerifyUser();
  }, [])


  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));

  const handleVeriffClick = () => {
    setVerifyingID(true);
    const veriff = Veriff({
      apiKey: import.meta.env.VITE_APP_VERIFF_KEY,
      parentId: "veriff-root",
      onSession: (err, response) => {
        if (err) {
          console.error("Veriff error:", err);
          setVerifyingID(false);
          return;
        }

        createVeriffFrame({
          url: response.verification.url,
          onEvent: (msg) => {
            switch (msg) {
              case MESSAGES.CANCELED:
                setVerifyingID(false);
                break;

              case MESSAGES.STARTED:
                setVerifyingID(true);
                break;

              case MESSAGES.FINISHED:
                setVerifyingID(true);

                let intervalCleared = false;
                toast.info("Checking your ID verification status... Please wait.");

                const interval = setInterval(async () => {
                  try {
                    const res = await getVeriffStatus({ session_id: response.verification.id });

                    if (res?.data?.status === "approved") {
                      clearInterval(interval);
                      intervalCleared = true;
                      setVerifyingID(false);
                      setIdVerified(true);
                      setActiveKey("step3");
                    }

                    else if (res?.data?.status === "declined") {
                      clearInterval(interval);
                      intervalCleared = true;
                      setVerifyingID(false);
                      setVeriffMessage("Verification declined. Please try again.");
                    }

                    else if (res?.data?.status === "success" && res?.data?.verification === null) {
                      clearInterval(interval);
                      intervalCleared = true;
                      setVerifyingID(false);
                      setIdVerified(true);
                      setActiveKey("step3");
                    }

                  } catch (err) {
                    console.error("Veriff status check error", err);
                    clearInterval(interval);
                    intervalCleared = true;
                    setVerifyingID(false);
                    setVeriffMessage("Error checking verification status. Please try again later.");
                  }
                }, 5000);

                setTimeout(() => {
                  if (!intervalCleared) {
                    clearInterval(interval);
                    setVerifyingID(false);
                    setActiveKey("step3");
                  }
                }, 15000);

                break;

              default:
                break;
            }
          },
        });
      },
    });

    veriff.setParams({
      vendorData: customer_id,
      person: {
        givenName: `${formData?.firstName}`,
        lastName: `${formData?.lastName}`,
      },
    });

    veriff.mount({
      formLabel: {
        givenName: "First Name",
        lastName: "Last Name",
        vendorData: "Customer ID",
      },
      submitBtnText: "Start Verification",
      loadingText: "Initializing Veriff...",
    });
  };


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (apiError) setApiError("");
    if (apiSuccess) setApiSuccess("");
  };

  const validatePersonalDetails = () => {
    setTouched((prev) => ({
      ...prev,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      dob: true,
      countryOfBirth: true,
      occupation: true,
    }));
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email format is invalid";

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^\d{1,10}$/.test(formData.phone)) {
      newErrors.phone = "Mobile number must be at most 10 digits";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

      if (dobDate > eighteenYearsAgo) {
        newErrors.dob = "You must be at least 18 years old";
      }
    }

    if (!formData.countryOfBirth)
      newErrors.countryOfBirth = "Country of birth is required";

    if (!formData.occupation.trim())
      newErrors.occupation = "Occupation is required";

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateAddressDetails = () => {
    setTouched((prev) => ({
      ...prev,
      country: true,
      address: true,
      buildingNo: true,
      streetName: true,
      city: true,
      zip: true,
      state: true,
    }));
    const newErrors = {};
    if (!formData.country) newErrors.country = "Country is required";
    if (!(formData.address || "").trim()) newErrors.address = "Address is required";
    if (!(formData.buildingNo || "").trim()) newErrors.buildingNo = "Building No. is required";
    if (!(formData.streetName || "").trim()) newErrors.streetName = "Street Name is required";
    if (!(formData.city || "").trim()) newErrors.city = "City is required";
    if (!(formData.zip || "").trim()) newErrors.zip = "Zip/Postal code is required";
    if (!(formData.state || "").trim()) newErrors.state = "State is required";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const runUpdateProfileApi = async () => {
    setIsLoading(true);
    setApiError("");
    setApiSuccess("");
    try {
      const APIDATA = {
        First_name: formData.firstName,
        Middle_name: formData.middleName,
        Last_name: formData.lastName,
        // email: formData.email,
        address: formData.address,
        Country_of_birth: formData.countryOfBirth,
        // mobile: `+${formData.countryCode}${formData.phone}`,
        country_code: formData.countryCode,
        Date_of_birth: formData.dob,
        Gender: "Male",
        location: formData.address,
        occupation: formData.occupation,
        payment_per_annum: "Tier-1 Less than 5 times",
        value_per_annum: "Tier-1 Less than $30,000",
        flat: "",
        building: formData.buildingNo,
        street: formData.streetName,
        postcode: formData.zip,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      };

      const response = await updateProfile(APIDATA);
      if (response && response.code === "200") {
        setApiSuccess("Profile updated successfully!");
        setActiveKey("step2");
      } else if (response && response.code === "400") {
        setApiError(
          response.message || "Invalid input. Please check the form fields."
        );
      } else {
        setApiError(
          response?.message || "An error occurred while updating profile."
        );
      }
    } catch (error) {
      setApiError("Network error. Please try again.");
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const isPersonalValid = validatePersonalDetails();
    const isAddressValid = validateAddressDetails();
    if (isPersonalValid && isAddressValid) {
      runUpdateProfileApi();
    }
  };

  const goToNext = () => {
    if (activeKey === "step1") {
      handleSubmit();
    } else if (activeKey === "step2") {
      if (!idVerified) {
        alert(
          "Please verify your ID first by clicking 'VERIFY YOUR ID' button."
        );
        return;
      }
    }
  };

  const goToPrevious = () => {
    if (activeKey === "step2") setActiveKey("step1");
    if (activeKey === "step3") setActiveKey("step2");
  };

  useEffect(() => {
    (async () => {
      const response = await userProfile();
      if (response?.code === "200") {
        if (
          (response.data.is_digital_Id_verified || "").toLowerCase() ===
          "approved"
        ) {
          navigate("/dashboard");
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (activeKey === "step3") {
      setCountdown(5);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeKey, navigate]);



  return (
    <>
      <TopNavbar />
      <Container className="py-5 pt-2 mt-5 mb-5 d-flex justify-content-between">
        <Tab.Container
          activeKey={activeKey}
          onSelect={(k) => {
            if (k === "step2" && activeKey !== "step1") setActiveKey(k);
            else if (k === "step3" && idVerified) setActiveKey(k);
            else if (k === "step1") setActiveKey("step1");
          }}
        >
          <Row className="w-100">
            <Col
              md={3}
              className="sidebar-steps d-flex justify-content-center align-items-center flex-column"
            >
              <Nav variant="pills" className="flex-column gap-4 w-100">
                {[1, 2, 3].map((num) => {
                  const stepKey = `step${num}`;
                  const currentStep = parseInt(activeKey.replace("step", ""));
                  const isActive = activeKey === stepKey;
                  const isCompleted = currentStep >= num;

                  return (
                    <Nav.Item key={num} className="step-wrapper">
                      <div className="step-connector">
                        <div
                          className={`step-dot ${isCompleted ? "completed" : ""
                            } ${isActive ? "active" : ""}`}
                        >
                          {isCompleted ? "●" : ""}
                        </div>
                        {num !== 3 && <div className="step-line" />}
                      </div>
                      <Nav.Link
                        eventKey={stepKey}
                        className={`step-label ${isCompleted ? "active" : ""}`}
                      >
                        <div>
                          <strong className="steps-number">Step {num}</strong>
                        </div>
                        <div className="steps-name">
                          {num === 1
                            ? "Personal Details"
                            : num === 2
                              ? "Verify Your ID"
                              : "KYC Completed"}
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </Col>

            <Col md={9} className="px-5">
              <Tab.Content className="kyc-content-form">
                {/* Step 1 */}
                <Tab.Pane eventKey="step1">
                  <h2 className="mb-1">Please complete KYC</h2>
                  <p className="text-muted mb-4">
                    You are only two steps away from completing your KYC
                  </p>

                  {/* API Success/Error Messages */}
                  {apiSuccess && (
                    <Alert variant="success" className="mb-3">
                      {apiSuccess}
                    </Alert>
                  )}
                  {apiError && (
                    <Alert variant="danger" className="mb-3">
                      {apiError}
                    </Alert>
                  )}

                  <Form className="profile-form">
                    <h3 className="mb-3 mt-3">Personal Details</h3>
                    <Row className="mb-3">
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            First Name <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          isInvalid={touched.firstName && errors.firstName}
                          disabled={isLoading}
                        />
                        {touched.firstName && errors.firstName && (
                          <div className="text-danger mt-1 small">
                            {errors.firstName}
                          </div>
                        )}
                      </FloatingLabel>
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Middle Name
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.middleName}
                          onChange={(e) =>
                            handleInputChange("middleName", e.target.value)
                          }
                          disabled={isLoading}
                        />
                      </FloatingLabel>
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Last Name <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          isInvalid={touched.lastName && errors.lastName}
                          disabled={isLoading}
                        />
                        {touched.lastName && errors.lastName && (
                          <div className="text-danger mt-1 small">
                            {errors.lastName}
                          </div>
                        )}
                      </FloatingLabel>
                    </Row>

                    <Row className="mb-3">
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Email<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          isInvalid={touched.email && errors.email}
                          disabled={isLoading}
                        />
                        {touched.email && errors.email && (
                          <div className="text-danger mt-1 small">
                            {errors.email}
                          </div>
                        )}
                      </FloatingLabel>
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Mobile Number
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3 mobileinput"
                      >
                        <div className="d-flex align-items-stretch p-0">
                          <Form.Select
                            value={formData.countryCode}
                            onChange={(e) =>
                              handleInputChange("countryCode", e.target.value)
                            }
                            disabled={isLoading}
                            style={{
                              maxWidth: "110px",
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          >
                            <option value="61">+61 (AU)</option>
                            <option value="64">+64 (NZ)</option>
                          </Form.Select>
                          <Form.Control
                            type="text"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            isInvalid={touched.phone && errors.phone}
                            disabled={isLoading}
                            style={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                          />
                        </div>
                        {touched.phone && errors.phone && (
                          <div className="text-danger mt-1 small">
                            {errors.phone}
                          </div>
                        )}
                      </FloatingLabel>
                    </Row>

                    <Row className="mb-3">
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Date of Birth
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="date"
                          max={new Date(
                            new Date().setFullYear(new Date().getFullYear() - 18)
                          )
                            .toISOString()
                            .split("T")[0]}
                          value={formData.dob}
                          onChange={(e) => handleInputChange("dob", e.target.value)}
                          isInvalid={touched.dob && errors.dob}
                          disabled={isLoading}
                        />
                        {touched.dob && errors.dob && (
                          <div className="text-danger mt-1 small">{errors.dob}</div>
                        )}
                      </FloatingLabel>


                      <Col className="mb-3">
                        <div className="floating-label-wrapper kyc-country">
                          <label
                            className={`floating-label ${formData.countryOfBirth ? "filled" : ""
                              }`}
                          >
                            Country of Birth
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <Select
                            options={countryOptions}
                            value={countryOptions.find(
                              (option) =>
                                option.value === formData.countryOfBirth
                            )}
                            onChange={(selectedOption) =>
                              handleInputChange(
                                "countryOfBirth",
                                selectedOption?.value || ""
                              )
                            }
                            placeholder=""
                            isSearchable
                            isDisabled={isLoading}
                            classNamePrefix="react-select"
                            className={
                              touched.countryOfBirth && errors.countryOfBirth
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {touched.countryOfBirth && errors.countryOfBirth && (
                            <div className="text-danger mt-1 small">
                              {errors.countryOfBirth}
                            </div>
                          )}
                        </div>
                      </Col>

                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Occupation
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          //placeholder="Occupation"
                          value={formData.occupation}
                          onChange={(e) =>
                            handleInputChange("occupation", e.target.value)
                          }
                          isInvalid={touched.occupation && errors.occupation}
                          disabled={isLoading}
                        />
                        {touched.occupation && errors.occupation && (
                          <div className="text-danger mt-1 small">
                            {errors.occupation}
                          </div>
                        )}
                      </FloatingLabel>
                    </Row>

                    <Row className="mb-3 mt-3">
                      <h3>Your Address</h3>
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Country
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Select
                          value={formData.country}
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                          isInvalid={touched.country && errors.country}
                          disabled={isLoading}
                        >
                          <option value="">Select Country</option>
                          <option value="Australia">Australia</option>
                          <option value="New Zealand">New Zealand</option>
                        </Form.Select>
                        {touched.country && errors.country && (
                          <div className="text-danger mt-1 small">
                            {errors.country}
                          </div>
                        )}
                      </FloatingLabel>

                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Address
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          as="textarea"
                          style={{ height: "50px" }}
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          isInvalid={touched.address && errors.address}
                          disabled={isLoading}
                        />
                        {touched.address && errors.address && (
                          <div className="text-danger mt-1 small">
                            {errors.address}
                          </div>
                        )}
                      </FloatingLabel>
                    </Row>

                    <Row className="mb-3">
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Building No.
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.buildingNo}
                          onChange={(e) =>
                            handleInputChange("buildingNo", e.target.value)
                          }
                          isInvalid={touched.buildingNo && errors.buildingNo}
                          disabled={isLoading}
                        />
                        {touched.buildingNo && errors.buildingNo && (
                          <div className="text-danger mt-1 small">
                            {errors.buildingNo}
                          </div>
                        )}
                      </FloatingLabel>

                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Street Name
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.streetName}
                          onChange={(e) =>
                            handleInputChange("streetName", e.target.value)
                          }
                          isInvalid={touched.streetName && errors.streetName}
                          disabled={isLoading}
                        />
                        {touched.streetName && errors.streetName && (
                          <div className="text-danger mt-1 small">
                            {errors.streetName}
                          </div>
                        )}
                      </FloatingLabel>
                    </Row>

                    <Row className="mb-3">
                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            City
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          isInvalid={touched.city && errors.city}
                          disabled={isLoading}
                        />
                        {touched.city && errors.city && (
                          <div className="text-danger mt-1 small">
                            {errors.city}
                          </div>
                        )}
                      </FloatingLabel>

                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            Zip/Postal Code
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.zip}
                          onChange={(e) =>
                            handleInputChange("zip", e.target.value)
                          }
                          isInvalid={touched.zip && errors.zip}
                          disabled={isLoading}
                        />
                        {touched.zip && errors.zip && (
                          <div className="text-danger mt-1 small">
                            {errors.zip}
                          </div>
                        )}
                      </FloatingLabel>

                      <FloatingLabel
                        as={Col}
                        label={
                          <span>
                            State
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          isInvalid={touched.state && errors.state}
                          disabled={isLoading}
                        />
                        {touched.state && errors.state && (
                          <div className="text-danger mt-1 small">
                            {errors.state}
                          </div>
                        )}
                      </FloatingLabel>
                    </Row>

                    <Row className="mb-3">
                      <Col>
                        <Button
                          variant="success"
                          className="nextbtn"
                          onClick={goToNext}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                              />
                              SUBMITTING...
                            </>
                          ) : (
                            "SUBMIT & NEXT STEP"
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          className="skipbtn"
                          onClick={() => navigate("/dashboard")}
                        >
                          Skip
                        </Button>
                        {isLoading && (
                          <p className="text-info mb-3">
                            <Spinner animation="border" size="sm" className="me-2" />
                            Verifying your details...
                          </p>
                        )}
                      </Col>
                    </Row>
                  </Form>
                </Tab.Pane>

                {/* Step 2 */}
                <Tab.Pane eventKey="step2">
                  <div className="kyc-complete-wrapper">
                    <div>
                      <h2 className="mb-3">Please complete KYC</h2>
                      <p>You are only one step away from completing your KYC</p>
                    </div>

                    <div className="verify-container">
                      <div id="veriff-root" style={{ marginTop: "20px" }}></div>
                      {/* {!verifyingID && (
                        <button
                          className={`verify-btn ${idVerified ? "verified" : ""}`}
                          type="button"
                          onClick={handleVeriffClick}
                          // disabled={idVerified}
                        >
                          {idVerified ? "ID VERIFIED ✓" : "VERIFY YOUR ID"}
                        </button>
                      )} */}

                      {/* {idVerified && (
                        <p className="text-success mt-3">
                          <strong>
                            ✓ ID Verification Completed Successfully!
                          </strong>
                          </p>
                          )}
                          
                          {idVerified && <p className="verify-description">
                          <strong>Veriff</strong> is an identity verification
                          provider that helps companies connect with customers.
                          </p>} */}
                    </div>

                    <div className="d-flex gap-2 justify-content-start">
                      <Button
                        variant="secondary"
                        className="prevbtn"
                        onClick={goToPrevious}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="secondary"
                        className="skipbtn"
                        onClick={() => navigate("/dashboard")}
                      >
                        Skip
                      </Button>
                    </div>
                    {VeriffMessage &&
                      <p>
                        {VeriffMessage}
                      </p>
                    }
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="step3">
                  <div className="text-center">
                    <>
                      <h2 className="text-success">✅ KYC Completed!</h2>
                      <p>Your KYC data is under review.</p>

                      <p className="text-muted">
                        {`Redirecting to dashboard in ${countdown} second${countdown !== 1 ? "s" : ""}...`}
                      </p>

                      <img src={KYCimage} alt="KYC Completed" />

                      <Button
                        variant="primary"
                        className="mt-3"
                        onClick={() => navigate("/dashboard")}
                      >
                        Go to Dashboard
                      </Button>
                    </>
                  </div>
                </Tab.Pane>

              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container >
      <Footer />
    </>
  );
};

export default KYCForm;