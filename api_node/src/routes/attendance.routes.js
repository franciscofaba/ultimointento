import { Router } from 'express'
import {getAttendance, CreateAttendanceByProfessor, UpdateAttendanceByStudent, getAttendanceByDate, getallAttendanceprofessor, getallAttendanceStudent,getAttendanceCountByDate,postAttendanceCount,getFaceCount} from '../controller/attendance.controller.js'
const router = Router()

router.get('/attendance', getAttendance)

router.get('/attendanceByDate/:idCourseFromCareer_fk/:date', getAttendanceByDate)

router.post('/attendance/professor/:idUser', CreateAttendanceByProfessor)

router.patch('/attendance/student', UpdateAttendanceByStudent)

router.get('/attendance/professor/all/:idUser', getallAttendanceprofessor)

router.get('/attendance/student/all/:idUser', getallAttendanceStudent)

router.get('/attendance/count/:idCourseFromCareer_fk/:date', getAttendanceCountByDate)

router.post('/attendance/facecount', postAttendanceCount)

router.get('/attendance/Countface/:date/:idCourseFromCareer_fk', getFaceCount)
export default router