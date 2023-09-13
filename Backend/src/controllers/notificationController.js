const { Notification, Project } = require('../models')

module.exports = {
    async getNotifications(req, res) {
        try {
            const notifs = await Notification.find({receiver : req.params.id})
            res.status(200).send(notifs)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async getNotification(req, res) {
        try {
            const notif = await Notification.findOneAndUpdate({_id : req.params.id}, {isRead: true})
            console.log(notif)
            res.status(200).send(notif)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async createNotification(req, res) {
        try {
            const notif = await Notification.create({...req.body})
            res.status(200).send(notif)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async updateNotification(req, res) {
        try {
            const notif = await Notification.findOneAndUpdate({_id : req.params.id}, {...req.body})
            res.status(200).send(notif)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async deleteNotification(req, res) {
        try {
            const notif = await Notification.deleteOne({_id : req.params.id})
            res.status(200).send(notif)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async createInvitation(req, res) {
        try {
            const invitation = await Notification.create({...req.body})
            res.status(200).send(invitation)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async updateInvitation(req, res) {
        try {
            let msg;
            const {userAction} = req.body
            const inv = await Notification.findById(req.params.id).populate("receiver", "username").populate("projectId", "name")

            if(userAction === "accept") {

                await Project.findByIdAndUpdate(inv.projectId, {
                    $push: {members: {member: inv.receiver, permission: "member"}}
                })

                await Notification.create({
                    sender: inv.receiver._id,
                    receiver: inv.sender,
                    msg: `${inv.receiver.username} accepted your invitation to project ${inv.projectId.name}.`,
                    isRead: false
                })

                msg = "Invitation accepted!"
            }

            else {
                await Notification.create({
                    sender: inv.receiver._id,
                    receiver: inv.sender,
                    msg: `${inv.receiver.username} rejected your invitation to project ${inv.projectId.name}..`,
                    isRead: false
                })

                msg = "Invitation rejected!"
            }

            await Notification.deleteOne({_id: req.params.id})

            res.status(200).send({msg})
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },
}