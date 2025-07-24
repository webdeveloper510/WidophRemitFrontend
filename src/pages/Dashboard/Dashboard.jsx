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
  userProfile,
} from "../../services/Api";
import SendMoney from "../../assets/images/send-money.png";
import Profile from "../../assets/images/profile.png";
import loaderlogo from "../../assets/images/logo.png";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/Navbar";
import { AnimatePresence } from "framer-motion";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { accessProvider } from "../../utils/accessProvider";

const Dashboard = () => {
  const [receiversCount, setReceiversCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [firstName, setFirstName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [Message, setMessage] = useState("");
  const navigate = useNavigate();
  const [profileCompleted, setprofileCompleted] = useState(false);
  const [kycStatus, setkycStatus] = useState("pending");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [recipientsResponse, transactionsResponse, userResponse] = await Promise.all([
          recipientList(),
          transactionHistory(),
          userProfile(),
        ]);

        // Recipients Count
        if (recipientsResponse.code === "200") {
          setReceiversCount(recipientsResponse?.data?.length || 0);
        }

        // Transactions Count
        if (transactionsResponse.code === "200") {
          setTransactionsCount(transactionsResponse?.data?.data?.length || 0);
        }
       

        if (userResponse?.code === "200") {
          setFirstName(userResponse.data.First_name || "User");

          const {
            is_digital_Id_verified,
            veriff_status,
          } = userResponse.data;

          const currentKycStatus = accessProvider(is_digital_Id_verified, veriff_status);
          setkycStatus(currentKycStatus);

          if (currentKycStatus === "pending") {
            setMessage("Please complete your KYC before proceeding ahead");
          } else if (currentKycStatus === "submitted") {
            setMessage("Your KYC has been submitted, please wait for approval .");
          } else if (currentKycStatus === "declined") {
            setMessage("Your KYC was declined. Please resubmit.");
          } else if (currentKycStatus === "suspended") {
            setMessage(`Your KYC has been ${currentKycStatus}, please contact admin for information.`);
          }
        } else {
          sessionStorage.clear();
          navigate("/login");
        }


      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
    <>
      <div className="p-3 d-flex flex-row customdashboardheight">
        <div className="d-flex w-100">
          <Sidebar collapsed={collapsed} />

          <div className="flex-grow-1 d-flex flex-column right-side-content">
            <TopNavbar onToggleSidebar={() => setCollapsed(!collapsed)} />
            <main className="flex-grow-1 p-3 mt-3">
              <AnimatePresence mode="wait">
                <AnimatedPage>
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
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div >
      <Footer />
    </>
  );
};

export default Dashboard;
