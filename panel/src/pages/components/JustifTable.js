import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Card, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


const JustifTable = () => {
    const [key, setKey] = useState('Users'); // Inicia con el tab 'Users' activo
    const [data, setData] = useState(null); // Variable de estado para almacenar los datos recibidos
    const [t, i18n]= useTranslation("global");


    useEffect(() => {
        // Llama a la API cuando el componente se monte
        fetch('http://localhost:5000/api/pdf/All')
            .then(response => response.json())
            .then(data => {
                // Convierte el blob en un objeto URL para descarga
                const formattedData = data.map(item => ({
                    ...item,
                    archivoPDF: URL.createObjectURL(new Blob([item.archivoPDF], { type: 'application/pdf' }))
                }));
                setData(formattedData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []); // El array vacío asegura que el efecto solo se ejecute una vez

    return (
        <>
            
            <Card.Text>
            {t('justificaciones.t1')}
            </Card.Text>
            <Card>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => {
                        setKey(k); // Cambia el tab activo
                    }}
                    className="mb-3"
                >
                    <Tab eventKey="Users" title={t('justificaciones.t2')}>
                        <Card.Body>
                            <Card.Title>{t('justificaciones.t3')}</Card.Title>
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
                                                {Object.entries(item).map(([key, value], index) => (
                                                    <td key={index}>
                                                        {key === 'archivoPDF' ? (
                                                            <a href={value} download={`documento_${item.id}.pdf`}>{t('justificaciones.t5')}</a>
                                                        ) : (
                                                            value
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Tab>
                </Tabs>
            </Card>
        </>
    );
};

export default JustifTable;
