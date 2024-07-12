import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Landingcard from "../../shared/Landingcard";
import Pagina from "../prueba";

import {Header,  Icon, IconGroup} from 'semantic-ui-react'
import Chatbot from "../../shared/Chatbot";
function IndexPortal() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [idUser, setIduser] = useState(null);
  const [t, i18n] = useTranslation("global");
  useEffect(() => {
    // Obtener el idStudent_fk de la URL
    const idUser_fk = window.location.pathname.split("/")[2]; // Obtén el tercer segmento de la URL
    setIduser(idUser_fk);
    // Llamar a la API para obtener los datos del usuario
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/User/${idUser_fk}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error al llamar a la API:", error);
      }
    };

    fetchData();
  }, []);

  const gotoAttendance = async () => {
    navigate(`/Justifications/${idUser}`);
  };

  const logout = () => {
    navigate(`/`);
  };

  return (
    
    <div>
      <Pagina>

        <br></br>
        <Landingcard ></Landingcard>
        <br></br>
        <Header as='h6' content='' >
          <IconGroup size='large'>
            <Icon name='comment alternate outline' />
         
            {t("portal.t3")}
          </IconGroup>
        </Header>
        <Chatbot></Chatbot>

      </Pagina>
      
    </div>

  );
}

export default IndexPortal;
