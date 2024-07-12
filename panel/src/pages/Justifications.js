import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import JustifTable from "./components/JustifTable";
const Justifications = () => {
  
  return (
    <>
      <Navbar>
        <JustifTable></JustifTable>
      </Navbar>
      <Outlet />
    </>
  )
};

export default Justifications;