import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { activEmail } from '../services/Api'
import { useParams, Link } from 'react-router-dom'

const EmailVerify = () => {
    const [verified, setVerified] = useState({ status: null, message: null })
    const { id } = useParams()

    useEffect(() => {
        activEmail(id).then(res => {
            if (res.code === "200") {
                setVerified({ status: true, message: res?.message })
            } else if (res.code === "400") {
                setVerified({ status: "failed", message: res?.message })
            } else if (res === "failed") {
                setVerified({ status: "failed", message: "Your email verification has been failed." })
            }
        }).catch(error => {
            setVerified({ status: "failed", message: "Your email verification has been failed." })
        })
    }, [])

    return (
        <Container fluid>
            <div className='d-flex justify-content-center align-items-center min-vh-100'>
                {verified?.status === true ? (
                    <div className='d-grid text-center'>
                        <i className='bi bi-check-circle display-5 text-success mb-2'></i>
                        <p className='fw-semibold'>{verified?.message}</p>
                        <Link to="/login">Go to login</Link>
                    </div>
                ) : verified?.status === "failed" ? (
                    <div className='d-grid text-center'>
                        <i className='bi bi-x-circle display-5 text-danger mb-2'></i>
                        <p className='fw-semibold'>{verified?.message}</p>
                    </div>
                ) : (
                    <div className="loader-overly">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default EmailVerify
