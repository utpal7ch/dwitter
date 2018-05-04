import { Request, Response } from 'express';
import { DweeterSearchResult } from '../helper-classes';

export interface IDweeterDb {
    searchDweeter(userId: string, dweeterName: String): Promise<DweeterSearchResult[]>;
    followDweeter(userId: String, followerId: string): Promise<Boolean>;
}

export const DweeterDbToken = Symbol('DweeterDbToken');