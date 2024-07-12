import { Router } from 'express'
import {getCourse,getCourseByCareer} from '../controller/CourseFromCareer.controller.js'
const router = Router()

router.get('/CourseFromCareer', getCourse)

router.get('/CourseFromCareer/:idCareer', getCourseByCareer)





export default router