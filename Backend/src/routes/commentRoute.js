const router = require('express').Router()

const commentController = require('../controllers/commentController')

router.get('/', (req, res) => {
    res.send({
        message: 'im in comment'
    })
})
router.get('/:id', commentController.getComment)
router.post('/', commentController.createComment)
router.delete('/:id', commentController.deleteComment)
router.put('/:id', commentController.updateComment)
router.patch('/action', commentController.updateActionComment)
router.get('/action/:uid/:id', commentController.getActionCommentById);
module.exports = router