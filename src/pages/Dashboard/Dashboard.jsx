import AnimatedPage from "../../components/AnimatedPage";
import stats1 from "../../assets/images/info1.png";
import stats2 from "../../assets/images/info2.png";
import stats3 from "../../assets/images/info3.png";
import stats4 from "../../assets/images/info4.png";
import ReceiverTable from "./ReceiverTable";
import LatestTransfer from "./LatestTransfer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { recipientList, transactionHistory } from "../../services/Api";
import SendMoney from "../../assets/images/send-money.png";
import Profile from "../../assets/images/profile.png";

const Dashboard = () => {
  const [ReceiversCount, setReceiversCount] = useState(0);
  const [TransactionsCount, setTransactionsCount] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await recipientList();
      if (response.code === "200") {
        setReceiversCount(response.data.length);
      }
    })();

    (async () => {
      const response = await transactionHistory();

      if (response.code === "200") {
        console.log(response.data.data.length);
        setTransactionsCount(response.data.data.length);
      }
    })();
  }, []);

  const navigate = useNavigate();
  return (
    <AnimatedPage>
      <div className="page-title">
        <h1>Welcome , Louie</h1>
      </div>

      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-7">
            <div className="dashbaord-bg-image p-4">
              <h2>
                Dashboard<br></br>
                <span>info</span>
              </h2>
              <div className="row mt-5">
                <div
                  className="col-md-4 mb-2 custom-width"
                  style={{ paddingRight: 0 }}
                >
                  <div className="bg-white p-3 border-r stats-box">
                    <img src={stats1} alt="stats" className="dashboard-info-img"/>
                    <div className="d-flex flex-column stats-row">
                      <span>Receivers</span>
                      <h4>{ReceiversCount}</h4>
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-4 mb-2 custom-width"
                  style={{ paddingleft: 0 }}
                >
                  <div className="bg-white p-3 border-r stats-box">
                    <img src={stats2} alt="stats" className="dashboard-info-img"/>
                    <div className="d-flex flex-column stats-row">
                      <span>Send Money</span>
                      <a href="#">
                      <img src={SendMoney} alt="send-money" />
                    </a>
                      <h4 onClick={() => navigate("/send-money")}>{">"}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-md-4 custom-width"
                  style={{ paddingRight: 0 }}
                >
                  <div className="bg-white p-3 border-r stats-box">
                    <img src={stats3} alt="stats" className="dashboard-info-img" />
                    <div className="d-flex flex-column stats-row">
                      <span>Transfers</span>
                      <h4>{TransactionsCount}</h4>
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-4 custom-width"
                  style={{ paddingleft: 0 }}
                >
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
