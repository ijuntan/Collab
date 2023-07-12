const router = require('express').Router()

const chatController = require('../controllers/chatController')

router.get('/', (req, res) => {
    res.send({
        message: 'im in chat'
    })
})
router.get('/:id1/:id2', chatController.getConversation)
router.post('/msg', chatController.createMessage)
module.exports = router