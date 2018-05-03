import { Request, Response } from 'express';

export interface IAccountController {
    signUp(req: Request, res: Response): Promise<any>;
    login(req: Request, res: Response): Promise<any>;
}

export const AccountControllerToken = Symbol('AccountControllerToken');