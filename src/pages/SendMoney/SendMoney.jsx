import AnimatedPage from "../../components/AnimatedPage";
import { Form, FloatingLabel, Col, InputGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { createTransaction, exchangeRate, getCurrencies } from "../../services/Api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { commaRemover } from "../../hooks/hook";
import { toast } from "react-toastify";

const SendMoney = () => {

  const amtSchema = Yup.object().shape({
    send_amt: Yup.string("Please enter a valid amount").notOneOf([".", ""]).test("value-test", (value, validationcontext) => {
      const {
        createError,
      } = validationcontext;
      if (Number(commaRemover(value)) < 100) {
        return createError({ message: "Minimum $100 required" })
      } else {
        return true
      }
    }).required(),
    exchange_amt: Yup.string("Please enter a valid amount").notOneOf([".", ""]).required(),
    from: Yup.string().required(),
    to: Yup.string().required(),
  })
  const [curr_in, setCurrIn] = useState([]);
  const [curr_out, setCurrOut] = useState([]);

  const initialValues = {
    send_amt: "",
    exchange_amt: "",
    from: "AUD",
    to: "NGN",
  }

  const [exch_rate, setExchRate] = useState();
  const [defaultExchange, setDefaultExchange] = useState()

  const { values, touched, handleChange, handleBlur, handleSubmit, errors } = useFormik({
    initialValues,
    validationSchema: amtSchema,
    onSubmit: async (values) => {
      let local = {}
      var transaction_id = sessionStorage.getItem("transaction_id") ? sessionStorage.getItem("transaction_id") : null
      const exch_data = await exchangeRate({ amount: values.send_amt, from: values.from, to: values.to, direction: "from" });
      let payload = {
        transaction_id: transaction_id,
        amount: {
          send_amount: commaRemover(values.send_amt),
          receive_amount: commaRemover(exch_data.amount),
          send_currency: values.from,
          receive_currency: values.to,
          receive_method: "Bank transfer",
          payout_partner: "",
          reason: "none",
          exchange_rate: exch_rate
        }
      }
      if (transaction_id === null || transaction_id === "undefined" || transaction_id === "") {
        delete payload["transaction_id"]
      }
      let amt = values.send_amt?.includes(".") ? values.send_amt : values.send_amt + ".00";
      const trans_res = await createTransaction(payload);
      if (trans_res.code === "200") {
        sessionStorage.setItem("transaction_id", trans_res?.data.transaction_id)
        if (sessionStorage.getItem("transfer_data")) {
          local = JSON.parse(sessionStorage.getItem("transfer_data"))
        }
        local.amount = { ...values, send_amt: commaRemover(amt), exchange_amt: commaRemover(exch_data.amount), exchange_rate: exch_rate, defaultExchange: defaultExchange }
        sessionStorage.setItem("transfer_data", JSON.stringify(local))
      } else if (trans_res.code === "400") {
        toast.error(res.message, { autoClose: 2000, position: "bottom-right", hideProgressBar: true });
      }
    }
  });

  useEffect(() => {
    exchangeRate({
      amount: "1",
      from: values.from,
      to: values.to,
      direction: "from"
    }).then(res => {
      if (res) {
        setExchRate(res?.rate)
        setDefaultExchange(res.default_exchange)
      }
    })
    getCurrencies().then((res) => {
      if (res?.code === "200") {
        setCurrOut(() => {
          return res?.data?.payout_currencies?.map((cr) => (
            cr.currency
          ));
        })
        setCurrIn(() => {
          return res?.data?.payin_currencies?.map((cr) => (
            cr.currency
          ));
        })
      }
    })
  }, [])


  const handleTypeChange = (e) => {
    const { value, name } = e.target;
    handleChange(e);
    handleConvertion(name, value, "from");
  }

  const handleConvertion = async (key, value, dir) => {
    let payload = {
      amount: commaRemover(values.send_amt) || "1",
      from: values.from,
      to: values.to,
      direction: dir
    }
    if (key == "send_amt" || key == "exchange_amt") {
      payload.amount = commaRemover(value)
    } else {
      payload[key] = value
    }
    const response = await exchangeRate(payload);
    if (response) {
      if (values.send_amt) {
        handleChange({ target: { name: "exchange_amt", value: response.amount } })
      }
      setDefaultExchange(response.default_exchange)
      setExchRate(response.rate)
    }
  }

  return (
    <AnimatedPage>
      <div className="page-title">
        <h1>Amount & Delivery </h1>
      </div>
      <div className="page-content-section mt-3">
        <div className="row">
          <div className="col-md-12">
            <div className="exchangerate p-4">
              <p>Exchange Rate</p>
              <h4>
                <b>1 {values.from} = {exch_rate} {values.to}</b>
              </h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Card className="receiver-card mt-4 bg-white p-5">
              <Card.Body>
                <Form className="profile-form" onSubmit={handleSubmit}>
                  <Row className="mb-4">
                    <FloatingLabel
                      controlId="floatingSelect"
                      as={Col}
                      label="Source"
                    >
                      <Form.Select aria-label="Floating label select example" name="from" value={values.from} onChange={handleTypeChange}>
                        {
                          curr_in.map(curr => (
                            <option key={curr} value={curr}>{curr}</option>
                          ))
                        }
                      </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingSelect"
                      as={Col}
                      label="Destination"
                    >
                      <Form.Select aria-label="Floating label select example" name="to" value={values.to} onChange={handleTypeChange}>
                        {
                          curr_out.map(curr => (
                            <option key={curr} value={curr}>{curr}</option>
                          ))
                        }
                      </Form.Select>
                    </FloatingLabel>
                  </Row>
                  <Row className="mb-3">
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Amount Send"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Amount Send" name="send_amt" value={values.send_amt} onChange={handleChange} onBlur={({ target }) => handleConvertion(target.name, target.value, "from")} />
                    </FloatingLabel>
                    <FloatingLabel
                      as={Col}
                      controlId="floatingInput"
                      label="Exchange Amount"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Exchange Amount" name="exchange_amt" value={values.exchange_amt} onChange={handleChange} onBlur={({ target }) => handleConvertion(target.name, target.value, "to")} />
                    </FloatingLabel>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Button variant="light" type="button" className="cancel-btn float-start">
                        Cancel
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="primary"
                        className="submit-btn float-end"
                        type="submit"
                      >
                        Continue
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
}

export default SendMoney;
