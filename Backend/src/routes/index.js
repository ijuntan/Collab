const express = require('express')
const user = require('./userRoute')
const post = require('./postRoute')
const chat = require('./chatRoute')
const router = express.Router()

// api/v1/user
router.use('/user', user)
// api/v1/post
router.use('/post', post)
// api/v1/chat
router.use('/chat', chat)

module.exports = router