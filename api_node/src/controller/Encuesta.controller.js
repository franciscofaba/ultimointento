import { pool } from '../db.js';
import logger from '../logger.js'; // Asegúrate de tener un módulo de logger configurado

export const updateEncuestaEstado = async (req, res) => {
    try {
        const { idUser_fk, idCourseInProgress_fk } = req.params;
        logger.debug(`DEBUG: Actualizando estado de encuesta para usuario ID: ${idUser_fk} y curso ID: ${idCourseInProgress_fk}`);

        const [result] = await pool.query(`
            UPDATE Encuesta 
            SET EstadoEncuesta = 'realizada' 
            WHERE idUser_fk = ? AND idCourseInProgress_fk = ?`, [idUser_fk, idCourseInProgress_fk]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'No se encontró información de la encuesta para actualizar'
            });
        }

        res.send('<html><body><h1>Encuesta realizada</h1></body></html>');
    } catch (error) {
        logger.error("Error al actualizar el estado de la encuesta:", error);
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};
