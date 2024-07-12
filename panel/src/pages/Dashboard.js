import { Outlet, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Card } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const Dashboard = () => {

  const [t, i18n]= useTranslation("global");

  return (
    <>
      <Navbar>

      <Card.Text>
      {t('inicio.t2')}
            </Card.Text>

      </Navbar>

      <Outlet />
    </>
  )
};

export default Dashboard;