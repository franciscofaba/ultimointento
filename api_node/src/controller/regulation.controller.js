import {pool} from '../db.js'


export const getRegulation = async (req,res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM Regulation')
        res.json(rows)

    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }
    
}

export const getRegulationByidCourse = async (req,res) => {
    try{
        console.log([req.params.idCourseFromCareer_fk])
        const [rows] = await pool.query('SELECT * FROM Regulation WHERE idCourseFromCareer_fk = ?', [req.params.idCourseFromCareer_fk])
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


