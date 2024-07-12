import { Router } from 'express'

import { postDashboardByEmail } from '../controller/Page.Controller.js';

const router = Router()
// Funciones de vista (asegúrate de definirlas o actualizar con tus funciones actuales)

router.post('/Dashboard/login', postDashboardByEmail);
  

  




  
export default router

