import stats1 from "../assets/images/info1.png";


const ReceiverCount = ({ receiversCount }) => {
    return (
        <div className="col-md-4 mb-2 custom-width" style={{ paddingRight: 0 }}>
            <div className="bg-white p-3 border-r stats-box">
                <img src={stats1} alt="stats" className="dashboard-info-img" />
                <div className="d-flex flex-column stats-row">
                    <span>Receivers</span>
                    <h4>{receiversCount}</h4>
                </div>
            </div>
        </div>
    )
}

export default ReceiverCount