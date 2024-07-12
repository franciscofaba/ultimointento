import { Router } from 'express'
import {getCourseInProgress,getCourseInProgressbyState,UpdateinterState} from '../controller/CourseInProgress.controller.js'
const router = Router()

router.get('/CourseInProgress', getCourseInProgress)
router.get('/CourseInProgress/:idUser', getCourseInProgressbyState)
router.patch('/CourseInProgress/state/', UpdateinterState)



export default router

