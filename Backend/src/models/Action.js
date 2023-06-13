const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const ActionSchema = new Schema({
    accountID:
    {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    to:
    {
        type: Types.ObjectId,
        refPath: "actionTo",
        required: true
    },
    actionTo:
    {
        type: String,
        enum: ["Post", "Comment"],
        required: true
    },
    action:
    {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Action = mongoose.model('Action', ActionSchema)

module.exports = Action