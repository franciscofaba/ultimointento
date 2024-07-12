import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Alert, Row, Col, Spinner, Image } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import successImage from '../../images/check.png'; 

function Estado() {
    const [error, setError] = useState(null);
    const [encuestaRealizada, setEncuestaRealizada] = useState(false);
    const [loading, setLoading] = useState(true);
    const [t, i18n] = useTranslation("global");

    useEffect(() => {
        console.log("useEffect called");


        const updateEncuestaEstado = async () => {
            try {
                const idUser_fk = window.location.pathname.split("/")[2];
                const idCourseInProgress_fk = window.location.pathname.split("/")[3]; // Suponiendo que el ID del curso está en la URL
                const response = await axios.put(`http://127.0.0.1:5000/api/Encuesta/${idUser_fk}/${idCourseInProgress_fk}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    setEncuestaRealizada(true);
                } else {
                    alert('Error: No se pudo actualizar el estado de la encuesta.');
                }
            } catch (error) {
                console.error('Error actualizando la encuesta:', error);
                alert('Error: No se pudo actualizar el estado de la encuesta.');
            }
        };

        updateEncuestaEstado();
    }, []);

    const noBackgroundStyle = {
        background: 'none',
        backgroundColor: '#fff', 
        minHeight: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <div style={noBackgroundStyle}>
            <Container className="text-center">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        {loading ? (
                            <div>
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </div>
                        ) : (
                            <div>
                                <Image src={successImage} fluid className="mb-4" />
                                <h1>Encuesta realizada con éxito!</h1>
                                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Estado;