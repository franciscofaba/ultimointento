import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Container, Card } from 'react-bootstrap';
import TableDisplay from "./components/tableDisplay";
import Pagina from "../prueba";

function AttendanceStudent() {
    const [attendance, setAttendance] = useState([]);
    const [idUser, setIdUser] = useState(null);
    const [idCareer_fk, setIdCareer_fk] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const userId = Cookies.get('userId');
        console.log(userId);  // Verificar valor

        if (userId) {
            console.log('Este es id: ', userId);
            const url = `http://20.195.171.94:5000/api/user/${userId}`;
            console.log("Fetching URL:", url);  // Verificar la URL completa
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    setIdUser(data.idUser);
                    setIdCareer_fk(data.idCareer_fk);
                    setUserName(data.UserName);
                    setEmail(data.email);
                    setRole(data.role);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    useEffect(() => {
        if (idUser) {
            const fetchAttendance = async () => {
                try {
                    const response = await axios.get(`http://20.195.171.94:5000/api/attendance/student/all/${idUser}`);
                    console.log(response);
                    setAttendance(response.data);
                } catch (error) {
                    console.error("Error al llamar a la API:", error);
                }
            };
            fetchAttendance();
        }
    }, [idUser]);

    return (
        <>
            <Pagina>

                    
                        <Card bg="white" style={{padding:'10px', marginTop:'10px'}}>
                           
                                <TableDisplay attendance={attendance} />
                          
                        </Card>

            </Pagina>
        </>
    );
}

export default AttendanceStudent;
