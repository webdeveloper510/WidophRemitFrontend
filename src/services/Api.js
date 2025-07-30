import Axios from "axios";

const private_instance = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URI
});
const user_check = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URI
});
const public_instance = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URI
})

let isCheckingUser = false;
let userCheckPromise = null;

private_instance.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("token");
    const userDetails = sessionStorage.getItem("remi-user-dt");
    if (token && userDetails) {
      if (isCheckingUser) {
        await userCheckPromise;
      } else {
        isCheckingUser = true;
        userCheckPromise = user_check.get("/user-exist/", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }).then((response) => {
          const { data } = response
          if (data.code === "200" && !data.data.is_deleted && data.data.is_digital_Id_verified !== "suspended") {
            return true;
          } else {
            if (data.data.is_digital_Id_verified === "suspended" || data.data.is_deleted) {
              localStorage.setItem("is_suspended", true)
            }
            sessionStorage.clear();
            window.location.href = "/login";
            return false;
          }
        }).catch((error) => {
          // console.log(error)
          // return false
          if (!error.response.status === 503) {
            localStorage.setItem("inactive", "true");
            sessionStorage.clear()
          }
          window.location.href = "/login";
          return false;
        }).finally(() => {
          isCheckingUser = false;
          return false
        });
        const isUserValid = await userCheckPromise;
        if (!isUserValid) {
          return Promise.reject("User is not valid or logged in.");
        }
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
private_instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const res = error?.response;

    if (
      res?.status === 401 &&
      (res?.data?.code === "token_not_valid" ||
        res?.data?.detail?.includes("token not valid"))
    ) {
      console.warn("⛔ Token is invalid or expired. Logging out...");
      sessionStorage.clear();
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
export const userRegisterCheck = async (data) => {
  const response = await public_instance.post("/register-check/", data).then(res => {
    return res?.data
  }).catch(error => {
    return error.response
  })
  return response
}

export const userRegisterVerify = async (data) => {
  const response = await public_instance.post("/register-verify/", data).then(res => {
    return res?.data
  }).catch(error => {
    return error.response
  })
  return response
}

export const registerOtpResend = async (data) => {

  const response = await public_instance.post("/resend-register-otp/", data, {
    // headers: {
    //   "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    // }
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response
  })
  return response
}

export const userLogin = async (data) => {
  const response = await public_instance.post("/login/", data).then(res => {
    return res?.data
  }).catch(error => {
    return error.response
  })
  return response
}

export const createMonovaPayment = async (data) => {
  try {
    const response = await private_instance.post('/monoova/direct-debit/',
      data,
      {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return error?.response || { error: "Unknown error occurred" };
  }
};


export const createAutoMatcher = async (data) => {
  try {
    const response = await private_instance.post('/monoova/create-automatcher/',
      data,
      {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return error?.response || { error: "Unknown error occurred" };
  }
};


export const GetAutoMatcher = async () => {
  try {
    const response = await private_instance.get('/monoova/exist-automatcher/',
      {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return error?.response || { error: "Unknown error occurred" };
  }
};


export const verifyEmail = async (data) => {
  const response = await public_instance.post("/verify-email/", data)
    .then(res => {
      return res?.data
    }).catch(error => {
      return error.response
    })
  return response
}

export const resendOtp = async (data) => {

  const response = await public_instance.post("/resend-otp/", data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  })
    .then(res => {
      return res?.data
    }).catch(error => {
      return error.response
    })
  return response
}

export const changePassword = async (data) => {
  const response = await private_instance.post("/change-password/", data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  })
  return response
}

export const resetEmail = async (data) => {
  const response = await public_instance.post("/send-password-reset-email/", data).then(res => {
    return res
  }).catch(error => {
    return error.response
  })
  return response
}

export const sendEmail = async () => {
  const response = await private_instance.post("/send-signup-emails/", {}, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const resetPassword = async (data) => {
  const response = await public_instance.post("/reset-password/", data).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const updateProfile = async (data) => {
  const response = await private_instance.post("/update-profile/", data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const userProfile = async () => {
  try {
    const response = await private_instance.post(
      "/user-profile/",
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        }
      }
    );

    return response.data;

  } catch (error) {
    return error?.response?.data || { error: "Unknown error" };
  }
};

export const exchangeRate = async (data) => {
  const response = await public_instance.post("/exchange-rate/", data).then(res => {
    if (res?.data.code === "200") {
      return res?.data?.data
    } else {
      return res?.data
    }
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const paymentSummary = async (data) => {
  const response = await private_instance.post("/payment/summary/", { transaction_id: data }, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const transactionHistory = async (data) => {
  const response = await private_instance.post("/payment/transaction-history/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const completedPayment = async (data) => {
  const response = await private_instance.post("/payment/completed-transactions/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const createRecipient = async (data) => {
  const response = await private_instance.post("/payment/recipient-create/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const getCardData = async (id) => {
  const response = await private_instance.post(`/payment/card/${id}`, {}, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const updateCardUser = async (id, data) => {
  const response = await private_instance.patch(`/payment/card/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const getUserRecipient = async (id) => {
  const response = await private_instance.get(`/payment/recipient-update/${id}`, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const updateUserRecipient = async (id, data) => {
  const response = await private_instance.post(`/payment/recipient-update/${id}`, data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const deleteRecipient = async (id) => {
  const response = await private_instance.delete(`/payment/recipient-update/${id}`, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const cardList = async (data) => {
  const response = await private_instance.post("/payment/card-list/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const recipientList = async (data) => {
  const response = await private_instance.post("/payment/recipient-list/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const activEmail = async (data) => {
  const response = await public_instance.post(`/activate-email/`, { customer_id: data }).then(res => {
    return res?.data
  }).catch(error => {
    return "failed"
  })

  return response
}

export const userCharge = async (data) => {
  const response = await private_instance.post(`/payment/stripe/user-charge/`, data, {
    headers: {
      //'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(error => {
    return error.response.data
  })
  return response
}

export const ZaiPayId = async (data) => {
  const response = await private_instance.post(`/payment/zai-payid/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    // //console.log(res)
    return res?.data
  }).catch(err => {
    // //console.log(err)
    return err.response.data
  })
  return response
}

export const ZaiPayTo = async (data) => {
  const response = await private_instance.post(`/payment/zai-payto/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const ZaiDashPayTo = async (data) => {
  const response = await private_instance.post(`/payment/zai-payto-login/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const ZaiDashPayId = async (data) => {
  const response = await private_instance.post(`/payment/zai-payid-login/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const verifyPayId = async (data) => {
  const response = await private_instance.post(`/payment/zai-payid-check/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const verifyPayTo = async (data) => {
  const response = await private_instance.post(`/payment/zai-payto-check/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const createPayId = async (data) => {

  const response = await private_instance.post(`payment/zai-payid-register/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const createAgreement = async (data) => {
  const response = await private_instance.post(`payment/zai-create-agreement/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const getAgreementList = async (amount) => {
  const response = await private_instance.post(`payment/zai-agreement-list/`, { send_amount: amount }, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response

}

export const updateAgreement = async (data) => {
  const response = await private_instance.post(`payment/zai-update-agreement/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const getVeriffStatus = async (data) => {
  const response = await private_instance.post(`veriff/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const createTransaction = async (data) => {
  const response = await private_instance.post(`payment/create-transaction/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const pendingTransactions = async () => {
  const response = await private_instance.get(`payment/pending-transactions/`, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const getPreferredCurrency = async () => {
  const response = await private_instance.get(`destination-currency/`, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    //console.log(res)
    return res?.data
  }).catch(err => {
    //console.log(err)
    return err.response.data
  })
  return response
}

export const setPreferredCurrency = async (data) => {
  const response = await private_instance.post(`destination-currency/`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
    },
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const getPayID = async () => {
  const response = await private_instance.post("payment/zai-payid-details/", {}, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const getDiscountedPrice = async (data) => {
  const response = await private_instance.post("payment/get-discount/", { transaction_id: data }, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const getReferral = async () => {
  const response = await private_instance.post("/referral-link/", {}, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const getReferralAmount = async () => {
  let response = private_instance.get("/payment/referrals/").then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const checkExistence = async () => {
  let response = await private_instance.get("/user-exist/", {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const getCouponList = async (currency) => {
  const response = await private_instance.get(`/payment/referrals-list/${currency}/`, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const applyReferralCode = async (data) => {
  const response = await private_instance.post("/payment/apply-referral-code/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const hitNewsletter = async (data) => {
  const response = await public_instance.post("/payment/subscribe-newsletter/", data).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const checkExistingAccount = async (data) => {
  const response = await private_instance.post("/payment/account-number-validation/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const validatePayId = async (data) => {
  const response = await private_instance.post("/payment/validate-payid/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const updateAccountUsage = async (data) => {
  const response = await private_instance.post("/update-tier/", data, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const fetchAccountUsage = async () => {
  const response = await private_instance.post("/payment/transaction-usage-details/", {}, {
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res?.data
  }).catch(err => {
    return err.response.data
  })
  return response
}

export const fetchBlogs = async () => {
  const response = await public_instance.post(`/service/blogs/`, {}).then(res => {
    return res?.data
  }).catch(err => {
    err?.response?.data
  })
  return response
}

export const getCurrencies = async () => {
  const response = await public_instance.post(`/payment/currencies/`, {}).then(res => {
    return res?.data
  }).catch(err => {
    err?.response?.data
  })
  return response
}

export const getTestimonials = async () => {
  const response = await public_instance.post(`/service/testimonials/`, {}).then(res => {
    return res?.data
  }).catch(err => {
    err?.response?.data
  })
  return response
}

export const getCustomerTypes = async () => {
  const response = await public_instance.get(`/payment/customer-types/`).then(res => {
    return res?.data
  }).catch(err => {
    err?.response?.data
  })
  return response
}

