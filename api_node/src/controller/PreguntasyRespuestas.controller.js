
import {pool} from '../db.js'

export const getRespuesta = async (req, res) => {
    const { pregunta } = req.params; // Obtener la pregunta del parámetro de la URL
    const preguntaNormalizada = pregunta.toLowerCase(); // Normalizar la pregunta

    try {
        // Consulta para obtener la respuesta correspondiente a la pregunta normalizada
        const [rows] = await pool.query('SELECT respuesta FROM preguntasrespuestas WHERE pregunta = ?', [preguntaNormalizada]);

        if (rows.length > 0) {
            // Si se encuentra una coincidencia, devolver la respuesta
            res.json({ respuesta: rows[0].respuesta });
        } else {
            // Si no se encuentra ninguna coincidencia, devolver un mensaje adecuado
            res.json({ message: 'No se encontró una respuesta para la pregunta proporcionada.' });
        }
    } catch (error) {
        // Registrar el mensaje de error real para depuración
        console.error('Error al obtener la respuesta:', error.message);

        // Enviar una respuesta de error al cliente
        return res.status(500).json({
            message: 'ERROR: algo salió mal'
        });
    }
};

export const postPreguntas = async (req, res) => {
    try {
        const { pregunta, respuesta } = req.body;
        const preguntaNormalizada = pregunta.toLowerCase(); // Normalizar la pregunta antes de insertarla

        // Inserta los datos en la tabla `preguntasrespuestas`
        const [result] = await pool.query(
            'INSERT INTO preguntasrespuestas (pregunta, respuesta) VALUES (?, ?)',
            [preguntaNormalizada, respuesta]
        );

        res.status(201).json({
            message: 'Pregunta y respuesta insertadas con éxito',
            insertId: result.insertId // Cambié a `insertId` para que sea consistente
        });
    } catch (error) {
        console.error('Error al insertar la pregunta y respuesta:', error.message);
        return res.status(500).json({
            message: 'ERROR: algo salió mal'
        });
    }
};
  
