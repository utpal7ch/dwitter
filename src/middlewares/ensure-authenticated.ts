import { Request, Response, NextFunction } from 'express';
import { container } from '../inversify.config';
import { IAccountDb, AccountDbToken, AccountDb } from '../account';
import { ILogger, LoggerFactory } from '../logger-and-decoretor';

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.headers.userid) {
        const logger: ILogger = LoggerFactory.getLogger();
        const accountDb = container.get<IAccountDb>(AccountDbToken);
        try {
            const isUserExist = await accountDb.isValidUserId(req.headers.userid as string);
            if (isUserExist) {
                logger.info(`Authenticated request from userId: ${req.headers.userid}`);
                next();
            } else {
                logger.info(`Unauthenticated request from userId: ${req.headers.userid}`);
                return res.status(401).send('Unauthenticated');
            }
        } catch (err) {
            logger.error(err);
            return res.status(401).send('Unauthenticated');
        }
    } else {
        return res.status(401).send('Unauthenticated');
    }
}