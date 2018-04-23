import * as bodyParser from 'body-parser';
import { Application, NextFunction, Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { InjectionToken } from './injection-token';
import { AppConfig } from './app-config';
import { IAccountController, AccountControllerToken } from './account';
import { getRouter, ILogger, LoggerFactory } from './logger-and-decoretor';
import * as mongoose from "mongoose";
import { IDweetController, DweetControllerToken } from './dweet';
import { IDweeterController, DweeterControllerToken } from './dweeter';

@injectable()
export class App {
    public expressApp: Application;
    private accountController: IAccountController;
    private dweetController: IDweetController;
    private dweeterController: IDweeterController;
    private logger: ILogger;

    constructor(
        @inject(AccountControllerToken) accountController: IAccountController,
        @inject(DweetControllerToken) dweetController: IDweetController,
        @inject(DweeterControllerToken) dweeterController: IDweeterController,
        @inject(InjectionToken.ExpressApplicationToken) expressApp: Application, ) {
        this.logger = LoggerFactory.getLogger();
        this.accountController = accountController;
        this.dweetController = dweetController;
        this.dweeterController = dweeterController;
        this.expressApp = expressApp;
        this.configure();
    }

    private configure() {
        this.addGlobalMiddlewares();
        this.configureRoutes();
        this.setupMongoDb();
    }

    private configureRoutes() {
        this.expressApp.use('/account', getRouter(this.accountController));
        this.expressApp.use('/dweet', getRouter(this.dweetController));
        this.expressApp.use('/dweeter', getRouter(this.dweeterController));
    }

    private setupMongoDb(): void {
        mongoose.connect(AppConfig.mogoConnectionString);
        mongoose.connection.on("error", (err: any) => {
            this.logger.error(`MongoDB connection err: ${err}`);
        });
    }

    private setHeaders = (req: Request, res: Response, next: NextFunction) => {
        // Setting CORS headers
        if (req.headers.origin) {
            res.header('Access-Control-Allow-Origin', req.headers.origin.toString());
        }
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
        next();
    }

    private addGlobalMiddlewares() {
        this.expressApp.use(this.setHeaders);
        this.expressApp.use(bodyParser.json({
            limit: '50mb',
        }));
        this.expressApp.use(bodyParser.urlencoded({
            extended: true,
            limit: '50mb',
        }));
    }
}

export const AppToken = Symbol('App');
