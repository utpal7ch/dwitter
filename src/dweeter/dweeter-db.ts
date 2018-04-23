import { injectable } from "inversify";
import { IDweeterDb } from ".";
import { User } from "../models";
import { DweeterSearchResult } from "../helper-classes";

@injectable()
export class DweeterDb implements IDweeterDb {

    public async searchDweeter(dweeterName: String): Promise<DweeterSearchResult[]> {
        return new Promise<DweeterSearchResult[]>((resolve) => {
            const condition = { userName: { "$regex": dweeterName, "$options": "i" } };

            User.find(condition, (err, foundUsers) => {
                if (err) {
                    throw err;
                } else {
                    const result: DweeterSearchResult[] = [];
                    for (const user of foundUsers) {
                        result.push({
                            dweeterId: user._id,
                            dweeterName: user.userName,
                        });
                    }
                    resolve(result);
                }
            });
        });
    }

    public async followDweeter(userId: String, followerId: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve) => {
            const conditions = {
                _id: userId,
                followings: { $ne: followerId }
            };
            const update = {
                $addToSet: { followings: followerId }
            }

            User.findOneAndUpdate(conditions, update, (err, doc) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}