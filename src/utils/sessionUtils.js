export const clearSessionStorageData = () => {
  sessionStorage.removeItem("monova_transaction_id");
  sessionStorage.removeItem("monova_form_data");
  sessionStorage.removeItem("monova_payment_data");
  sessionStorage.removeItem("monova_payment_response");
  sessionStorage.removeItem("payload");
  sessionStorage.removeItem("selected_payment_method");
  sessionStorage.removeItem("selected_receiver");
  sessionStorage.removeItem("transaction_id");
  sessionStorage.removeItem("transfer_data");
  sessionStorage.removeItem("transfer_reason");
  sessionStorage.removeItem("final_transfer_reason");
  sessionStorage.removeItem("other_reason");
  sessionStorage.removeItem("pageIsReloading");
};