const jwt = require('jsonwebtoken');
const { Post } = require('../models')
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

    async createPost(req, res) {
        const {
            name,
            content,
            category,
            createdBy
        } = req.body

        try {
            const post = await Post.create({...req.body}) 
            res.status(200).json(post)
        } catch(error) {
            console.log(error)
        }
    },
}