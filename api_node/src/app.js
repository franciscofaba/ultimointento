import app from './index.js';
import { PORT, HOST } from './config.js';
import cron from 'node-cron';
import { sendRememberEmail, sendStudentEmails, sendProfessorEmails } from '../src/controller/EnviarEmail.controller.js';
import logger from './logger.js';  // Importa el logger

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Servidor escuchando en http://${HOST}:${PORT}`);  // Usa logger.info
    

    
    // Si deseas seguir usando `cron` para ejecutar otras tareas periódicamente, puedes mantener la configuración de `cron`
    //cron.schedule('* * * * *', () => {
        //console.log('Tarea de cron ejecutándose cada minuto.');
        // Puedes descomentar estas funciones si también necesitas que se ejecuten periódicamente
        // sendRememberEmail();
        // sendStudentEmails();
        // sendProfessorEmails();
    //});
    
});

