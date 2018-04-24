import { IDweeterController, IDweeterDb, DweeterDbToken, DweeterDb } from ".";
import { Request, Response } from 'express';
import { customRoute, Route, ILogger, LoggerFactory } from "../logger-and-decoretor";
import { injectable } from "inversify";
import { container } from "../inversify.config";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";

@injectable()
export class DweeterController implements IDweeterController {
    private logger: ILogger;
    constructor() {
        this.logger = LoggerFactory.getLogger();
    }

    @customRoute(new Route('get', '/search', ensureAuthenticated))
    public async searchDweeter(req: Request, res: Response): Promise<any> {
        try {
            const dweeterName = req.query.queryString;

            //const dweeterDb = container.get<IDweeterDb>(DweeterDbToken);
            const dweeterDb = new DweeterDb();
            const searchResult = await dweeterDb.searchDweeter(dweeterName);
            return res.status(200).send(searchResult);
        } catch (err) {
            this.logger.error(err);
            return res.status(500).send('Unknown error occured');
        }
    }

    @customRoute(new Route('patch', '/:followerId/follow', ensureAuthenticated))
    public async followDweeter(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.headers.userid as string;
            const followerId = req.params.followerId;

            //const dweeterDb = container.get<IDweeterDb>(DweeterDbToken);
            const dweeterDb = new DweeterDb();
            const dbResult = await dweeterDb.followDweeter(userId, followerId);
            return res.status(200).send(dbResult);
        } catch (err) {
            this.logger.error(err);
            return res.status(500).send('Unknown error occured');
        }
    }
}