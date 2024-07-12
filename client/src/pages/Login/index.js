import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Top from "../../shared/top_login";
import login from "../../images/uai2.png";
import axios from "axios";


function Login() {
    const [t, i18n]= useTranslation("global");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook para redireccionar

    const handleSubmit = async () => {
        try {
            // Envía un POST para iniciar sesión y obtener datos del usuario
            const loginResponse = await axios.post('http://20.195.171.94:5000/api/login', {
                email: email,  // Asume que `email` y `password` son parte del estado o props
                password: password
            }, {
                withCredentials: true  // Envía las cookies y permite que las cookies sean recibidas
            });

            // Verifica si la autenticación fue exitosa antes de proceder
            if (loginResponse && loginResponse.data) {
                const userData = loginResponse.data;
                const { user, token } = userData;
                const { idUser_fk, email } = user;
                console.log('User ID:', idUser_fk);
                console.log('User Email:', email);
                console.log('Token:', token);

                // Guarda el token en localStorage para futuras solicitudes
                localStorage.setItem('token', token);

                // Configura axios para incluir el token en todas las solicitudes subsecuentes
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Realiza una solicitud GET para obtener información adicional, como el rol, usando el ID del usuario
                const roleResponse = await axios.get(`http://20.195.171.94:5000/api/user/${idUser_fk}`, {
                    withCredentials: true  // Asegúrate de que las cookies sean enviadas y recibidas
                });
                console.log('Este es el roleResponse:', roleResponse);

                // Aquí asumimos que `roleResponse.data.role` contiene el rol del usuario
                const userRole = roleResponse.data.role;
                console.log(userRole)
                if (userRole === 'Profesor' || userRole === 'profesor' || userRole === 'Professor' || userRole === 'professor') {
                    navigate('/Portal2_chatbot');  // Ajustado para no exponer ID en la URL
                } else {
                    navigate('/portal');  // Ajustado para no exponer ID en la URL
                }
            } else {
                // Manejo cuando la autenticación falla
                setError("Las credenciales proporcionadas son incorrectas o el usuario no existe.");
            }
        } catch (error) {
            console.error("Error al llamar a la API:", error);
            setError("Error en el proceso de autenticación");
        }
    };
    
    return (
        <>
            <Top />
            <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
                <Row className="w-100">
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <img src={login} alt="login" style={{ width: '50%' }} />
                    </Col>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <div className="w-75">
                            <h2 className="mb-4 text-center">{t("login.t1")}</h2>
                            <Form>
                                <FloatingLabel controlId="floatingInput" label={t("login.t2")} className="mb-3">
                                    <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingPassword" label={t("login.t3")} className="mb-3">
                                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </FloatingLabel>
                                <Button variant="success" onClick={handleSubmit} className="mb-3 w-100">
                                {t("login.t4")}
                                </Button>
                            </Form>
                            <p className="mb-1 text-center">{t("login.t5")}</p>
                            <p className="mb-0 text-center">
                            {t("login.t6")} <Link to="/signup">{t("login.t7")}</Link>
                            </p>
                            {error && <p className="text-danger">{error}</p>}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;