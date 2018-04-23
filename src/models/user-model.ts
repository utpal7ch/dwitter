import * as mongoose from 'mongoose';
import { CustomValidator } from '.';

export interface IUser {
    userName: String;
    email: String;
    fullName: String;
    password: String,
    dweets: Array<String>; // dweetIds
    redweets: Array<String>; // dweetIds
    followings: Array<String>; // userIds
    followers: Array<String>; // userIds
}

interface IUserModel extends IUser, mongoose.Document { }

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validator: [CustomValidator.validateEmail, 'Invalid email address'],
    },
    fullName: { type: String, required: [true, 'Name is required'], },
    password: { type: String, required: [true, 'Password is required'], },
    dweets: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'DweetId is required'],
        ref: 'User',
    }],
    redweets: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'DweetId is required'],
        ref: 'User',
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'DweeterId is required'],
        ref: 'User',
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'DweeterId is required'],
        ref: 'User',
    }],
});

export const User = mongoose.model<IUserModel>('User', userSchema);
