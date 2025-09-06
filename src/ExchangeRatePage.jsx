import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ExchangeRatePage = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const navigate = useNavigate();

    const exchangeData = {
        exchange_rate: queryParams.get("exchange_rate"),
        send_amount: queryParams.get("send_amount"),
        send_currency: queryParams.get("send_currency"),
        receive_amount: queryParams.get("receive_amount"),
        receive_currency: queryParams.get("receive_currency"),
        method: queryParams.get("method"),
        fees: queryParams.get("fees"),
        TotalAmount: queryParams.get("total")
    };

    useEffect(() => {
        sessionStorage.setItem("web_exchange_data", JSON.stringify(exchangeData));
        navigate("/login");
    }, [search]);

    return (
        <></>
    );
};

export default ExchangeRatePage;
