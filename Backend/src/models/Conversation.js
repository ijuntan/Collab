const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const ConversationSchema = new Schema({
    participants: {
        type: [Types.ObjectId],
        ref:"User",
        required: true
    },
    messages: {
        type: [{
            sender: {
                type: Types.ObjectId,
                ref:"User",
                required: true
            },
            message: {
                type: String,
                required: true
            },
            time: {
                type: Date,
                required: true,
            }
        }],
        required: false
    }
})

const Conversation = mongoose.model('Conversation', ConversationSchema)

module.exports = Conversation