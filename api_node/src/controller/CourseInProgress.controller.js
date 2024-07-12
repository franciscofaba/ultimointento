import {pool} from '../db.js'

import winston from 'winston';


// aqui creo el logger
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: 'debug',
  format: combine(
  
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] - Level: ${info.level} - ${info.message}` ),
   
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/LOGGING_CourseInProgresss.log' }),
  ],
});

const requestLog = { method: "GET"};
const childLogger = logger.child(requestLog);





export const getCourseInProgress = async (req, res) => {
    try {
        //--------------------------------------------------------------------------//
        // 1.- log: INFO
        // Justificacion: Es necesario un log para informar que la llamada a esta 
        //                funcion fue exitosa.
        //--------------------------------------------------------------------------//
        childLogger.info(' Funcion -> getCourseInProgress.controller iniciada | method: GET');
        //const [rows] = await pool.query('SELECT * FROM CourseInProgress');
        res.json(rows);


        //--------------------------------------------------------------------------//
        // 2.- log: DEBUG
        // Justificacion: Es necesario fijar este log para hacer un debug del codigo 
        //                y confirmar realmente lo que se obtiene de la llamada a la 
        //                base de datos se ejecuto de forma correcta
        //--------------------------------------------------------------------------//
        childLogger.debug(`Resultado de la consulta: ${JSON.stringify(rows, null, 2)}` );
  

    } catch (error) {


        //-------------------------------------------------------------------------//
        // 3.- log: Error
        // Justificacion: Es necesario tener un log que permita registrar el error
        //                 para analizar porque la llamda a la api no se Produjo.
        //--------------------------------------------------------------------------//               
        childLogger.error('[ERROR] in getCourseInProgress: try again!', error);
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};



export const getCourseInProgressbyState = async (req,res) => {
    try{
        const idUser = req.params.idUser;
        const [rows] = await pool.query('SELECT * FROM CourseInProgress WHERE idUser_fk = ?', [idUser])
        res.json(rows)

    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes sadsaswrong'
        })
    }
    
}

export const UpdateinterState = async (req, res) => {
    try {
         
        const { semesterNumber, idCareer , idUser} = req.body;


        await pool.query('START TRANSACTION;');

        const [courses] = await pool.query('SELECT idCourseFromCareer FROM CourseFromCareer WHERE idCourseFromCareer_fk = ? AND semesterNumber = ?', [idCareer, semesterNumber]);

        const interStateQuery = 'UPDATE `BBD_CRM`.`CourseInProgress` SET `courseStatus` = "En curso" WHERE `idCourse_fk` = ? AND `idUser_fk` = ?';


        for (const course of courses) {
            await pool.query(interStateQuery, [course.idCourse, idUser]);
        }

        await pool.query('COMMIT;');

        res.status(200).json({
            message: 'El estado del curso ha sido actualizado correctamente',
            idUser: idUser
        });
    } catch (error) {
        console.error('Error al actualizar el estado del curso:', error);
        await pool.query('ROLLBACK;');
        return res.status(500).json({
            message: 'ERROR: Algo salió mal al actualizar el estado del curso'
        });
    }
};



