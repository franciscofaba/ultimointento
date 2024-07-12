
import {pool} from '../db.js'


export const getCareer = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Career');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las carreras:', error.message); // Es útil registrar el mensaje de error real para depuración
        return res.status(500).json({
            message: 'ERROR: something goes wrong'
        });
    }
};

export const getCareerById = async (req,res) => {
    try{
        console.log([req.params.idCareer])
        const [rows] = await pool.query('SELECT * FROM Career WHERE idCareer = ?', [req.params.idCareer])
        if (rows.length <= 0 ) return res.status(404).json({
            message:'no se encontro envio'
        })
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }   
}
