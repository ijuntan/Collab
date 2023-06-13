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
    to: {
        type: Types.ObjectId,
        refPath: "repliedTo",
        required:true,
        
    },
    repliedTo: {
        type: String,
        enum: ['Post', 'Comment'],
        required: true,
    },
    comment: {
        type: [Types.ObjectId],
        ref:"Comment",
        required: false
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