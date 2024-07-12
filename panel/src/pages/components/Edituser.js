import React, { useEffect, useState } from 'react';
import { Form, Accordion, Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


const EditUser = () => {
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [t, i18n]= useTranslation("global");


    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            console.log('Datos recibidos:', jsonData);
            setData(jsonData); // Asumiendo que la respuesta JSON es un array de usuarios
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            setData([]); // En caso de error, limpia los datos previos
        }
    };
   
    useEffect(() => {
        fetchData('http://localhost:5000/api/User');
    }, []);

    const handleSelectChange = (event) => {
        const userId = event.target.value;
        const user = data.find(u => u.idUser.toString() === userId);
        setSelectedUser(user || {});
 
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario
        if (!selectedUser.idUser) {
            console.error('No se ha seleccionado ningún usuario.');
            return;
        }
        const url = `http://localhost:5000/api/user/${selectedUser.idUser}`;
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser)
            });
            if (response.ok) {
                console.log('Usuario actualizado con éxito');
            } else {
                throw new Error('Algo salió mal al actualizar el usuario');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };
    
    return (
        <>
            <Form>
                <h3 style={{margin:'10px'}}>{t('users.t1')}</h3>
                <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label style={{margin:'10px'}}>{t('users.t2')}</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={handleSelectChange}>
                        <option>{t('users.t2')}</option>
                        {data.map((user, index) => (
                            <option key={index} value={user.idUser}>{user.email}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Form>

            <Accordion style={{ padding: '10px' }}>
                <Accordion.Item defaultActiveKey="1">
                    
                    <Accordion.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formUserName">
                                    <Form.Label>{t('users.t3')}</Form.Label>
                                    <Form.Control name="UserName" type="text" value={selectedUser.UserName || ''} placeholder={t('users.t4')} onChange={handleChange} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>{t('users.t5')}</Form.Label>
                                    <Form.Control name="email" type="email" value={selectedUser.email || ''} placeholder={t('users.t6')} onChange={handleChange} />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridRole">
                                    <Form.Label>{t('users.t7')}</Form.Label>
                                    <Form.Control name="role" type="text" value={selectedUser.role || ''} placeholder={t('users.t8')} onChange={handleChange} />
                               
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridCareer">
                                    <Form.Label>{t('users.t9')}</Form.Label>
                                    <Form.Control name="idCareer_fk" type="text" value={selectedUser.idCareer_fk || ''} placeholder={t('users.t10')} onChange={handleChange} />
                               
                                </Form.Group>
                            </Row>

                            <Button variant="primary" type="submit">
                            {t('users.t11')}
                            </Button>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
};

export default EditUser;
