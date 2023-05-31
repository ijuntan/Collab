const mongoose = require('mongoose')

const { Schema } = mongoose;

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
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post