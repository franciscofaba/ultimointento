import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Edituser from "./components/Edituser";
const Users = () => {
  return (
    <>
        
        <Navbar>

        <Edituser></Edituser>
        </Navbar>
        <Outlet />
    </>
  )
};

export default Users;