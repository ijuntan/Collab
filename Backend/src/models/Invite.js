const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const InviteSchema = new Schema({
    invited: {
        type: Types.ObjectId,
        ref:"User",
        required: true
    },
    sender: {
        type: Types.ObjectId,
        ref:"User",
        required: true
    },
    action: {
        type: String,
        required: true
    }
})

const Invite = mongoose.model('Invite', InviteSchema)

module.exports = Invite