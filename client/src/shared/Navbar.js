import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar, Nav, NavDropdown,Card, Button , Row, Col} from 'react-bootstrap';
import Avatar from "react-avatar";
import Modal from "../shared/Modal";
import {useNavigate } from "react-router-dom";
import { useModal } from "../shared/useModal";
import { Icon } from 'semantic-ui-react'
import { useTranslation } from "react-i18next";
import styles from "../shared/styles_module.css";


function Navbar_shared() {
    const [userData, setUserData] = useState(null);
    const [isOpenModal,openModal,closeModal] = useModal(false);

    const navigate = useNavigate(); 
    const [t, i18n]= useTranslation("global");
    const [idUser, setIduser] = useState(null);


    useEffect(() => {
        // Obtener el idUser_fk de la URL
        const idUser_fk = window.location.pathname.split("/")[2]; // Obtén el tercer segmento de la URL
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

   
    const logout = () => {
        navigate(`/`);
      };


    return (
        <>
            <Navbar className="navbar-custom">
            <Navbar.Brand className="texto" href="#home" style={{ marginLeft: 30 }}>{t("nav.t2")}</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link className="texto" href={`/inicio/${idUser}`}>{t("nav.t3")}</Nav.Link>
                    <div className="me-auto" style={{ marginLeft: 30 }}>
                        <div onClick={openModal}>
                            {userData && userData.UserName ? (
                                <Avatar name={userData.UserName} round size={40} />
                            ) : (
                                <Avatar name="U" round size={40} />
                            )}
                        </div>
                    </div>
                    
                </Nav>
                <Button 
                    className="p-1 ms-auto" 
                    variant="light" 
                    style={{marginRight:"2rem", marginTop:"5px"}}
                    onClick={logout} 
                >
                    <Col>
                 
                            
                        <Icon fitted name='log out' />
                        <p>{t("nav.t5")}</p>
                        
                    </Col>
                </Button>
                    
                    
            </Navbar>
            <div>
                <Modal isOpen={isOpenModal} closeModal={closeModal}>
                    <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title className="modulo_portal">
                            {userData && userData.UserName ? (
                                <Avatar name={userData.UserName} round size={70}  />
                            ) : (
                                <Avatar name="U" round size={70}  />
                            )}
                        </Card.Title>
                        <Card.Text>
                            {userData ? (
                            <div>
                                <p>{t("modal.t1")} {userData.email}</p>
                                <p>{t("modal.t2")}  {userData.UserName}</p>
                            </div>
                                            
                            ) : (
                                <p>{t("modal.t3")} </p>
                            )}
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </Modal>
                                            
    </div>
        </>
    );
}

export default Navbar_shared;