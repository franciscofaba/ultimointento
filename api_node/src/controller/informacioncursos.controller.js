import { pool } from '../db.js';

// Función para obtener la información de los cursos
export const getInformacioncursos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM InformacionCursos');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};

// Función para obtener la información de los cursos por ID
export const getInformacioncursosbyid = async (req, res) => {
    try {
        const { idUser_fk } = req.params;
        const currentDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato 'YYYY-MM-DD'
        console.log(`Fetching information for user ID: ${idUser_fk} from date: ${currentDate}`);

        const [rows] = await pool.query(`
            SELECT idInformacion, idCourseInProgress_fk, horario, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, ubicacion 
            FROM InformacionCursos 
            WHERE idUser_fk = ? AND fecha >= ?
            ORDER BY fecha ASC 
            LIMIT 3`, [idUser_fk, currentDate]);

        if (rows.length <= 0) {
            return res.status(404).json({
                message: 'No se encontró información del curso'
            });
        }

        res.json(rows);
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};

export const getinformaciongradobyid = async (req, res) => {
    try {
        const { idCarrer_fk } = req.params;

        const [rows] = await pool.query(`
            SELECT idCareer, careerName, degreeType 
            FROM Career
            WHERE idCareer = ? `
            , [idCarrer_fk]);

        if (rows.length <= 0) {
            return res.status(404).json({
                message: 'No se encontró información del curso'
            });
        }

        res.json(rows);
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};
