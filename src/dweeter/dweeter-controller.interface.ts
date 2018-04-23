import { Request, Response } from 'express';

export interface IDweeterController {
    searchDweeter(req: Request, res: Response): Promise<any>;
    followDweeter(req: Request, res: Response): Promise<any>;
}

export const DweeterControllerToken = Symbol('DweeterControllerToken');