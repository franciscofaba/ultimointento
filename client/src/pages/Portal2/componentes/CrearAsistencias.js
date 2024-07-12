import React, { useEffect, useState } from 'react';
import { FormButton, Form, Dropdown, Header, Divider, Card, Button } from 'semantic-ui-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../componentes/estilos.css";
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';

const CrearAsistencias = () => {
    const [t, i18n] = useTranslation("global");
    const [date, setDate] = useState("");
    const [idCourseFromCareer, setidCourseFromCareer] = useState([]);
    const [courses, setCourses] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [condicion, setCondicion] = useState(false);

    const navigate = useNavigate();

    const [buttonClass, setButtonClass] = useState('ui disabled button');
    const today = new Date().toISOString().split('T')[0];
    const [idUser, setIdUser] = useState(null);
    const [idCareer_fk, setIdCareer_fk] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const userId = Cookies.get('userId');
        const token = Cookies.get('accessToken'); // Asume que el token está almacenado en una cookie llamada 'accessToken'
        
        if (userId && token) {
            const url = `http://localhost:5000/api/user/${userId}`;
            
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluye el token en la cabecera de autorización
                },
                withCredentials: true // Asegúrate de que las cookies sean enviadas y recibidas
            })
            .then(response => {
                const data = response.data;
                console.log("aqui"+data)
                setIdUser(data.idUser);
                setIdCareer_fk(data.idCareer_fk);
                setUserName(data.UserName);
                setEmail(data.email);
                setRole(data.role);
            })
            .catch(error => console.error('Error fetching user data:', error));
        }
    }, []); // Dependencias vacías para que se ejecute solo una vez al montar el componente


    useEffect(() => {
        console.log(idUser, idCareer_fk, userName, email, role);
    }, [idUser, idCareer_fk, userName, email, role]);

    useEffect(() => {
        if (idUser) {
            const fetchCourses = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/CourseInProgress/${idUser}`);
                    setCourses(response.data);
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            };

            const fetchAttendance = async () => {
                try {
                    const respuesta = await axios.get(`http://localhost:5000/api/attendance/professor/all/${idUser}`);
                    setAttendances(respuesta.data);
                } catch (error) {
                    console.error("Error al llamar a la API:", error);
                }
            };

            fetchCourses();
            fetchAttendance();
        }
    }, [idUser]);  // Dependiendo de idUser para que se ejecute después de que idUser se establezca

    const handleSubmit = async () => {
        try {
            if (!date || idCourseFromCareer.length === 0) {
                console.error('Ingresa la fecha y selecciona un curso');
                return;
            }

            const json = {
                date: date,
                idCourseFromCareer_fk: idCourseFromCareer
            };

            await axios.post(`http://localhost:5000/api/attendance/professor/${idUser}`, json);

            console.log('Datos enviados correctamente');
            setCondicion(true);
            setButtonClass('ui button'); // Cambiar la clase del botón a activo
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    const handleNavigate = () => {
        // Establecer las cookies antes de navegar
        Cookies.set('date', date);
        Cookies.set('idCourseFromCareer', idCourseFromCareer);
        navigate('/iniciar');
    };

    const stateOptions = courses.map(course => ({
        key: course.idCourseFromCareer_fk,
        text: course.idCourseFromCareer_fk,
        value: course.idCourseFromCareer_fk,
    }));

    const handleCourseSelection = (event, data) => {
        setidCourseFromCareer(data.value);
        setCondicion(false);
    };

    return (
        <Card style={{ width: '100%', padding: '10px' }}>
            <Header as='h2'>{t("portal2.t1")}</Header>
            <Divider />
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>{t("portal2.t2")}</label>
                    <input
                        type='date'
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>{t("portal2.t3")}</label>
                    <Dropdown
                        placeholder={t("portal2.t3")}
                        fluid
                        selection
                        value={idCourseFromCareer}
                        options={stateOptions}
                        onChange={handleCourseSelection}
                        onSearchChange={handleCourseSelection}
                    />
                </Form.Field>
                <FormButton content={t("portal2.t1")} />
            </Form>
            <Divider />
            <Button className={buttonClass} onClick={handleNavigate}>
                {t("portal2.t5")}
            </Button>
        </Card>
    );
};

export default CrearAsistencias;
