const jwt = require('jsonwebtoken');
const { Post, Comment, User, Action } = require('../models')
const config = require('../config/config');

module.exports = {
    async getPost(req, res) {
        try {
            const posts = await Post.aggregate([{$sample: {size: 10}}])
            res.status(200).json(posts)
        } catch(error) {
            console.log(error)
        }
    },

    async getPostByCategory(req, res) {
        try {
            const {category} = req.params
            const posts = await Post.aggregate([{$match: {category: category}}, {$sample: {size: 10}}])
            
            res.status(200).json(posts)
        } catch(error) {
            console.log(error)
        }
    },

    async getPostBySearch(req, res) {
        try {
            const {search} = req.params

            const posts = await Post.aggregate([{$match: {name: {$regex: search, '$options': 'i'}}}])
            
            res.status(200).json(posts)
        } catch(error) {
            console.log(error)
        }
    },

    async getPostById(req, res) {
        try {
            const {id} = req.params
            const post = await Post.findById(id).populate("createdBy", "username").populate({path:"comment", populate:{path:"createdBy", select:"username"}})
            res.status(200).json(post)
        } catch(error) {
            console.log(error)
        }
    },

    async createPost(req, res) {
        try {
            const post = await Post.create(req.body) 
            res.status(200).json(post)
        } catch(error) {
            console.log(error)
        }
    },

    async createComment(req, res) {
        try {
            const comment = await Comment.create(req.body)
            await Post.findOneAndUpdate({_id: comment.to}, {$push: {comment: comment._id}})
            res.status(200).json(comment)
        } catch(error) {
            console.log(error)
        }
    },

    async actionToPost(req, res) {
        try {
            const action = await Action.create(req.body)
            console.log(action)
            if(action.action === "Like") {
                await Post.findOneAndUpdate({_id: action.to}, {$inc: {like: 1}})
            }
            else {
                await Post.findOneAndUpdate({_id: action.to}, {$inc: {like: -1}})
            }
            res.status(200).json(action)
        } catch(error) {
            console.log(error)
        }
    },

    async getActionUser(req, res) {
        try {
            const {id} = req.params
            const actionList = await Action.find({accountID: id}, "to action")

            res.status(200).json(actionList)
        } catch(error) {
            console.log(error)
        }
    },

    async updateActionPost(req, res) {
        try {
            const {userID, postID, act, beforeAct} = req.body
            const result = await Action.findOneAndUpdate({accountID: userID, to: postID}, {action: act})
            if(result) {
                if(beforeAct === "Like") {
                    if(act === "Dislike") await Post.findOneAndUpdate({_id: postID}, {$inc: {like: -2}})
                    else await Post.findOneAndUpdate({_id: postID}, {$inc: {like: -1}})
                }
                else if(beforeAct === "Dislike") {
                    if(act === "Like") await Post.findOneAndUpdate({_id: postID}, {$inc: {like: 2}})
                    else await Post.findOneAndUpdate({_id: postID}, {$inc: {like: 1}})
                }
                else {
                    if(act === "Like") await Post.findOneAndUpdate({_id: postID}, {$inc: {like: 1}})
                    else await Post.findOneAndUpdate({_id: postID}, {$inc: {like: -1}})
                } 
            }
            res.status(200).json(result)
        } catch(error) {
            console.log(error)
        }
    }
}