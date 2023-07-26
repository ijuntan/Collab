const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    like: {
        type: Number,
        required: true
    },
    dislike: {
        type: Number,
        required: true
    },
    root: {
        type: Types.ObjectId,
        refPath: "Comment",
        required: false,
    },
    parent: {
        type: Types.ObjectId,
        refPath: "Comment",
        required: false,
    },
    postId: {
        type: Types.ObjectId,
        refPath: "Post",
        required:true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment