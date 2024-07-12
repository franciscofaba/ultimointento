import { Router } from 'express'

import {pong} from '../controller/index.controller.js'

const router = Router()

router.get('/ping', pong );


export default router