export const accessProvider = (onboard = "pending", veriff = "not started") => {
  if (onboard === "pending") {
    if (
      veriff === "not started" ||
      veriff === "started" ||
      veriff === "abandoned" ||
      veriff === "resubmission_requested" ||
      veriff === "expired" ||
      veriff === "pending"
    ) {
      return "pending";
    } else {
      return "submitted";
    }
  } else if (onboard === "declined") {
    return "declined";
  } else if (onboard === "approved") {
    return "approved";
  } else if (onboard === "suspended") {
    return "suspended";
  } else {
    return "pending";
  }
};
