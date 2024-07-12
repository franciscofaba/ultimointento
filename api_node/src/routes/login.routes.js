import { Router } from 'express'
import {getLogin,getLoginByEmail, postLoginByEmail} from '../controller/login.controller.js'
const router = Router()

router.get('/login1', getLogin)

router.get('/login/:email', getLoginByEmail)

router.post('/login', postLoginByEmail)




export default router