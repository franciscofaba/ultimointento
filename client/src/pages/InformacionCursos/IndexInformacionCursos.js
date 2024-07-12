import React, { useEffect, useState } from "react";
import axios from "axios";

import { Container, Form, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Pagina from "../prueba";
import Cookies from 'js-cookie';

function InformacionCursos() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [t, i18n] = useTranslation("global");
    const [idUser, setIduser] = useState();
    const [table, setTable] = useState([]);
    const [informacion, setInformacion] = useState([]);
    const [error, setError] = useState(null);
    const [grado, setGrado] = useState([]);
    const [selectedgrade, setSelectedGrado] = useState(null);

    useEffect(() => {
        const idUser_fk = Cookies.get('userId');
        setIduser(idUser_fk);

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/User/${idUser_fk}`);
                console.log("User Data:", response.data);
                setUserData(response.data);
            } catch (error) {
                console.error("Error al llamar a la API de usuario:", error);
                setError("Error al obtener datos del usuario");
            }
        };

        fetchData();

        const fetchTable = async () => {
            try {
                const answer = await axios.get(`http://localhost:5000/api/CourseInProgress/${idUser_fk}`);
                console.log("Course Table Data:", answer.data);
                setTable(answer.data);

                const idCareer_fk_values = [...new Set(answer.data.map(course => course.idCareer_fk))];
                const firstIdCareer = idCareer_fk_values[0];
                console.log("First idCareer_fk Value:", firstIdCareer);

                if (firstIdCareer) {
                    const gradocarreraResponse = await axios.get(`http://localhost:5000/api/informaciongrados/${firstIdCareer}`);
                    console.log("Grado Data:", gradocarreraResponse.data);
                    setGrado(gradocarreraResponse.data);
                    setSelectedGrado(firstIdCareer);
                    fetchInformacion(idUser_fk);
                }
            } catch (error) {
                console.error("Error al llamar a la API de CourseInProgress:", error);
                setError(t("informacioncursos.t2"));
            }
        };

        fetchTable();
    }, []);

    const fetchInformacion = async (idUser_fk) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/informacioncursos/${idUser_fk}`);
            console.log("Informacion Cursos Data:", response.data);
            setInformacion(response.data);
            setError(null);
        } catch (error) {
            console.error("Error al llamar a la API de informacioncursos:", error);
            setInformacion([]);
            setError("Error al obtener información del curso");
        }
    };

    const handleGradoChange = (e) => {
        const selectedgrade = e.target.value;
        setSelectedGrado(selectedgrade);

        if (selectedgrade) {
            fetchInformacion(idUser);
        } else {
            setInformacion([]);
            setError("Grado no encontrado");
        }
    };

    const logout = () => {
        navigate(`/`);
    };

    const gotoAttendance = () => {
        const idUser_fk = window.location.pathname.split("/")[2];
        navigate(`/Justifications/${idUser_fk}`);
    };

    return (
        <>
            <Pagina>
                <Card style={{padding:'10px'}} className="d-flex flex-column ">
                    <Row className="my-4">
                        <Col>
                            <h3 className="text-center">{t("informacioncursos.t1")}</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Select aria-label="Seleccionar grado" onChange={handleGradoChange} value={selectedgrade}>
                                {grado.map(g => (
                                    <option key={g.idCareer} value={g.idCareer}>
                                        {g.degreeType}-{g.careerName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="my-4">
                        {informacion.length > 0 ? (
                            informacion.map((info, index) => {
                                const course = table.find(course => course.idCourseInProgress === info.idCourseInProgress_fk);
                                console.log("Matching Course:", course);
                                const courseName = course ? course.courseName : "Información del Grado";
                                return (
                                    <Col md={12} key={index}>
                                        <Card className="mb-">
                                            <Card.Body>
                                                <Card.Title style={{ color: 'black' }}>{courseName}</Card.Title>
                                                <Card.Text><strong>Horario:</strong> {info.horario}</Card.Text>
                                                <Card.Text><strong>Fecha:</strong> {info.fecha}</Card.Text>
                                                <Card.Text><strong>Ubicación:</strong> {info.ubicacion}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })
                        ) : (
                            <Col>
                                <Alert variant="info">{t("informacioncursos.t3")}</Alert>
                            </Col>
                        )}
                    </Row>
                    <Row className="my-4">
                        <Col className="text-center">
                            <Button variant="secondary" className="ms-2" onClick={logout}>{t("informacioncursos.t5")}</Button>
                        </Col>
                    </Row>
                </Card >
            </Pagina>
        </>
    );
}

export default InformacionCursos;
