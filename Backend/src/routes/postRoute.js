const router = require('express').Router()

const postController = require('../controllers/postController')

router.get('/', (req, res) => {
    res.send({
        message: 'im in post'
    })
})

router.get('/getpost', postController.getPost)
router.get('/getpostbycategory/:category', postController.getPostByCategory)
router.get('/getpostbysearch/:search', postController.getPostBySearch)
router.post('/createpost', postController.createPost)

module.exports = router