import { ILogger, LoggerFactory } from './logger-and-decoretor';
import * as http from 'http';
import { container } from './inversify.config';
import 'reflect-metadata';
import { App, AppToken } from './app';

export class Server {
    private port: number;
    private isHttps: boolean;
    private logger: ILogger;

    constructor(port: number, isHttps: boolean = false) {
        this.port = port;
        this.isHttps = isHttps;
        this.logger = LoggerFactory.getLogger();
    }

    public start() {
        const app = container.get<App>(AppToken);
        const httpServer = http.createServer(app.expressApp);
        httpServer.listen(this.port);
        httpServer.on('error', (err) => {
            this.logger.error(`An Unhandled error has occured ${err.message}`);
        });
        httpServer.on('listening', () => {
            const bind = typeof this.port === 'string'
                ? 'Pipe ' + this.port
                : 'Port ' + this.port;
            this.logger.info('Listening on ' + bind);
        });
    }
}
