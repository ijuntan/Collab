const router = require('express').Router()

const projectController = require('../controllers/projectController')

router.get('/', (req, res) => {
    res.send({
        message: 'im in project'
    })
})
router.get('/projects/:id', projectController.getProjects)
router.get('/:id', projectController.getProject)
router.post('/', projectController.createProject)
router.delete('/:id', projectController.deleteProject)
router.patch('/:id', projectController.updateProject)
module.exports = router