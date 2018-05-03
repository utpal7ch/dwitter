import { injectable } from "inversify";
import { IAccountDb } from ".";
import { IUser, User } from "../models";
import { DbResult, ValidationError } from "../helper-classes";

@injectable()
export class AccountDb implements IAccountDb {

    public async signUp(user: IUser): Promise<DbResult> {
        return new Promise<DbResult>((resolve) => {
            const userModel = new User(user);
            userModel.save((err, result) => {
                if (err) {
                    resolve(new DbResult(this.handleSignupError(err), undefined));
                } else {
                    resolve(new DbResult(undefined, result.toJSON()));
                }
            });
        });
    }

    public async login(user: IUser): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const query = User.find({ userName: user.userName, password: user.password });
            query.select('_id userName fullName');

            query.exec((err, result) => {
                if (err) {
                    reject(`Mongoose error: ${err}`);
                } else {
                    resolve(result[0] ? result[0].toJSON() : null);
                }
            });
        });
    }

    public async isValidUserId(userId: String): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            User.findById(userId, '_id', (err, result) => {
                if (err || !result) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }

    private handleSignupError(error: any): ValidationError[] {
        const retVal: ValidationError[] = [];
        if (error.name && error.name === 'ValidationError') {
            for (const key in error.errors) {
                retVal.push({
                    key: key,
                    message: error.errors[key].message,
                });
            }
        } else if (error.code && Number(error.code) === 11000) {
            retVal.push({
                key: 'userName',
                message: 'Username already exist'
            });
        } else {
            throw new Error(`Unhandled mongoose error: ${error}`);
        }
        return retVal;
    }
}