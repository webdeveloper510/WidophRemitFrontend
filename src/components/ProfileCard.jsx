import { Link } from "react-router-dom";
import stats4 from "../assets/images/info4.png";
import Profile from "../assets/images/profile.png";



const ProfileCard = () => {
    return (
        <div className="col-md-4 custom-width" style={{ paddingLeft: 0 }}>
            <div className="bg-white p-3 border-r stats-box">
                <img src={stats4} alt="stats" className="dashboard-info-img" />
                <div className="d-flex flex-column stats-row">
                    <span>Profile</span>
                    <Link to="/profile-information">
                        <img src={Profile} alt="profile" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard