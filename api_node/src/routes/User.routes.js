import { Router } from 'express'

import {getUser,getUserById,createUser,updateUser,deleteUserById} from '../controller/User.controller.js'
import { validateToken } from '../controller/settings/keys.js'
const router = Router()

router.get('/User', getUser)

router.get('/User/:idUser', getUserById)

router.post('/User', createUser)

router.patch('/User/:idUser', updateUser)

router.delete('/User/:idUser', deleteUserById)

export default router