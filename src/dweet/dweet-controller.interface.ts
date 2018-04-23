import { Request, Response } from 'express';

export interface IDweetController {
    getAllFollowedDweets(req: Request, res: Response): Promise<any>;
    createDweet(req: Request, res: Response): Promise<any>;
    likeDweet(req: Request, res: Response): Promise<any>;
    commentOnDweet(req: Request, res: Response): Promise<any>;
    searchDweet(req: Request, res: Response): Promise<any>;
}

export const DweetControllerToken = Symbol('DweetControllerToken');