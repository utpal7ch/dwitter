import { ILogger } from "./logger.interface";
import { WinstonLogger } from './winston-logger';

export class LoggerFactory {
    private static logger: ILogger;

    public static getLogger(): ILogger {
        if(!LoggerFactory.logger) {
            LoggerFactory.logger = new WinstonLogger();
        }
        return LoggerFactory.logger;
    }
}