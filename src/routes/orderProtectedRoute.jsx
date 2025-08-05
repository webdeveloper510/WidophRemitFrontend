import { Navigate } from "react-router-dom";

const TransactionProtectedRoute = ({ children }) => {
  const monovaTransactionId = sessionStorage.getItem("monova_transaction_id");
  const regularTransactionId = sessionStorage.getItem("transaction_id");
  const transferData = JSON.parse(sessionStorage.getItem("transfer_data") || "{}");
  
  const hasValidTransactionData = (monovaTransactionId || regularTransactionId) && 
                                  Object.keys(transferData).length > 0;
  
  if (!hasValidTransactionData) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default TransactionProtectedRoute;