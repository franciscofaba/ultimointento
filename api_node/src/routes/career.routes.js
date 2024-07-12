import { Router } from 'express'
import {getCareer,getCareerById} from '../controller/career.controller.js'
const router = Router()

router.get('/career', getCareer)

router.get('/career/:idCareer', getCareerById)





export default router