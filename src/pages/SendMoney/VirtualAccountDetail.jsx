import React, { useEffect, useState } from 'react'
import AnimatedPage from '../../components/AnimatedPage';
import Back from "../../assets/images/back.png";
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const VirtualAccountDetail = () => {
    const [monovaform, setmonovaform] = useState(JSON.parse(sessionStorage.getItem("monova_form_data")));
    const [PaymentMethod, setPaymentMethod] = useState(JSON.parse(sessionStorage.getItem("monova_form_data")).payment_mode);
    const [paymemtError, setpaymemtError] = useState("")
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const allowed = location.state?.from === "Payment-Detail" || location.state?.from === "/confirm-transfer";
        if (!allowed) navigate("/send-money");
    }, [location])


    function Gonext() {
        if (!PaymentMethod) { setpaymemtError("Please select payment type!"); return; }
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
            <div style={{ maxWidth: '600px', margin: '2rem auto 0 auto' }}>
                <select
                    id="paymentMethod"
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        marginTop: '0.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ff 100%)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        fontSize: '1rem',
                        color: '#333',
                        outline: 'none',
                        appearance: 'none',
                        transition: 'box-shadow 0.2s',
                    }}
                    onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setpaymemtError("")
                    }}
                    onFocus={e => e.target.style.boxShadow = '0 0 0 2px #6366f1'}
                    onBlur={e => e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'}
                    value={PaymentMethod}
                >
                    <option value="">Select Payment Method</option>
                    <option value="npp">NPP Credit Bank Account</option>
                </select>
                {paymemtError && (
                    <div style={{ color: '#ef4444', marginTop: '0.5rem', fontWeight: '500', fontSize: '0.98rem', textAlign: 'left' }}>
                        {paymemtError}
                    </div>
                )}
            </div>
            <Table striped bordered style={{ marginTop: '2rem' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '80%' }}>Account Number</td>
                        <td style={{ width: '20%' }}>
                            {monovaform.accountNumber}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: '80%' }}>Account Name</td>
                        <td style={{ width: '20%' }}>
                            {monovaform.accountName}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: '80%' }}>BSB Number</td>
                        <td style={{ width: '20%' }}>
                            {monovaform.bsbNumber}
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