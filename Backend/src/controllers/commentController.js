const { Comment } = require('../models')

module.exports = {
    async getComment(req, res) {
        try {
            const comment = await Comment.find({postId: req.params.id}).populate("createdBy", "username profilePic")
            res.status(200).send(comment)
        } catch(error) {
            res.status(400).send({msg:"Get Comment Fail"})
        }
    },

    async createComment(req, res) {
        try {
            const comment = await Comment.create(req.body)
            res.status(200).send(comment)
        } catch(error) {
            res.status(400).send({msg:"Create Comment Fail"})
        }
    },
    
    async updateComment(req, res) {
        try {
            const result = await Comment.findOneAndUpdate({_id: req.params.id}, {...req.body})
            res.status(200).send(result)
        } catch(error) {
            res.status(400).send({msg:"Update Comment Fail"})
        }
    },

    async deleteComment(req, res) {
        try {
            const res1 = await Comment.deleteOne({_id: req.params.id})
            const res2 = await Comment.deleteMany({root: req.params.id})
            await Promise.all([res1, res2]).then((result)=>res.status(200).send(result))
        } catch(error) {
            res.status(400).send({msg:"Delete Comment Fail"})
        }
    },
}