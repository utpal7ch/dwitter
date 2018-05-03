import { IUser } from "../models";
import { DbResult } from "../helper-classes";

export interface IAccountDb {
    signUp(user: IUser): Promise<DbResult>;
    login(user: IUser): Promise<any>;
    isValidUserId(userId: String): Promise<Boolean>;
}

export const AccountDbToken = Symbol('AccountDbToken');