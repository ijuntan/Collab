const router = require('express').Router()

const {v4: uuidv4} = require('uuid')
const postController = require('../controllers/postController')
const { Post } = require('../models');

const myMulter = require('./storage');
const notificationController = require('../controllers/notificationController');

router.get('/', (req, res) => {
    res.send({
        message: 'im in post'
    })
})

router.get('/posts', postController.getPost)
router.get('/posts/:category', postController.getPostByCategory)
router.get('/search', postController.getPostBySearch)
router.get('/:id', postController.getPostById)
router.get('/user_posts/:id', postController.getPostByUser)

router.post('/image/:id', myMulter.upload.single('image'), async (req, res) => {
    try {
      const file = myMulter.bucket.file(uuidv4() + "." + req.file.mimetype.split('/')[1]);
      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on('finish', async() => {
        const oldPic = await Post.findById(req.params.id)

        if(oldPic.image){
            const fileToBeDeleted = myMulter.bucket.file(oldPic.image.split('/')[4])
            await fileToBeDeleted.delete()
        }

        const url = `https://storage.googleapis.com/${myMulter.bucket.name}/${file.name}`;
        await Post.findOneAndUpdate({_id: req.params.id}, {image: url})
        res.status(200).send('Image uploaded');
      });

      stream.on('error', async(err) => {
        await Post.deleteOne({_id: req.params.id})
        console.error('Error uploading to GCP:', err);
        res.status(500).send('Error uploading image');
      });
  
      stream.end(req.file.buffer);

    } catch (error) {
    await Post.deleteOne({_id: req.params.id})
      console.error('Error processing upload:', error);
      res.status(500).send('Error processing upload');
    }
})

router.post('/', postController.createPost)
router.patch('/:id', postController.updatePost)
router.delete('/:id', postController.deletePost)

router.get('/action/:id', postController.getActionUser)
router.get('/action/:uid/:pid', postController.getActionUserPost)
router.post('/action', postController.actionToPost)
router.put('/action', postController.updateActionPost)

module.exports = router