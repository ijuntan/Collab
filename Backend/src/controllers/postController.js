const { Post, Comment, User, Action } = require('../models')

module.exports = {
    async getPost(req, res) {
        try {
            //const posts = await Post.aggregate([{$sample: {size: 10}}])
            const posts = await Post.find({}).populate("createdBy", "username")
            //console.log(posts)
            res.status(200).json(posts)
        } catch(error) {
            res.status(400).json(error)
        }
    },

    async getPostByUser(req, res) {
        try {
            const posts = await Post.find({createdBy: req.params.id}).sort({createdAt:-1})
            console.log(posts)
            res.status(200).json(posts)
        } catch(error) {
            res.status(400).json(error)
        }
    },

    async getPostByCategory(req, res) {
        try {
            //const posts = await Post.aggregate([{$match: {category: category}}, {$sample: {size: 10}}])
            const posts = await Post.find({category: req.query.search}).populate("createdBy", "username")
            res.status(200).json(posts)
        } catch(error) {
            res.status(400).json(error)
        }
    },

    async getPostBySearch(req, res) {
        try {
            const posts = await Post.aggregate([{$match: {name: {$regex: req.query.s, '$options': 'i'}}}])
            await User.populate(posts, {path: "createdBy", select:"username"});
            res.status(200).json(posts)
        } catch(error) {
            res.status(400).json(error)
        }
    },

    async getPostById(req, res) {
        try {
            const post = await Post.findById(req.params.id).populate("createdBy", "username")
            res.status(200).json(post)
        } catch(error) {
            res.status(400).json(error)
        }
    },

    async createPost(req, res) {
        try {
            const post = await Post.create(req.body)
            res.status(200).json(post)
        } catch(error) {
            res.status(400).json(error)
        }
    },

    async updatePost(req, res) {
        try {
            const {id} = req.params
            const res1 = await Post.findOneAndUpdate({_id: id}, {...req.body})
            res.status(200).json(result)
        }
        catch(error) {
            res.status(400).json(error)
        }
    },

    async deletePost(req, res) {
        try {
            const {id} = req.params
            const res1 = await Post.deleteOne({_id: id})
            const res2 = await Comment.deleteMany({postId: id})
            await Promise.all([res1, res2]).then((result)=>res.status(200).json(result))
        }
        catch(error) {
            res.status(400).json(error)
        }
    },

    //Action
    async actionToPost(req, res) {
        try {
            const action = await Action.create(req.body)
            if(action.action === "Like") {
                await Post.findOneAndUpdate({_id: action.to}, {$inc: {like: 1}})
            }
            else {
                await Post.findOneAndUpdate({_id: action.to}, {$inc: {dislike: 1}})
            }
            res.status(200).json(action)
        } catch(error) {
            res.status(400).json(error)
        }
    },

    async getActionUser(req, res) {
        try {
            const {id} = req.params
            const actionList = await Action.find({accountID: id}, "to action")

            res.status(200).json(actionList)
        } catch(error) {
            res.status(400).json(error)
        }
    },

    async updateActionPost(req, res) {
        try {
            const {userID, postID, act, beforeAct} = req.body
            const result = await Action.findOneAndUpdate({accountID: userID, to: postID}, {action: act})
            if(result) {
                if(beforeAct === "Like") {
                    if(act === "Dislike") await Post.findOneAndUpdate({_id: postID}, {$inc: {like: -1, dislike: 1}})
                    else await Post.findOneAndUpdate({_id: postID}, {$inc: {like: -1}})
                }
                else if(beforeAct === "Dislike") {
                    if(act === "Like") await Post.findOneAndUpdate({_id: postID}, {$inc: {like: 1, dislike: -1}})
                    else await Post.findOneAndUpdate({_id: postID}, {$inc: {dislike: -1}})
                }
                else {
                    if(act === "Like") await Post.findOneAndUpdate({_id: postID}, {$inc: {like: 1}})
                    else await Post.findOneAndUpdate({_id: postID}, {$inc: {dislike: 1}})
                } 
            }
            res.status(200).json(result)
        } catch(error) {
            res.status(400).json(error)
        }
    },
}