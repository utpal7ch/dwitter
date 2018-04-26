import { container } from "../inversify.config";
import { IDweetController, DweetDb, IDweetDb, DweetDbToken } from ".";
import { Request, Response } from 'express';
import { customRoute, Route, ILogger, LoggerFactory } from "../logger-and-decoretor";
import { injectable } from "inversify";
import { Dweet } from "../models";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";


@injectable()
export class DweetController implements IDweetController {
    private logger: ILogger;
    constructor() {
        this.logger = LoggerFactory.getLogger();
    }

    @customRoute(new Route('get', '/', ensureAuthenticated))
    public async getAllFollowedDweets(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.headers.userid as String;

            const dweetDb = container.get<IDweetDb>(DweetDbToken);
            const result = await dweetDb.getAllFollowedDweets(userId);
            return res.status(200).send(result);
        } catch (err) {
            this.logger.error(err);
            return res.status(500).send('Unknown error occured');
        }
    }

    @customRoute(new Route('post', '/create', ensureAuthenticated))
    public async createDweet(req: Request, res: Response): Promise<any> {
        try {
            const dweet = {
                dweeterId: req.headers.userid,
                message: req.body.message,
            };
            const dweetDb = container.get<IDweetDb>(DweetDbToken);
            const dbResult = await dweetDb.createDweet(dweet as any);
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

    @customRoute(new Route('patch', '/:dweetid/like', ensureAuthenticated))
    public async likeDweet(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.headers.userid as String;
            const dweetId = req.params.dweetid;

            const dweetDb = container.get<IDweetDb>(DweetDbToken);
            const dbResult = await dweetDb.likeDweet(userId, dweetId);
            return res.status(200).send(dbResult);
        } catch (err) {
            this.logger.error(err);
            return res.status(500).send('Unknown error occured');
        }
    }

    @customRoute(new Route('put', '/:dweetid/comment', ensureAuthenticated))
    public async commentOnDweet(req: Request, res: Response): Promise<any> {
        try {
            const dweetId = req.params.dweetid;
            const comment = {
                message: req.body.message,
                commentBy: req.headers.userid as String,
            }

            const dweetDb = container.get<IDweetDb>(DweetDbToken);
            const dbResult = await dweetDb.commentOnDweet(dweetId, comment as any);
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

    @customRoute(new Route('get', '/search', ensureAuthenticated))
    public async searchDweet(req: Request, res: Response): Promise<any> {
        try {
            const message = req.query.queryString;

            const dweetDb = container.get<IDweetDb>(DweetDbToken);
            const searchResult = await dweetDb.searchDweet(message);
            return res.status(200).send(searchResult);
        } catch (err) {
            this.logger.error(err);
            return res.status(500).send('Unknown error occured');
        }
    }
}