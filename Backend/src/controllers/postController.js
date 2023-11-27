const { Post, Comment, User, Action } = require('../models')
const myMulter = require('../routes/storage')

module.exports = {
    async getPost(req, res) {
        try {
            const posts = await Post.aggregate([
                {$sample: {size: 4 + parseInt(req.query.skip)}}, 
                {$skip: parseInt(req.query.skip)}, 
                {$lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }}, 
                {$unwind: "$createdBy"},
                {$project: {
                    "createdBy.password": 0,
                    "createdBy.email": 0,
                    "createdBy.createdAt": 0,
                    "createdBy.updatedAt": 0,
                    "createdBy.follows": 0,
                    "createdBy.followed": 0,
                    "createdBy.__v": 0
                }}
            ])
            //const posts = await Post.find({}).populate("createdBy", "username profilePic").skip(parseInt(req.query.skip)).limit(6).sort({createdAt:-1})
            //posts.forEach(post=>console.log(post.name));
            res.status(200).send(posts)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async getPostByUser(req, res) {
        try {
            const posts = await Post.find({createdBy: req.params.id}).sort({createdAt:-1})
            console.log(posts)
            res.status(200).send(posts)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async getPostByCategory(req, res) {
        try {
            //const posts = await Post.aggregate([{$match: {category: category}}, {$sample: {size: 10}}])
            const posts = await Post.find({category: req.query.search}).populate("createdBy", "username profilePic")
            res.status(200).send(posts)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async getPostBySearch(req, res) {
        try {
            const posts = await Post.aggregate([{$match: {name: {$regex: req.query.s, '$options': 'i'}}}])
            await User.populate(posts, {path: "createdBy", select:"username profilePic"});
            res.status(200).send(posts)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async getPostById(req, res) {
        try {
            const post = await Post.findById(req.params.id).populate("createdBy", "username profilePic")
            res.status(200).send(post)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async createPost(req, res) {
        try {
            const post = await Post.create(req.body)
            res.status(200).send(post._id)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async updatePost(req, res) {
        try {
            const {id} = req.params
            const result = await Post.findOneAndUpdate({_id: id}, {...req.body})
            res.status(200).send(result)
        }
        catch(error) {
            console.log(error)
            res.status(400).send(error)
        }
    },

    async deletePost(req, res) {
        try {
            const {id} = req.params
            const postToBeDeleted = await Post.findById(id)
            if(postToBeDeleted.image){
                const fileToBeDeleted = myMulter.bucket.file(postToBeDeleted.image.split('/')[4])
                await fileToBeDeleted.delete()
            }
            const res1 = await Post.deleteOne({_id: id})
            const res2 = await Comment.deleteMany({postId: id})
            const res3 = await Action.deleteMany({to: id})
            
            await Promise.all([res1, res2, res3]).then((result)=>res.status(200).send(result))
        }
        catch(error) {
            console.log(error)
            res.status(400).send(error)
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
            res.status(200).send(action)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async getActionUser(req, res) {
        try {
            const {id} = req.params
            const actionList = await Action.find({accountID: id}, "to action")

            res.status(200).send(actionList)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async getActionUserPost(req, res) {
        try {
            const {uid, pid} = req.params
            const action = await Action.find({accountID: uid, postID: pid}, "action")

            res.status(200).send(action)
        } catch(error) {
            res.status(400).send(error)
        }
    },

    async updateActionPost(req, res) {
        try {
            const {userID, postID, act, beforeAct} = req.body
            console.log(userID, postID, act, beforeAct)
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
            res.status(200).send(result)
        } catch(error) {

            res.status(400).send(error)
        }
    },
}