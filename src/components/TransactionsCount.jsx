import stats3 from "../assets/images/info3.png";

const TransactionsCount = ({transactionsCount}) => {
    return (
        <div className="col-md-4 custom-width" style={{ paddingRight: 0 }}>
            <div className="bg-white p-3 border-r stats-box">
                <img src={stats3} alt="stats" className="dashboard-info-img" />
                <div className="d-flex flex-column stats-row">
                    <span>Transfers</span>
                    <h4>{transactionsCount}</h4>
                </div>
            </div>
        </div>
    )
}

export default TransactionsCount