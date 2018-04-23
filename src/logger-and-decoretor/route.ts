import { Handler } from 'express';
import { injectable } from 'inversify';

@injectable()
export class Route {
    public method: string;
    public path: string;
    public handlers: Handler[];

    constructor(method: string, path: string, ...handlers: Handler[]) {
        this.method = method;
        this.path = path;
        this.handlers = handlers;
    }
}
