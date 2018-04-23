import { Request, Response } from 'express';
import { DweeterSearchResult } from '../helper-classes';

export interface IDweeterDb {
    searchDweeter(dweeterName: String): Promise<DweeterSearchResult[]>;
    followDweeter(userId: String, followerId: string): Promise<Boolean>;
}

export const DweeterDbToken = Symbol('DweeterDbToken');