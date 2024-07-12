import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Landingcard from "../../shared/Landingcard";
import Pagina2 from "../prueba2";
import { Header, Dropdown, Segment} from 'semantic-ui-react';
import Cookies from 'js-cookie';

function SubirImagen() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [courseNames, setCourseNames] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const navigate = useNavigate();
  const [idUser, setIduser] = useState(null);
  const [t, i18n] = useTranslation("global");
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedFilePath, setProcessedFilePath] = useState(null);
  const [faceCount, setFaceCount] = useState(0);

  useEffect(() => {
    // Obtener el idUser de la URL
    const idUser_fk = Cookies.get('userId');
    setIduser(idUser_fk);

    // Llamar a la API para obtener los datos del usuario
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/User/${idUser_fk}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error al llamar a la API:", error);
      }
    };

    // Llamar a la API para obtener los nombres de los cursos
    const fetchCourseName = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/CourseInProgress/${idUser_fk}`);
        setCourseNames(response.data);
      } catch (error) {
        console.error("Error al llamar a la API:", error);
      }
    };

    // Establecer la fecha actual
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Puedes cambiar el formato de la fecha si es necesario
    setCurrentDate(formattedDate);

    fetchData();
    fetchCourseName();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `http://127.0.0.1:5001/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('File uploaded successfully:', response.data);
      setProcessedFilePath(response.data.processed_file_path);
      setFaceCount(response.data.face_count);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCourseChange = (event, data) => {
    setSelectedCourse(data.value);
  };

  const courseOptions = courseNames.map(course => ({
    key: course.idUser_fk,
    text: course.courseName,
    value: course.idCourseFromCareer_fk,
  }));

  const handleReset = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/api/attendance/facecount`,
        {
          date: currentDate,
          idCourseFromCareer_fk: selectedCourse,
          faceCount: faceCount
        }
      );
      console.log('Attendance count sent successfully:', response.data);

      setSuccessMessage(t("reconocimiento.t11"));
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(t("reconocimiento.t12"));
        setSuccessMessage('');
      } else {
        console.error('Error uploading file:', error);
      }
    } finally {
      setUserData(null);
      setCourseNames([]);
      setSelectedCourse(null);
      setSelectedFile(null);
      setProcessedFilePath(null);
      setFaceCount(0);
    }
  };




  return (

    <div>
      <Pagina2>
        <Segment style={{marginTop:'15px'}}>
            <h2>{t("reconocimiento.t1")}</h2>
          <Header as='h6' content=''></Header>

          <div className="container mt-4">
         
            <h4>{t("reconocimiento.t2")}</h4>
            <h6>{t("reconocimiento.t3")}</h6>
            <p>{t("reconocimiento.t4")}</p>

            <div>
              <h5>{t("reconocimiento.t5")}</h5>
            </div>

            <Dropdown
              placeholder={t("reconocimiento.t13")}
              fluid
              selection
              options={courseOptions}
              onChange={handleCourseChange}
              style={{ marginBottom: '20px' }}
            />
            
            {selectedCourse && (
              <div style={{marginBottom:'15px'}}>
                <h8>{t("reconocimiento.t6")} {currentDate}</h8>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
              {t("reconocimiento.t7")}
              </button>
            </form>

            {processedFilePath && (
              <div className="mt-4">
                <h3>{t("reconocimiento.t8")}</h3>
                <p>{t("reconocimiento.t9")} {faceCount}</p>
                <img
                  src={`http://127.0.0.1:5001/uploads/${encodeURIComponent(processedFilePath.split('\\').pop())}`}
                  alt="Processed"
                  className="img-fluid"
                />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button type="button" className="btn btn-danger mt-3" onClick={handleReset}>
                  {t("reconocimiento.t10")}
                  </button>
                </div>
              </div>
            )}
            {successMessage && (
              <div style={{ marginTop: '20px', textAlign: 'center', color: 'green' }}>
                <p>{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div style={{ marginTop: '20px', textAlign: 'center', color: 'green' }}>
                <p>{errorMessage}</p>
              </div>
            )}

          </div>  
        </Segment>
        
      </Pagina2>
    </div>
  );
}

export default SubirImagen;
