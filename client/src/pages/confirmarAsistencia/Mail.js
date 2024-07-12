import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Login/styles.module.css";
import Top from "../../shared/top_login";
import login from "../../images/uai2.png";
import axios from "axios";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import bcrypt from 'bcryptjs'; // Importa bcryptjs

function Mail() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");  // Estado para guardar el mensaje de error

    const handleSubmit = async () => {
        try {
            // Limpia cualquier mensaje de error previo
            setError("");

            // Intenta obtener la respuesta del servidor
            const response = await axios.get(`http://localhost:5000/api/login/${email}`);
            
            // Aquí manejarías la respuesta positiva, como guardar el token, etc.
            console.log('Login successful:', response.data);
        } catch (error) {
            // Verifica si el error es debido a un correo no encontrado
            if (error.response && error.response.status === 404) {
                setError("El email es incorrecto o no existe.");
            } else {
                // Maneja otros tipos de errores (p.ej., problemas de red, errores del servidor, etc.)
                setError("Ocurrió un error al intentar iniciar sesión. Por favor intenta de nuevo más tarde.");
            }
        }
    };
    
    return (
            <div className={styles.container}>
                <h1 className={styles.heading}>Log in Form</h1>
                <div className={styles.form_container}>
                    <div className={styles.left}>
                        <img className={styles.img} src={login} alt="login" />
                    </div>
                    <div className={styles.right}>
                        <h2 className={styles.from_heading}>Members Log in</h2>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Email address"
                            className="mb-3"
                            >
                            <Form.Control 
                                type="email"
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '300px' }}
                            />
                        </FloatingLabel>
                        <button className={styles.btn} onClick={handleSubmit}>
                            Log In
                        </button>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                    </div>
                </div>
            </div>
    );
}

export default Mail;
