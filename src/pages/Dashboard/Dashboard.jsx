import AnimatedPage from "../../components/AnimatedPage";
import stats1 from "../../assets/images/info1.png";
import stats2 from "../../assets/images/info2.png";
import stats3 from "../../assets/images/info3.png";
import stats4 from "../../assets/images/info4.png";
import ReceiverTable from "./ReceiverTable";
import LatestTransfer from "./LatestTransfer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  recipientList,
  transactionHistory,
} from "../../services/Api";
import SendMoney from "../../assets/images/send-money.png";
import Profile from "../../assets/images/profile.png";
import loaderlogo from "../../assets/images/logo.png";

const Dashboard = () => {
  const [receiversCount, setReceiversCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [firstName, setFirstName] = useState("User");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from session
    const userData = JSON.parse(sessionStorage.getItem("User data") || "{}");
    setFirstName(userData.First_name || "User");

    // Load receivers & transactions
    const fetchData = async () => {
      const recipientsResponse = await recipientList();
      if (recipientsResponse.code === "200") {
        setReceiversCount(recipientsResponse.data.length);
      }

      const transactionsResponse = await transactionHistory();
      if (transactionsResponse.code === "200") {
        setTransactionsCount(transactionsResponse.data.data.length);
      }
    };

    fetchData();

    // Simulate loader
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <img src={loaderlogo} alt="Logo" className="loader-logo" />
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-title">
        <h1>Welcome, {firstName}</h1>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-7">
            <div className="dashbaord-bg-image p-4">
              <h2>Dashboard</h2>

              <div className="row mt-5">
                <div className="col-md-4 mb-2 custom-width" style={{ paddingRight: 0 }}>
                  <div className="bg-white p-3 border-r stats-box">
                    <img src={stats1} alt="stats" className="dashboard-info-img" />
                    <div className="d-flex flex-column stats-row">
                      <span>Receivers</span>
                      <h4>{receiversCount}</h4>
                    </div>
                  </div>
                </div>

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
              </div>

              <div className="row">
                <div className="col-md-4 custom-width" style={{ paddingRight: 0 }}>
                  <div className="bg-white p-3 border-r stats-box">
                    <img src={stats3} alt="stats" className="dashboard-info-img" />
                    <div className="d-flex flex-column stats-row">
                      <span>Transfers</span>
                      <h4>{transactionsCount}</h4>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 custom-width" style={{ paddingLeft: 0 }}>
                  <div className="bg-white p-3 border-r stats-box">
                    <img src={stats4} alt="stats" className="dashboard-info-img" />
                    <div className="d-flex flex-column stats-row">
                      <span>Profile</span>
                      <Link to="/profile-information">
                        <img src={Profile} alt="profile" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="col-md-5">
            <ReceiverTable />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            <LatestTransfer />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
