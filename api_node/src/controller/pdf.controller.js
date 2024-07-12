import {pool} from '../db.js'
export const uploadPDF = async (req, res) => {
    const { fecha, siglaCurso } = req.body;
    const archivoPDF = req.file.buffer;

    const sqlInsert = 'INSERT INTO DocumentosPDF (fecha, siglaCurso, archivoPDF) VALUES (?, ?, ?)';
    const sqlUpdate = 'UPDATE attendance SET attendance = ? WHERE date = ? AND idCourseInProgress_fk = ?';

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Insertar el archivo PDF en la tabla DocumentosPDF
        await connection.query(sqlInsert, [fecha, siglaCurso, archivoPDF]);

        // Actualizar la tabla attendance
        await connection.query(sqlUpdate, ['En proceso de justificación', fecha, siglaCurso]);

        await connection.commit();
        
        res.status(200).send('Archivo subido y tabla attendance actualizada exitosamente.');
    } catch (err) {
        await connection.rollback();
        console.error('Error subiendo el archivo o actualizando la tabla:', err);
        res.status(500).send('Error subiendo el archivo o actualizando la tabla.');
    } finally {
        connection.release();
    }
};

// Función para descargar archivo PDF
export const downloadPDF = async (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM DocumentosPDF WHERE id = ?';
    try {
        const [rows] = await pool.query(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).send('File not found.');
        }
        const archivoPDF = rows[0].archivoPDF;
        res.setHeader('Content-Type', 'application/pdf');
        res.send(archivoPDF);
    } catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Error retrieving data.');
    }
};

export const getDocumentsWithUserInfo = async (req, res) => {
    try {
      const [documents] = await pool.query('SELECT * FROM DocumentosPDF');

  
      const documentPromises = documents.map(async (document) => {
        try {
  
          // Verificamos la columna correcta para la búsqueda
          const [course] = await pool.query('SELECT idUser_fk, courseName FROM CourseInProgress WHERE idCourseInProgress= ?', [document.siglaCurso]);

          if (course.length > 0) {
            const [user] = await pool.query('SELECT UserName FROM User WHERE idUser = ?', [course[0].idUser_fk]);
         
  
            if (user.length > 0) {
              return {
                id: document.id,
                fecha: document.fecha,
                siglaCurso: document.siglaCurso,
                archivoPDF: document.archivoPDF,
                idUser_fk: course[0].idUser_fk,
                courseName: course[0].courseName,
                UserName: user[0].UserName
              };
            }
          }
        } catch (err) {
          console.error('Error processing document:', document, err);
        }
        return null;
      });
  
      const documentResults = await Promise.all(documentPromises);

  
      const filteredResults = documentResults.filter(result => result !== null);
     
  
      res.json(filteredResults);
    } catch (error) {
      console.error('Error retrieving documents:', error);
      res.status(500).json({ message: 'Error retrieving documents', error });
    }
  };