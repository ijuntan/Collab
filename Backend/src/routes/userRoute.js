const router = require('express').Router()

const notificationController = require('../controllers/notificationController')
const userController = require('../controllers/userController')
const {isAuthenticated, signup} = require('../middleware')
const {v4: uuidv4} = require('uuid')
const { User } = require('../models')
const myMulter = require('./storage')

router.get('/', (req, res) => {
    res.send({
        message: 'im in user'
    })
})
router.post('/signup', signup, userController.signup)
router.post('/login', userController.login)
router.post('/forgotpassword', userController.forgotpassword)
router.put('/resetpassword/:resetToken', userController.resetpassword)
router.get('/dash', isAuthenticated, userController.findByID)
router.get('/:id', userController.getUserById)
router.get('/follow/:id', userController.getFollowById)
router.get('/follower/:id', userController.getFollowerById)
router.get('/name/:name', userController.getUserByName)
router.patch('/follow', userController.followUser)
router.patch('/unfollow', userController.unfollowUser)

router.post('/image/:id', myMulter.upload.single('image'), async (req, res) => {
    try {
      const file = myMulter.bucket.file(uuidv4() + "." + req.file.mimetype.split('/')[1]);
      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on('finish', async() => {
        const oldPic = await User.findById(req.params.id)

        if(oldPic.profilePic){
            const fileToBeDeleted = myMulter.bucket.file(oldPic.profilePic.split('/')[4])
            await fileToBeDeleted.delete()
        }

        const url = `https://storage.googleapis.com/${myMulter.bucket.name}/${file.name}`;
        await User.findOneAndUpdate({_id: req.params.id}, {profilePic: url})

        console.log("user updated")
        res.status(200).send('Image uploaded');
      });

      stream.on('error', async(err) => {
        console.error('Error uploading to GCP:', err);
        res.status(500).send('Error uploading image');
      });
  
      stream.end(req.file.buffer);

    } catch (error) {
      res.status(500).send('Error processing upload');
    }
})

//Notification
router.get('/notifications/:id', notificationController.getNotifications)
router.get('/notification/:id', notificationController.getNotification)
router.post('/notification', notificationController.createNotification)
router.delete('/notification/:id', notificationController.deleteNotification)
router.patch('/notification/:id', notificationController.updateNotification)

//Invitation
router.post('/invitation', notificationController.createInvitation)
router.patch('/invitation/:id', notificationController.updateInvitation)

module.exports = router