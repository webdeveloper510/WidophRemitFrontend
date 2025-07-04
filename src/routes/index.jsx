import React from "react";
import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./protectedRoutes";
import PublicRoute from "./publicRoutes";
import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import SendMoney from "../pages/SendMoney/SendMoney";
import PaymentInfo from "../pages/PaymentInfo/PaymentInfo";
import TransfersList from "../pages/Transfers/TransfersList";
import TransferDetails from "../pages/Dashboard/TransferDetails";
import ProfileInformation from "../pages/Dashboard/ProfileInformation";
import ReceiverList from "../pages/SendMoney/ReceiverList";
import ReceiverDetail from "../pages/SendMoney/ReceiverDetail";
import ReviewTransfer from "../pages/SendMoney/ReviewTransfer";
import PaymentDetail from "../pages/SendMoney/PaymentDetail";
import ConfirmTransfer from "../pages/SendMoney/ConfirmTransfer";
import PaymentProcessed from "../pages/SendMoney/PaymentProcessed";
import Receivers from "../pages/Receivers/Receivers";
import AddReceiver from "../pages/Receivers/AddReceiver";
import MonoovaPaymentGateway from "../pages/PaymentGateway/MonoovaPaymentGateway";
import LoginLayout from "../components/LoginSignup/LoginLayout";
import Login from "../components/LoginSignup/Login";
import SignUp from "../components/LoginSignup/Signup";
import KYCForm from "../components/KYC/KYCForm";
import OtpVerification from "../components/LoginSignup/OTP";
import TransactionSuccess from "../pages/SendMoney/TranscationSuccess";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route
        element={
          <PublicRoute>
            <LoginLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/kyc" element={<KYCForm />} />
        <Route path="/transaction-success" element={<TransactionSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="send-money" element={<SendMoney />} />
        <Route path="payment-info" element={<PaymentInfo />} />
        <Route path="transfers-list" element={<TransfersList />} />
        <Route path="receivers" element={<Receivers />} />
        <Route path="transfer-details" element={<TransferDetails />} />
        <Route path="profile-information" element={<ProfileInformation />} />
        <Route path="/receivers-list" element={<ReceiverList />} />
        <Route path="receiver-add" element={<ReceiverDetail />} />
        <Route path="review-transfer" element={<ReviewTransfer />} />
        <Route path="payment-detail" element={<PaymentDetail />} />
        <Route path="confirm-transfer" element={<ConfirmTransfer />} />
        <Route path="payment-processed" element={<PaymentProcessed />} />
        <Route path="/add-receiver" element={<AddReceiver />} />
        <Route path="monoova" element={<MonoovaPaymentGateway />} />
        {/* Redirect / to /dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
