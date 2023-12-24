const { Project, User, Notification } = require('../models')

module.exports = {
    async getProjects(req, res) {
        try {
            //find projects where user is a member
            const projects = await Project.find({members: {$elemMatch: {member: req.params.id}}})
                .populate("createdBy", "username")
                .populate("members.member", "username profilePic")
            res.status(200).send(projects)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async getProject(req, res) {
        try {
            const project = await Project.findOne({_id : req.params.id})
                .populate("createdBy", "username")
                .populate("members.member", "username profilePic")
                .populate('document', 'title')

            res.status(200).send(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async createProject(req, res) {
        try {
            const project = await Project.create({...req.body})
            res.status(200).send(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async updateProject(req, res) {
        try {
            const project = await Project.findOneAndUpdate({_id : req.params.id}, {...req.body})
            res.status(200).send(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async deleteProject(req, res) {
        try {
            const project = await Project.deleteOne({_id : req.params.id})
            res.status(200).send(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async addLinkToProject(req, res) {
        try {
            const project = await Project.findOneAndUpdate({_id : req.params.id}, {
               $push:{
                    link: req.body
               } 
            })
            res.status(200).send(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async deleteLinkFromProject(req, res) {
        try {
            const project = await Project.findOneAndUpdate({_id : req.params.id}, {
               $pull:{
                    link: {_id: req.body.linkId}
               } 
            })
            res.status(200).send(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async addMemberToProject(req, res) {
        try {
            const proj = await Project.findOne({_id: req.params.id})
                                    .populate("createdBy", "username")
                                    .populate("members.member", "username")

            if(req.body.username === proj.createdBy.username) {
                res.status(401).send({msg: "You can't add yourself!"})
                return
            }

            const member = await User.findOne({username: req.body.username})
            if(!member) {
                res.status(401).send({msg: "User not found!"})
                return
            }

            if(proj.members.some(mem => mem.member.username === req.body.username)) {
                res.status(401).send({msg: "User already in project!"})
                return
            }

            const invitation = {
                sender: proj.createdBy._id,
                receiver: member._id,
                projectId: proj._id,
                msg: `${proj.createdBy.username} invited you to join ${proj.name} project`,
                isRead: false
            }

            await Notification.create({...invitation})

            res.status(200).send({msg: "User invited!"})
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async kickMemberFromProject(req, res) {
        try {
            console.log(req.body.memberId)
            const proj = await Project.findOne({_id: req.params.id})

            if(req.body.memberId === proj.createdBy) {
                res.status(401).send({msg: "You can't kick yourself!"})
                return
            }

            if(!proj.members.some(mem => mem.member == req.body.memberId)) {
                res.status(401).send({msg: "User not in project!"})
                return
            }

            await Project.findOneAndUpdate({_id : req.params.id}, {
               $pull:{
                    members: {
                        member: req.body.memberId
                    }
               } 
            })

            await Notification.create({
                receiver: req.body.memberId,
                msg: `You have been kicked from ${proj.name}!`,
                isRead: false
            })

            res.status(200).send({msg: "User kicked!"})
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

    async leaveProject(req, res) {
        try {
            const proj = await Project.findOne({_id: req.params.proj_id})
            if(req.params.user_id === proj.createdBy) {
                res.status(401).send({msg: "You can't leave your own project!"})
                return
            }

            if(!proj.members.some(mem => mem.member == req.params.user_id)) {
                res.status(401).send({msg: "User not in project!"})
                return
            }

            await Project.findOneAndUpdate({_id : req.params.proj_id}, {
               $pull:{
                    members: {
                        member: req.params.user_id
                    }
               } 
            })
            
            const user = await User.findOne({_id: req.params.user_id})

            await Notification.create({
                receiver: proj.createdBy,
                msg: `${user.username} have left ${proj.name}!`,
                isRead: false
            })

            res.status(200).send({msg: "User left!"})
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    }
}