const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const PostSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true,
    },
    like: {
        type: Number,
        required: true
    },
    comment: {
        type: [Types.ObjectId],
        ref:'Comment',
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

const Post = mongoose.model('Post', PostSchema)

module.exports = Post