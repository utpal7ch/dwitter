import * as mongoose from 'mongoose';

export interface IComment {
    message: String;
    commentDate: Date;
    commentBy: String; // userIds
}

export interface IDweet {
    dweeterId: String; // userId
    createdDate: Date;
    message: String;
    likes: [String]; // userIds
    redweets: [String]; // userIds
    comments: [IComment];
}

interface IDweetModel extends IDweet, mongoose.Document { }

const dweetSchema = new mongoose.Schema({
    dweeterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'DweeterId is required'],
        ref: 'User',
    },
    createdDate: {
        type: Date,
        required: true,
        default: new Date(),
    },
    message: {
        type: String,
        required: [true, 'Dweet message is required'],
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'LikerId is required'],
        ref: 'User',
    }],
    redweets: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'RedweeterId is required'],
        ref: 'User',
    }],
    comments: [{
        message: { type: String, required: [true, 'Comment message is required'], },
        commentDate: { type: Date, required: true, default: new Date(), },
        commentBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'CommenterId is required'],
            ref: 'User',
        },
    }],
});

export const Dweet = mongoose.model<IDweetModel>('Dweet', dweetSchema);
