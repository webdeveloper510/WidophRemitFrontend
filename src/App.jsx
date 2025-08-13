import AppRoutes from "./routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NetworkDetector from "./components/NetworkDetector";

function App() {
  return (
    <NetworkDetector>
      <AppRoutes />
      <ToastContainer />
    </NetworkDetector>
  );
}

export default App;

