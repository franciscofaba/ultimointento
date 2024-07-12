import React, { useState, useEffect } from "react";
import { FloatingLabel, Form, Button } from 'react-bootstrap';
import QRGenerator from "./components/qr";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Iniciar() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");  
    const [date, setDate] = useState("");
    const [idCourseFromCareer, setidCourseFromCareer] = useState("");
    const [ipAddress, setIpAddress] = useState('');
    const [t, i18n] = useTranslation("global");

    const handleSubmit = async () => {
        try {
            setError("");

            const json = {
                email: email,
                date: date,
                idCourseFromCareer_fk: idCourseFromCareer
            };

            const response = await fetch(`http://20.195.171.94:5000/api/attendance/student`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ocurrió un error al intentar iniciar sesión. Por favor intenta de nuevo más tarde.');
            }

            console.log('successful:', data);
            navigate(`/Portal2`);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const dateFromCookie = Cookies.get('date');
        const idCourseFromCareerFromCookie = Cookies.get('idCourseFromCareer');

        setDate(dateFromCookie);
        setidCourseFromCareer(idCourseFromCareerFromCookie);
        setIpAddress('192.168.68.124');
    }, []); 
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
            <h1 style={{ marginTop: '20px' }}>{t("qr.t1")}</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <QRGenerator link={`http://${ipAddress}:3000/iniciar/${date}/${idCourseFromCareer}`} />
            </div>
            <div style={{ marginTop: '20px', maxWidth: '400px', textAlign: 'center' }}>
                <h2>{t("qr.t2")}</h2>
                <FloatingLabel controlId="floatingInput" label={t("qr.t3")} className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FloatingLabel>
                <Button variant="success" onClick={handleSubmit}>
                    {t("qr.t4")}
                </Button>
                {error && <div style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{error}</div>}
            </div>
        </div>
    );
}

export default Iniciar;
