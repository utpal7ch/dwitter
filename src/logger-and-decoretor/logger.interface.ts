
export interface ILogger {
    info(msg: string): void;
    debug(msg: string): void;
    error(error: string | object): void;
}

export const ILoggerToken = Symbol('ILogger'); 