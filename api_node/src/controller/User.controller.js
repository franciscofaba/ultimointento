import {pool} from '../db.js'


export const getUser = async (req,res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM User')
        res.json(rows)

    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }
    
}

export const getUserById = async (req,res) => {
    try{
        console.log([req.params.idUser])
        const [rows] = await pool.query('SELECT * FROM User WHERE idUser = ?', [req.params.idUser])
        if (rows.length <= 0 ) return res.status(404).json({
            message:'ERROR: User not found'
        })
        console.log(rows[0])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }   
}

export const createUser = async (req, res) => {
    try {
        const { idCareer_fk, UserName, email, role, password } = req.body;

        // Inicia la transacción
        await pool.query('START TRANSACTION;');

        // Obtiene el último idUser de la base de datos
        const [lastIdResult] = await pool.query('SELECT MAX(idUser) AS lastId FROM `BBD_CRM`.`User`;');
        const lastId = lastIdResult[0].lastId || 0;
        const newIdUser = lastId + 1;

        // Inserta en la tabla User
        await pool.query('INSERT INTO `BBD_CRM`.`User` (`idUser`, `idCareer_fk`, `UserName`, `email`, `role`) VALUES (?, ?, ?, ?, ?);', [newIdUser, idCareer_fk, UserName, email, role]);

        // Inserta en la tabla login
        await pool.query('INSERT INTO `BBD_CRM`.`login` (`email`, `password`, `idUser_fk`) VALUES (?, ?, ?);', [email, password, newIdUser]);

        // Confirma la transacción
        await pool.query('COMMIT;');


        
        await insertCIP(newIdUser); // Espera a que insertICF termine
        
        res.status(201).json({
            id: newIdUser,
            idCareer_fk,
            UserName,
            email,
            role,
            password,
            idUser_fk: newIdUser
        });
    } catch (error) {
        console.error('Error al insertar el User:', error);
        // Revierte la transacción si hay un error
        await pool.query('ROLLBACK;');
        return res.status(500).json({
            message: 'ERROR: Algo salió mal'
        });
    }
};


export const updateUser = async (req, res) => {
    try {
        const idUser = req.params.idUser; // Suponiendo que el ID del estudiante está en los parámetros de la solicitud
        const { idCareer_fk, UserName, email, role, password} = req.body;

        // Verificar si se está actualizando el correo electrónico
        const updatingEmail = req.body.email !== undefined;
        console.log(idUser)
        // Inicia la transacción
        await pool.query('START TRANSACTION;');
        // Actualiza los datos del estudiante en la tabla User
        await pool.query('SET FOREIGN_KEY_CHECKS=0;');
        const UserQuery = 'UPDATE `BBD_CRM`.`User` SET  `idCareer_fk` = IFNULL(?, `idCareer_fk`), `UserName` = IFNULL(?, `UserName`), `email` = IFNULL(?, `email`),`role` = IFNULL(?, `role`) WHERE `idUser` = ?;';

        // Si se está actualizando el correo electrónico, también actualizar en la tabla login
        await pool.query(UserQuery, [idCareer_fk, UserName, email, role, idUser]);

        // Si se está actualizando el correo electrónico, también actualizar en la tabla login
        if (updatingEmail) {
            const loginQuery = 'UPDATE `BBD_CRM`.`login` SET `email` = ? WHERE `idUser_fk` = ?;';
            await pool.query(loginQuery, [email, idUser]);
        }

        // Confirma la transacción

        await pool.query('SET FOREIGN_KEY_CHECKS=1;');
        await pool.query('COMMIT;');

        res.status(200).json({
            id: idUser,
            idCareer_fk,
            UserName,
            email,
            role,
            password,
            idUser_fk: idUser
        });
    } catch (error) {
        console.error('Error al actualizar el User:', error);
        // Revierte la transacción si hay un error
        await pool.query('ROLLBACK;');
        return res.status(500).json({
            message: 'ERROR: Algo salió mal'
        });
    }
};




export const deleteUserById = async (req, res) => {
    const idUser = req.params.idUser;
    console.log(`Intentando eliminar estudiante con ID: ${idUser}`);

    if (!idUser) {
        return res.status(400).json({
            message: 'El ID del estudiante es requerido.'
        });
    }

    try {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Primero, eliminar las referencias en `Attendance` que están vinculadas a través de `CourseInProgress`
            await connection.query(`
                DELETE Attendance FROM Attendance
                INNER JOIN CourseInProgress
                ON Attendance.idUserClass_fk = CourseInProgress.idUserClass
                WHERE CourseInProgress.idUser_fk = ?`, [idUser]);

            // Luego, eliminar las referencias en `CourseInProgress`
            await connection.query('DELETE FROM CourseInProgress WHERE idUser_fk = ?', [idUser]);

            // Continuar con la eliminación en otras tablas como antes
            await connection.query('DELETE FROM login WHERE idUser_fk = ?', [idUser]);
            const [result] = await connection.query('DELETE FROM User WHERE idUser = ?', [idUser]);

            if (result.affectedRows <= 0) {
                throw new Error(`Estudiante con ID ${idUser} no encontrado.`);
            }

            await connection.commit();
            res.status(200).json({
                message: 'Estudiante eliminado con éxito',
                idUser
            });
        } catch (error) {
            await connection.rollback();
            throw error; // Relanzar para manejar en el siguiente bloque catch
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al eliminar el estudiante:', error.message);
        res.status(500).json({
            message: 'ERROR: Algo salió mal al intentar eliminar el estudiante'
        });
    }
};






async function insertCIP(idUser) {
    try {
        await pool.query('START TRANSACTION;');
        await pool.query('SET FOREIGN_KEY_CHECKS=0;');
        const [rows] = await pool.query('SELECT * FROM User WHERE idUser = ?', [idUser]);
        const [courses] = await pool.query('SELECT * FROM CourseFromCareer WHERE idCareer_fk = ?', [rows[0].idCareer_fk]);
        console.log(courses);
        
        for (const course of courses) {
            try {
                const courseId = `${idUser}-${course.idCourseFromCareer}`;
                const query = 'INSERT INTO `BBD_CRM`.`CourseInProgress` (`idUser_fk`, `idCourseFromCareer_fk`, `idCareer_fk`, `professor`, `courseName`, `idCourseInProgress`, `courseStatus`) VALUES (?, ?, ?, ?, ?, ?, ?)';
                await pool.query(query, [idUser, course.idCourseFromCareer, course.idCareer_fk, 'profesor', course.courseName, courseId, 'inactivo']);
                console.log(`Curso '${course.courseName}' insertado en CourseInProgress con ID ${courseId}.`);
            } catch (error) {
                console.error(`Error al insertar curso '${course.courseName}' en CourseInProgress:`, error);
            }
        }
        
        await pool.query('SET FOREIGN_KEY_CHECKS=1;');
        await pool.query('COMMIT;');
        console.log('Todos los cursos insertados en CourseInProgress.');
    } catch (error) {
        console.error('Error al insertar cursos en CourseInProgress:', error);
    }
};

