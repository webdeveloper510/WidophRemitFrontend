import AppRoutes from "./routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
// {
//     "code": "200",
//     "message": "Authorise agreement.",
//     "data": {
//         "payid": "au488502@mywidophremit.com",
//         "account_number": "123456987123",
//         "bsb_code": "122455",
//         "payid_type": "zai_id",
//         "status": "active"
//     }
// }