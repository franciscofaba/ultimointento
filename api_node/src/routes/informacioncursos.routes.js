import { Router } from 'express'
import {getInformacioncursos,getInformacioncursosbyid,getinformaciongradobyid} from '../controller/informacioncursos.controller.js'
const router = Router()

router.get('/informacioncursos', getInformacioncursos)

router.get('/informacioncursos/:idUser_fk', getInformacioncursosbyid)

router.get('/informaciongrados/:idCarrer_fk', getinformaciongradobyid)



export default router