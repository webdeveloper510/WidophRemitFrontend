import React, { useState, useEffect } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import { getNames } from "country-list";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { changePassword, updateProfile, userProfile } from "../../services/Api";
import Modal from "react-bootstrap/Modal";
import UpdatePopup from "../../assets/images/profilepopup.png";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/Navbar";
import { AnimatePresence } from "framer-motion";

const ProfileInformation = () => {
  const [modalShow, setModalShow] = useState(false);
  const [modalShowVerify, setModalShowVerify] = useState(false);
  const [countryCode, setCountryCode] = useState("61");
  const [rawMobile, setRawMobile] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const countryOptions = getNames().map((country) => ({
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

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchAndVerifyUser = async () => {
      try {
        const res = await userProfile();

        if (res?.code === "200") {
          const userData = res.data;
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
        } else {
          navigate("/login");
          sessionStorage.clear();
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setRedirectTo("/login");
        sessionStorage.clear();
      }
    };

    fetchAndVerifyUser();
  }, []);

  // useEffect(() => {
  //   const userData = JSON.parse(sessionStorage.getItem("User data") || "{}");

  //   if (Object.keys(userData).length > 0) {
  //     const updatedData = {
  //       firstName: userData.First_name || "",
  //       middleName: userData.Middle_name || "",
  //       lastName: userData.Last_name || "",
  //       customerId: userData.customer_id || "",
  //       email: userData.email || "",
  //       mobile: userData.mobile || "",
  //       dateOfBirth: userData.Date_of_birth || "",
  //       countryOfBirth: userData.Country_of_birth || "",
  //       occupation: userData.occupation || "",
  //       country: userData.country || userData.location || "",
  //       address: userData.address || "",
  //       city: userData.city || "",
  //       zip: userData.postcode || "",
  //       state: userData.state || "",
  //     };

  //     setFormData((prev) => ({
  //       ...prev,
  //       ...updatedData,
  //     }));

  //     if (userData.mobile && userData.mobile.startsWith("+")) {
  //       const countryCode = userData.mobile.substring(1, 3);
  //       const phoneNumber = userData.mobile.substring(3);
  //       setCountryCode(countryCode);
  //       setRawMobile(phoneNumber);
  //     }
  //   }
  // }, []);

  // const handlePasswordUpdate = async () => {
  //   const { currentPassword, newPassword, confirmPassword } = formData;

  //   if (!currentPassword || !newPassword || !confirmPassword) {
  //     return toast.error("All password fields are required");
  //   }
  //   if (newPassword !== confirmPassword) {
  //     return toast.error("New and confirm passwords do not match");
  //   }
  //   try {
  //     const res = await changePassword({
  //       old_password: currentPassword,
  //       new_password: newPassword,
  //       confirm_password: confirmPassword,
  //     });
  //     if (res?.code === "200") {
  //       toast.success("Password updated successfully");
  //       setFormData((prev) => ({
  //         ...prev,
  //         currentPassword: "",
  //         newPassword: "",
  //         confirmPassword: "",
  //       }));
  //     } else {
  //       toast.error(res?.message || "Failed to update password");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Something went wrong");
  //   }
  // };

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

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      return;
    }

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
            ...JSON.parse(sessionStorage.getItem("User data") || "{}"),
            ...payloadData,
            mobile: fullMobile,
            email: formData.email,
          };

          sessionStorage.setItem("User data", JSON.stringify(newSessionData));
        } else {
          toast.error(res?.message || "Failed to update profile");
        }
      })
      .catch((err) => {
        console.error("Profile update error:", err);
        toast.error("Unexpected error while updating profile");
      });
  };

  const getInvalid = (field) => submitted && !formData[field];

  return (
    <>
      <div className="p-3 d-flex flex-row customdashboardheight">
        <div className="d-flex w-100">
          <Sidebar collapsed={collapsed} />

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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                  Email <span style={{ color: "red" }}>*</span>
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
                                readOnly
                                required
                                isInvalid={getInvalid("dateOfBirth")}
                              />
                              <Form.Control.Feedback type="invalid">
                                Date of Birth is required
                              </Form.Control.Feedback>
                            </FloatingLabel>
                            <FloatingLabel
                              as={Col}
                              label={
                                <span>
                                  Country of Birth
                                  <span style={{ color: "red" }}>*</span>
                                </span>
                              }
                            >
                              <Form.Control
                                name="countryOfBirth"
                                value={formData.countryOfBirth}
                                onChange={handleChange}
                                required
                                isInvalid={getInvalid("countryOfBirth")}
                              />
                              <Form.Control.Feedback type="invalid">
                                Country of Birth is required
                              </Form.Control.Feedback>
                            </FloatingLabel>
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
                                      option.value === formData.country
                                  )}
                                  onChange={(selectedOption) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      country: selectedOption.value,
                                    }))
                                  }
                                />

                                {/* <Form.Control
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    isInvalid={getInvalid("country")}
                  /> */}
                                <Form.Control.Feedback type="invalid">
                                  Country is required
                                </Form.Control.Feedback>
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
                                className="mb-3"
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
                                  City<span style={{ color: "red" }}>*</span>
                                </span>
                              }
                            >
                              <Form.Control
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
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
                                type="number"
                                value={formData.zip}
                                onChange={handleChange}
                                requiredvalue={rawMobile}
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
                                  State<span style={{ color: "red" }}>*</span>
                                </span>
                              }
                            >
                              <Form.Control
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                isInvalid={getInvalid("state")}
                              />
                              <Form.Control.Feedback type="invalid">
                                State is required
                              </Form.Control.Feedback>
                            </FloatingLabel>
                          </Row>


  {/* Password Update Section */}
          <Card className="receiver-card mt-4 bg-white">
            <Card.Body>
              <Card.Title>Change Password</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Current Password" className="position-relative">
                  <Form.Control
                    type={visibility.current ? "text" : "password"}
                    className="PassowrdWidth"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => toggleVisibility("current")}
                    className="password-eye"
                  >
                    {visibility.current ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </FloatingLabel>

                <FloatingLabel as={Col} label="New Password" className="position-relative">
                  <Form.Control
                    type={visibility.new ? "text" : "password"}
                    className="PassowrdWidth"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => toggleVisibility("new")}
                    className="password-eye"
                  >
                    {visibility.new ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </FloatingLabel>
                <FloatingLabel as={Col} label="Confirm Password" className="position-relative">
                  <Form.Control
                   type={visibility.confirm ? "text" : "password"}
                   className="PassowrdWidth"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => toggleVisibility("confirm")}
                    className="password-eye"
                  >
                    {visibility.confirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </FloatingLabel>
              </Row>
              
            </Card.Body>
          </Card>

                          <Row className="mb-3 mt-4">
                            <Col>
                              <Button
                                variant="primary"
                                className="float-end updateform"
                                onClick={handleUpdateProfile}
                              >
                                Update
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      {/* Password Section remains unchanged */}
                      {/* ... */}
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
      <Footer />
    </>
  );
};

export default ProfileInformation;
