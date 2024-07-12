import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Dropdown, Header, Divider, Card, Table, Button } from 'semantic-ui-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

const VerAsistencias = () => {
  const [t, i18n] = useTranslation("global");
  const [attendanceDay, setAttendanceDay] = useState("");
  const [attendances, setAttendances] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [table, setTable] = useState([]);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [idCourseFromCareer, setidCourseFromCareer] = useState([]);
  const [idUser, setIdUser] = useState(null);
  const [idCareer_fk, setIdCareer_fk] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      const url = `http://localhost:5000/api/user/${userId}`;
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
    console.log(idUser, idCareer_fk, userName, email, role);
  }, [idUser, idCareer_fk, userName, email, role]);

  useEffect(() => {
    if (selectedAttendance) {
      fetchTable();
      fetchCount(); // Añadir fetchCount para obtener el conteo de alumnos presentes
    }
  }, [selectedAttendance]);

  const handleassistSelection = (event, data) => {
    const value = String(data.value); // Asegurarse de que el valor es una cadena
    const [date, idCourseFromCareer_fk] = value.split('/');
    const attendance = attendances.find(att => 
        att.date === date && att.idCourseFromCareer_fk === idCourseFromCareer_fk
    );
    setSelectedAttendance(attendance);
  };

  const handle = () => {
    if (selectedAttendance) {
      Cookies.set('date', selectedAttendance.date);
      Cookies.set('idCourseFromCareer', selectedAttendance.idCourseFromCareer_fk);
      navigate('/iniciar');
    }
  };

  const assistOptions = attendances.map(attendance => ({
    key: attendance.date + ' - ' + attendance.idCourseFromCareer_fk,
    text: attendance.date + ' - ' + attendance.idCourseFromCareer_fk,
    value: String(attendance.date + '/' + attendance.idCourseFromCareer_fk),
  }));

  const fetchAttendance = async () => {
    try {
      const respuesta = await axios.get(`http://localhost:5000/api/attendance/professor/all/${idUser}`);
      setAttendances(respuesta.data);
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    }
  };

  const fetchTable = async () => {
    try {
      const answer = await axios.get(`http://localhost:5000/api/attendanceByDate/${selectedAttendance.idCourseFromCareer_fk}/${selectedAttendance.date}`);
      setTable(answer.data);
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    }
  };


  const fetchFacecount = async () => {
    try {
      const answer = await axios.get(`http://localhost:5000/api/attendance/Countface/${selectedAttendance.idCourseFromCareer_fk}/${selectedAttendance.date}`);
      setTable(answer.data);
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    }
  };

  const fetchCount = async () => {
    try {
      const answer = await axios.get(`http://localhost:5000/api/attendance/count/${selectedAttendance.idCourseFromCareer_fk}/${selectedAttendance.date}`);
      setCount(answer.data.count);
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    }
  };

  return (
    <Card style={{ width: '100%', padding: '10px' }}>
      <Header as='h2'>{t("portal2.t5")}</Header>
      <Divider />
      <Dropdown
        placeholder={t("portal2.t7")}
        search
        selection
        options={assistOptions}
        onChange={handleassistSelection}
        onClick={fetchAttendance} 
      />
      <Button onClick={handle} style={{ marginTop: '10px' }}>
        {t("portal2.t5")}
      </Button>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t("portal2.t8")}</Table.HeaderCell>
            <Table.HeaderCell>{t("portal2.t9")}</Table.HeaderCell>
            <Table.HeaderCell>{t("portal2.t10")}</Table.HeaderCell>
            <Table.HeaderCell>{t("portal2.t11")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan="4" style={{ textAlign: 'center' }}>
            {t("portal2.t13")} {count} 
            </Table.Cell>
          </Table.Row>
          {table.map(student => (
            <Table.Row key={student.idUser}>
              <Table.Cell>{student.idUser}</Table.Cell>
              <Table.Cell>{student.date}</Table.Cell>
              <Table.Cell>{student.attendance}</Table.Cell>
              <Table.Cell>{student.idCourseFromCareer_fk}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>  
    </Card>
  );
};

export default VerAsistencias;
