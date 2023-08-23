const { Project } = require('../models')

module.exports = {
    async getProjects(req, res) {
        try {
            const projects = await Project.find({createdBy : req.params.id}).populate("members", "username")
            res.status(200).json(projects)
        }
        catch(err) {
            console.log(err)
            res.status(404).json({msg: "Please try again!"})
        }
    },

    async getProject(req, res) {
        try {
            const project = await Project.findOne({_id : req.params.id})
                .populate("createdBy", "username")
                .populate("members.member", "username")
                .populate('document', 'title')

            res.status(200).json(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).json({msg: "Please try again!"})
        }
    },

    async createProject(req, res) {
        try {
            const project = await Project.create({...req.body})
            res.status(200).json(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).json({msg: "Please try again!"})
        }
    },

    async updateProject(req, res) {
        try {
            const project = await Project.findOneAndUpdate({_id : req.params.id}, {...req.body})
            res.status(200).json(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).json({msg: "Please try again!"})
        }
    },

    async deleteProject(req, res) {
        try {
            const project = await Project.deleteOne({_id : req.params.id})
            res.status(200).json(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).json({msg: "Please try again!"})
        }
    },

    async addLinkToProject(req, res) {
        try {
            const project = await Project.findOneAndUpdate({_id : req.params.id}, {
               $push:{
                    link: req.body
               } 
            })
            res.status(200).json(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).json({msg: "Please try again!"})
        }
    },

    async deleteLinkFromProject(req, res) {
        try {
            const project = await Project.findOneAndUpdate({_id : req.params.id}, {
               $pull:{
                    link: {_id: req.body.linkId}
               } 
            })
            res.status(200).json(project)
        }
        catch(err) {
            console.log(err)
            res.status(404).json({msg: "Please try again!"})
        }
    }
}