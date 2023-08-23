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
    list: {
        type: [String],
        required: true,
    },
    category: {
        type: [String],
        required: true,
    },
    members: {
        type: [{
            member: {
                type: Types.ObjectId,
                ref: "User",
            },
            permission: String
        }],
        required: true,
    },
    link: {
        type: [{name:String, web:String}],
        required: false,
    },
    document: {
        type: [Types.ObjectId],
        ref: "Document",
        required: false,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: true
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project