import { Outlet } from "react-router-dom";
const Nopages = () => {
  return (
    <>
      <nav>
       <h1>Error:page not found</h1>
      </nav>

      <Outlet />
    </>
  )
};

export default Nopages;