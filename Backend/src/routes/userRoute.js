const router = require('express').Router()

const userController = require('../controllers/userController')
const {isAuthenticated, signup} = require('../middleware')

router.get('/', (req, res) => {
    res.send({
        message: 'im in user'
    })
})
router.post('/signup', signup, userController.signup)
router.post('/login', userController.login)
router.post('/forgotpassword', userController.forgotpassword)
router.post('/resetpassword/:resetToken', userController.resetpassword)
router.get('/dash', isAuthenticated, userController.findByID)
module.exports = router