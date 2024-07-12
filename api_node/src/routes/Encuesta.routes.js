import { Router } from 'express'
import {updateEncuestaEstado} from '../controller/Encuesta.controller.js'
const router = Router()

router.put('/Encuesta/:idUser_fk/:idCourseInProgress_fk',updateEncuestaEstado )




export default router