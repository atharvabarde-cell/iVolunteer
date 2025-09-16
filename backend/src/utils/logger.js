import {createLogger, format, transports} from "winston"
import DailyRotateFile from "winston-daily-rotate-file"


const logFormat = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss:SSS' // More precise timestamp with milliseconds
    }),
    format.errors({stack: true}), // Include stack traces for errors
    format.json(), // Use JSON format for better parsing
    format.printf(({timestamp, level, message}) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
);

export const logger = createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss:SSS'
                }),
                format.printf(({timestamp, level, message}) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`
                })
            )
        }),

        new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,// compress old logs
            maxSize: "10m",
            maxFiles: "14d",
            auditFile: 'logs/audit.json' // Track log file rotations
        }),
        new DailyRotateFile({
            level: 'error',
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: "5m",
            maxFiles: "30d",
            auditFile: 'logs/error-audit.json' // Track log file rotations
        })
    ],

    exceptionHandlers:[
        new transports.File({filename: 'logs/exceptions.log'})
    ],
    rejectionHandlers: [
        new transports.File({filename: 'logs/rejections.log'})
    ],
    exitOnError: false
});

import fs from 'fs';
if(!fs.existsSync('logs')){
    fs.mkdirSync('logs', {recursive: true});
}


