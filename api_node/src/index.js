import express from 'express'
import indexRoutes from './routes/index.routes.js'
import UserRoutes from './routes/User.routes.js'
import loginRoutes from './routes/login.routes.js'
import CourseFromCareerRoutes from './routes/CourseFromCareer.routes.js'
import careerRoutes from './routes/career.routes.js'
import CourseInProgressRoutes from './routes/CourseInProgress.routes.js'
import attendanceRoutes from './routes/attendance.routes.js'
import regulationRoutes from './routes/regulation.routes.js'
import informacioncursos from './routes/informacioncursos.routes.js'
import pageroute from './routes/Page.routes.js'
import Encuesta from './routes/Encuesta.routes.js'
import chatRoutes from './routes/chatbot.routes.js' // Importa la nueva ruta
import dotenv from "dotenv";
import expressLayout from 'express-ejs-layouts'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pdfroutes from './routes/pdf.routes.js'
import PreguntasyRespuestas from './routes/PreguntasyRespuestas.routes.js'
import { validateToken } from './controller/settings/keys.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4200',
    'http://20.195.171.94:3000',
    'http://20.195.171.94:4200',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4200'
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,OPTIONS,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  };
  
  app.use(cors(corsOptions));

app.use(indexRoutes)
app.use('/api', UserRoutes)
app.use('/api', loginRoutes)
app.use('/api', CourseFromCareerRoutes)
app.use('/api', careerRoutes)
app.use('/api', CourseInProgressRoutes)
app.use('/api', attendanceRoutes)
app.use('/api', regulationRoutes)
app.use('/api', informacioncursos)
app.use('/api', Encuesta)
app.use('/api', chatRoutes) // Usa la nueva ruta para el chat
app.use(pageroute)
app.use(pdfroutes)
app.use('/api', PreguntasyRespuestas)

export default app;
