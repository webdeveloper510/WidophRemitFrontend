import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import PaymentInfo from "./pages/PaymentInfo";
import Transfers from "./pages/Transfers";
import Receivers from "./pages/Receivers";
import TransferDetails from "./pages/TransferDetails";
import ProfileInformation from "./pages/ProfileInformation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="send-money" element={<SendMoney />} />
        <Route path="payment-info" element={<PaymentInfo />} />
        <Route path="transfers" element={<Transfers />} />
        <Route path="receivers" element={<Receivers />} />
        <Route path="transfer-details" element={<TransferDetails />} />
        <Route path="profile-information" element={<ProfileInformation />} />

        {/* Redirect / to /dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
