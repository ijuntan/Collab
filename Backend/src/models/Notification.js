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
    projectId: {
        type: Types.ObjectId,
        ref:"Project",
        required: false
    },
    msg: String,
    isRead: { type: Boolean, default: false }
},{
    timestamps: true
})

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification