import React, { useEffect, useState } from 'react'
import AnimatedPage from '../../components/AnimatedPage';
import Back from "../../assets/images/back.png";
import { Button, Col, Row, Table, Form, FloatingLabel } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiFileCopyLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
const VirtualAccountDetail = () => {
    const [monovaform, setmonovaform] = useState(JSON.parse(sessionStorage.getItem("monova_form_data")));
    const [PaymentMethod, setPaymentMethod] = useState(JSON.parse(sessionStorage.getItem("monova_form_data")).payment_mode);
    const [paymemtError, setpaymemtError] = useState("")
    const navigate = useNavigate();
    const location = useLocation();

    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success("Copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy to clipboard.");
            });
    };


    useEffect(() => {
        const allowed = location.state?.from === "Payment-Detail" || location.state?.from === "/confirm-transfer";
        if (!allowed) navigate("/send-money");
    }, [location])

    function Gonext() {
        if (!PaymentMethod) {
            setpaymemtError("Please select payment type!");
            return;
        }
        const temp = { ...monovaform, payment_mode: PaymentMethod }
        sessionStorage.setItem("monova_form_data", JSON.stringify(temp))
        navigate("/confirm-transfer", { state: { from: "Payment-Detail" } });
    }

    return (
        <AnimatedPage>
            <div className="page-title">
                <div className="d-flex align-items-center">
                    <Button
                        variant="link"
                        className="p-0 border-0 bg-transparent"
                        onClick={() =>
                            navigate("/payment-detail", {
                                state: { from: "/confirm-transfer" },
                            })
                        }
                    >
                        <img src={Back} alt="Back" />
                    </Button>
                    <h1>Monoova Virtual Account Detail</h1>
                </div>
            </div>

            <Row className="mt-5">
                <FloatingLabel
                    controlId="floatingPaymentMethod"
                    as={Col}
                    label="Payment Method"
                    className="mb-3"
                >
                    <Form.Select
                        value={PaymentMethod}
                        onChange={(e) => {
                            setPaymentMethod(e.target.value);
                            setpaymemtError("");
                        }}
                        isInvalid={!!paymemtError}
                    >
                        <option value="">Select Payment Method</option>
                        <option value="npp">NPP Credit Bank Account</option>
                    </Form.Select>
                    {paymemtError && (
                        <Form.Control.Feedback type="invalid">
                            {paymemtError}
                        </Form.Control.Feedback>
                    )}
                </FloatingLabel>
            </Row>

            <Table striped bordered style={{ marginTop: '2rem' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '80%' }}>Account Number</td>
                        <td style={{ width: '15%' }}>
                            {monovaform.accountNumber}
                        </td>
                        <td>
                            <span
                                className=""
                                onClick={() => copyToClipboard(monovaform.accountNumber)}
                                style={{ cursor: "pointer" }}
                            >
                                <RiFileCopyLine />
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: '80%' }}>Account Name</td>
                        <td style={{ width: '15%' }}>
                            {monovaform.accountName}
                        </td>
                        <td>
                            <span
                                className=""
                                onClick={() => copyToClipboard(monovaform.accountName)}
                                style={{ cursor: "pointer" }}
                            >
                                <RiFileCopyLine />
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: '80%' }}>BSB Number</td>
                        <td style={{ width: '15%' }}>
                            {monovaform.bsbNumber}
                        </td>
                        <td>
                            <span
                                className=""
                                onClick={() => copyToClipboard(monovaform.bsbNumber)}
                                style={{ cursor: "pointer" }}
                            >
                                <RiFileCopyLine />
                            </span>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <Row className="mt-5">
                <Col>
                    <Button
                        variant="light"
                        className="cancel-btn float-start"
                        onClick={() =>
                            navigate("/payment-detail", {
                                state: { from: "/confirm-transfer" },
                            })
                        }
                    >
                        Back
                    </Button>
                </Col>
                <Col>
                    <Button
                        variant="primary"
                        className="float-end updateform"
                        onClick={Gonext}
                    >
                        Continue
                    </Button>
                </Col>
            </Row>
        </AnimatedPage>
    )
}

export default VirtualAccountDetail
