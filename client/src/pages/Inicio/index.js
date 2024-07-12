import React, { useEffect, useState } from "react";
import axios from "axios";
import {  Card } from 'react-bootstrap';
import Landingcard from "../../shared/Landingcard";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Pagina2 from "../prueba2";
import Chatbot from "../../shared/Chatbot";
import {Header,  Icon, IconGroup} from 'semantic-ui-react'

function IndexPortal() {
    const [t, i18n]= useTranslation("global");
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate(); 
    const [idUser, setIduser] = useState(null);
    
    useEffect(() => {
        const idUser_fk = window.location.pathname.split("/")[2];
        setIduser(idUser_fk);
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/User/${idUser_fk}`);
                setUserData(response.data);
            } catch (error) {
                console.error("Error al llamar a la API:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>

        <Pagina2 >
            <br></br>
            <Landingcard></Landingcard>
            <br></br>
            <Header as='h6' content='' >
            <IconGroup size='large'>
                <Icon name='comment alternate outline' />
            
                Prueba nuestro chatbot más reciente.
            </IconGroup>
            </Header>
            <Chatbot></Chatbot>
        </Pagina2>


      
        </>
    );
}

export default IndexPortal;