const express = require('express')
const user = require('./userRoute')
const post = require('./postRoute')
const router = express.Router()

// api/v1/user
router.use('/user', user)
// api/v1/post
router.use('/post', post)

module.exports = router