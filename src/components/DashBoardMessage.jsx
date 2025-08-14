import { Link } from "react-router-dom"

const DashBoardMessage = ({ firstName, kycStatus, Message }) => {
    return (
        <>
            <div className="page-title">
                <h1>Welcome, {firstName}</h1>
            </div>

            {Message && (
                <div className="alert alert-warning mt-3" role="alert">
                    {Message}{" "}
                    {kycStatus !== "submitted" && kycStatus !== "suspended" && (
                        <Link to="/kyc" className="alert-link">
                            Complete Now
                        </Link>
                    )}
                </div>
            )}
        </>
    )
}

export default DashBoardMessage