import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log("is auth ", isAuthenticated)
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// import { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
// import { userProfile } from '../services/Api';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [verified, setVerified] = useState(false);
//   const [redirectTo, setRedirectTo] = useState(null);

//   useEffect(() => {
//     const fetchAndVerifyUser = async () => {
//       if (!isAuthenticated) {
//         setRedirectTo('/login');
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await userProfile();
//         if (res?.code === '200') {
//           const idStatus = res.data?.is_digital_Id_verified;
//           if (idStatus !== 'verified') {
//             setRedirectTo('/kyc');
//           } else {
//             setVerified(true);
//           }
//         } else {
//           setRedirectTo('/login');
//         }
//       } catch (error) {
//         console.error("Profile fetch error:", error);
//         setRedirectTo('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAndVerifyUser();
//   }, [isAuthenticated]);

//   if (loading) return null; // or loading spinner

//   if (redirectTo) return <Navigate to={redirectTo} replace />;

//   return verified ? <>{children}</> : null;
// };

// export default ProtectedRoute;
