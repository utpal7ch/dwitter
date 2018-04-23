import { DbResult } from "../helper-classes";
import { IDweet, IComment } from "../models";

export interface IDweetDb {
    createDweet(dweet: IDweet): Promise<DbResult>;
    likeDweet(userId: String, dweeetId: String): Promise<Boolean>;
    commentOnDweet(dweetId: String, comment: IComment): Promise<DbResult>;
    searchDweet(message: String): Promise<any[]>;
    getAllFollowedDweets(userId: String): Promise<any>;
}

export const DweetDbToken = Symbol('DweetDbToken');