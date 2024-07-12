import {pool} from '../db.js'


export const getCourse = async (req,res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM CourseFromCareer')
        res.json(rows)

    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }
    
}

export const getCourseByCareer = async (req,res) => {
    try{
        console.log([req.params.idCareer])
        const [rows] = await pool.query('SELECT * FROM CourseFromCareer WHERE idCareer_fk = ?', [req.params.idCareer])
        if (rows.length <= 0 ) return res.status(404).json({
            message:'no se encontro envio'
        })
        res.json(rows)
    } catch(error) {
        return res.status(500).json({
            message:'ERROR: something goes wrong'
        })
    }   
}




