import { useState, useEffect } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col, Spinner } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import { getNames } from "country-list";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  changePassword,
  kycAddressList,
  resendOtp,
  updateProfile,
  userProfile,
  verifyEmail,
} from "../../services/Api";
import Modal from "react-bootstrap/Modal";
import UpdatePopup from "../../assets/images/profilepopup.png";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/Navbar";
import { AnimatePresence } from "framer-motion";
import { accessProvider } from "../../utils/accessProvider";
import OtpImage from "../../assets/images/Otp-image.png";
import OTPInput from "react-otp-input";
import allCountries from "../../utils/AllCountries";

const ProfileInformation = () => {
  const [modalShow, setModalShow] = useState(false);
  const [modalShowOtp, setmodalShowOtp] = useState(false);
  const [modalShowVerify, setModalShowVerify] = useState(false);
  const [countryCode, setCountryCode] = useState("61");
  const [rawMobile, setRawMobile] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    const stored = sessionStorage.getItem("collapsed");
    return stored === "true";
  });

  const [kycStatus, setkycStatus] = useState("pending");
  const [PasswordChange, setPasswordChange] = useState(false);
  const [changingPassword, setchangingPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [user, setuser] = useState({});
  const [otpPurpose, setOtpPurpose] = useState("");
  const navigate = useNavigate();
  const [AllCountries, setAllCountries] = useState(
    allCountries.map((c) => ({
      label: c.name,
      value: c.name,
    })),
  );
  // const countryOptions = [
  //   { value: "Australia", label: "Australia" },
  //   { value: "New Zealand", label: "New Zealand" },
  // ];

  const countryOptions = [
    { value: "Australia", label: "Australia", country_code: "AU" },
    { value: "Nigeria", label: "Nigeria", country_code: "NG" },
    { value: "New Zealand", label: "New Zealand", country_code: "NZ" },
  ];

  const countryOfBirthOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));

  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    customerId: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    countryOfBirth: "",
    occupation: "",
    address: "",
    country: "",
    city: "",
    zip: "",
    state: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleResendOtp = async () => {
    try {
      const payload = {
        mobile: user?.mobile,
        type: "email",
      };
      const response = await resendOtp(payload);
      if (response?.code === "200") {
        toast.success(response?.message || "OTP resent successfully!");
        setOtp("");
      } else {
        toast.error(response?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error("Something went wrong while resending OTP");
    }
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["currentPassword", "newPassword", "confirmPassword"].includes(name)) {
      if (/\s/.test(value)) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchAndVerifyUser = async () => {
      try {
        const res = await userProfile();

        if (res?.code === "200") {
          const userData = res.data;
          setuser(res.data);
          setFormData((prev) => ({
            ...prev,
            firstName: userData.First_name || "",
            middleName: userData.Middle_name || "",
            lastName: userData.Last_name || "",
            customerId: userData.customer_id || "",
            email: userData.email || "",
            mobile: userData.mobile || "",
            dateOfBirth: userData.Date_of_birth || "",
            countryOfBirth: userData.Country_of_birth || "",
            occupation: userData.occupation || "",
            country: userData.country || userData.location || "",
            address: userData.address || "",
            city: userData.city || "",
            zip: userData.postcode || "",
            state: userData.state || "",
          }));

          if (userData.mobile && userData.mobile.startsWith("+")) {
            const countryCode = userData.mobile.substring(1, 3);
            const phoneNumber = userData.mobile.substring(3);
            setCountryCode(countryCode);
            setRawMobile(phoneNumber);
          }

          const { is_digital_Id_verified, veriff_status } = userData;

          const currentKycStatus = accessProvider(
            is_digital_Id_verified,
            veriff_status,
          );
          setkycStatus(currentKycStatus);
        } else {
          navigate("/login");
          sessionStorage.clear();
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        sessionStorage.clear();
      }
    };

    fetchAndVerifyUser();
  }, []);

  const verifyOtpHandler = async () => {
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    const otpPayload = {
      email: user?.email,
      mobile: user?.Mobile || user?.mobile,
      otp: otp,
    };

    try {
      const response = await verifyEmail(otpPayload);
      if (response?.code === "200") {
        if (otpPurpose === "password") {
          setchangingPassword(true);
          handleUpdateProfile();
        } else if (otpPurpose === "profile") {
          updateProfileAfterOtp();
        }
      } else {
        toast.error(response?.message || "Invalid OTP");
      }
      setOtp("");
    } catch (err) {
      console.error("OTP Verification Error:", err);
      toast.error("Error verifying OTP");
    }
  };

  const updateProfileAfterOtp = () => {
    const fullMobile = `+${countryCode}${rawMobile}`;
    const { email, mobile, ...rest } = formData;

    const payloadData = {
      First_name: rest.firstName,
      Middle_name: rest.middleName,
      Last_name: rest.lastName,
      customer_id: rest.customerId,
      Date_of_birth: rest.dateOfBirth,
      Country_of_birth: rest.countryOfBirth,
      occupation: rest.occupation,
      address: rest.address,
      country: rest.country,
      city: rest.city,
      postcode: rest.zip,
      state: rest.state,
    };

    updateProfile(payloadData)
      .then((res) => {
        if (res?.code === "200") {
          setModalShow(true);
          const newSessionData = {
            ...JSON.parse(sessionStorage.getItem("user_data") || "{}"),
            ...payloadData,
            mobile: fullMobile,
            email: formData.email,
          };
          sessionStorage.setItem("user_data", JSON.stringify(newSessionData));
        } else {
          toast.error(res?.message || "Failed to update profile");
        }
        setmodalShowOtp(false);
      })
      .catch((err) => {
        console.error("Profile update error:", err);
        toast.error("Unexpected error while updating profile");
        setmodalShowOtp(false);
      });
  };

  const requiredFields = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "countryOfBirth",
    "occupation",
    "country",
    "address",
    "city",
    "zip",
    "state",
  ];

  const handleUpdateProfile = () => {
    setSubmitted(true);

    if (PasswordChange) {
      const { currentPassword, newPassword, confirmPassword } = formData;
      setchangingPassword(true);

      const passwordInvalid =
        !currentPassword ||
        !newPassword ||
        newPassword.length < 8 ||
        confirmPassword !== newPassword;

      if (passwordInvalid) return;

      changePassword({
        old_password: currentPassword,
        new_password: newPassword,
      })
        .then((res) => {
          if (res?.code === "200") {
            toast.success("Password updated successfully");
            setFormData((prev) => ({
              ...prev,
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }));
            setOtp("");
            setPasswordChange(false);

            setTimeout(() => {
              setSubmitted(false);
            }, 0);
          } else {
            toast.error(res?.message || "Failed to update password");
          }
          setchangingPassword(false);
          setmodalShowOtp(false);
        })
        .catch((err) => {
          console.error("Password update error:", err);
          toast.error("Unexpected error while updating password");
        });

      return;
    }

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) return;
    const fullMobile = `+${countryCode}${rawMobile}`;
    const { email, mobile, ...rest } = formData;

    const payloadData = {
      First_name: rest.firstName,
      Middle_name: rest.middleName,
      Last_name: rest.lastName,
      customer_id: rest.customerId,
      Date_of_birth: rest.dateOfBirth,
      Country_of_birth: rest.countryOfBirth,
      occupation: rest.occupation,
      address: rest.address,
      country: rest.country,
      city: rest.city,
      postcode: rest.zip,
      state: rest.state,
    };

    updateProfile(payloadData)
      .then((res) => {
        if (res?.code === "200") {
          setModalShow(true);
          const newSessionData = {
            ...JSON.parse(sessionStorage.getItem("user_data") || "{}"),
            ...payloadData,
            mobile: fullMobile,
            email: formData.email,
          };
          sessionStorage.setItem("user_data", JSON.stringify(newSessionData));
        } else {
          toast.error(res?.message || "Failed to update profile");
        }
      })
      .catch((err) => {
        console.error("Profile update error:", err);
        toast.error("Unexpected error while updating profile");
      });
  };

  const getInvalid = (field) => {
    if (!submitted) return false;

    if (PasswordChange) {
      if (
        ["currentPassword", "newPassword", "confirmPassword"].includes(field)
      ) {
        if (!formData[field]) return true;
        if (/\s/.test(formData[field])) return true;
        if (field === "newPassword") {
          if (formData.newPassword.length < 8) return true;
          if (!/[a-z]/.test(formData.newPassword)) return true;
          if (!/[A-Z]/.test(formData.newPassword)) return true;
          if (!/[0-9]/.test(formData.newPassword)) return true;
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) return true;
        }
        if (
          field === "confirmPassword" &&
          formData.confirmPassword !== formData.newPassword
        )
          return true;
      }
    }

    return !formData[field];
  };

  const hasPasswordErrors = () => {
    const small = /[a-z]/;
    const capital = /[A-Z]/;
    const number = /[0-9]/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      !formData.currentPassword ||
      /\s/.test(formData.currentPassword) ||
      !formData.newPassword ||
      /\s/.test(formData.newPassword) ||
      formData.newPassword.length < 8 ||
      !small.test(formData.newPassword) ||
      !capital.test(formData.newPassword) ||
      !number.test(formData.newPassword) ||
      !special.test(formData.newPassword) ||
      !formData.confirmPassword ||
      /\s/.test(formData.confirmPassword) ||
      formData.confirmPassword !== formData.newPassword
    );
  };

  return (
    <>
      <div className="p-3 d-flex flex-row customdashboardheight">
        <div className="d-flex w-100">
          <Sidebar collapsed={collapsed} disabled={kycStatus !== "approved"} />

          <div className="flex-grow-1 d-flex flex-column right-side-content">
            <TopNavbar onToggleSidebar={() => setCollapsed(!collapsed)} />
            <main className="flex-grow-1 p-3 mt-3">
              <AnimatePresence mode="wait">
                <AnimatedPage>
                  <div className="page-title">
                    <div className="d-flex align-items-center">
                      <Link to={"/dashboard"}>
                        <img src={Back} alt="Back" />
                      </Link>
                      <h1>Profile Information</h1>
                    </div>
                  </div>

                  <div className="page-content-section mt-3">
                    <Form className="profile-form">
                      <Card className="receiver-card bg-white">
                        <Card.Body>
                          {!PasswordChange && (
                            <>
                              <Card.Title>Personal Details</Card.Title>
                              <Row className="mb-3">
                                <FloatingLabel
                                  as={Col}
                                  label={
                                    <span>
                                      First Name{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  }
                                  className="mb-3"
                                >
                                  <Form.Control
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        (/^[a-zA-Z0-9 -]+$/.test(value) &&
                                          value.length <= 30) ||
                                        !value
                                      )
                                        handleChange(e);
                                    }}
                                    required
                                    isInvalid={getInvalid("firstName")}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    First Name is required
                                  </Form.Control.Feedback>
                                </FloatingLabel>
                                <FloatingLabel
                                  as={Col}
                                  label="Middle Name"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        (/^[a-zA-Z0-9 -]+$/.test(value) &&
                                          value.length <= 30) ||
                                        !value
                                      )
                                        handleChange(e);
                                    }}
                                  />
                                </FloatingLabel>
                                <FloatingLabel
                                  as={Col}
                                  label={
                                    <span>
                                      Last Name{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  }
                                  className="mb-3"
                                >
                                  <Form.Control
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        (/^[a-zA-Z0-9 -]+$/.test(value) &&
                                          value.length <= 30) ||
                                        !value
                                      )
                                        handleChange(e);
                                    }}
                                    required
                                    isInvalid={getInvalid("lastName")}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Last Name is required
                                  </Form.Control.Feedback>
                                </FloatingLabel>
                              </Row>
                              <Row className="mb-3">
                                <FloatingLabel
                                  as={Col}
                                  label={
                                    <span>
                                      Customer ID{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  }
                                  className="mb-3"
                                >
                                  <Form.Control
                                    name="customerId"
                                    value={formData.customerId}
                                    readOnly
                                    disabled
                                    plaintext
                                  />
                                </FloatingLabel>
                                <FloatingLabel
                                  as={Col}
                                  label={
                                    <span>
                                      Email{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  }
                                  className="mb-3"
                                >
                                  <Form.Control
                                    type="email"
                                    value={formData.email}
                                    readOnly
                                    disabled
                                    plaintext
                                  />
                                </FloatingLabel>
                              </Row>
                              <Row className="mb-3 mobile_numbero">
                                <Col>
                                  <FloatingLabel
                                    label={
                                      <span>
                                        Mobile Number{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    className="mb-3"
                                  >
                                    <div className="d-flex align-items-stretch">
                                      <Form.Select
                                        value={countryCode}
                                        readOnly
                                        disabled
                                        style={{
                                          maxWidth: "110px",
                                          borderTopRightRadius: 0,
                                          borderBottomRightRadius: 0,
                                          backgroundColor: "#fff",
                                          color: "#000",
                                          opacity: 1,
                                        }}
                                      >
                                        <option value="61">+61 (AU)</option>
                                        <option value="64">+64 (NZ)</option>
                                      </Form.Select>
                                      <Form.Control
                                        type="text"
                                        value={rawMobile}
                                        readOnly
                                        disabled
                                        max={10}
                                        style={{
                                          borderTopLeftRadius: 0,
                                          borderBottomLeftRadius: 0,
                                          backgroundColor: "#fff",
                                          color: "#000",
                                          opacity: 1,
                                        }}
                                      />
                                    </div>
                                  </FloatingLabel>
                                </Col>
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
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                    isInvalid={getInvalid("dateOfBirth")}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Date of Birth is required
                                  </Form.Control.Feedback>
                                </FloatingLabel>

                                {/* Updated Country of Birth - Now a dropdown */}
                                <Col>
                                  <div className="floating-label-wrapper kyc-country">
                                    <label>
                                      Country of Birth{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Select
                                      options={AllCountries}
                                      name="countryOfBirth"
                                      value={AllCountries.find(
                                        (option) =>
                                          option.value ===
                                          formData.countryOfBirth,
                                      )}
                                      onChange={(selectedOption) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          countryOfBirth: selectedOption.value,
                                        }))
                                      }
                                      className={
                                        getInvalid("countryOfBirth")
                                          ? "is-invalid"
                                          : ""
                                      }
                                    />
                                    {getInvalid("countryOfBirth") && (
                                      <div className="invalid-feedback d-block">
                                        Country of Birth is required
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
                                >
                                  <Form.Control
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    required
                                    isInvalid={getInvalid("occupation")}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Occupation is required
                                  </Form.Control.Feedback>
                                </FloatingLabel>
                              </Row>

                              <Row className="mb-3">
                                <Col>
                                  <div className="floating-label-wrapper kyc-country">
                                    <label>
                                      Country{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Select
                                      options={countryOptions}
                                      name="country"
                                      value={countryOptions.find(
                                        (option) =>
                                          option.value === formData.country,
                                      )}
                                      onChange={(selectedOption) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          country: selectedOption.value,
                                        }))
                                      }
                                      className={
                                        getInvalid("country")
                                          ? "is-invalid"
                                          : ""
                                      }
                                    />
                                    {getInvalid("country") && (
                                      <div className="invalid-feedback d-block">
                                        Country is required
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col>
                                  <FloatingLabel
                                    as={Col}
                                    label={
                                      <span>
                                        Address
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    className="mb-3 textarea-label"
                                  >
                                    <Form.Control
                                      name="address"
                                      as="textarea"
                                      style={{ height: "50px" }}
                                      value={formData.address}
                                      onChange={handleChange}
                                      required
                                      isInvalid={getInvalid("address")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      Address is required
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
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  }
                                >
                                  <Form.Control
                                    name="city"
                                    value={formData.city}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        (/^[a-zA-Z -]+$/.test(value) &&
                                          value.length <= 35) ||
                                        !value
                                      )
                                        handleChange(e);
                                    }}
                                    required
                                    isInvalid={getInvalid("city")}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    City is required
                                  </Form.Control.Feedback>
                                </FloatingLabel>
                                <FloatingLabel
                                  as={Col}
                                  label={
                                    <span>
                                      Zip/Postal Code
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  }
                                >
                                  <Form.Control
                                    name="zip"
                                    type="text"
                                    value={formData.zip}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        (/^\d+$/.test(value) &&
                                          value.length <= 9) ||
                                        !value
                                      )
                                        handleChange(e);
                                    }}
                                    required
                                    isInvalid={getInvalid("zip")}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Zip is required
                                  </Form.Control.Feedback>
                                </FloatingLabel>
                                <FloatingLabel
                                  as={Col}
                                  label={
                                    <span>
                                      State
                                      <span style={{ color: "red" }}>*</span>
                                    </span>
                                  }
                                >
                                  <Form.Control
                                    name="state"
                                    value={formData.state}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (
                                        (/^[a-zA-Z -]+$/.test(value) &&
                                          value.length <= 30) ||
                                        !value
                                      )
                                        handleChange(e);
                                    }}
                                    required
                                    isInvalid={getInvalid("state")}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    State is required
                                  </Form.Control.Feedback>
                                </FloatingLabel>
                              </Row>
                            </>
                          )}

                          {/* Password Update Section */}
                          {PasswordChange && (
                            <Card className="receiver-card mt-4 bg-white">
                              <Card.Body>
                                <Card.Title>Change Password</Card.Title>
                                <Row className="mb-3">
                                  <FloatingLabel
                                    as={Col}
                                    label={
                                      <span>
                                        Current password
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    className="position-relative"
                                  >
                                    <Form.Control
                                      type={
                                        visibility.current ? "text" : "password"
                                      }
                                      className="PassowrdWidth"
                                      name="currentPassword"
                                      value={formData.currentPassword}
                                      onChange={handleChange}
                                      isInvalid={getInvalid("currentPassword")}
                                      required
                                    />
                                    <span
                                      onClick={() =>
                                        toggleVisibility("current")
                                      }
                                      className="password-eye"
                                    >
                                      {visibility.current ? (
                                        <FaEyeSlash />
                                      ) : (
                                        <FaEye />
                                      )}
                                    </span>
                                    <Form.Control.Feedback type="invalid">
                                      {!formData.currentPassword
                                        ? "Current password is required"
                                        : /\s/.test(formData.currentPassword)
                                          ? "Password cannot contain spaces"
                                          : null}
                                    </Form.Control.Feedback>
                                  </FloatingLabel>

                                  <FloatingLabel
                                    as={Col}
                                    label={
                                      <span>
                                        New password
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    className="position-relative"
                                  >
                                    <Form.Control
                                      type={
                                        visibility.new ? "text" : "password"
                                      }
                                      className="PassowrdWidth"
                                      name="newPassword"
                                      value={formData.newPassword}
                                      onChange={handleChange}
                                      isInvalid={getInvalid("newPassword")}
                                      required
                                    />
                                    <span
                                      onClick={() => toggleVisibility("new")}
                                      className="password-eye"
                                    >
                                      {visibility.new ? (
                                        <FaEyeSlash />
                                      ) : (
                                        <FaEye />
                                      )}
                                    </span>
                                    <Form.Control.Feedback type="invalid">
                                      {!formData.newPassword
                                        ? "New password is required"
                                        : /\s/.test(formData.newPassword)
                                          ? "Password cannot contain spaces"
                                          : formData.newPassword.length < 8
                                            ? "New password must be at least 8 characters"
                                            : !/[a-z]/.test(
                                                  formData.newPassword,
                                                )
                                              ? "Password must contain a lowercase letter"
                                              : !/[A-Z]/.test(
                                                    formData.newPassword,
                                                  )
                                                ? "Password must contain an uppercase letter"
                                                : !/[0-9]/.test(
                                                      formData.newPassword,
                                                    )
                                                  ? "Password must contain a number"
                                                  : !/[!@#$%^&*(),.?":{}|<>]/.test(
                                                        formData.newPassword,
                                                      )
                                                    ? "Password must contain a special character"
                                                    : null}
                                    </Form.Control.Feedback>
                                  </FloatingLabel>

                                  <FloatingLabel
                                    as={Col}
                                    label={
                                      <span>
                                        Confirm password
                                        <span style={{ color: "red" }}>*</span>
                                      </span>
                                    }
                                    className="position-relative"
                                  >
                                    <Form.Control
                                      type={
                                        visibility.confirm ? "text" : "password"
                                      }
                                      className="PassowrdWidth"
                                      name="confirmPassword"
                                      value={formData.confirmPassword}
                                      onChange={handleChange}
                                      isInvalid={getInvalid("confirmPassword")}
                                      required
                                    />
                                    <span
                                      onClick={() =>
                                        toggleVisibility("confirm")
                                      }
                                      className="password-eye"
                                    >
                                      {visibility.confirm ? (
                                        <FaEyeSlash />
                                      ) : (
                                        <FaEye />
                                      )}
                                    </span>
                                    <Form.Control.Feedback type="invalid">
                                      {!formData.confirmPassword
                                        ? "Confirm password is required"
                                        : /\s/.test(formData.confirmPassword)
                                          ? "Password cannot contain spaces"
                                          : formData.confirmPassword !==
                                              formData.newPassword
                                            ? "Passwords do not match"
                                            : null}
                                    </Form.Control.Feedback>
                                  </FloatingLabel>
                                </Row>
                              </Card.Body>
                            </Card>
                          )}

                          <Row className="mb-3 mt-4">
                            <Col className="d-flex justify-content-end gap-2">
                              {!PasswordChange && (
                                <Button
                                  variant="primary"
                                  className="updateform"
                                  onClick={() => {
                                    setSubmitted(false);
                                    setPasswordChange(true);
                                  }}
                                >
                                  Change Password
                                </Button>
                              )}

                              {PasswordChange && (
                                <>
                                  <Button
                                    variant="primary"
                                    className="updateform"
                                    onClick={() => {
                                      setPasswordChange(false);
                                      setFormData((prev) => ({
                                        ...prev,
                                        currentPassword: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                      }));
                                      setSubmitted(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="primary"
                                    className="updateform"
                                    onClick={() => {
                                      setSubmitted(true);
                                      if (!hasPasswordErrors()) {
                                        setOtpPurpose("password");
                                        setmodalShowOtp(true);
                                        resendOtp({ mobile: user?.mobile });
                                      }
                                    }}
                                  >
                                    Save Password
                                  </Button>
                                </>
                              )}

                              {!PasswordChange && (
                                <Button
                                  variant="primary"
                                  className="updateform"
                                  onClick={() => {
                                    setSubmitted(true);
                                    if (
                                      requiredFields.every(
                                        (field) => formData[field],
                                      )
                                    ) {
                                      setOtpPurpose("profile");
                                      setmodalShowOtp(true);
                                      resendOtp({ mobile: user?.mobile });
                                    }
                                  }}
                                >
                                  Update
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Form>
                  </div>
                  <Modal
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    className="profileupdate"
                  >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                      <h4>Profile Information Updated Successfully</h4>
                      <p className="m-4 text-center">
                        <img
                          src={UpdatePopup}
                          alt="Profile Update Success"
                          width="250px"
                        />
                      </p>
                    </Modal.Body>
                    <Modal.Footer className="PopupButton">
                      <Button
                        onClick={() => {
                          setModalShow(false);
                          setTimeout(() => setModalShowVerify(true), 300);
                          navigate("/dashboard");
                        }}
                      >
                        Continue
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </AnimatedPage>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>

      <Modal
        size="md"
        centered
        show={modalShowOtp}
        onHide={() => {
          setmodalShowOtp(false);
          setOtp("");
          setchangingPassword(false);
        }}
        className="profileupdate"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={!changingPassword}></Modal.Header>
        <Modal.Body>
          {changingPassword ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
              <p className="mt-3">Changing your password, please wait...</p>
            </div>
          ) : (
            <>
              <h4>Verify your account by entering the code</h4>
              <p className="m-4">
                <img src={OtpImage} alt="image" />
              </p>
              <Col className="inputBoxStyle">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </Col>
              <Button
                variant="link"
                onClick={handleResendOtp}
                className="resendOTP"
              >
                Resend OTP
              </Button>
            </>
          )}
        </Modal.Body>

        {!changingPassword && (
          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Row className="mb-3">
              <Col>
                <Button
                  variant="light"
                  className="cancel-btn float-start"
                  onClick={() => setmodalShowOtp(false)}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={verifyOtpHandler}
                  variant="primary"
                  className="submit-btn float-end"
                >
                  Continue
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        )}
      </Modal>
      <Footer />
    </>
  );
};

export default ProfileInformation;
