const router = require('express').Router()

const postController = require('../controllers/postController')
const { upload } = require('../middleware')

router.get('/', (req, res) => {
    res.send({
        message: 'im in post'
    })
})

router.get('/getpost', postController.getPost)
router.get('/getpostbycategory/:category', postController.getPostByCategory)
router.get('/getpostbysearch/:search', postController.getPostBySearch)
router.get('/getpostbyid/:id', postController.getPostById)
router.post('/createpost', upload.single('image'), postController.createPost)
router.post('/createcomment', postController.createComment)
router.post('/actiontopost', postController.actionToPost)
router.put('/updateactionpost', postController.updateActionPost)
router.get('/getactionbyuser/:id', postController.getActionUser)
module.exports = router