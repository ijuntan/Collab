const { Project } = require('../models')

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
    }
}