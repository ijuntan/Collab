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
router.patch('/:id', commentController.updateComment)
module.exports = router