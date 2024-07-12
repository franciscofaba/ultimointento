import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: '/logs/error.log', level: 'error' }),
        new transports.File({ filename: '/logs/combined.log' }),
        new transports.Console()
    ]
});

export default logger;
