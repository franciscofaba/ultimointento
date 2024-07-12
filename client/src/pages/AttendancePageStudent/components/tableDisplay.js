import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  Table,
  Button,
  Icon,
  Header,
  Segment,
  Label,
  Divider,
  Input
} from 'semantic-ui-react';

const TableDisplay = ({ attendance }) => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [justified, setJustified] = useState([]);
  const [t, i18n] = useTranslation("global");

  const handleCheckboxChange = (date, idCourse) => {
    setData([date, idCourse]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Por favor selecciona un archivo PDF.");
      return;
    }

    const formData = new FormData();
    formData.append('archivoPDF', file);
    formData.append('fecha', data[0]);
    formData.append('siglaCurso', data[1]);

    try {
      const response = await axios.post('http://localhost:5000/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Archivo subido exitosamente.");
      // Actualiza el estado de justificación
      setJustified([...justified, data[0]]);
    } catch (error) {
      console.error("Error subiendo el archivo:", error);
      alert("Error subiendo el archivo.");
    }
  };

  return (
    <div>
      <Header as='h3'>{t("tabledisplay.t8")}</Header>
      <Divider />
      <Table compact celled definition>
        <TableHeader>
          <TableRow>
            <TableHeaderCell />
            <TableHeaderCell>{t("tabledisplay.t1")}</TableHeaderCell>
            <TableHeaderCell>{t("tabledisplay.t2")}</TableHeaderCell>
            <TableHeaderCell>{t("tabledisplay.t3")}</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {attendance
            .filter(record => !justified.includes(record.date))
            .map((record, index) => (
              <TableRow key={index}>
                <TableCell compact style={{ width: '2rem' }}>
                  <Button
                    size='mini'
                    icon
                    labelPosition='right'
                    onClick={() => {
                      handleCheckboxChange(record.date, record.idCourseInProgress_fk);
                      console.log(record.date, record.idCourseInProgress_fk);
                    }}
                  >
                    {t("tabledisplay.t4")}
                    <Icon name='right arrow' />
                  </Button>
                </TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.attendance}</TableCell>
                <TableCell>{record.idCourseInProgress_fk}</TableCell>
              </TableRow>
            ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableHeaderCell>
              <p>{t("tabledisplay.t5")}</p>
              <Label style={{ width: '15rem', margin: '2px' }}>
                {t("tabledisplay.t1")} {data[0]}
              </Label>
            </TableHeaderCell>
            <TableHeaderCell >
              <Segment placeholder>
                <Input type="file" accept="application/pdf" onChange={handleFileChange} />
                <Header icon>
                  <Icon name='pdf file outline' />
                </Header>
                <Button primary onClick={handleFileUpload}>{t("tabledisplay.t7")}</Button>
              </Segment>
            </TableHeaderCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TableDisplay;
