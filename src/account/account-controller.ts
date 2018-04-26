import { injectable } from "inversify";
import { container } from "../inversify.config";
import { Request, Response } from 'express';
import { customRoute, Route, ILogger, LoggerFactory } from "../logger-and-decoretor";
import { IUser } from "../models";
import { IAccountController, IAccountDb, AccountDbToken, AccountDb } from ".";

@injectable()
export class AccountController implements IAccountController {
    private logger: ILogger;
    constructor() {
        this.logger = LoggerFactory.getLogger();
    }

    @customRoute(new Route('post', '/signup'))
    public async signUp(req: Request, res: Response): Promise<any> {
        try {
            const user = {
                userName: req.body.userName,
                email: req.body.email,
                fullName: req.body.fullName,
                password: req.body.password,
            };
            const accountDb = container.get<IAccountDb>(AccountDbToken);
            const dbResult = await accountDb.signUp(user as any);
            if (dbResult.errors) {
                return res.status(400).send(dbResult.errors);
            } else {
                return res.status(200).send(dbResult.result);
            }
        } catch (err) {
            this.logger.error(err);
            return res.status(500).send('Unknown error occured');
        }
    }
}