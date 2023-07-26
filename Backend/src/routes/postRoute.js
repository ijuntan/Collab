const router = require('express').Router()
const multer = require('multer')
const postController = require('../controllers/postController')

router.get('/', (req, res) => {
    res.send({
        message: 'im in post'
    })
})

// const upload = multer({
//     limits: {
//       fileSize: 10 * 1024 * 1024 // 10MB file size limit
//     },
//     fileFilter: (req, file, cb) => {
//       // Perform file type validation
//       const allowedMimes = PredefinedDokumenCategory;
//       if (allowedMimes.includes(file.mimetype)) {
//         cb(null, true);
//       } else {
//         console.log("Get this file: ")
//         console.log(file.mimetype)
//         cb(new Error('Invalid file type.'));
//       }
//     },
//     storage: multer.memoryStorage()
// });

router.get('/posts', postController.getPost)
router.get('/posts/:category', postController.getPostByCategory)
router.get('/search', postController.getPostBySearch)
router.get('/:id', postController.getPostById)

//router.post('/post', upload.single('image'), postController.createPost)
router.post('/', postController.createPost)
router.patch('/:id', postController.updatePost)
router.delete('/:id', postController.deletePost)

router.get('/action/:id', postController.getActionUser)
router.post('/action', postController.actionToPost)
router.put('/action', postController.updateActionPost)
module.exports = router