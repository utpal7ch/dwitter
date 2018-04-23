import { ILogger } from "./logger.interface";
var winston = require('winston');
var fs = require('fs');

export class WinstonLogger implements ILogger {
    private logger: any;

    constructor() {
        var dir = 'logs';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' })
            ]
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }));
        }
    }

    info(msg: string): void {
        this.logger.info(msg);
    }

    debug(msg: string): void {
        this.logger.info(msg);
    }
    error(error: string | object): void {
        this.logger.info(error);
    }
}