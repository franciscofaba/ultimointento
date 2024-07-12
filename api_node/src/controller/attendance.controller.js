
import {pool} from '../db.js'

export const getAttendance = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Attendance  ');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las carreras:', error.message); // Es útil registrar el mensaje de error real para depuración
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};

export const getAttendanceByDate = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Attendance WHERE idCourseFromCareer_fk = ? and date = ?',[req.params.idCourseFromCareer_fk,req.params.date]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las carreras:', error.message); // Es útil registrar el mensaje de error real para depuración
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};





export const getAttendanceCountByDate = async (req, res) => {
    try {
        const { date, idCourseFromCareer_fk } = req.params;
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM Attendance WHERE date = ? AND idCourseFromCareer_fk = ? AND attendance = "presente"', 
            [date, idCourseFromCareer_fk]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el conteo de asistencia:', error.message);
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};







export const CreateAttendance = async (req,res) => {
    try{
        console.log([req.params.idUser])
        const {date, attendance, justification, idCourseInProgress_fk, idUser, idCareer_fk, idCourseFromCareer_fk} = req.body;
        await pool.query('INSERT INTO `BBD_CRM`.`Attendance` (`date`, `attendance`, `justification`, `idCourseInProgress_fk`, `idUser`, `idCareer_fk`, `idCourseFromCareer_fk`) VALUES  (?, ?, ?, ?, ?, ? ,? ,?);', [idAttendance, date, attendance, justification, idCourseInProgress_fk, idUser, idCareer_fk, idCourseFromCareer_fk]);

        if (rows.length <= 0 ) return res.status(404).json({
            message:'ERROR: User not found'
        })
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }   
}


export const CreateAttendanceByProfessor = async (req, res) => {
    try {
        console.log([req.params.idUser])
        const { date, idCourseFromCareer_fk } = req.body;
        const [rows] = await pool.query('SELECT * FROM CourseInProgress WHERE idUser_fk = ?', [req.params.idUser]);
        console.log(rows)
        
        if (rows.length <= 0) return res.status(404).json({
            message: 'ERROR: User not found'
        });

        const idCourseInProgress = rows[0].idCourseInProgress;
        const idCareer = rows[0].idCareer_fk;
        

        console.log(idCareer,idCourseInProgress,idCourseFromCareer_fk)
        // Obtener la lista de alumnos para el curso actual
        const [alumnos] = await pool.query('SELECT * FROM CourseInProgress WHERE idCourseFromCareer_fk = ?', [idCourseFromCareer_fk]);
        console.log(alumnos)
        // Iterar sobre cada alumno y realizar el insert en la tabla attendance
        for (const alumno of alumnos) {
            await pool.query('START TRANSACTION;');
            await pool.query('SET FOREIGN_KEY_CHECKS=0;');
            
            await pool.query(
                'INSERT INTO attendance (date, attendance, justification, idCourseInProgress_fk, idUser, idCareer_fk, idCourseFromCareer_fk) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [date, 'ausente', null, alumno.idCourseInProgress, alumno.idUser_fk , idCareer, idCourseFromCareer_fk]
            );
            await pool.query('SET FOREIGN_KEY_CHECKS=1;');
            await pool.query('COMMIT;');
        }

        res.status(200).json({ message: 'Attendance created successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'ERROR: Something went wrong'
        });
    }
};


export const UpdateAttendanceByStudent = async (req, res) => {
    try {
        const { email, date, idCourseFromCareer_fk } = req.body;
        
        // Obtener el ID de usuario basado en el correo electrónico
        const row = await pool.query('SELECT idUser_fk FROM Login WHERE email = ?', [email]);
        const user = row[0][0].idUser_fk;
        
        // Definir el valor de la asistencia
        const attendance = 'presente';


        // Verificar si el usuario pertenece al curso especificado
        const courseRow = await pool.query('SELECT idUser_fk, idCourseFromCareer_fk FROM CourseInProgress WHERE idUser_fk = ? AND idCourseFromCareer_fk = ?', [user, idCourseFromCareer_fk]);
        if (courseRow[0].length === 0) {
            return res.status(400).json({ message: 'Ese alumno no pertenece a la clase.' });
        }
        

        // Verificar si ya existe un registro de asistencia para ese usuario en esa fecha y curso
        const attendanceRow = await pool.query('SELECT attendance FROM Attendance WHERE idUser = ? AND date = ? AND idCourseFromCareer_fk = ?', [user, date, idCourseFromCareer_fk]);
        if (attendanceRow[0].length > 0) {
            if (attendanceRow[0][0].attendance === 'presente') {
                return res.status(400).json({ message: 'Usted ya está presente.' });
            }
        }

        // Verificar la existencia de registros de asistencia
        const select = await pool.query('SELECT * FROM `BBD_CRM`.`Attendance` WHERE `idUser` = ? AND `date` = ? AND `idCourseFromCareer_fk` = ?', [user, date, idCourseFromCareer_fk]);
        
        console.log(select[0][0]);
        
        // Actualizar la asistencia
        await pool.query('UPDATE `BBD_CRM`.`Attendance` SET `attendance` = IFNULL(?, `attendance`) WHERE `idUser` = (SELECT idUser_fk FROM Login WHERE email = ?) AND `date` = ? AND `idCourseFromCareer_fk` = ?', [attendance, email, date, idCourseFromCareer_fk]);
        
        return res.status(200).json({
            message: 'Attendance updated successfully'
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'ERROR: Something went wrong'
        });
    }
};


export const getallAttendanceprofessor = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Attendance  WHERE idUser = ? ',[req.params.idUser]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las carreras:', error.message); // Es útil registrar el mensaje de error real para depuración
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};


export const getallAttendanceStudent = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM Attendance WHERE (attendance = "ausente" ) AND idUser = ?',
            [req.params.idUser]
          );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las carreras:', error.message); // Es útil registrar el mensaje de error real para depuración
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};

export const postAttendanceCount = async (req, res) => {
    try {
        const { date, idCourseFromCareer_fk, faceCount } = req.body;

        // Verifica si ya existe un registro con la misma fecha e idCourseFromCareer_fk
        const [existingRows] = await pool.query(
            'SELECT * FROM attendancesummary WHERE date = ? AND idCourseFromCareer_fk = ?',
            [date, idCourseFromCareer_fk]
        );

        if (existingRows.length > 0) {
            return res.status(409).json({
                message: 'Attendance count for this date and course already exists'
            });
        }

        // Inserta los datos en la tabla `attendancesummary`
        const [result] = await pool.query(
            'INSERT INTO attendancesummary (date, idCourseFromCareer_fk, count_attendance) VALUES (?, ?, ?)',
            [date, idCourseFromCareer_fk, faceCount]
        );

        res.status(201).json({
            message: 'Attendance count inserted successfully',
            insertId: result.id
        });
    } catch (error) {
        console.error('Error al insertar el conteo de asistencia:', error.message);
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};

export const getFaceCount = async (req, res) => {
    const { date, idCourseFromCareer_fk } = req.params;
    try {
      const [rows] = await pool.query('SELECT count_attendance FROM AttendanceSummary WHERE date = ? AND idCourseFromCareer_fk = ?', [date, idCourseFromCareer_fk]);
  
      if (rows.length === 0) {
        return res.json({ faceCount: 0 });
      }
  
      const faceCount = rows[0].count_attendance || 0;
      res.json({ faceCount });
    } catch (error) {
      console.error('Error al obtener el contador:', error.message);
      return res.status(500).json({
        message: 'ERROR: something goes wrong'
      });
    }
  };
  
  
