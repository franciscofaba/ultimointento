import { Router } from 'express'

import {postPreguntas,getRespuesta} from '../controller/PreguntasyRespuestas.controller.js'
const router = Router()

router.get('/Respuesta/:pregunta', getRespuesta)

router.post('/Pregunta', postPreguntas)

export default router