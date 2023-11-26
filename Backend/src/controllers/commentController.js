const { Comment, Action } = require('../models')

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
            const res3 = await Action.deleteMany({to: req.params.id})
            await Promise.all([res1, res2]).then((result)=>res.status(200).send(result))
        } catch(error) {
            res.status(400).send({msg:"Delete Comment Fail"})
        }
    },

    async updateActionComment(req, res) {
        try {
            const {userID, commentID, act, beforeAct} = req.body
            const result = await Action.findOneAndUpdate({accountID: userID, to: commentID}, {action: act})
            if(!result) {
                await Action.create({
                    accountID: userID,
                    to: commentID,
                    actionTo: "Comment",
                    action: act
                })
            }
            if(beforeAct === "Like") {
                if(act === "Dislike") await Comment.findOneAndUpdate({_id: commentID}, {$inc: {like: -1, dislike: 1}})
                else await Comment.findOneAndUpdate({_id: commentID}, {$inc: {like: -1}})
            }
            else if(beforeAct === "Dislike") {
                if(act === "Like") await Comment.findOneAndUpdate({_id: commentID}, {$inc: {like: 1, dislike: -1}})
                else await Comment.findOneAndUpdate({_id: commentID}, {$inc: {dislike: -1}})
            }
            else {
                if(act === "Like") await Comment.findOneAndUpdate({_id: commentID}, {$inc: {like: 1}})
                else await Comment.findOneAndUpdate({_id: commentID}, {$inc: {dislike: 1}})
            } 
            res.status(200).send({msg:'Update Action Comment Success'})
        } catch(error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    async getActionCommentById(req, res) {
        try {
            const {uid, id} = req.params
            const actionList = await Action.findOne({accountID: uid, to: id})
            res.status(200).send({act:actionList.action})
        } catch(error) {
            console.log(error)
            res.status(400).send(error)
        }
    }
}