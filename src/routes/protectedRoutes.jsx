
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { userProfile } from '../services/Api';
import loaderlogo from "../assets/images/logo.png"


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const location = useLocation();
  const pathname = location.pathname;


  useEffect(() => {
    const fetchAndVerifyUser = async () => {
      if (!isAuthenticated) {
        setRedirectTo('/login');
        setLoading(false);
        return;
      }

      try {
        const res = await userProfile();

        if (res?.code === '200') {
          const idStatus = res.data?.is_digital_Id_verified;
          if (idStatus !== 'approved') {
            setRedirectTo('/dashboard');
          } else {
            sessionStorage.setItem("User data", JSON.stringify(res?.data));
            setVerified(true);
          }
        } else {
          setRedirectTo('/login');
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setRedirectTo('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAndVerifyUser();
  }, [isAuthenticated]);

  if (loading)
    return (
      <div className="loader-wrapper">
        <img src={loaderlogo} alt="Logo" className="loader-logo" />
        <div className="spinner"></div>
      </div>
    );


  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return verified ? <>{children}</> : null;
};

export default ProtectedRoute;
