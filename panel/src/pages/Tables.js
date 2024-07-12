import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Tablesdisplay from "./components/Tabledisplay";
import { useTranslation } from 'react-i18next';

const Tables = () => {
  const [t, i18n]= useTranslation("global");

  return (
    <>
      <Navbar>

        <Tablesdisplay></Tablesdisplay>
      </Navbar>
      <Outlet />
    </>
  )
};

export default Tables;