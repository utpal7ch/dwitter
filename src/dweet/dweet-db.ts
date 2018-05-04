import { IDweetDb } from ".";
import { IDweet, Dweet, User, IComment } from "../models";
import { DbResult, ValidationError } from "../helper-classes";
import { injectable } from "inversify";

@injectable()
export class DweetDb implements IDweetDb {

    public async getAllFollowedDweets(userId: String): Promise<any> {
        return new Promise<any>((resolve) => {
            User.findById(userId)
                .populate({
                    path: 'followings',
                    select: 'dweets userName',
                    //populate: { path: 'dweets' }
                })
                .exec((err, foundDweeters) => {
                    if (err) {
                        throw err;
                    } else {
                        const dweets: any[] = [];
                        const dweetIdDweeterMap = new Map<string, string>();

                        foundDweeters.followings.forEach((dweeter) => {
                            const userName = (dweeter as any).userName;
                            ((dweeter as any).dweets as any[]).forEach((dweetId) => {
                                dweets.push(dweetId);
                                dweetIdDweeterMap.set(dweetId.toString(), userName);
                            });
                        });
                        Dweet.find({ _id: { $in: dweets } })
                            .lean()
                            .exec((error, result) => {
                                if (err) {
                                    throw err;
                                } else {
                                    for (const dweet of result) {
                                        (dweet as any).dweeterName = dweetIdDweeterMap.get(dweet._id.toString());
                                    }
                                    resolve(result);
                                }
                            });
                    }
                })
        });
    }

    public async searchDweet(message: String): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            const condition = { message: { "$regex": message, "$options": "i" } };

            Dweet.find(condition, (err, foundDweets) => {
                if (err) {
                    throw err;
                } else {
                    resolve(foundDweets);
                }
            });
        });
    }

    public async commentOnDweet(dweetId: String, comment: IComment): Promise<DbResult> {
        return new Promise<DbResult>((resolve) => {
            Dweet.findById(dweetId, (err, dweet) => {
                if (err) {
                    throw err;
                } else {
                    dweet.comments.push(comment);
                    dweet.save((error, updatedDweet) => {
                        if (error) {
                            resolve(new DbResult(this.handleDbError(error), undefined));
                        } else {
                            resolve(new DbResult(undefined, updatedDweet.comments));
                        }
                    });
                }
            });
        });
    }

    public async likeDweet(userId: String, dweetId: String): Promise<Boolean> {
        return new Promise<Boolean>((resolve) => {
            const conditions = {
                _id: dweetId,
                likes: { $ne: userId }
            };
            const update = {
                $addToSet: { likes: userId }
            }

            Dweet.findOneAndUpdate(conditions, update, {new: true}, (err, doc) => {
                if (err) {
                    resolve(false);
                } else {
                    if(doc) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    public async createDweet(dweet: IDweet): Promise<DbResult> {
        return new Promise<DbResult>((resolve) => {
            const dweetModel = new Dweet(dweet);
            dweetModel.save((err, createdDweet) => {
                if (err) {
                    resolve(new DbResult(this.handleDbError(err), undefined));
                } else {
                    const condition = {
                        _id: dweet.dweeterId
                    };
                    const update = {
                        $addToSet: { dweets: createdDweet._id }
                    };
                    User.findByIdAndUpdate(condition, update, (error, foundUser) => {
                        if (error) {
                            createdDweet.remove((err, res) => {
                                if (err) {
                                    throw new Error(`Unable to delete dweet: ${createdDweet._id}`)
                                }
                            });
                        }
                        resolve(new DbResult(undefined, createdDweet.toJSON()));
                    });
                }
            });
        });
    }

    private handleDbError(error: any): ValidationError[] {
        const retVal: ValidationError[] = [];
        if (error.name && error.name === 'ValidationError') {
            for (const key in error.errors) {
                retVal.push({
                    key: key,
                    message: error.errors[key].message,
                });
            }
        } else {
            throw new Error(`Unhandled mongoose error: ${error}`);
        }
        return retVal;
    }
}