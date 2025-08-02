import TopNavbar from "./TopNavbar";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";

const LoginLayout = () => {
  return (
    <div className="d-flex flex-column">
      <TopNavbar />
      <Container className="flex-grow-1 d-flex align-items-center justify-content-between mt-5 mb-5">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default LoginLayout;
