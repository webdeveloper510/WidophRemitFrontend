import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { recipientList, transactionHistory, userProfile } from "../services/Api";
import { accessProvider } from "../utils/accessProvider";

export const useDashboardData = () => {
  const [receiversCount, setReceiversCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [firstName, setFirstName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [kycStatus, setKycStatus] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [recipientsResponse, transactionsResponse, userResponse] = await Promise.all([
          recipientList(),
          transactionHistory(),
          userProfile(),
        ]);

        if (recipientsResponse.code === "200") {
          setReceiversCount(recipientsResponse?.data?.length || 0);
        }

        if (transactionsResponse.code === "200") {
          setTransactionsCount(transactionsResponse?.data?.data?.length || 0);
        }

        if (userResponse?.code === "200") {
          setFirstName(userResponse.data.First_name || "User");

          const { is_digital_Id_verified, veriff_status } = userResponse.data;
          const currentKycStatus = accessProvider(is_digital_Id_verified, veriff_status);
          setKycStatus(currentKycStatus);

          if (currentKycStatus === "pending") {
            setMessage("Please complete your KYC before proceeding ahead");
          } else if (currentKycStatus === "submitted") {
            setMessage("Your KYC has been submitted, please wait for approval.");
          } else if (currentKycStatus === "declined") {
            setMessage("Your KYC was declined. Please resubmit.");
          } else if (currentKycStatus === "suspended") {
            sessionStorage.clear();
            navigate("/login");
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
  }, [navigate]);

  return {
    receiversCount,
    transactionsCount,
    firstName,
    loading,
    message,
    kycStatus,
  };
};
