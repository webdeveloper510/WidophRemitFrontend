import { Link } from "react-router-dom";
import stats2 from "../assets/images/info2.png";
import SendMoney from "../assets/images/send-money.png";


const SendMoneyCard = () => {
    return (
        <div className="col-md-4 mb-2 custom-width" style={{ paddingLeft: 0 }}>
            <div className="bg-white p-3 border-r stats-box">
                <img src={stats2} alt="stats" className="dashboard-info-img" />
                <div className="d-flex flex-column stats-row">
                    <span>Send Money</span>
                    <Link to="/send-money">
                        <img src={SendMoney} alt="send-money" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SendMoneyCard