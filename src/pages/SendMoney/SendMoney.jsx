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

const SendMoney = () => {
  const navigate = useNavigate();
  const [curr_in, setCurrIn] = useState([]);
  const [curr_out, setCurrOut] = useState([]);
  const [exch_rate, setExchRate] = useState();
  const [defaultExchange, setDefaultExchange] = useState();
  const [isConverting, setIsConverting] = useState(false);

  const amtSchema = Yup.object().shape({
    send_amt: Yup.string()
      .required("Send amount is required")
      .test("min-amount", "Minimum $100 required", (value) => {
        if (!value) return false;
        return Number(commaRemover(value)) >= 100;
      }),
    exchange_amt: Yup.string().required("Exchange amount is required"),
    from: Yup.string().required("Source currency is required"),
    to: Yup.string().required("Destination currency is required"),
    receive_method: Yup.string().required("Please select a receive method"),
  });

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

      let payload = {
        transaction_id: transaction_id,
        amount: {
          send_amount: commaRemover(values.send_amt),
          receive_amount: commaRemover(exch_data.amount),
          send_currency: values.from,
          receive_currency: values.to,
          receive_method: values.receive_method,
          payout_partner: "",
          reason: "none",
          exchange_rate: exch_rate,
        },
      };

      if (!transaction_id) delete payload["transaction_id"];

      let amt = values.send_amt.includes(".")
        ? values.send_amt
        : values.send_amt + ".00";

      const trans_res = await createTransaction(payload);

      if (trans_res.code === "200") {
        sessionStorage.setItem(
          "transaction_id",
          trans_res?.data.transaction_id
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
        };

        sessionStorage.setItem("transfer_data", JSON.stringify(local));

        navigate("/receivers-list");
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

  const getExchangeRate = useCallback(async (from, to, amount = "1") => {
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
  }, [isConverting]);


  const debouncedConversion = useCallback(
    debounce(async (key, value, dir) => {
      if (!value || value === "0" || isConverting) return;

      let payload = {
        amount: commaRemover(value) || "1",
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
        if (response) {
          if (dir === "from" && values.send_amt) {
            setFieldValue("exchange_amt", response.amount);
          } else if (dir === "to" && values.exchange_amt) {
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
    [
      values.from,
      values.to,
      values.send_amt,
      values.exchange_amt,
      setFieldValue,
      isConverting,
    ]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const currencyRes = await getCurrencies();
        if (currencyRes?.code === "200") {
          setCurrOut(
            currencyRes?.data?.payout_currencies?.map((cr) => cr.currency)
          );
          setCurrIn(
            currencyRes?.data?.payin_currencies?.map((cr) => cr.currency)
          );
        }
        await getExchangeRate(initialValues.from, initialValues.to);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  const handleTypeChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);


    if (name === "from" || name === "to") {
      debouncedConversion(name, value, "from");
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
  };

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
                        disabled={isConverting}
                      >
                        {curr_in.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
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
                        disabled={isConverting}
                      >
                        {curr_out.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
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
                        onChange={handleChange}
                        onBlur={handleAmountBlur}
                        disabled={isConverting}
                        isInvalid={touched.send_amt && !!errors.send_amt}
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
                        value={values.exchange_amt}
                        onChange={handleChange}
                        onBlur={handleAmountBlur}
                        disabled={isConverting}
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
                    <Col>
                      <Button
                        variant="light"
                        type="button"
                        className="cancel-btn float-start"
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
