const express = require('express')
const user = require('./userRoute')

const router = express.Router()

// api/v1/user
router.use('/user', user)

module.exports = router