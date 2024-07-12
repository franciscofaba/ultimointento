import { Router } from 'express'
import {getRegulation,getRegulationByidCourse} from '../controller/regulation.controller.js'
const router = Router()

router.get('/regulation', getRegulation)

router.get('/regulation/:idCourse_fk', getRegulationByidCourse)





export default router