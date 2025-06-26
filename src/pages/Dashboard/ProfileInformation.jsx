import React, { useState ,useEffect} from "react";
import AnimatedPage from "../../components/AnimatedPage";
import OtpInput from "react-otp-input";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import PhoneInput from "react-phone-number-input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import UpdatePopup from "../../assets/images/profilepopup.png";
import OtpImage from "../../assets/images/Otp-image.png";
import { userProfile } from "../../services/Api"; // ✅ Imported API
import { toast } from "react-toastify";

const ProfileInformation = () => {
  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShowVerify, setModalShowVerify] = React.useState(false);
  const [otp, setOtp] = useState("");

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
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await userProfile({});
      console.log("Fetched profile data:", response);

      if (response?.code === "200" && response?.data) {
        const data = response.data;

        setFormData({
          first_name: data.First_name || "",
          middle_name: data.middle_name || "",
          last_name: data.Middle_name || "",
          customer_id: data.customer_id || "",
          email: data.email || "",
          mobile: data.mobile || "",
          date_of_birth: data.Date_of_birth || "",
          country_of_birth: data.Country_of_birth || "",
          occupation: data.occupation || "",
          country: data.location || "",
          address: data.address || "",
          city: data.city || "",
          zip: data.zip || "",
          state: data.state || "",
        });

        setValue(data.mobile); // For PhoneInput
      } else {
        console.error("Profile fetch failed:", response);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();
}, []);


  return (
    <AnimatedPage>
      <div className="page-title">
        <div className="d-flex align-items-center">
          <a href="dashboard">
            <img src={Back} alt="Back" />
          </a>
          <h1>Profile Information</h1>
        </div>
      </div>

      <div className="page-content-section mt-3">
        <Form className="profile-form">
          {/* Personal Details */}
          <Card className="receiver-card bg-white">
            <Card.Body>
              <Card.Title>Personal Details</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="First Name">
                  <Form.Control value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Middle Name">
                  <Form.Control value={formData.middleName} onChange={(e) => handleChange("middleName", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Last Name">
                  <Form.Control value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Customer ID">
                  <Form.Control value={formData.customerId} onChange={(e) => handleChange("customerId", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Email">
                  <Form.Control type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Mobile">
                  <PhoneInput
                    international
                    defaultCountry="AU"
                    countryCallingCodeEditable={false}
                    value={value}
                    onChange={setValue}
                  />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Date of Birth">
                  <Form.Control type="date" value={formData.dateOfBirth} onChange={(e) => handleChange("dateOfBirth", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Country of Birth">
                  <Form.Control value={formData.countryOfBirth} onChange={(e) => handleChange("countryOfBirth", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Occupation">
                  <Form.Control value={formData.occupation} onChange={(e) => handleChange("occupation", e.target.value)} />
                </FloatingLabel>
              </Row>
            </Card.Body>
          </Card>

          {/* Address */}
          <Card className="receiver-card mt-4 bg-white">
            <Card.Body>
              <Card.Title>Your Address</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Country">
                  <Form.Control value={formData.country} onChange={(e) => handleChange("country", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Address">
                  <Form.Control
                    as="textarea"
                    value={formData.address}
                    style={{ height: "50px" }}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="City">
                  <Form.Control value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Zip/Postal Code">
                  <Form.Control type="number" value={formData.zip} onChange={(e) => handleChange("zip", e.target.value)} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="State">
                  <Form.Control value={formData.state} onChange={(e) => handleChange("state", e.target.value)} />
                </FloatingLabel>
              </Row>
            </Card.Body>
          </Card>

          {/* Password Section */}
          <Card className="receiver-card mt-4 bg-white">
            <Card.Body>
              <Card.Title>Change Password</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Current Password" className="position-relative">
                  <Form.Control
                    type={visibility.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleChange("currentPassword", e.target.value)}
                  />
                  <span onClick={() => toggleVisibility("current")} className="password-eye">
                    {visibility.current ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </FloatingLabel>

                <FloatingLabel as={Col} label="New Password" className="position-relative">
                  <Form.Control
                    type={visibility.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                  />
                  <span onClick={() => toggleVisibility("new")} className="password-eye">
                    {visibility.new ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </FloatingLabel>

                <FloatingLabel as={Col} label="Confirm Password" className="position-relative">
                  <Form.Control
                    type={visibility.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  />
                  <span onClick={() => toggleVisibility("confirm")} className="password-eye">
                    {visibility.confirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </FloatingLabel>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Button variant="primary" className="float-end updateform" >
                    Update
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>

        {/* Update Success Modal */}
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered className="profileupdate">
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h4>Profile information Updated Successfully</h4>
            <p className="m-4">
              <img src={UpdatePopup} alt="popup" width="250px" />
            </p>
          </Modal.Body>
          <Modal.Footer className="PopupButton">
            <Button
              onClick={() => {
                setModalShow(false);
                setTimeout(() => setModalShowVerify(true), 300);
              }}
            >
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        {/* OTP Modal */}
        <Modal show={modalShowVerify} onHide={() => setModalShowVerify(false)} centered className="profileupdate">
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h4>Verify your account by entering the code</h4>
            <p className="m-4">
              <img src={OtpImage} alt="otp" />
            </p>
            <OtpInput
              value={otp}
              inputStyle="inputBoxStyle"
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
            />
            <a href="#" className="resendOTP">Resend OTP</a>
          </Modal.Body>
          <Modal.Footer>
            <Row className="w-100">
              <Col>
                <Button variant="light" onClick={() => setModalShowVerify(false)}>Cancel</Button>
              </Col>
              <Col>
                <a href="dashboard">
                  <Button variant="primary">Continue</Button>
                </a>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </div>
    </AnimatedPage>
  );
};

export default ProfileInformation;
