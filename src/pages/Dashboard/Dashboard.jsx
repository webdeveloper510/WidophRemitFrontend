import AnimatedPage from "../../components/AnimatedPage";
import stats1 from "../../assets/images/info1.png";
import stats2 from "../../assets/images/info2.png";
import stats3 from "../../assets/images/info3.png";
import stats4 from "../../assets/images/info4.png";
import ReceiverTable from "./ReceiverTable";
import LatestTransfer from "./LatestTransfer";
import SendMoney from "../../assets/images/send-money.png";
import Profile from "../../assets/images/profile.png";

const Dashboard = () => (
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
                  <img
                    src={stats1}
                    alt="stats"
                    className="dashboard-info-img"
                  />
                  <div className="d-flex flex-column stats-row">
                    <span>Receivers</span>
                    <h4>878</h4>
                  </div>
                </div>
              </div>
              <div
                className="col-md-4 mb-2 custom-width"
                style={{ paddingleft: 0 }}
              >
                <div className="bg-white p-3 border-r stats-box">
                  <img
                    src={stats2}
                    alt="stats"
                    className="dashboard-info-img"
                  />
                  <div className="d-flex flex-column stats-row">
                    <span>Send Money</span>

                    <a href="#">
                      <img src={SendMoney} alt="send-money" />
                    </a>
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
                  <img
                    src={stats3}
                    alt="stats"
                    className="dashboard-info-img"
                  />
                  <div className="d-flex flex-column stats-row">
                    <span>Transfers</span>
                    <h4>878</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4 custom-width" style={{ paddingleft: 0 }}>
                <div className="bg-white p-3 border-r stats-box">
                  <img
                    src={stats4}
                    alt="stats"
                    className="dashboard-info-img"
                  />
                  <div className="d-flex flex-column stats-row">
                    <span>Profile</span>
                    <a href="#">
                      <img src={Profile} alt="profile" />
                    </a>
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

export default Dashboard;
