import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Dropdown, Header, Divider, Card, Table, Button } from 'semantic-ui-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

const Vercontador = () => {
  const [t, i18n] = useTranslation("global");
  const [attendanceDay, setAttendanceDay] = useState("");
  const [attendances, setAttendances] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [table, setTable] = useState([]);
  const [count, setCount] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [difference, setDifference] = useState(0);
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
      fetchCount(); 
      fetchFaceCount(); 
    }
  }, [selectedAttendance]);

  useEffect(() => {
    if (faceCount > count) {
      setFaceCount(count);
    }
    setDifference(count - faceCount);
  }, [count, faceCount]);

  const handleassistSelection = (event, data) => {
    const value = String(data.value); 
    const [date, idCourseFromCareer_fk] = value.split('/');
    const attendance = attendances.find(att => 
        att.date === date && att.idCourseFromCareer_fk === idCourseFromCareer_fk
    );
    setSelectedAttendance(attendance);
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


  const fetchFaceCount = async () => {
    try {
      const answer = await axios.get(`http://localhost:5000/api/attendance/Countface/${selectedAttendance.date}/${selectedAttendance.idCourseFromCareer_fk}`);
      setFaceCount(answer.data.faceCount); 
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
    <Card style={{width:'100%', padding: '10px' }}>
      <Header as='h2'>{t("portal2.t14")}</Header>
      <Divider />
      <Dropdown
        placeholder={t("portal2.t7")}
        search
        selection
        options={assistOptions}
        onChange={handleassistSelection}
        onClick={fetchAttendance} 
      />
      <div style={{ marginTop: '20px' }}>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{t("portal2.t15")}</Table.HeaderCell>
              <Table.HeaderCell>{t("portal2.t16")}</Table.HeaderCell>
              <Table.HeaderCell>{t("portal2.t17")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{count}</Table.Cell>
              <Table.Cell>{faceCount}</Table.Cell>
              <Table.Cell>{difference}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </Card>
  );
};

export default Vercontador;
