import AnimatedPage from "../components/AnimatedPage";
import stats1 from "../assets/images/info1.png";
import stats2 from "../assets/images/info2.png";
import stats3 from "../assets/images/info3.png";
import stats4 from "../assets/images/info4.png";

const Dashboard = () => (
  <AnimatedPage>
    <div className="page-title">
      <h1>Welcome , Louie</h1>
    </div>

    <div className="page-content-section mt-3">
      <div className="row">
        <div className="col-md-7">
          <div className="dashbaord-bg-image p-3">
            <h2>
              Dashboard<br></br>
              <span>info</span>
            </h2>
            <div className="row mt-5">
              <div className="col-md-4 mb-2" style={{ paddingRight: 0 }}>
                <div className="d-flex bg-white p-3 border-r">
                  <img src={stats1} alt="stats" />
                  <div className="d-flex flex-column">
                    <span>Receivers</span>
                    <h4>878</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-2" style={{ paddingleft: 0 }}>
                <div className="d-flex bg-white p-3 border-r">
                  <img src={stats2} alt="stats" />
                  <div className="d-flex flex-column">
                    <span>Receivers</span>
                    <h4>878</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4" style={{ paddingRight: 0 }}>
                <div className="d-flex bg-white p-3 border-r">
                  <img src={stats3} alt="stats" />
                  <div className="d-flex flex-column">
                    <span>Receivers</span>
                    <h4>878</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4" style={{ paddingleft: 0 }}>
                <div className="d-flex bg-white p-3 border-r">
                  <img src={stats4} alt="stats" />
                  <div className="d-flex flex-column">
                    <span>Receivers</span>
                    <h4>878</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">dsf</div>
      </div>
    </div>
  </AnimatedPage>
);

export default Dashboard;
