import { Tab, Tabs, Card, Button, CardHeader, Table } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Tablesdisplay = () => {
    const [key, setKey] = useState(''); // Inicia con el tab 'Users' activo
    const [data, setData] = useState(null); // Variable de estado para almacenar los datos recibidos
    const [t, i18n]= useTranslation("global");


    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            console.log('Datos recibidos:', jsonData);
            setData(jsonData); // Actualiza la variable de estado con los datos recibidos
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            setData(null); // En caso de error, limpia los datos previos
        }
    };

    const queryTable = (parametro) => {
        if (parametro === 'Users') {
            console.log('Cargando datos para el tab Users');
            fetchData('http://localhost:5000/api/User');
        } else if (parametro === 'Login') {
            console.log('Preparando el tab Login');
            fetchData('http://localhost:5000/api/Login1');
        } else if (parametro === 'Courses') {
            console.log('Mostrando cursos disponibles en el tab Courses');
            fetchData('http://localhost:5000/api/CourseFromCareer');
        }
    };

    return (
        <>
            <Card.Title>{t('tables.t1')}</Card.Title>
            <Card.Text>
            {t('tables.t2')}
            </Card.Text>
            <Card>
            
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => {
                        setKey(k); // Cambia el tab activo
                        queryTable(k); // Ejecuta cualquier función adicional
                    }}
                    className="mb-3"
                >
                    
                    <Tab eventKey="Users" title={t('tables.t3')}>
                        <Card.Body>
                            <Card.Title>{t('tables.t7')}</Card.Title>
                      
                            {data && (
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            {data.length > 0 && Object.keys(data[0]).map((key, index) => (
                                                <th key={index}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                {Object.values(item).map((value, index) => (
                                                    <td key={index}>{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Tab>
                    <Tab eventKey="Login" title={t('tables.t4')}>
                        <Card.Body>
                            <Card.Title>{t('tables.t6')}</Card.Title>
                        
                            <Table responsive>
                            {data && (
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            {data.length > 0 && Object.keys(data[0]).map((key, index) => (
                                                <th key={index}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                {Object.values(item).map((value, index) => (
                                                    <td key={index}>{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            </Table>
                        </Card.Body>
                    </Tab>
                    <Tab eventKey="Courses" title={t('tables.t5')}>
                        <Card.Body>
                            <Card.Title>{t('tables.t8')}</Card.Title>
                 
                            <Table responsive>
                            {data && (
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            {data.length > 0 && Object.keys(data[0]).map((key, index) => (
                                                <th key={index}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                {Object.values(item).map((value, index) => (
                                                    <td key={index}>{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            </Table>
                        </Card.Body>
                    </Tab>

                </Tabs>
            </Card>



        </>
    )
};

export default Tablesdisplay;