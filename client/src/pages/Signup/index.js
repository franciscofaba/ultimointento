import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import Top from "../../shared/top_login";
import sign_up from "../../images/uai2.png";
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import { useTranslation } from "react-i18next";

function Signup() {
    const [t, i18n]= useTranslation("global");
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [career, setCareer] = useState('');

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleCareerChange = (event) => {
        setCareer(event.target.value);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        // Hash the password before sending it to the server
        const hashedPassword = await bcrypt.hash(password, 10);

        const requestData = {
            idCareer_fk: career,
            UserName: username,
            email: email,
            role: role,
            password: hashedPassword // Use the hashed password
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/User', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                console.log('Usuario creado exitosamente');
            } else {
                console.error('Error al crear usuario');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    };

    return (
        <>
            <Top />
            <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
                <Row className="w-100">
                    <Col md={6} className="d-flex justify-content-center">
                        <img src={sign_up} alt="signup" style={{ width: '50%' }} />
                    </Col>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <div className="w-75">
                            <h1 className="mb-4 text-center">{t("registro.t1")}</h1>

                            <Form>
                                <FloatingLabel controlId="floatingUsername" label={t("registro.t2")} className="mb-3">
                                    <Form.Control type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingInput" label={t("registro.t3")} className="mb-3">
                                    <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingPassword" label={t("registro.t4")} className="mb-3">
                                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </FloatingLabel>

                                <Form.Select as="select" value={role} onChange={handleRoleChange} className="mb-3">
                                    <option value="">{t("registro.t5")}</option>
                                    <option value="student">{t("registro.t6")}</option>
                                    <option value="Profesor">{t("registro.t7")}</option>
                                </Form.Select>

                                <Form.Select as="select" value={career} onChange={handleCareerChange} className="mb-3">
                                    <option value="">{t("registro.t5")}</option>
                                    <option value="ICF">ICF</option>
                                    <option value="PRD">PRD</option>
                                </Form.Select>

                                <Button variant="success" onClick={handleLogin} className="mb-3 w-100">
                                {t("registro.t8")}
                                </Button>
                            </Form>

                            <p className="mb-1 text-center">{t("registro.t9")}</p>
                            <p className="mb-0 text-center">
                            {t("registro.t10")} <Link to="/login">{t("registro.t11")}</Link>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Signup;
