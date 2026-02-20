import AnimatedPage from "../../components/AnimatedPage";
import { Form, FloatingLabel, Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { commaRemover } from "../../hooks/hook";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  createTransaction,
  exchangeRate,
  getCurrencies,
} from "../../services/Api";
import { useLocation } from "react-router-dom";
import { clearSessionStorageData } from "../../utils/sessionUtils";
import Loader from "../../components/Loader";

const SendMoney = () => {
  useEffect(() => {
    clearSessionStorageData();
    const webData = sessionStorage.getItem("web_exchange_data");
    const tempData = sessionStorage.getItem("temp_exchange_data");
    if (!webData && !(tempData && location.state?.backFromReceivers === true)) {
      sessionStorage.removeItem("temp_exchange_data");
    }
  }, []);

  const location = useLocation();

  const isBackFromReceivers = location.state?.backFromReceivers === true;
  const navigate = useNavigate();
  const [curr_in, setCurrIn] = useState([]);
  const [curr_out, setCurrOut] = useState([]);
  const [exch_rate, setExchRate] = useState();
  const [fees, setfees] = useState(0.0);
  const [TotalAmount, setTotalAmount] = useState(0.0);
  const [defaultExchange, setDefaultExchange] = useState();
  const [isConverting, setIsConverting] = useState(false);
  const [loading, setLoading] = useState(true);

  const amtSchema = Yup.object().shape({
    send_amt: Yup.string()
      .required("Send amount is required")
      .test("min-amount", "Amount must be between $100 and $15000", (value) => {
        if (!value) return false;
        const amount = Number(commaRemover(value));
        // return amount >= 100 && amount <= 15000;
        return amount <= 15000;
      }),
    exchange_amt: Yup.string().required("Exchange amount is required"),
    from: Yup.string().required("Source currency is required"),
    to: Yup.string().required("Destination currency is required"),
    receive_method: Yup.string().required("Please select a receive method"),
  });

  const updateTempExchangeData = (updatedValues) => {
    sessionStorage.setItem(
      "temp_exchange_data",
      JSON.stringify({
        exchange_rate: exch_rate || "",
        send_amount: commaRemover(updatedValues.send_amt || ""),
        send_currency: updatedValues.from || "AUD",
        receive_amount: commaRemover(updatedValues.exchange_amt || ""),
        receive_currency: updatedValues.to || "NGN",
        method: updatedValues.receive_method || "Bank transfer",
        fees: updatedValues.fees ?? 0,
        TotalAmount: updatedValues.TotalAmount ?? 0,
      }),
    );
  };

  const initialValues = {
    send_amt: "",
    exchange_amt: "",
    from: "AUD",
    to: "NGN",
    receive_method: "Bank transfer",
  };

  const {
    values,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: amtSchema,
    onSubmit: async (values) => {
      if (values.receive_method === "Mobile wallet") {
        toast.warning("Mobile Wallet is not available", {
          autoClose: 3000,
          position: "bottom-right",
        });
        return;
      }
      let local = {};
      let transaction_id = sessionStorage.getItem("transaction_id") || null;
      const exch_data = await exchangeRate({
        amount: values.send_amt,
        from: values.from,
        to: values.to,
        direction: "from",
      });

      setfees(exch_data.incoming_fixed);
      setTotalAmount(exch_data.final_incoming);

      let payload = {
        amount: {
          send_amount: commaRemover(values.send_amt),
          receive_amount: commaRemover(exch_data.amount),
          send_currency: values.from,
          receive_currency: values.to,
          receive_method: values.receive_method,
          payout_partner: "",
          reason: "none",
          exchange_rate: exch_rate,
          fee_total_amount: TotalAmount,
          fee_amount: fees,
        },
      };

      if (!transaction_id) delete payload["transaction_id"];

      let amt = values.send_amt.includes(".")
        ? values.send_amt
        : values.send_amt + ".00";

      const trans_res = await createTransaction(payload);
      sessionStorage.setItem("payload", JSON.stringify(payload));

      if (trans_res.code === "200") {
        sessionStorage.setItem(
          "transaction_id",
          trans_res?.data.transaction_id,
        );

        if (sessionStorage.getItem("transfer_data")) {
          local = JSON.parse(sessionStorage.getItem("transfer_data"));
        }

        local.amount = {
          ...values,
          send_amt: commaRemover(amt),
          exchange_amt: commaRemover(exch_data.amount),
          exchange_rate: exch_rate,
          defaultExchange: defaultExchange,
          TotalAmount: exch_data.final_incoming,
          fees: exch_data.incoming_fixed,
        };

        let tempData = JSON.parse(sessionStorage.getItem("temp_exchange_data"));
        tempData = {
          ...tempData,
          fees,
          TotalAmount,
        };
        sessionStorage.removeItem("temp_exchange_data");
        sessionStorage.setItem("temp_exchange_data", JSON.stringify(tempData));
        sessionStorage.setItem("transfer_data", JSON.stringify(local));

        navigate("/receivers-list", {
          state: {
            from: "send-money",
          },
        });
      } else if (trans_res.code === "400") {
        toast.error(trans_res.message, {
          autoClose: 2000,
          position: "bottom-right",
          hideProgressBar: true,
        });
      }
    },
  });
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const getExchangeRate = useCallback(
    async (from, to, amount = "1") => {
      if (isConverting) return;

      setIsConverting(true);
      try {
        const response = await exchangeRate({
          amount: amount,
          from: from,
          to: to,
          direction: "from",
        });
        if (response) {
          setExchRate(response?.rate);
          setDefaultExchange(response.default_exchange);
          return response;
        }
      } catch (error) {
        console.error("Exchange rate error:", error);
      } finally {
        setIsConverting(false);
      }
    },
    [isConverting],
  );

  const debouncedConversion = useCallback(
    debounce(async (key, value, dir) => {
      if (!value || value === "0") return;

      const cleanValue = commaRemover(value) || "1";

      let payload = {
        amount: cleanValue,
        from: values.from,
        to: values.to,
        direction: dir,
      };

      if (key === "from" || key === "to") {
        payload[key] = value;
        payload.amount = commaRemover(values.send_amt) || "1";
      }

      setIsConverting(true);
      try {
        const response = await exchangeRate(payload);
        setfees(response.incoming_fixed);
        setTotalAmount(response.final_incoming);
        if (response) {
          if (dir === "from") {
            setFieldValue("exchange_amt", response.amount);
          } else if (dir === "to") {
            setFieldValue("send_amt", response.amount);
          }
          setDefaultExchange(response.default_exchange);
          setExchRate(response.rate);
        }
      } catch (error) {
        console.error("Conversion error:", error);
      } finally {
        setIsConverting(false);
      }
    }, 500),
    [values.from, values.to, isConverting, setFieldValue],
  );

  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType("navigation");
    const isReload =
      (navigationEntries.length && navigationEntries[0].type === "reload") ||
      (performance &&
        performance.navigation &&
        performance.navigation.type === 1);

    if (isReload && location.state?.backFromReceivers) {
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, backFromReceivers: false },
      });
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const currencyRes = await getCurrencies();
        if (currencyRes?.code === "200") {
          setCurrOut(
            currencyRes?.data?.payout_currencies?.map((cr) => ({
              currency: cr.currency,
              country: cr.country,
            })),
          );
          setCurrIn(
            currencyRes?.data?.payin_currencies?.map((cr) => ({
              currency: cr.currency,
              country: cr.country,
            })),
          );
        }

        const webData = sessionStorage.getItem("web_exchange_data");
        const tempData = sessionStorage.getItem("temp_exchange_data");

        if (webData) {
          sessionStorage.removeItem("web_exchange_data");
          sessionStorage.removeItem("from_root");
          const parsedData = JSON.parse(webData);
          if (
            parsedData.send_amount &&
            parsedData.receive_amount &&
            parsedData.send_currency &&
            parsedData.receive_currency
          ) {
            setFieldValue("send_amt", parsedData.send_amount || "");
            setFieldValue("exchange_amt", parsedData.receive_amount || "");
            setFieldValue("from", parsedData.send_currency || "AUD");
            setFieldValue("to", parsedData.receive_currency || "NGN");
            setFieldValue(
              "receive_method",
              parsedData.method || "Bank transfer",
            );
            setfees(parsedData.fees);
            setTotalAmount(parsedData.TotalAmount);

            if (parsedData.exchange_rate) {
              setExchRate(parsedData.exchange_rate);
            } else {
              await getExchangeRate(
                parsedData.send_currency,
                parsedData.receive_currency,
              );
            }
            updateTempExchangeData(parsedData);
          } else {
            await getExchangeRate(initialValues.from, initialValues.to);
          }
        } else if (tempData && isBackFromReceivers) {
          const parsedData = JSON.parse(tempData);
          setFieldValue("send_amt", parsedData.send_amount || "");
          setFieldValue("exchange_amt", parsedData.receive_amount || "");
          setFieldValue("from", parsedData.send_currency || "AUD");
          setFieldValue("to", parsedData.receive_currency || "NGN");
          setFieldValue("receive_method", parsedData.method || "Bank transfer");
          setTotalAmount(parsedData.TotalAmount);
          setfees(parsedData.fees);
          await getExchangeRate(
            parsedData.send_currency,
            parsedData.receive_currency,
          );
        } else {
          await getExchangeRate(initialValues.from, initialValues.to);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [setFieldValue]);

  const handleTypeChange = (e) => {
    const { name, value } = e.target;

    // 1️⃣ Update form field (from / to)
    handleChange(e);

    // 2️⃣ CLEAR ALL AMOUNT RELATED STATES
    setFieldValue("send_amt", "");
    setFieldValue("exchange_amt", "");
    setfees(0);
    setTotalAmount(0);
    setExchRate(null);

    // 3️⃣ CLEAR SESSION DATA FOR AMOUNTS
    const cleared = {
      ...values,
      [name]: value,
      send_amt: "",
      exchange_amt: "",
      fees: 0,
      TotalAmount: 0,
    };

    updateTempExchangeData(cleared);

    // 4️⃣ Trigger fresh rate for new pair
    debouncedConversion(name, value, "from");
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    const regex = /^\d*\.?\d{0,2}$/;

    if (value === "" || regex.test(value)) {
      setFieldValue(name, value);

      if (name === "send_amt" && value === "") {
        setFieldValue("exchange_amt", "");
        updateTempExchangeData({
          ...values,
          send_amt: "",
          exchange_amt: "",
        });
        return;
      }

      const updated = { ...values, [name]: value };

      updateTempExchangeData(updated);

      if (name === "send_amt") {
        debouncedConversion(name, value, "from");
      }
    }
  };

  const handleAmountBlur = (e) => {
    const { name, value } = e.target;
    if (value && !isConverting) {
      if (name === "send_amt") {
        debouncedConversion(name, value, "from");
      } else if (name === "exchange_amt") {
        if (!value) {
          setFieldValue("exchange_amt", "");
          setFieldValue("send_amt", "");
        } else {
          debouncedConversion(name, value, "to");
        }
      }
    }

    const updated = { ...values, [name]: value };
    updateTempExchangeData(updated);
  };

  if (loading) return <Loader />;

  return (
    <AnimatedPage>
      <div className="page-title">
        <h1>Amount & Delivery</h1>
      </div>
      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <div className="exchangerate p-4">
              <p>Exchange Rate</p>
              <h4>
                <b>
                  1 {values.from} = {exch_rate || "Loading..."} {values.to}
                </b>
              </h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-4 bg-white p-5">
              <Card.Body>
                <Form
                  className="profile-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <Row className="mb-4">
                    <FloatingLabel
                      as={Col}
                      controlId="from"
                      label="Source"
                      className="mb-3"
                    >
                      <Form.Select
                        name="from"
                        value={values.from}
                        onChange={handleTypeChange}
                        //disabled={isConverting}
                      >
                        {curr_in.map((curr) => (
                          <option key={curr.currency} value={curr.currency}>
                            {curr.country} ({curr.currency})
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="to"
                      label="Destination"
                      className="mb-3"
                    >
                      <Form.Select
                        name="to"
                        value={values.to}
                        onChange={handleTypeChange}
                        //disabled={isConverting}
                      >
                        {curr_out.map((curr) => (
                          <option key={curr.currency} value={curr.currency}>
                            {curr.country} ({curr.currency})
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="send_amt"
                      label="Amount Send"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="send_amt"
                        value={values.send_amt}
                        onChange={(e) => {
                          if (e.target.value[0] == 0) return;
                          if (e.target.value <= 15000) handleAmountChange(e);
                        }}
                        onBlur={handleAmountBlur}
                        //disabled={isConverting}
                        isInvalid={touched.send_amt && !!errors.send_amt}
                        autoComplete="off"
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.send_amt}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      as={Col}
                      controlId="exchange_amt"
                      label="Exchange Amount"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="exchange_amt"
                        value={values.send_amt && values.exchange_amt}
                        readOnly
                        isInvalid={
                          touched.exchange_amt && !!errors.exchange_amt
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.exchange_amt}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={6} className="ms-auto">
                      <ul className="total-payment">
                        <li>
                          Fee
                          <label>
                            <b className="">
                              {values.send_amt ? fees : "0.00"} {values.from}
                            </b>
                          </label>
                        </li>
                        <li>
                          Total to pay
                          <label>
                            <b className="">
                              {values.send_amt ? TotalAmount : "0.00"}{" "}
                              {values.from}
                            </b>
                          </label>
                        </li>
                      </ul>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Button
                        variant="light"
                        type="button"
                        className="cancel-btn float-start"
                        onClick={() => navigate("/dashboard")}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="primary"
                        className="submit-btn float-end"
                        type="submit"
                        disabled={isConverting}
                      >
                        {isConverting ? "Loading..." : "Continue"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SendMoney;
