import { Outlet, Link } from "react-router-dom";
import Login from "./components/Login";
const Layout = () => {
  return (
    <>
      <Login></Login>
      <Outlet />
    </>
  )
};

export default Layout;