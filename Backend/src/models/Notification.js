const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const NotificationSchema = new Schema({
    sender: {
        type: Types.ObjectId,
        ref:"User",
        required: false
    },
    receiver: {
        type: Types.ObjectId,
        ref:"User",
        required: true
    },
    content: String,
    isRead: false
},{
    timestamps: true
})

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification