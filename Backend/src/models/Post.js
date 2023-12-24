const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const PredefinedDokumenCategory = [
    "image/jpeg",  
    "image/png", 
]

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
    tag: {
        type: String,
        required: false
    },
    like: {
        type: Number,
        required: true
    },
    dislike: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false,
    },
    project: {
        type: Types.ObjectId,
        ref: "Project",
        required: false,
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