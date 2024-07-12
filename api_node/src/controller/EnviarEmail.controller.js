import { pool } from '../db.js';
import nodemailer from 'nodemailer';
import logger from '../logger.js';

// Configuración de Nodemailer para Outlook
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'bpesociedad@gmail.com',
        pass: 'ooqh cxdf hogf ywzi' // Usa la contraseña de aplicación si tienes habilitada la autenticación en dos pasos
    }
});

const getUserEmailByID = async (idUser) => {
    const [userRows] = await pool.query('SELECT email FROM User WHERE idUser = ?', [idUser]);
    if (userRows.length > 0) {
        return userRows[0].email;
    }
    return null;
};
const subtractOneMonth = (date) => {
    const dateObj = new Date(date);
    dateObj.setMonth(dateObj.getMonth() - 1);
    return dateObj.toISOString().split('T')[0];
};

// Función para enviar correos electrónicos
export const sendRememberEmail = async () => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Obtener el próximo curso de cada usuario
        const [users] = await pool.query('SELECT DISTINCT idUser_fk FROM InformacionCursos WHERE fecha >= ?', [currentDate]);

        for (const user of users) {
            const idUser = user.idUser_fk;

            const [courseRows] = await pool.query(`
                SELECT idInformacion, idCourseInProgress_fk, horario, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, ubicacion 
                FROM InformacionCursos 
                WHERE idUser_fk = ? AND fecha >= ?
                ORDER BY fecha ASC 
                LIMIT 1`, [idUser, currentDate]);

            if (courseRows.length > 0) {
                const courseInfo = courseRows.map(row => `
                    Curso ID: ${row.idCourseInProgress_fk}
                    Horario: ${row.horario}
                    Fecha: ${row.fecha}
                    Ubicación: ${row.ubicacion}
                `).join('\n\n');

                // Obtener el correo electrónico del usuario
                const userEmail = await getUserEmailByID(idUser);
                if (userEmail) {
                    const mailOptions = {
                        from: 'bpesociedad@gmail.com',
                        to: userEmail,
                        subject: 'Recordatorio de Cursos',
                        text: `Aquí tienes la información de los próximos cursos:\n\n${courseInfo}\n\nLink adicional: https://forms.office.com/Pages/ResponsePage.aspx?id=a3WTFOOefkuF-6Gn7OXBZSrndyTDm0JGoDpurwdZnmxUNEtJSFNXR0tJMTBWRFA0WDNHUlA4MkNZQy4u`
                    };

                    await transporter.sendMail(mailOptions);
                    console.log(`Correo enviado exitosamente a ${userEmail}`);
                } else {
                    console.log(`No se encontró correo electrónico para el usuario con ID ${idUser}`);
                }
            } else {
                console.log(`No hay información de cursos para el usuario con ID ${idUser}`);
            }
        }
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

// Nueva función para enviar recordatorios a los profesores un mes antes del inicio del curso
// Función para enviar correos electrónicos a profesores
export const sendProfessorEmails = async () => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        // Obtener todos los profesores
        const [professors] = await pool.query(`
            SELECT u.idUser, u.email
            FROM User u
            WHERE u.role = 'profesor'
        `);

        for (const professor of professors) {
            const idUser = professor.idUser;
            const userEmail = professor.email;

            // Obtener el primer curso de cada idCourseInProgress del profesor
            const [courseRows] = await pool.query(`
                SELECT DISTINCT ON (ic.idCourseInProgress_fk) ic.idInformacion, ic.idCourseInProgress_fk, ic.horario, DATE_FORMAT(ic.fecha, '%Y-%m-%d') as fecha, ic.ubicacion
                FROM InformacionCursos ic
                JOIN CourseInProgress cip ON ic.idCourseInProgress_fk = cip.idCourseInProgress
                WHERE cip.idUser_fk = ?
                ORDER BY ic.idCourseInProgress_fk, ic.fecha ASC`, [idUser]);
                for (const row of courseRows) {
                    const fechaMenosUnMes = subtractOneMonth(row.fecha);
                    
                    if (fechaMenosUnMes === currentDate) {
                        const courseInfo = `
                            Curso ID: ${row.idCourseInProgress_fk}
                            Horario: ${row.horario}
                            Fecha original: ${row.fecha}
                            Fecha menos un mes: ${fechaMenosUnMes}
                            Ubicación: ${row.ubicacion}
                        `;
    
                        if (userEmail) {
                            const mailOptions = {
                                from: 'bpesociedad@gmail.com',
                                to: userEmail,
                                subject: 'Recordatorio de Próximo Curso',
                                text: `Estimado Profesor,\n\nAquí tienes la información de tu próximo curso:\n\n${courseInfo}\n\nPor favor confirma con la secretaría.\n\nSaludos,\nAdministración`
                            };
    
                            await transporter.sendMail(mailOptions);
                            console.log(`Correo enviado exitosamente a ${userEmail}`);
                        } else {
                            console.log(`No se encontró correo electrónico para el profesor con ID ${idUser}`);
                        }
                    }
                }
        }
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};
export const sendStudentEmails = async () => {
    logger.debug("DEBUG: Entrando en sendStudentEmails");
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        // Obtener todos los estudiantes
        const [students] = await pool.query(`
            SELECT u.idUser, u.email
            FROM User u
            WHERE u.role = 'student'
        `);
        logger.info("INFO: Datos de login obtenidos exitosamente");

        for (const student of students) {
            logger.debug(`DEBUG: Procesando estudiante con ID: ${student.idUser}`);
            const idUser = student.idUser;
            const userEmail = student.email;

            // Obtener el último curso de cada idCourseInProgress del estudiante
            const [courseRows] = await pool.query(`
                SELECT ic.idInformacion, ic.idCourseInProgress_fk, ic.horario, DATE_FORMAT(ic.fecha, '%Y-%m-%d') as fecha, ic.ubicacion
                FROM InformacionCursos ic
                JOIN CourseInProgress cip ON ic.idCourseInProgress_fk = cip.idCourseInProgress
                WHERE cip.idUser_fk = ?
                AND ic.fecha = (
                    SELECT MAX(ic2.fecha)
                    FROM InformacionCursos ic2
                    WHERE ic2.idCourseInProgress_fk = ic.idCourseInProgress_fk
                )
                ORDER BY ic.idCourseInProgress_fk, ic.fecha DESC`, [idUser]);
            logger.info(`INFO: Número de cursos obtenidos para el estudiante ${idUser}: ${courseRows.length}`);

            for (const row of courseRows) {
                // Comprobar el estado de la encuesta
                const [surveyStatus] = await pool.query(`
                    SELECT EstadoEncuesta
                    FROM Encuesta
                    WHERE idCourseInProgress_fk = ? AND idUser_fk = ?`, [row.idCourseInProgress_fk, idUser]);
                const idCourseInProgress=row.idCourseInProgress_fk

                if (surveyStatus.length > 0 && surveyStatus[0].estado !== 'realizado') {
                    // Determinar la frecuencia de envío de correos electrónicos
                    const fechaCurso = new Date(row.fecha);
                    const diffInDays = 6;
                    let sendEmail = false;

                    if (diffInDays <= 7) {
                        sendEmail = true;
                    }

                    if (sendEmail) {
                        const courseInfo = `
                            Curso ID: ${row.idCourseInProgress_fk}
                            Horario: ${row.horario}
                            Fecha: ${row.fecha}
                            Ubicación: ${row.ubicacion}
                        `;

                        if (userEmail) {
                            const mailOptions = {
                                from: 'bpesociedad@gmail.com',
                                to: userEmail,
                                subject: 'Recordatorio para completar la encuesta del curso',
                                text: `Estimado Estudiante,\n\nPor favor, completa la encuesta para el siguiente curso:\n\n${courseInfo}\n\nHaz clic en el siguiente enlace para confirmar que has completado la encuesta: http://localhost:3000/Estado/${idUser}/${idCourseInProgress} \n\nSaludos,\nAdministración`
                            };

                            await transporter.sendMail(mailOptions);
                            console.log(`Correo enviado exitosamente a ${userEmail}`);
                        } else {
                            console.log(`No se encontró correo electrónico para el estudiante con ID ${idUser}`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};
// Exportar las funciones para uso futuro
export const SendProfessorEmails = async (req, res) => {
    try {
        await sendProfessorEmails();
        res.status(200).json({ message: 'Correos enviados exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'ERROR: something goes wrong' });
    }
};

// Exportar las funciones para uso futuro
export const SendRememberEmail = async (req, res) => {
    try {
        await sendRememberEmail();
        res.status(200).json({ message: 'Correos enviados exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'ERROR: something goes wrong' });
    }
};
export const SendStudentEmails = async (req, res) => {
    try {
        await sendStudentEmails();
        res.status(200).json({ message: 'Correos enviados exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'ERROR: something goes wrong' });
    }
};