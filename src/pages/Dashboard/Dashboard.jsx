import AnimatedPage from "../../components/AnimatedPage";
import ReceiverTable from "./ReceiverTable";
import LatestTransfer from "./LatestTransfer";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/Navbar";
import { AnimatePresence } from "framer-motion";
import Footer from "../../components/Footer";
import DashBoardCards from "../../components/DashBoardCards";
import DashBoardMessage from "../../components/DashBoardMessage";
import { useDashboardData } from "../../hooks/useDashboardData";
import Loader from "../../components/Loader";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = sessionStorage.getItem("collapsed");
    return stored === "true";
  });

  const {
    receiversCount,
    transactionsCount,
    firstName,
    loading,
    message,
    kycStatus,
  } = useDashboardData();

  if (loading) return <Loader />;

  return (
    <>
      <div className="p-3 d-flex flex-row customdashboardheight">
        <div className="d-flex w-100">
          <Sidebar collapsed={collapsed} disabled={kycStatus !== "approved"} />
          <div className="flex-grow-1 d-flex flex-column right-side-content">
            <TopNavbar onToggleSidebar={() => setCollapsed(!collapsed)} />
            <main className="flex-grow-1 p-3 mt-3">
              <AnimatePresence mode="wait">
                <AnimatedPage>
                  <DashBoardMessage
                    Message={message}
                    firstName={firstName}
                    kycStatus={kycStatus}
                  />
                  <div className="page-content-section mt-3">
                    <div className="row">
                      <DashBoardCards
                        transactionsCount={transactionsCount}
                        receiversCount={receiversCount}
                      />
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
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
