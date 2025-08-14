import loaderlogo from "../assets/images/logo.png";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <img src={loaderlogo} alt="Logo" className="loader-logo" />
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
