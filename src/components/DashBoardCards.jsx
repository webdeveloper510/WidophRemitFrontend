import ProfileCard from "./ProfileCard"
import ReceiverCount from "./ReceiverCount"
import SendMoneyCard from "./SendMoneyCard"
import TransactionsCount from "./TransactionsCount"

const DashBoardCards = ({ receiversCount, transactionsCount }) => {
    return (
        <div className="col-md-7 dash_main">
            <div className="dashbaord-bg-image p-4">
                <h2>Dashboard</h2>
                <div className="row mt-5 feilds_out">
                    <ReceiverCount receiversCount={receiversCount} />
                    <SendMoneyCard />
                </div>
                <div className="row feilds_out">
                    <TransactionsCount transactionsCount={transactionsCount} />
                    <ProfileCard />
                </div>
            </div>
        </div>
    )
}

export default DashBoardCards