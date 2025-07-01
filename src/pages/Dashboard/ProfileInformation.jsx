import React, { useState, useEffect } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import Back from "../../assets/images/back.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, FloatingLabel, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userProfile, changePassword } from "../../services/Api";

const ProfileInformation = () => {
  const [countryCode, setCountryCode] = useState("61");
  const [rawMobile, setRawMobile] = useState("");
  const navigate = useNavigate();

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
    const fetchProfile = async () => {
      try {
        const response = await userProfile({});
        if (response?.code === "200" && response?.data) {
          const data = response.data;
           sessionStorage.setItem(
          "user_name",
          JSON.stringify({
            firstName: data.First_name || "",
            lastName: data.Last_name || "",
          })
        );
          setFormData((prev) => ({
            ...prev,
            firstName: data.First_name || "",
            middleName: data.Middle_name || "",
            lastName: data.Last_name || "",
            customerId: data.customer_id || "",
            email: data.email || "",
            mobile: data.mobile || "",
            dateOfBirth: data.Date_of_birth || "",
            countryOfBirth: data.Country_of_birth || "",
            occupation: data.occupation || "",
            country: data.country || data.location || "",
            address: data.address || "",
            city: data.city || "",
            zip: data.postcode || "",
            state: data.state || "",
          }));

          if (data.mobile && data.mobile.startsWith("+")) {
            const countryCode = data.mobile.substring(1, 3);
            const phoneNumber = data.mobile.substring(3);
            setCountryCode(countryCode);
            setRawMobile(phoneNumber);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All password fields are required");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New and confirm passwords do not match");
    }
    try {
      const res = await changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      if (res?.code === "200") {
        toast.success("Password updated successfully");
        setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        toast.error(res?.message || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

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
          {/* Profile Info Section */}
          <Card className="receiver-card bg-white">
            <Card.Body>
              <Card.Title>Personal Details</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="First Name">
                  <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Middle Name">
                  <Form.Control name="middleName" value={formData.middleName} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Last Name">
                  <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Customer ID">
                  <Form.Control name="customerId" value={formData.customerId} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Email">
                  <Form.Control type="email" value={formData.email} readOnly plaintext />
                </FloatingLabel>
              </Row>
              <Row className="mb-3 mobile_numbero">
                <Col>
                  <FloatingLabel label="Mobile Number">
                    <div className="d-flex align-items-stretch">
                      <Form.Select
                        value={countryCode}
                        disabled
                        style={{ maxWidth: "110px", borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      >
                        <option value="61">+61 (AU)</option>
                        <option value="64">+64 (NZ)</option>
                      </Form.Select>
                      <Form.Control
                        type="text"
                        value={rawMobile}
                        disabled
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      />
                    </div>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Date of Birth">
                  <Form.Control name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Country of Birth">
                  <Form.Control name="countryOfBirth" value={formData.countryOfBirth} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Occupation">
                  <Form.Control name="occupation" value={formData.occupation} onChange={handleChange} />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Country">
                  <Form.Control name="country" value={formData.country} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Address">
                  <Form.Control name="address" as="textarea" style={{ height: "50px" }} value={formData.address} onChange={handleChange} />
                </FloatingLabel>
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="City">
                  <Form.Control name="city" value={formData.city} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="Zip/Postal Code">
                  <Form.Control name="zip" type="number" value={formData.zip} onChange={handleChange} />
                </FloatingLabel>
                <FloatingLabel as={Col} label="State">
                  <Form.Control name="state" value={formData.state} onChange={handleChange} />
                </FloatingLabel>
              </Row>
                 <Row className="mb-3">
                <Col>
<Button
  variant="primary"
  className="float-end updateform"
  onClick={() => {
  const fullMobile = `+${countryCode}${rawMobile}`;

    const {
      email,  // ❌ Exclude
      mobile, // ❌ Exclude
      ...rest
    } = formData;

    // Map frontend keys to backend keys
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
      // currentPassword, newPassword, confirmPassword can also be included if needed
    };

    sessionStorage.setItem(
      "pendingProfileUpdate",
      JSON.stringify(payloadData)
    );

    navigate("/otp-verification", {
      state: {
        from: "profile",
        otpData: {
          email,
          mobile: fullMobile,
        },
      },
    });
  }}
>
  Update
</Button>

                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Password Update Section */}
          <Card className="receiver-card mt-4 bg-white">
            <Card.Body>
              <Card.Title>Change Password</Card.Title>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Current Password" className="position-relative">
                  <Form.Control
                    type={visibility.current ? "text" : "password"}
                    placeholder="Current Password"
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
                    placeholder="New Password"
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
              </Row>
              <Row className="mb-3">
                <FloatingLabel as={Col} label="Confirm Password" className="position-relative">
                  <Form.Control
                    type={visibility.confirm ? "text" : "password"}
                    placeholder="Confirm Password"
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
              <Button variant="secondary" onClick={handlePasswordUpdate}>
                Update Password
              </Button>
            </Card.Body>
          </Card>
        </Form>
      </div>
    </AnimatedPage>
  );
};

export default ProfileInformation;