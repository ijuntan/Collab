const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const ProjectSchema = new Schema({
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
    members: {
        type: [Types.ObjectId],
        ref: "User",
        required: true,
    },
    createdBy: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project