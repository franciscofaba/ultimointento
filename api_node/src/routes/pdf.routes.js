import { Router } from 'express';
import multer from 'multer';
import { uploadPDF, downloadPDF, getDocumentsWithUserInfo  } from '../controller/pdf.controller.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/api/pdf/upload', upload.single('archivoPDF'), uploadPDF);

router.get('/api/pdf/download/:id', downloadPDF);
router.get('/api/pdf/All', getDocumentsWithUserInfo);

export default router;